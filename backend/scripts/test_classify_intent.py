"""Regresión del clasificador de intent.

Por qué existe: `classify_intent` buscaba keywords con `k in q`, así que "ia"
matcheaba dentro de "panadería", "policía", "historia", "galería". Todo lead de
retail/local caía en intent=ia y recibía copy de automatizaciones.

Ejecutar: ./.venv/bin/python scripts/test_classify_intent.py
"""
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.services.agent import classify_intent  # noqa: E402

# (mensaje, intent esperado)
CASES = [
    # Regresión: subpalabras que contenían "ia"
    ("es para una panaderia en Quilicura", "default"),
    ("la policia me contacto", "default"),
    ("historia de la empresa", "default"),
    ("tengo una galeria de arte", "default"),
    ("mi farmacia necesita un sitio", "web"),
    ("trabajo en la policia municipal", "default"),
    # Intent real, debe seguir funcionando
    ("quiero una pagina web", "web"),
    ("necesito automatizar ventas", "ia"),
    ("quiero un agente de IA", "ia"),
    ("necesito un bot de whatsapp", "ia"),
    ("quiero un logo y marca", "branding"),
    ("precio del sitio web", "precio"),
    ("cuanto cuesta", "precio"),
    ("quiero una landing", "web"),
    # Default honesto
    ("hola", "default"),
    ("tengo una tienda de ropa", "default"),
    # Agenda: intención comercial real que antes caía en default y recibía
    # "¿buscas branding, web o IA?" — el lead que pide hora nunca avanzaba.
    ("quiero agendar una reunion", "agenda"),
    ("necesito una cita con el equipo", "agenda"),
    ("quiero reservar hora para una demostracion", "agenda"),
    ("me puedes dar un horario para hablar", "agenda"),
    # "cita" es palabra completa, no raíz: "citación" es Default, no un pedido de hora.
    ("necesito una citacion formal", "default"),
    # Precedencia: pedir IA para agendar sigue siendo venta de IA, no agenda.
    ("necesito automatizar el whatsapp para agendar citas", "ia"),
]


def main() -> int:
    failed = []
    for msg, expected in CASES:
        got, conf = classify_intent(msg)
        ok = got == expected
        if not ok:
            failed.append((msg, expected, got, conf))
        print(f"{'ok  ' if ok else 'FAIL'} {msg!r} -> {got} (conf {conf}), esperado {expected}")
    print(f"\n{len(CASES) - len(failed)}/{len(CASES)} casos pasan")
    if failed:
        print("FALLOS:")
        for msg, expected, got, conf in failed:
            print(f"  {msg!r}: esperado {expected}, obtenido {got} ({conf})")
        return 1
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
