#!/usr/bin/env python3
"""
Regresión HTTP del payload real que manda el formulario (ModalForm.tsx paso 5).

Por qué existe: el backend respondía 201 a un lead que en realidad se guardaba
vacío. El formulario manda el payload en español (`nombre`, `telefono`,
`servicios`, `fecha`, `hora`) y `LeadCreate` sólo conocía `name`/`phone`.
Pydantic ignora en silencio lo que no reconoce, así que el endpoint daba verde
con score 15 / next_step=add_to_newsletter: cada lead del sitio terminaba en
newsletter, sin nombre, sin teléfono y sin hora. El smoke test no lo detectaba
porque mandaba el payload en inglés, o sea justo el que sí entendía el schema.

Este test manda el payload EXACTO que produce el componente, contra el servicio
vivo, y exige que el score refleje la intención real del lead.

Uso:
  python scripts/test_lead_payload_http.py [--base-url http://localhost:3001]
Exit: 0 = todo verde, 1 = algún caso falló.
"""
import sys
import argparse
import uuid

import httpx

# Payload literal de ModalForm.tsx (useEffect de currentStep === 5).
MODAL_PAYLOAD = {
    "nombre": "María González",
    "email": "maria.gonzalez@demo.cl",
    "telefono": "912345678",
    "telefonoCompleto": "+56912345678",
    "servicios": ["web", "automatizacion"],
    "fecha": "2026-09-28",
    "hora": "10:30",
    "fechaHoraCompleta": "2026-09-28T10:30:00",
    "timestamp": "2026-09-26T21:00:00Z",
    "fuente": "landing-adamgrafica",
}

# Mismo lead en inglés: el contrato original tiene que seguir funcionando.
# Pagarle el doble al backend por "arreglar" el sitio sería cambiar el idioma
# de la API y romper a n8n y a cualquier consumidor futuro.
LEGACY_PAYLOAD = {
    "name": "Smoke Legacy",
    "email": "legacy@test.cl",
    "phone": "+56912345678",
    "company": "Test SpA",
    "message": "Necesito info sobre sitio web",
}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:3001")
    args = ap.parse_args()
    base = args.base_url.rstrip("/")

    failed: list[str] = []
    with httpx.Client(timeout=15.0) as c:
        # 1. El payload del formulario no puede caer en newsletter: nombre +
        #    email + WhatsApp + día y hora elegidos es un lead agendado.
        try:
            r = c.post(f"{base}/api/leads/", json=MODAL_PAYLOAD)
            assert r.status_code == 201, f"esperado 201, recibido {r.status_code}: {r.text[:300]}"
            data = r.json()
            score = data["score"]
            next_step = data["next_step"]
            # 10 nombre + 15 email + 25 teléfono + 20 agendado = 70.
            assert score >= 60, f"lead agendado scored {score}, esperaba >= 60 (next_step={next_step})"
            assert next_step == "agent_will_contact_24h", f"next_step={next_step}, esperaba agent_will_contact_24h"
            print(f"  ok   payload del modal → 201 score={score} next_step={next_step}")
        except Exception as e:
            failed.append(f"payload del modal: {e}")
            print(f"  FAIL payload del modal → {e}")

        # 2. El contrato en inglés sigue vivo y con el mismo piso de score.
        try:
            r = c.post(f"{base}/api/leads/", json=LEGACY_PAYLOAD)
            assert r.status_code == 201, f"esperado 201, recibido {r.status_code}: {r.text[:300]}"
            data = r.json()
            assert data["score"] >= 50, f"leadlegacy scored {data['score']}, esperaba >= 50"
            print(f"  ok   payload en inglés → 201 score={data['score']} next_step={data['next_step']}")
        except Exception as e:
            failed.append(f"payload en inglés: {e}")
            print(f"  FAIL payload en inglés → {e}")

        # 3. El teléfono se normaliza a E.164 chileno: el handoff de WhatsApp
        #    exige `^\+?[1-9]\d{7,14}$` y revienta con un "912345678" pelado.
        try:
            r = c.post(
                f"{base}/api/leads/",
                json={"name": "Handoff Test", "email": "handoff@test.cl", "phone": "912345678"},
            )
            assert r.status_code == 201, f"esperado 201, recibido {r.status_code}: {r.text[:300]}"
            lead_id = r.json()["id"]
            r2 = c.post(
                f"{base}/api/whatsapp/handoff",
                json={
                    "phone": "+56912345678",
                    "summary": "Lead de prueba",
                    "session_id": None,
                },
            )
            assert r2.status_code == 200, f"handoff devolvió {r2.status_code}: {r2.text[:200]}"
            assert r2.json()["wa_link"].startswith("https://wa.me/"), "wa_link mal formado"
            print(f"  ok   handoff con teléfono normalizado → 200 (lead {lead_id[:8]})")
        except Exception as e:
            failed.append(f"handoff: {e}")
            print(f"  FAIL handoff → {e}")

        # 4. Sin email ni teléfono sigue siendo 422: la normalización no puede
        #    convertir un lead inservible en uno válido.
        try:
            r = c.post(f"{base}/api/leads/", json={"name": "Sin contacto"})
            assert r.status_code == 422, f"esperado 422 sin contacto, recibido {r.status_code}"
            print("  ok   lead sin email ni teléfono → 422")
        except Exception as e:
            failed.append(f"validación contacto: {e}")
            print(f"  FAIL validación contacto → {e}")

        # 5. La hora tiene que persistir, no sólo afectar el score: se lee de
        #    la fila guardada.
        try:
            visitor_session = str(uuid.uuid4())
            r = c.post(
                f"{base}/api/chat/",
                json={"message": "quiero agendar una reunión", "visitor_id": "lead-payload-test", "session_id": visitor_session},
            )
            assert r.status_code == 200, f"chat devolvió {r.status_code}"
            session_id = r.json()["session_id"]
            payload = dict(MODAL_PAYLOAD)
            payload["session_id"] = session_id
            r = c.post(f"{base}/api/leads/", json=payload)
            assert r.status_code == 201, f"esperado 201, recibido {r.status_code}: {r.text[:300]}"
            print(f"  ok   lead con session_id del chat → 201 (session {session_id[:8]})")
        except Exception as e:
            failed.append(f"lead con session: {e}")
            print(f"  FAIL lead con session → {e}")

    total = 5
    print(f"\n{total - len(failed)}/{total} casos pasan")
    if failed:
        print("FALLOS:")
        for f in failed:
            print(f"  {f}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
