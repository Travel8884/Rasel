from datetime import datetime

from fastapi import APIRouter, Depends, HTTPException, Request, status
from sqlalchemy.orm import Session

from app.audit import log_action
from app.database import get_db
from app.deps import (
    check_rate_limit,
    clear_failed_attempts,
    get_current_user_optional,
    register_failed_attempt,
    request_context,
)
from app.models import Role, User
from app.schemas import LoginInput, Token, UserCreate, UserRead
from app.security import create_access_token, get_password_hash, validate_password_policy, verify_password


router = APIRouter(prefix="/auth", tags=["authentication"])


@router.post("/register", response_model=UserRead)
def register_user(
    payload: UserCreate,
    db: Session = Depends(get_db),
    ctx: dict = Depends(request_context),
    current_user: User | None = Depends(get_current_user_optional),
):
    user_count = db.query(User).count()
    if user_count > 0:
        if current_user is None or current_user.role != Role.ADMIN:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Admin permission required")

    if db.query(User).filter(User.email == payload.email.lower()).first():
        raise HTTPException(status_code=409, detail="Email already exists")

    try:
        validate_password_policy(payload.password)
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc

    role = Role.ADMIN if user_count == 0 else payload.role
    user = User(
        email=payload.email.lower(),
        full_name=payload.full_name,
        hashed_password=get_password_hash(payload.password),
        role=role,
    )
    db.add(user)
    db.commit()
    db.refresh(user)

    log_action(
        db,
        action="user_created",
        entity_type="user",
        entity_id=str(user.id),
        actor=current_user if user_count > 0 else user,
        metadata_json={"email": user.email, "role": user.role.value},
        ip_address=ctx.get("ip_address"),
        user_agent=ctx.get("user_agent"),
    )
    return user


@router.post("/login", response_model=Token)
def login(payload: LoginInput, request: Request, db: Session = Depends(get_db), ctx: dict = Depends(request_context)):
    identifier = f"{request.client.host if request.client else 'unknown'}:{payload.email.lower()}"
    check_rate_limit(identifier)

    user = db.query(User).filter(User.email == payload.email.lower()).first()
    if not user or not verify_password(payload.password, user.hashed_password):
        register_failed_attempt(identifier)
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

    clear_failed_attempts(identifier)
    user.last_login_at = datetime.utcnow()
    db.commit()

    token = create_access_token(user.email, user.role.value)
    log_action(
        db,
        action="user_login",
        entity_type="user",
        entity_id=str(user.id),
        actor=user,
        metadata_json={"email": user.email},
        ip_address=ctx.get("ip_address"),
        user_agent=ctx.get("user_agent"),
    )
    return Token(access_token=token)
