# Travel Agency Account Management (PHP + XAMPP)

এই প্রজেক্টটি একটি **full travel agency account management software** — PHP + MySQL (XAMPP) দিয়ে তৈরি।

## Features
- Admin login/logout
- Dashboard (today income, expense, profit, due)
- Customer management (CRUD)
- Tour package management (CRUD)
- Booking management (payment status সহ)
- Income/Expense entry
- Due tracking
- Profit/Loss monthly report
- Printable booking invoice
- Responsive modern UI (Bootstrap + custom CSS)

## Quick Setup (XAMPP)
1. `travel_agency_php` ফোল্ডারটি `C:/xampp/htdocs/` এ কপি করুন
2. XAMPP থেকে Apache + MySQL চালু করুন
3. `http://localhost/phpmyadmin` এ গিয়ে `travel_agency` নামে DB তৈরি করুন
4. `sql/schema.sql` import করুন
5. ব্রাউজারে চালান: `http://localhost/travel_agency_php`

## Default Login
- Username: `admin`
- Password: `admin123`

> প্রোডাকশনে password অবশ্যই পরিবর্তন করবেন।
