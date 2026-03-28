from collections import defaultdict, deque
from datetime import datetime, timezone

from fastapi import Depends, Header, HTTPException, Request, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from app.config import get_settings
from app.database import get_db
from app.models import Role, User
from app.security import decode_access_token


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")
oauth2_optional = OAuth2PasswordBearer(tokenUrl="/auth/login", auto_error=False)
settings = get_settings()
_failed_attempts: dict[str, deque[float]] = defaultdict(deque)


def check_rate_limit(identifier: str) -> None:
    now = datetime.now(timezone.utc).timestamp()
    attempts = _failed_attempts[identifier]
    window_start = now - settings.login_attempt_window_seconds
    while attempts and attempts[0] < window_start:
        attempts.popleft()
    if len(attempts) >= settings.login_attempt_limit:
        raise HTTPException(status_code=429, detail="Too many failed login attempts. Try again later.")


def register_failed_attempt(identifier: str) -> None:
    _failed_attempts[identifier].append(datetime.now(timezone.utc).timestamp())


def clear_failed_attempts(identifier: str) -> None:
    _failed_attempts.pop(identifier, None)


def _resolve_user(db: Session, token: str | None) -> User | None:
    if not token:
        return None
    try:
        payload = decode_access_token(token)
    except ValueError:
        return None
    user = db.query(User).filter(User.email == payload.get("sub")).first()
    if not user or not user.is_active:
        return None
    return user


def get_current_user(db: Session = Depends(get_db), token: str = Depends(oauth2_scheme)) -> User:
    user = _resolve_user(db, token)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")
    return user


def get_current_user_optional(db: Session = Depends(get_db), token: str | None = Depends(oauth2_optional)) -> User | None:
    return _resolve_user(db, token)


def require_roles(*roles: Role):
    def dependency(current_user: User = Depends(get_current_user)) -> User:
        if current_user.role not in roles:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient permissions")
        return current_user

    return dependency


def request_context(request: Request, user_agent: str | None = Header(default=None)) -> dict[str, str | None]:
    return {"ip_address": request.client.host if request.client else None, "user_agent": user_agent}
