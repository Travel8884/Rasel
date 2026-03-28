from sqlalchemy.orm import Session

from app.models import ActivityLog, User


def log_action(
    db: Session,
    *,
    action: str,
    entity_type: str,
    entity_id: str | None,
    actor: User | None,
    metadata_json: dict | None = None,
    ip_address: str | None = None,
    user_agent: str | None = None,
) -> None:
    entry = ActivityLog(
        action=action,
        entity_type=entity_type,
        entity_id=entity_id,
        actor_id=actor.id if actor else None,
        metadata_json=metadata_json or {},
        ip_address=ip_address,
        user_agent=user_agent,
    )
    db.add(entry)
    db.commit()
