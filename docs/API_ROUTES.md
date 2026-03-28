# API Routes

Base URL: `/api`

## Authentication
- `POST /auth/login`

## Dashboard
- `GET /dashboard`

## Customers
- `GET /customers`
- `POST /customers`
- `PUT /customers/:id`
- `DELETE /customers/:id` (admin, manager)
- `GET /customers/:id/history`

## Bookings
- `GET /bookings`
- `POST /bookings`
- `PATCH /bookings/:id/status`

## Accounting
- `GET /payments`
- `POST /payments`
- `GET /expenses`
- `POST /expenses`

## Employees
- `GET /employees` (admin, manager)
- `POST /employees` (admin only)

## Reports
- `GET /reports/sales?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/financial?from=YYYY-MM-DD&to=YYYY-MM-DD`
- `GET /reports/sales/export?from=YYYY-MM-DD&to=YYYY-MM-DD` (Excel)

## Invoice & Backup
- `GET /invoice/:bookingId/pdf`
- `GET /backup` (admin only)

## Notifications & Settings
- `GET /notifications`
- `GET /settings`
- `PUT /settings` (admin, manager)
