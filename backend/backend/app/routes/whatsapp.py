"""
POST /api/whatsapp/handoff — transfiere la conversación a WhatsApp.

Genera link wa.me con resumen + intenta enviar via WhatsApp Bridge.
"""
import logging
import urllib.parse
import uuid
import httpx
from fastapi import APIRouter
from pydantic import BaseModel, Field

from app.config import settings

router = APIRouter()
log = logging.getLogger(__name__)


class WhatsAppHandoffRequest(BaseModel):
    session_id: uuid.UUID | None = None
    phone: str = Field(..., pattern=r"^\+?[1-9]\d{7,14}$")
    summary: str = Field(..., max_length=500)
    preferred_message: str | None = Field(None, max_length=1000)


class WhatsAppHandoffResponse(BaseModel):
    wa_link: str
    bridge_sent: bool
    message_id: str | None = None
    fallback_url: str


@router.post("/handoff", response_model=WhatsAppHandoffResponse)
async def whatsapp_handoff(request: WhatsAppHandoffRequest):
    """Genera link WhatsApp con resumen y notifica al equipo."""

    # Construir el mensaje
    base_msg = request.preferred_message or (
        f"Hola, estuve hablando con el agente de adamgrafica.online.\n\n"
        f"Resumen: {request.summary}\n\n"
        f"¿Podemos seguir por acá?"
    )

    # wa.me link (universal)
    phone_clean = request.phone.lstrip("+")
    wa_link = f"https://wa.me/{phone_clean}?text={urllib.parse.quote(base_msg)}"

    # Intentar enviar via WhatsApp Bridge (opcional)
    bridge_sent = False
    message_id = None
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(
                f"{settings.whatsapp_bridge_url}/send",
                json={
                    "to": request.phone,
                    "text": base_msg,
                    "metadata": {"source": "adamgrafica-v2", "session_id": str(request.session_id) if request.session_id else None},
                },
            )
            if resp.status_code < 400:
                bridge_sent = True
                data = resp.json()
                message_id = data.get("message_id")
    except Exception as e:
        log.warning(f"WhatsApp Bridge send failed (returning wa.me link only): {e}")

    return WhatsAppHandoffResponse(
        wa_link=wa_link,
        bridge_sent=bridge_sent,
        message_id=message_id,
        fallback_url=wa_link,
    )