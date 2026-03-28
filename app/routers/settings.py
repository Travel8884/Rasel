from datetime import datetime

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.audit import log_action
from app.database import get_db
from app.deps import request_context, require_roles
from app.models import Role, SystemSetting, User
from app.schemas import SystemSettingsRead, SystemSettingsUpdate


router = APIRouter(prefix="/settings", tags=["settings"])
SETTING_KEYS = ["company_name", "company_logo_url", "support_email", "timezone"]


def _load_settings(db: Session) -> dict[str, str | None]:
    records = db.query(SystemSetting).filter(SystemSetting.key.in_(SETTING_KEYS)).all()
    data = {k: None for k in SETTING_KEYS}
    for item in records:
        data[item.key] = item.value
    return data


@router.get("/system", response_model=SystemSettingsRead)
def get_settings(db: Session = Depends(get_db), _: User = Depends(require_roles(Role.ADMIN, Role.STAFF))):
    data = _load_settings(db)
    latest = db.query(SystemSetting).order_by(SystemSetting.updated_at.desc()).first()
    return SystemSettingsRead(
        company_name=data.get("company_name") or "",
        company_logo_url=data.get("company_logo_url"),
        support_email=data.get("support_email") or "support@example.com",
        timezone=data.get("timezone") or "UTC",
        updated_at=latest.updated_at if latest else None,
        updated_by=latest.updated_by if latest else None,
    )


@router.put("/system", response_model=SystemSettingsRead)
def update_settings(
    payload: SystemSettingsUpdate,
    db: Session = Depends(get_db),
    admin: User = Depends(require_roles(Role.ADMIN)),
    ctx: dict = Depends(request_context),
):
    now = datetime.utcnow()
    for key in SETTING_KEYS:
        value = getattr(payload, key)
        row = db.query(SystemSetting).filter(SystemSetting.key == key).first()
        if row:
            row.value = value or ""
            row.updated_by = admin.id
            row.updated_at = now
        else:
            db.add(SystemSetting(key=key, value=value or "", updated_by=admin.id, updated_at=now))
    db.commit()

    log_action(
        db,
        action="system_settings_updated",
        entity_type="settings",
        entity_id="system",
        actor=admin,
        metadata_json=payload.model_dump(),
        ip_address=ctx.get("ip_address"),
        user_agent=ctx.get("user_agent"),
    )

    return SystemSettingsRead(**payload.model_dump(), updated_at=now, updated_by=admin.id)
