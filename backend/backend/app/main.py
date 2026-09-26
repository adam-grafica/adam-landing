"""
ADAM GRÁFICA Landing v2 — Backend FastAPI

Endpoints:
- POST /api/chat           Chat con agente (A2A gateway)
- POST /api/leads          Lead capture
- GET  /api/calendar/availability  Calendar slots
- POST /api/whatsapp/handoff       Handoff a WhatsApp
- GET  /health             Health check
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.db import init_db, close_db
from app.routes import chat, leads, calendar, whatsapp


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Startup/shutdown hooks."""
    await init_db()
    yield
    await close_db()


app = FastAPI(
    title="ADAM GRÁFICA Landing v2 API",
    description="Backend para el sitio agente de ADAM GRÁFICA",
    version="2.0.0",
    lifespan=lifespan,
)

# CORS — allow v1 (prod) + v2 (staging) + dev
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
async def health():
    """Health check para load balancer / CapRover."""
    return {
        "status": "ok",
        "service": "adamgrafica-landing-v2",
        "version": "2.0.0",
        "environment": settings.environment,
    }


# Mount routers
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(leads.router, prefix="/api/leads", tags=["leads"])
app.include_router(calendar.router, prefix="/api/calendar", tags=["calendar"])
app.include_router(whatsapp.router, prefix="/api/whatsapp", tags=["whatsapp"])


@app.exception_handler(Exception)
async def unhandled_exception_handler(request, exc):
    """Log + devolver 500 limpio sin filtrar stack al cliente."""
    import logging
    logging.exception(f"Unhandled error in {request.url.path}: {exc}")
    return JSONResponse(
        status_code=500,
        content={
            "error": "internal_server_error",
            "message": "Algo salió mal. Te paso a un humano: wa.me/56912345678",
            "fallback_url": "https://wa.me/56912345678",
        },
    )