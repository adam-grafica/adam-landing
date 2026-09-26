#!/usr/bin/env python3
"""
test_bundle_api_base.py — el bundle servido no puede hornear un origin ajeno.

Por qué existe (2026-09-26, MS-MANAGER):
  El bundle horneaba `http://localhost:3001` como base de la API. Para un
  visitante real en adamgrafica.online ese localhost es el suyo, así que
  disponibilidad, chat y envío de lead morían en producción con el código
  impecable. El smoke test existente no lo cazaba porque pegaba directo al
  backend en :3001, nunca a través del bundle servido: la mitad del sistema
  (el front) quedaba fuera del gate.

  Este test cierra ese hueco. Falla si el bundle servido vuelve a contener un
  origin absoluto de loopback apuntando al backend.

Uso:
  python3 backend/scripts/test_bundle_api_base.py [dist_dir]

Variables de entorno opcionales:
  BUNDLE_DIR   sobreescribe el directorio dist a inspeccionar.
"""

from __future__ import annotations

import os
import re
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[2]
DEFAULT_DIST = REPO_ROOT / "dist"

# Cualquier URL de loopback (localhost, 127.0.0.0/8, [::1], 0.0.0.0) es
# suspecta en un bundle: el navegador del visitante nunca la resuelve al
# backend. Exigimos que apunte a una ruta `/api/` porque así evitamos el falso
# positivo de librerías de terceros: Google Analytics (gtag) trae el literal
# `let o="http://localhost"` como origin placeholder para medir el
# same-origin, y no tiene nada que ver con nuestra API.
LOOPBACK_HOST = r"(?:localhost|127(?:\.\d{1,3}){3}|\[::1\]|0\.0\.0\.0)"
LOOPBACK_API_URL = re.compile(
    rf"https?://{LOOPBACK_HOST}(?::\d+)?/api(?:/|\b)", re.IGNORECASE
)

# Puerto del backend propio: aunque se use sin path, es el default horneado
# que matchmaking rompió producción la primera vez.
LOOPBACK_BACKEND_PORT = re.compile(
    rf"https?://{LOOPBACK_HOST}:3001\b", re.IGNORECASE
)

# Rutas que sí deben estar: prueba que el fix quedó aplicado, no sólo ausente.
REQUIRED_MARKERS = (
    "/api/chat",
    "/api/leads/",
    "/api/calendar/availability",
)

# Ficheros que no son código de la app: fuentes de terceros, .map, binarios.
SKIP_SUFFIXES = {".map", ".woff2", ".woff", ".ttf", ".eot", ".otf", ".png",
                  ".jpg", ".jpeg", ".gif", ".webp", ".avif", ".ico", ".mp4",
                  ".webm", ".pdf", ".zip"}


def js_and_html_files(dist: Path) -> list[Path]:
    if not dist.is_dir():
        return []
    out = []
    for p in sorted(dist.rglob("*")):
        if not p.is_file():
            continue
        if p.suffix.lower() in SKIP_SUFFIXES:
            continue
        if p.name.endswith(".gz"):  # gzip ya se valida en su versión plana
            continue
        if p.suffix.lower() in {".js", ".mjs", ".html", ".css", ".json"}:
            out.append(p)
    return out


def main() -> int:
    dist = Path(os.environ.get("BUNDLE_DIR", sys.argv[1] if len(sys.argv) > 1 else DEFAULT_DIST))
    print(f"Inspeccionando bundle en: {dist}")

    files = js_and_html_files(dist)
    if not files:
        print(f"FALLA (setup): no hay JS/HTML que inspeccionar en {dist}.")
        print("  ¿Corriste `npm run build`? El test necesita el bundle real,")
        print("  no el codigo fuente: el bug que buscamos es el horneado.")
        return 2

    print(f"Ficheros a inspeccionar: {len(files)}")
    failures: list[str] = []
    markers_found: dict[str, bool] = {m: False for m in REQUIRED_MARKERS}

    for path in files:
        try:
            text = path.read_text(encoding="utf-8", errors="replace")
        except OSError as exc:
            failures.append(f"{path.relative_to(dist)}: no se pudo leer ({exc})")
            continue

        for m in REQUIRED_MARKERS:
            if m in text:
                markers_found[m] = True

        # Los dos patrones se solapan en `http://localhost:3001/api/...`;
        # deduplicamos por URL para que el reporte no inflate el conteo.
        seen_urls: set[str] = set()
        for pattern in (LOOPBACK_API_URL, LOOPBACK_BACKEND_PORT):
            for match in pattern.finditer(text):
                url = match.group(0)
                if url in seen_urls:
                    continue
                seen_urls.add(url)
                start = max(0, match.start() - 90)
                end = min(len(text), match.end() + 90)
                snippet = " ".join(text[start:end].split())
                rel = path.relative_to(dist)
                failures.append(
                    f"{rel}: origin de loopback horneado -> {url}\n"
                    f"    contexto: ...{snippet}..."
                )

    print()
    print("Marcadores de API presentes en el bundle:")
    for m, ok in markers_found.items():
        print(f"  {'OK ' if ok else 'FALTA'} {m}")

    missing = [m for m, ok in markers_found.items() if not ok]

    if failures:
        print()
        print(f"FALLA: {len(failures)} loopback horneado(s) en el bundle.")
        for f in failures:
            print(f"  - {f}")
        print()
        print("El bundle debe hablar same-origin (/api/...) y dejar que el proxy")
        print("inverso resuelva el backend. Ver src/config/api.ts.")
        return 1

    if missing:
        print()
        print(f"FALLA: el bundle no contiene {missing}.")
        print("Puede que el build este stale o que las rutas se movieron.")
        return 1

    print()
    print(f"OK: {len(files)} ficheros limpios, sin origin de loopback horneado,")
    print("    y las 3 rutas de API presentes como rutas relativas.")
    print("    El bundle ahora depende del proxy /api, no de localhost.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
