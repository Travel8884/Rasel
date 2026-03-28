# Installation & Production Guide

## 1) System Requirements
- Node.js 20+
- MySQL 8+
- npm 10+

## 2) Database Setup
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/sample_data.sql
```

## 3) Environment Setup
```bash
cp backend/.env.example backend/.env
```
Set strong values:
- `JWT_SECRET` (required long random string)
- `DB_*` credentials
- `FRONTEND_URL`

## 4) Install and Start
```bash
cd backend
npm install
npm run start
```
App is served at: `http://localhost:4000`

## 5) Optional Reverse Proxy (Nginx)
Proxy `:80 -> :4000` with TLS certs.

## 6) Security Checklist
- Replace default passwords immediately
- Restrict MySQL user privileges
- Set backup cron using `/api/backup`
- Enable HTTPS
- Rotate JWT secret periodically

## 7) Daily Operations
- Use Reports for daily/monthly export
- Use Settings for currency/company profile
- Download backup SQL regularly
