# Rasel - Full SaaS Project (Backend + Frontend + Database)

This repository now contains a **complete runnable project**:

- **Backend**: FastAPI + SQLAlchemy + JWT auth + RBAC + activity logs + system settings
- **Frontend**: Nginx-served SPA (HTML/CSS/JS) for login, profile, settings, and logs
- **Database**: PostgreSQL service with bootstrap SQL
- **Deployment**: Docker Compose for full local/prod-like setup
- **Export**: Script to generate a downloadable archive of the whole project

---

## Project structure

```text
.
├── app/
│   ├── routers/
│   ├── audit.py
│   ├── config.py
│   ├── database.py
│   ├── deps.py
│   ├── main.py
│   ├── models.py
│   ├── schemas.py
│   └── security.py
├── frontend/
│   ├── Dockerfile
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── db/
│   └── init.sql
├── scripts/
│   └── export_project.sh
├── docker-compose.yml
├── Dockerfile
├── requirements.txt
├── .env.example
└── tests/
```

---

## Features delivered

### Multi-user system
- Roles: `admin`, `staff`
- First registered user is auto-bootstrapped as `admin`
- Subsequent user creation requires authenticated admin

### Role-based access control
- Shared dependency `require_roles(...)`
- Admin-only endpoints for user listing/role changes/settings writes
- Staff sees only their own activity logs

### Activity logs
- Tracks actions such as user creation, login, role updates, settings changes
- Stores actor, entity type, metadata, IP, user-agent, timestamp

### System settings panel
- Backend endpoints for business settings:
  - `company_name`
  - `company_logo_url`
  - `support_email`
  - `timezone`
- Frontend form to load and save those settings

### Authentication and security
- BCrypt password hashing
- JWT bearer token authentication
- Password policy rules (length + upper/lower/digit/symbol)
- Login brute-force rate limit controls
- Security response headers middleware
- CORS configuration via environment variable

---

## Run with Docker (recommended)

```bash
docker compose up --build
```

Services:
- Frontend: http://localhost:8080
- Backend API: http://localhost:8000
- Backend docs: http://localhost:8000/docs
- PostgreSQL: localhost:5432

---

## Initial usage flow

1. Register the first user via `POST /auth/register`.
   - This account becomes `admin` automatically.
2. Log in with `POST /auth/login` to get bearer token.
3. Use admin token to create additional users and assign roles.
4. Update company settings from frontend or API.
5. Review activity logs for audit trail.

---

## Export complete project archive

Generate a full downloadable tarball containing backend + frontend + db + scripts:

```bash
./scripts/export_project.sh
```

Output:

```text
dist/rasel-full-project.tar.gz
```

---

## Notes for production

- Change `SECRET_KEY` to a strong random value.
- Use managed PostgreSQL and private networking.
- Add Alembic migrations and observability stack.
- Add refresh token rotation + optional MFA.
- Add reverse proxy TLS termination and WAF/rate limits.
