"""
POST /api/leads — captura de lead desde el formulario.

Persists en Postgres + opcionalmente notifica via WhatsApp Bridge.
"""
import logging
import httpx
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models.lead import Lead
from app.models.chat_session import ChatSession
from app.schemas.lead import LeadCreate, LeadResponse
from app.config import settings

router = APIRouter()
log = logging.getLogger(__name__)


def _score_lead(payload: LeadCreate) -> int:
    """Tiny heuristic: 0-100 score según completitud + intent signals."""
    score = 0
    if payload.name: score += 10
    if payload.email: score += 15
    if payload.phone: score += 25  # phone = high intent
    if payload.company: score += 15
    if payload.industry: score += 10
    if payload.message:
        # Longer message = more engaged
        score += min(25, len(payload.message) // 20)
    return min(100, score)


@router.post("", response_model=LeadResponse, status_code=201)
@router.post("/", response_model=LeadResponse, status_code=201)
async def create_lead(payload: LeadCreate, session: AsyncSession = Depends(get_session)):
    """Persiste el lead y devuelve confirmación."""

    if not (payload.email or payload.phone):
        raise HTTPException(
            status_code=422,
            detail="Se requiere al menos email o teléfono para hacer seguimiento.",
        )

    # Calcular score
    score = _score_lead(payload)

    # Si tenemos session_id, vincularla al lead
    chat_session = None
    if payload.session_id:
        chat_session = await session.get(ChatSession, payload.session_id)
        if chat_session:
            # we'll set lead_id after creating lead
            pass

    lead = Lead(
        source=payload.source or "adamgrafica-v2",
        name=payload.name,
        email=payload.email,
        phone=payload.phone,
        company=payload.company,
        industry=payload.industry,
        message=payload.message,
        session_id=payload.session_id,
        user_agent=payload.user_agent,
        referrer=payload.referrer,
        score=score,
        status="new",
    )
    session.add(lead)
    await session.flush()

    if chat_session:
        chat_session.lead_id = lead.id

    await session.commit()

    # Notificar al WhatsApp Bridge (fire-and-forget)
    if payload.phone:
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(
                    f"{settings.whatsapp_bridge_url}/notify/new-lead",
                    json={
                        "lead_id": str(lead.id),
                        "name": payload.name,
                        "phone": payload.phone,
                        "company": payload.company,
                        "message": payload.message,
                        "score": score,
                    },
                )
        except Exception as e:
            log.warning(f"WhatsApp Bridge notify failed (non-fatal): {e}")

    # Decide next step
    if score >= 60:
        next_step = "agent_will_contact_24h"
    elif score >= 30:
        next_step = "nurture_sequence_7_days"
    else:
        next_step = "add_to_newsletter"

    return LeadResponse(
        id=lead.id,
        created_at=lead.created_at,
        status=lead.status,
        score=lead.score,
        next_step=next_step,
    )