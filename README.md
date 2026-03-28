# Travel Agency Management Software (Production-Ready)

A full-stack, role-based Travel Agency Management platform with dashboard analytics, booking workflows, accounting, invoices, reports, employee control, notifications, backup, dark mode, and exports.

## Tech Stack
- Backend: Node.js + Express
- Frontend: Responsive HTML/CSS/JavaScript (Bootstrap + Chart.js)
- Database: MySQL
- Auth: JWT + RBAC

## Folder Structure
```
.
├── backend/
│   ├── package.json
│   └── src/
│       ├── config/        # env + mysql pool
│       ├── controllers/   # business logic
│       ├── middleware/    # auth, validation, errors
│       ├── routes/        # API routes
│       ├── services/      # PDF/Excel services
│       ├── utils/         # Joi schemas
│       └── server.js      # app entry
├── frontend/
│   ├── index.html
│   ├── css/app.css
│   └── js/app.js
├── database/
│   ├── schema.sql
│   └── sample_data.sql
└── docs/
    ├── API_ROUTES.md
    └── INSTALLATION.md
```

## Quick Start
1. Create MySQL DB schema and sample data:
   ```bash
   mysql -u root -p < database/schema.sql
   mysql -u root -p < database/sample_data.sql
   ```
2. Configure backend env:
   ```bash
   cp backend/.env.example backend/.env
   # then update DB credentials and JWT secret
   ```
3. Install and run backend:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
4. Open `http://localhost:4000`

### Default Credentials
- Admin: `admin@travel.local` / `admin123`
- Manager: `manager@travel.local` / `admin123`

## Included Functional Modules
- Dashboard analytics (sales, dues, profit, bookings + charts)
- Customer CRUD + travel history
- Booking management (flight/hotel/package/visa)
- Payment + due + expense + P/L report
- Auto invoice generation + printable PDF
- Employee management + role controls + activity logs
- Reporting (sales, financial, Excel export)
- Notifications (booking updates, payment events)
- Settings (company profile, currency, dark mode)
- Backup endpoint (`.sql` download)

For API details and full installation hardening, see `docs/`

## One-command Docker Run
```bash
docker compose up --build
```
- App: `http://localhost:4000`
- MySQL exposed on: `localhost:3307`

If you face local setup issues, read: `docs/TROUBLESHOOTING_BN.md`.
