from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.deps import require_roles
from app.models import ActivityLog, Role, User
from app.schemas import ActivityLogRead


router = APIRouter(prefix="/activity-logs", tags=["activity"])


@router.get("", response_model=list[ActivityLogRead])
def list_activity_logs(
    limit: int = 50,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_roles(Role.ADMIN, Role.STAFF)),
):
    query = db.query(ActivityLog).order_by(ActivityLog.created_at.desc())
    if current_user.role != Role.ADMIN:
        query = query.filter(ActivityLog.actor_id == current_user.id)
    return query.limit(min(limit, 200)).all()
