"""Calendar availability schemas."""
from datetime import date as DateType
from pydantic import BaseModel
from typing import Optional


class CalendarSlot(BaseModel):
    time: str  # HH:MM
    available: bool
    reason: Optional[str] = None
    duration_min: int = 30


class CalendarAvailabilityResponse(BaseModel):
    date: DateType
    slots: list[CalendarSlot]
    timezone: str = "America/Santiago"