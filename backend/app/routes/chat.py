"""
POST /api/chat — chat con agente embebido.

Persists session + messages en Postgres.
Calls A2A gateway vía services/agent.py.
"""
import logging
import uuid
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.db import get_session
from app.models.chat_session import ChatSession, ChatMessage
from app.schemas.chat import ChatRequest, ChatResponse
from app.services.agent import call_agent

router = APIRouter()
log = logging.getLogger(__name__)


@router.post("", response_model=ChatResponse)
@router.post("/", response_model=ChatResponse)
async def chat(request: ChatRequest, session: AsyncSession = Depends(get_session)):
    """Procesa un mensaje del usuario y devuelve la del agente."""

    # Get or create session
    chat_session: ChatSession | None = None
    if request.session_id:
        chat_session = await session.get(ChatSession, request.session_id)

    if chat_session is None:
        chat_session = ChatSession(
            visitor_id=request.visitor_id,
            user_agent=request.user_agent,
            page_url=request.page_url,
        )
        session.add(chat_session)
        await session.flush()  # get id

    # Persist user message
    user_msg = ChatMessage(
        session_id=chat_session.id,
        role="user",
        content=request.message,
    )
    session.add(user_msg)

    # Call agent (A2A gateway or fallback)
    agent_result = await call_agent(
        message=request.message,
        session_id=str(chat_session.id),
        visitor_id=request.visitor_id,
    )

    # Persist agent message
    agent_msg = ChatMessage(
        session_id=chat_session.id,
        role="agent",
        content=agent_result["reply"],
        tokens_used=agent_result.get("tokens"),
        latency_ms=agent_result.get("latency_ms"),
        metadata_={
            "intent": agent_result.get("intent"),
            "confidence": agent_result.get("confidence"),
            "agent_id": agent_result.get("agent_id"),
            "tools_invoked": agent_result.get("tools_invoked", []),
        },
    )
    session.add(agent_msg)

    # Update last_seen
    from datetime import datetime
    chat_session.last_seen_at = datetime.utcnow()

    await session.commit()

    return ChatResponse(
        session_id=chat_session.id,
        reply=agent_result["reply"],
        intent=agent_result.get("intent"),
        confidence=agent_result.get("confidence"),
        tools_invoked=agent_result.get("tools_invoked", []),
        tokens=agent_result.get("tokens"),
        latency_ms=agent_result.get("latency_ms"),
        agent_id=agent_result.get("agent_id"),
    )