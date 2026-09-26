# adam-landing-v2-backend

Backend FastAPI para el sitio v2 de ADAM GRÁFICA.

## Stack
- FastAPI 0.115+ (async)
- SQLAlchemy 2.0 + asyncpg
- Pydantic v2
- Alembic para migrations
- httpx para llamar al A2A gateway
- python-dotenv

## Endpoints
- `POST /api/chat` — chat con agente (A2A gateway)
- `POST /api/leads` — captura de lead (Postgres)
- `GET /api/calendar/availability` — slots disponibles (Temporal)
- `POST /api/whatsapp/handoff` — handoff a WhatsApp Bridge

## Dev local
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 9850
```

## Env vars requeridas
```env
DATABASE_URL=postgresql+asyncpg://postgres:postgres@127.0.0.1:5432/adamgrafica
A2A_GATEWAY_URL=http://127.0.0.1:9900
WHATSAPP_BRIDGE_URL=http://127.0.0.1:5290
ENVIRONMENT=development
CORS_ORIGINS=http://localhost:5173,https://adamgrafica.online
```

## Deploy
- Docker multi-stage → CapRover
- Health check: `GET /health` → 200 OK