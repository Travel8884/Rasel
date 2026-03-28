from datetime import datetime
from typing import Any

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import Role


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LoginInput(BaseModel):
    email: EmailStr
    password: str


class UserCreate(BaseModel):
    email: EmailStr
    full_name: str = Field(min_length=2, max_length=120)
    password: str = Field(min_length=12, max_length=128)
    role: Role = Role.STAFF


class UserRead(BaseModel):
    id: int
    email: EmailStr
    full_name: str
    role: Role
    is_active: bool
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserRoleUpdate(BaseModel):
    role: Role


class ActivityLogRead(BaseModel):
    id: int
    actor_id: int | None
    action: str
    entity_type: str
    entity_id: str | None
    metadata_json: dict[str, Any]
    ip_address: str | None
    user_agent: str | None
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SystemSettingsUpdate(BaseModel):
    company_name: str = Field(min_length=1, max_length=120)
    company_logo_url: str | None = Field(default=None, max_length=300)
    support_email: EmailStr
    timezone: str = Field(min_length=2, max_length=80)


class SystemSettingsRead(SystemSettingsUpdate):
    updated_at: datetime | None = None
    updated_by: int | None = None
