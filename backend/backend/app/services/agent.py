"""
Agent service — wraps A2A gateway call.

Fallback chain:
1. A2A gateway (MIDI SOFT) at 127.0.0.1:9900
2. Hardcoded responses si gateway caída
3. WhatsApp handoff si user frustrated
"""
import logging
import time
import httpx
from app.config import settings

log = logging.getLogger(__name__)


# Hardcoded fallback (mismo del ChatAgentBubble.tsx frontend)
FALLBACK_RESPONSES = {
    "branding": "Para branding arrancamos con un diagnóstico de 30 min. ¿Quieres que te agende con el equipo creativo?",
    "web": "Sitios web arrancan en $1.490.000 CLP, entregamos en 4 semanas. ¿Te paso un case de tu industria?",
    "ia": "Hacemos agentes que responden WhatsApp, agendan citas, califican leads. ¿Tu caso es conversacional o interno?",
    "precio": "Branding desde $890K, sitio web desde $1.49M, automatizaciones desde $2.4M. ¿Cuál te interesa?",
    "default": "Cuéntame más. ¿Buscas mejorar imagen (branding), presencia online (web), o automatizar algo (IA)?",
}


def classify_intent(message: str) -> tuple[str, float]:
    """Tiny keyword classifier — fallback si A2A no responde."""
    q = message.lower()
    if any(k in q for k in ["branding", "marca", "logo"]):
        return "branding", 0.85
    if any(k in q for k in ["web", "sitio", "página", "landing"]):
        return "web", 0.85
    if any(k in q for k in ["ia", "agente", "automat", "whatsapp bot"]):
        return "ia", 0.85
    if any(k in q for k in ["precio", "cuánto", "cuesta", "valor", "costo"]):
        return "precio", 0.80
    return "default", 0.50


async def call_agent(
    message: str,
    session_id: str | None = None,
    visitor_id: str = "",
) -> dict:
    """
    Call A2A gateway. Falls back to local responses on failure.

    Returns dict with keys: reply, intent, confidence, latency_ms, agent_id.
    """
    start = time.perf_counter()

    # Try the gateway
    try:
        async with httpx.AsyncClient(timeout=8.0) as client:
            resp = await client.post(
                f"{settings.a2a_gateway_url}/agents/{settings.a2a_agent_id}/invoke",
                json={
                    "message": message,
                    "session_id": session_id,
                    "visitor_id": visitor_id,
                    "agent_context": "adamgrafica-landing-v2",
                },
            )
            resp.raise_for_status()
            data = resp.json()
            data["latency_ms"] = int((time.perf_counter() - start) * 1000)
            data["agent_id"] = settings.a2a_agent_id
            return data
    except Exception as e:
        log.warning(f"A2A gateway unavailable ({type(e).__name__}: {e}), using fallback")

    # Fallback: local classifier
    intent, confidence = classify_intent(message)
    latency = int((time.perf_counter() - start) * 1000)
    return {
        "reply": FALLBACK_RESPONSES[intent],
        "intent": intent,
        "confidence": confidence,
        "tokens": None,
        "latency_ms": latency,
        "agent_id": "local-fallback",
        "tools_invoked": [],
    }