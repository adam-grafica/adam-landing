"""
Calendar service — placeholder hasta Sprint 3.

Cuando Temporal workflow esté listo:
- start workflow on /api/calendar/book
- poll availability from Temporal
- persist booking in Postgres
"""
from datetime import date as DateType, timedelta


def _generate_business_hours() -> list[str]:
    """9:00 a 18:00 cada 30 min, en horario Chile."""
    slots = []
    h, m = 9, 0
    while h < 18:
        slots.append(f"{h:02d}:{m:02d}")
        m += 30
        if m >= 60:
            m = 0
            h += 1
    return slots


async def get_availability(date: DateType) -> dict:
    """
    Devuelve slots del día. Sprint 3 → Temporal workflow.
    Por ahora: lunes a viernes 9-18 con 70% disponibilidad simulada.
    """
    # Fin de semana: no disponible
    if date.weekday() >= 5:
        slots = [
            {"time": t, "available": False, "reason": "weekend", "duration_min": 30}
            for t in _generate_business_hours()
        ]
    else:
        import hashlib
        seed = int(hashlib.md5(date.isoformat().encode()).hexdigest()[:8], 16)
        slots = []
        for i, t in enumerate(_generate_business_hours()):
            # Pseudo-random per slot: 70% disponibles
            available = ((seed >> i) & 0b111) > 2
            slots.append({
                "time": t,
                "available": available,
                "reason": None if available else "booked",
                "duration_min": 30,
            })
    return {
        "date": date,
        "slots": slots,
        "timezone": "America/Santiago",
    }