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
    # Elegir día y hora es la señal más fuerte que puede dejar un lead: ya
    # resolvió su propia agenda. Antes el formulario mandaba fecha/hora y el
    # schema las descartaba, así que un lead con hora confirmada y WhatsApp
    # quedaba en 50 → nurture_sequence_7_days, igual que uno que sólo escribió
    # su nombre. Agendado no es "interesado", es "listo para hablar".
    if payload.appointment_date and payload.appointment_time: score += 20
    elif payload.appointment_date: score += 10
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
        # El agendamiento y los servicios no tienen columna propia: viven en
        # metadata. Sin esto, la hora que eligió el lead se guardaba en el
        # request y se perdía antes de llegar a la base.
        metadata_={
            "appointment_date": payload.appointment_date.isoformat() if payload.appointment_date else None,
            "appointment_time": payload.appointment_time,
            "appointment_at": payload.appointment_at,
            "services": payload.services,
            "submitted_at": payload.submitted_at.isoformat() if payload.submitted_at else None,
        },
    )
    session.add(lead)
    await session.flush()

    if chat_session:
        chat_session.lead_id = lead.id

    await session.commit()

    # Notificar al WhatsApp Bridge (fire-and-forget)
    if payload.phone:
        # El bridge recibe un resumen, no un volcado de campos. Armarlo desde
        # los datos normalizados (no desde el request crudo) para que diga
        # "agendó el martes 10:30" y no "sin info".
        partes: list[str] = []
        if payload.name:
            partes.append(payload.name)
        if payload.services:
            partes.append(", ".join(payload.services))
        if payload.appointment_date and payload.appointment_time:
            partes.append(f"agendó {payload.appointment_date.isoformat()} {payload.appointment_time}")
        elif payload.appointment_date:
            partes.append(f"pidió {payload.appointment_date.isoformat()} (hora por confirmar)")
        resumen = " · ".join(partes) or "Lead sin detalles"
        try:
            async with httpx.AsyncClient(timeout=5.0) as client:
                await client.post(
                    f"{settings.whatsapp_bridge_url}/notify/new-lead",
                    json={
                        "lead_id": str(lead.id),
                        "name": payload.name,
                        "phone": payload.phone,
                        "company": payload.company,
                        "message": resumen,
                        "score": score,
                        "appointment_at": payload.appointment_at,
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