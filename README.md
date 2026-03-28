# Rasel SaaS Core Upgrade

This repository now includes a production-oriented FastAPI backend foundation suitable for SaaS operations.

## What is implemented

- Multi-user architecture with `admin` and `staff` roles.
- Role-based access control (RBAC) on protected endpoints.
- Activity logs for authentication and administrative actions.
- System settings panel endpoints for business configuration (`company_name`, `company_logo_url`, etc.).
- Hardened authentication/security baseline:
  - BCrypt password hashing
  - JWT access tokens
  - Password policy enforcement
  - Login rate limiting for brute-force protection
  - Security HTTP headers middleware

## API overview

- `POST /auth/register` (bootstrap first admin, later admin-only)
- `POST /auth/login`
- `GET /users/me`
- `GET /users` (admin-only)
- `PATCH /users/{user_id}/role` (admin-only)
- `GET /activity-logs` (admin sees all, staff sees own)
- `GET /settings/system` (authenticated)
- `PUT /settings/system` (admin-only)
- `GET /health`

## Local run

```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

## Production notes

Before production deployment:

1. Set a strong `SECRET_KEY` through environment variables.
2. Move from SQLite to PostgreSQL (`DATABASE_URL`).
3. Add migrations (Alembic) and centralized logging/monitoring.
4. Add refresh tokens + token rotation and optional MFA.
5. Configure HTTPS termination and WAF/rate-limit at edge.
