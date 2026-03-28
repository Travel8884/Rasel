# Travel Agency Management Software (Full-Stack)

Production-ready travel agency management platform with role-based authentication, booking workflow, accounting, invoicing, reports, notifications, and responsive admin UI.

## Stack
- Backend: Node.js + Express + MySQL
- Frontend: React + Vite + Recharts
- Auth: JWT + RBAC (Admin, Manager, Staff)

## Folder Structure
```
backend/
  src/
    config/            # DB pool
    controllers/       # domain controllers
    middleware/        # auth & error handler
    routes/            # REST API routes
    services/          # auth service
    utils/             # response helpers
  sql/
    schema.sql         # full database schema
    seed.sql           # sample production-like data
frontend/
  src/
    components/
    context/
    pages/
    services/
    styles/
```

## Setup Guide (No Additional Coding Required)

### 1) Prerequisites
- Node.js 20+
- MySQL 8+

### 2) Database Setup
```bash
mysql -u root -p < backend/sql/schema.sql
mysql -u root -p < backend/sql/seed.sql
```

### 3) Backend Setup
```bash
cd backend
cp .env.example .env
# edit DB credentials + JWT secret
npm install
npm run dev
```
Backend runs at `http://localhost:5000`.

### 4) Frontend Setup
```bash
cd frontend
npm install
echo "VITE_API_URL=http://localhost:5000/api" > .env
npm run dev
```
Frontend runs at `http://localhost:5173`.

### 5) Login Credentials (Seeded)
- Admin: `admin@travelpro.com` / `Admin@123`
- Manager: `manager@travelpro.com` / `Admin@123`
- Staff: `staff@travelpro.com` / `Admin@123`

## API Routes

### Auth
- `POST /api/auth/login`
- `GET /api/auth/me`

### Dashboard
- `GET /api/dashboard`

### Customers
- `GET /api/customers?q=`
- `POST /api/customers`
- `PUT /api/customers/:id`
- `DELETE /api/customers/:id` (Admin/Manager)

### Bookings
- `GET /api/bookings?status=&type=`
- `POST /api/bookings`
- `PATCH /api/bookings/:id/status`

### Accounting
- `POST /api/payments`
- `POST /api/expenses`

### Invoices
- `GET /api/invoices`
- `POST /api/invoices`
- `GET /api/invoices/:id/pdf` (print-ready PDF)

### Employee Management
- `GET /api/employees` (Admin)
- `POST /api/employees` (Admin)

### Reports
- `GET /api/reports/sales`
- `GET /api/reports/finance`
- `GET /api/reports/sales-export` (Excel)

### Notifications
- `GET /api/notifications`
- `POST /api/notifications`

### Settings
- `GET /api/settings`
- `PUT /api/settings` (Admin/Manager)

## Feature Coverage
- Dashboard summary cards + monthly charts
- Customer CRUD with passport/NID
- Flight/Hotel/Package/Visa booking pipeline
- Payment, due, expense, profit/loss support
- Unique invoice ID + PDF receipt generation
- Employee role-based access control
- Sales/financial reporting + Excel export
- Notification center for reminders/updates
- Company profile + currency + dark mode
- Search/filter support (customers/bookings)
- Backup-ready SQL schema + seed data

## Backup Strategy
For production backup (daily cron):
```bash
mysqldump -u root -p travel_agency > backup_$(date +%F).sql
```
