"""Pydantic schemas."""
from app.schemas.chat import ChatRequest, ChatResponse
from app.schemas.lead import LeadCreate, LeadResponse
from app.schemas.calendar import CalendarAvailabilityResponse, CalendarSlot

__all__ = [
    "ChatRequest",
    "ChatResponse",
    "LeadCreate",
    "LeadResponse",
    "CalendarAvailabilityResponse",
    "CalendarSlot",
]