# Rasel SaaS Suite (Backend + Frontend + Database)

This repository is now a complete SaaS-ready project bundle:

- **Backend:** FastAPI API server with JWT auth, RBAC, activity logs, system settings
- **Frontend:** React + Vite admin dashboard for business operations
- **Database:** PostgreSQL (Docker Compose service)

## Features Delivered

### 1) Multi-user system (Admin, Staff)
- Role model with `admin` / `staff`
- First registration auto-bootstraps initial admin
- Admin can create additional users and manage roles

### 2) Role-Based Access Control (RBAC)
- Protected endpoint dependencies enforce role permissions
- Admin-only operations for sensitive actions (user role updates, settings writes)

### 3) Activity Logs
- Tracks auth and admin actions (`user_login`, `user_created`, `user_role_updated`, `system_settings_updated`)
- Staff sees own log scope; admin sees all logs

### 4) System Settings Panel
- Business-level settings API + frontend panel:
  - Company name
  - Company logo URL
  - Support email
  - Timezone

### 5) Authentication and Security Hardening
- BCrypt password hashing
- JWT bearer tokens
- Password complexity policy
- Login rate-limiting guard
- Secure headers middleware
- CORS handling for frontend/backend deployment

## Project Structure

```
.
├── app/                    # FastAPI backend
├── frontend/               # React frontend dashboard
├── tests/                  # Backend tests
├── docker-compose.yml      # Full stack orchestration
├── Dockerfile              # Backend image
└── scripts/export_project.sh
```

## Quick Start (Full Stack)

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API docs: http://localhost:8000/docs
- Postgres: localhost:5432

## First-time Admin Bootstrap

1. Start stack (`docker compose up --build`)
2. Register first admin user via API:

```bash
curl -X POST http://localhost:8000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@company.com",
    "full_name": "Platform Admin",
    "password": "StrongPass#2026",
    "role": "admin"
  }'
```

After first account, further `/auth/register` calls require an authenticated admin token.

## Export a Downloadable Project Archive

Use the included script to export the full codebase:

```bash
bash scripts/export_project.sh
```

Creates:
- `dist/rasel-saas-project.tar.gz`

## Environment Variables

See `.env.example` for all backend env vars.

## Local Development Without Docker

Backend:
```bash
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Frontend:
```bash
cd frontend
npm install
npm run dev
```
