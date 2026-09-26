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
    # Agenda: intención que antes caía en default (medido 3/3 en HTTP). El lead
    # que pide hora recibía "¿buscas branding, web o IA?" y se iba.
    ("quiero agendar una reunión", "agenda", "agendar reunión"),
    ("necesito una cita con el equipo", "agenda", "pedir cita"),
    ("quiero reservar hora", "agenda", "reservar hora"),
    # Precedencia: agenda no puede robarle el caso a ia.
    ("necesito automatizar el whatsapp para agendar citas", "ia", "IA gana sobre agenda"),
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
                # `a2a` significa que el gateway atendió y el clasificador local
                # no entró en el camino: en ese caso el intent esperado no
                # aplica y exigirlo hace el test flaky según el estado del
                # gateway (medido: el gateway :9900 responde intermitente, mismo
                # mensaje daba "precio" en fallback y "a2a" en respuesta viva).
                # La cobertura del clasificador no se pierde: vive en
                # test_classify_intent.py, que lo ejercita sin red.
                via_gateway = got == "a2a"
                ok = via_gateway or got == expected
                if not ok:
                    failed.append((msg, expected, got, why))
                tag = "ok  (vía gateway)" if via_gateway else ("ok  " if ok else "FAIL")
                print(f"{tag} {msg!r} -> {got} (esperado {expected}) — {why}")
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
