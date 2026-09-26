"""Lead create/response schemas.

2026-09-26 (MS-MANAGER): el formulario real (ModalForm.tsx paso 5) manda el
payload en español — `nombre`, `telefono`, `telefonoCompleto`, `servicios`,
`fecha`, `hora`, `fechaHoraCompleta`, `timestamp`, `fuente` — mientras este
schema sólo conocía `name`/`phone`. Pydantic descarta en silencio lo que no
reconoce, así que el endpoint respondía 201 igual: cada lead del sitio se
guardaba sin nombre, sin teléfono y sin hora, con score 15 y
next_step=add_to_newsletter. El lead de pago (nombre + WhatsApp + hora) y el
lead de newsletter (nombre, nada más) se veían idénticos en el CRM.

Se acepta el payload en ambos idiomas con AliasChoices, y se agregan los
campos de agendamiento que el formulario ya enviaba y que nadie leía.
"""
from typing import Optional
import uuid
from datetime import date as DateType, datetime
from pydantic import AliasChoices, BaseModel, EmailStr, Field, model_validator


class LeadCreate(BaseModel):
    # Campos canónicos en inglés (contrato original, sigue siendo la fuente de
    # verdad para n8n y cualquier consumidor futuro). Cada uno acepta además su
    # alias en español tal cual lo produce el formulario.
    name: Optional[str] = Field(
        None,
        max_length=128,
        validation_alias=AliasChoices("name", "nombre"),
    )
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(
        None,
        max_length=32,
        validation_alias=AliasChoices("phone", "telefono", "telefonoCompleto"),
    )
    company: Optional[str] = Field(None, max_length=256)
    industry: Optional[str] = Field(None, max_length=64)
    message: Optional[str] = Field(None, max_length=4000)
    session_id: Optional[uuid.UUID] = None
    source: Optional[str] = Field(
        None,
        max_length=64,
        validation_alias=AliasChoices("source", "fuente"),
    )
    user_agent: Optional[str] = None
    referrer: Optional[str] = None

    # Agendamiento — el formulario los mandaba y el backend los descartaba.
    # Sin esto, la hora elegida por el lead se perdía en el camino.
    appointment_date: Optional[DateType] = Field(
        None,
        validation_alias=AliasChoices("appointment_date", "fecha"),
    )
    appointment_time: Optional[str] = Field(
        None,
        max_length=5,
        pattern=r"^\d{2}:\d{2}$",
        validation_alias=AliasChoices("appointment_time", "hora"),
    )
    appointment_at: Optional[str] = Field(
        None,
        max_length=32,
        validation_alias=AliasChoices("appointment_at", "fechaHoraCompleta"),
    )
    services: list[str] = Field(
        default_factory=list,
        max_length=10,
        validation_alias=AliasChoices("services", "servicios"),
    )
    submitted_at: Optional[datetime] = Field(
        None,
        validation_alias=AliasChoices("submitted_at", "timestamp"),
    )

    model_config = {"populate_by_name": True}

    @model_validator(mode="after")
    def _normalize_phone(self) -> "LeadCreate":
        """El formulario arma el teléfono como `+56` + 9 dígitos (p.ej. +56912345678).

        El schema de WhatsApp handoff exige `^\+?[1-9]\d{7,14}$`. Sin
        normalizar, el mismo número sirve para un endpoint y revienta en el otro.
        """
        if self.phone:
            digits = "".join(ch for ch in self.phone if ch.isdigit())
            if digits and not digits.startswith("56"):
                digits = f"56{digits}"
            self.phone = f"+{digits}" if digits else None
        return self


class LeadResponse(BaseModel):
    id: uuid.UUID
    created_at: datetime
    status: str
    score: int
    next_step: str

    model_config = {"from_attributes": True}
