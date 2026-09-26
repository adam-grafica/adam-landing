#!/usr/bin/env python3
"""
Regresión a nivel HTTP del clasificador de intent (no sólo unit).

Por qué existe: `classify_intent` matcheaba la keyword "ia" con `k in q`, así que
"panadería", "policía", "historia" y "galería" caían en intent=ia y el lead retail
recibía copy de automatizaciones. El fix (afb5a2ec) pasó los 16 casos unit, pero
el smoke HTTP no cubría el clasificador: un refactor del router o del fallback
podía devolver intent correcto mientras el camino real sigue roto, o al revés.

Este test pega al endpoint vivo y exige que el intent que sale por HTTP sea el
esperado, que es exactamente lo que ve el usuario.

Uso:
  python scripts/test_chat_intent_http.py [--base-url http://localhost:3001]
Exit: 0 = todo verde, 1 = algún caso falló.
"""
import sys
import argparse
import uuid

import httpx

# (mensaje, intent esperado, por qué importa)
CASES = [
    # Regresión del bug "ia" dentro de palabras: retail/local NO es automatización.
    ("es para una panadería en Quilicura", "default", "'ia' dentro de panadería"),
    ("necesito una policía de seguridad para mi local", "default", "'ia' dentro de policía"),
    ("quiero una galería de fotos para mi estudio", "default", "'ia' dentro de galería"),
    ("necesito un local en Quilicura", "default", "lead de local plano"),
    # Intención real de IA: la palabra exacta y sus verboides deben seguir matcheando.
    ("necesito automatizar el WhatsApp", "ia", "automatizar (verboide)"),
    ("quiero un chatbot con IA", "ia", "keyword exacta 'ia'"),
    # Otras intenciones: el fallback no debe tragárselas.
    # Ojo: precio va PRIMERO a propósito en classify_intent (comentario en
    # agent.py: "precio del sitio web" debe ser precio, no web). Este caso
    # documenta esa precedencia en vez de pelearla.
    ("quiero un sitio web con catálogo", "web", "web con catálogo"),
    ("necesito una página de precios", "precio", "precio gana sobre web por precedencia"),
    ("¿cuánto cuesta el sitio web?", "precio", "precio del sitio web → precio"),
]


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:3001")
    args = ap.parse_args()
    base = args.base_url.rstrip("/")

    failed = []
    with httpx.Client(timeout=15.0) as c:
        # El mismo visitor para toda la corrida, con un session_id nuevo por caso:
        # el endpoint valida session_id como uuid, y mandar texto plano rompe el 422.
        visitor = f"intent-http-{uuid.uuid4().hex[:12]}"
        for msg, expected, why in CASES:
            try:
                r = c.post(
                    f"{base}/api/chat/",
                    json={
                        "message": msg,
                        "visitor_id": visitor,
                        "session_id": str(uuid.uuid4()),
                    },
                )
                assert r.status_code == 200, f"esperado 200, recibido {r.status_code}: {r.text[:200]}"
                got = r.json().get("intent")
                ok = got == expected
                if not ok:
                    failed.append((msg, expected, got, why))
                print(f"{'ok  ' if ok else 'FAIL'} {msg!r} -> {got} (esperado {expected}) — {why}")
            except Exception as e:
                failed.append((msg, expected, "error", why))
                print(f"FAIL {msg!r} -> {e} — {why}")

    print(f"\n{len(CASES) - len(failed)}/{len(CASES)} casos pasan")
    if failed:
        print("FALLOS:")
        for msg, expected, got, why in failed:
            print(f"  {msg!r}: esperado {expected}, obtenido {got} — {why}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
