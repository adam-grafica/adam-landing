"""
GET /api/calendar/availability — slots de tiempo disponibles.
"""
from datetime import date as DateType
from fastapi import APIRouter, Query, HTTPException

from app.schemas.calendar import CalendarAvailabilityResponse
from app.services.calendar import get_availability

router = APIRouter()


@router.get("/availability", response_model=CalendarAvailabilityResponse)
async def calendar_availability(date: DateType = Query(..., description="YYYY-MM-DD")):
    """
    Devuelve slots para una fecha.
    Sprint 3: integrará Temporal workflow para bookings reales.
    """
    # No dates in the past
    from datetime import date as _date
    if date < _date.today():
        raise HTTPException(status_code=400, detail="No se puede consultar disponibilidad en el pasado.")

    result = await get_availability(date)
    return CalendarAvailabilityResponse(**result)