#!/usr/bin/env python3
"""
Smoke test del backend Adam Landing v2.

Uso:
  python scripts/smoke_test.py [--base-url http://localhost:9850]

Tests:
1. /health → 200
2. /api/chat (POST) con mensaje → reply con intent
3. /api/leads (POST) con email+phone → 201 + lead_id
4. /api/calendar/availability → slots array
5. /api/whatsapp/handoff → wa_link generado
"""
import sys
import argparse
import httpx


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", default="http://localhost:3001")
    args = ap.parse_args()

    base = args.base_url.rstrip("/")
    passed = 0
    failed = 0

    import uuid

    with httpx.Client(timeout=20.0) as c:
        # 1. Health
        try:
            r = c.get(f"{base}/health")
            assert r.status_code == 200, f"expected 200, got {r.status_code}"
            data = r.json()
            assert data["status"] == "ok"
            print(f"  ✓ /health → {r.status_code} ({data['service']} v{data['version']})")
            passed += 1
        except Exception as e:
            print(f"  ✗ /health → {e}")
            failed += 1

        # 2. Chat (UUID válido — el endpoint exige formato UUID)
        try:
            r = c.post(f"{base}/api/chat/", json={
                "message": "Necesito un sitio web para mi pyme",
                "visitor_id": str(uuid.uuid4()),
                "session_id": str(uuid.uuid4()),
            })
            assert r.status_code == 200, f"expected 200, got {r.status_code}"
            data = r.json()
            assert "reply" in data and "session_id" in data
            print(f"  ✓ /api/chat → {r.status_code} (intent={data.get('intent')}, agent={data.get('agent_id')})")
            passed += 1
            session_id = data["session_id"]
        except Exception as e:
            print(f"  ✗ /api/chat → {e}")
            failed += 1
            session_id = None

        # 3. Lead
        try:
            payload = {
                "name": "Smoke Test",
                "email": "smoke@test.cl",
                "phone": "+56912345678",
                "company": "Test SpA",
                "message": "Necesito info sobre sitio web",
                "session_id": session_id,
            }
            r = c.post(f"{base}/api/leads/", json=payload)
            assert r.status_code == 201, f"expected 201, got {r.status_code}: {r.text}"
            data = r.json()
            assert data["score"] > 0, f"score should be > 0, got {data['score']}"
            print(f"  ✓ /api/leads → {r.status_code} (score={data['score']}, next_step={data['next_step']})")
            passed += 1
        except Exception as e:
            print(f"  ✗ /api/leads → {e}")
            failed += 1

        # 4. Calendar availability
        #
        # Ojo: consultar "mañana" sin más producía 0/18 slots los fines de semana
        # (el service bloquea sáb/dom), y el assert viejo sólo miraba len(slots)>0,
        # así que el smoke pasaba en verde con una agenda que nadie puede reservar.
        # Ahora se busca el próximo día hábil y se exige que haya horario libre.
        try:
            from datetime import date, timedelta
            probe = date.today() + timedelta(days=1)
            while probe.weekday() >= 5:  # salta sáb/dom
                probe += timedelta(days=1)
            probe_iso = probe.isoformat()
            r = c.get(f"{base}/api/calendar/availability", params={"date": probe_iso})
            assert r.status_code == 200
            data = r.json()
            assert "slots" in data and len(data["slots"]) > 0
            avail = sum(1 for s in data["slots"] if s["available"])
            assert avail > 0, f"{probe_iso} es día hábil pero 0 slots disponibles"
            print(f"  ✓ /api/calendar/availability → {r.status_code} ({avail}/{len(data['slots'])} slots available, {probe_iso} hábil)")
            passed += 1
        except Exception as e:
            print(f"  ✗ /api/calendar/availability → {e}")
            failed += 1

        # 5. WhatsApp handoff
        try:
            r = c.post(f"{base}/api/whatsapp/handoff", json={
                "phone": "+56912345678",
                "summary": "Quiere info de sitio web",
                "session_id": session_id,
            })
            assert r.status_code == 200
            data = r.json()
            assert data["wa_link"].startswith("https://wa.me/")
            print(f"  ✓ /api/whatsapp/handoff → {r.status_code} (link={data['wa_link'][:35]}...)")
            passed += 1
        except Exception as e:
            print(f"  ✗ /api/whatsapp/handoff → {e}")
            failed += 1

    print(f"\n{'='*60}")
    print(f"  Passed: {passed}/5  ·  Failed: {failed}/5")
    if failed > 0:
        sys.exit(1)
    print(f"  ✓ All smoke tests passed")


if __name__ == "__main__":
    main()