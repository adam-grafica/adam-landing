"""Lead create/response schemas."""
from typing import Optional
import uuid
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field


class LeadCreate(BaseModel):
    name: Optional[str] = Field(None, max_length=128)
    email: Optional[EmailStr] = None
    phone: Optional[str] = Field(None, max_length=32)
    company: Optional[str] = Field(None, max_length=256)
    industry: Optional[str] = Field(None, max_length=64)
    message: Optional[str] = Field(None, max_length=4000)
    session_id: Optional[uuid.UUID] = None
    source: Optional[str] = Field(None, max_length=64)
    user_agent: Optional[str] = None
    referrer: Optional[str] = None


class LeadResponse(BaseModel):
    id: uuid.UUID
    created_at: datetime
    status: str
    score: int
    next_step: str

    model_config = {"from_attributes": True}