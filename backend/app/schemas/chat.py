"""Chat request/response schemas."""
from typing import Optional
import uuid
from pydantic import BaseModel, Field


class ChatRequest(BaseModel):
    session_id: Optional[uuid.UUID] = None
    message: str = Field(..., min_length=1, max_length=2000)
    visitor_id: str = Field(..., min_length=1, max_length=128)
    page_url: Optional[str] = None
    user_agent: Optional[str] = None


class ChatResponse(BaseModel):
    session_id: uuid.UUID
    reply: str
    intent: Optional[str] = None
    confidence: Optional[float] = None
    tools_invoked: list[str] = []
    tokens: Optional[int] = None
    latency_ms: Optional[int] = None
    agent_id: Optional[str] = None