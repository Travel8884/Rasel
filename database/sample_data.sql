USE travel_agency;

INSERT INTO employees (full_name, email, phone, role, password_hash) VALUES
('System Admin', 'admin@travel.local', '+1-555-000-0001', 'admin', '$2a$10$JYhVVDawI9Qf2TqJSoRk/.OrsPaAHFxRxRuJqC5h.aY9PNwGz7x5i'),
('Operations Manager', 'manager@travel.local', '+1-555-000-0002', 'manager', '$2a$10$JYhVVDawI9Qf2TqJSoRk/.OrsPaAHFxRxRuJqC5h.aY9PNwGz7x5i')
ON DUPLICATE KEY UPDATE full_name=VALUES(full_name);

INSERT INTO settings (id, company_name, company_address, company_logo, currency, dark_mode)
VALUES (1, 'SkyRoute Travels', 'New York, USA', '', 'USD', FALSE)
ON DUPLICATE KEY UPDATE company_name=VALUES(company_name);

INSERT INTO customers (full_name, email, phone, passport_no, nid_no, address) VALUES
('Alice Johnson','alice@example.com','+1-555-101-0001','P1234567','NID001','Chicago'),
('Rahim Uddin','rahim@example.com','+1-555-101-0002','P7654321','NID002','Dallas');

INSERT INTO bookings (customer_id, booking_type, destination, travel_date, amount, cost, status, notes, created_by) VALUES
(1,'flight','London','2026-03-10',1200,900,'confirmed','Round trip',1),
(2,'visa','Canada','2026-03-15',500,220,'pending','Student visa support',2);

INSERT INTO invoices (booking_id, invoice_no, invoice_date) VALUES
(1,'INV-2026-000001','2026-03-01'),
(2,'INV-2026-000002','2026-03-02');

INSERT INTO payments (booking_id, payment_method, amount, payment_date, reference, created_by) VALUES
(1,'bank',700,'2026-03-03','TXN-12345',1),
(2,'mobile',200,'2026-03-04','MBL-455',2);

INSERT INTO expenses (category, amount, expense_date, note, created_by) VALUES
('Marketing',300,'2026-03-05','Social media ads',1),
('Office Rent',1000,'2026-03-01','Monthly rent',1);

INSERT INTO notifications (customer_id, title, message) VALUES
(1,'Payment Reminder','Remaining due for London trip.'),
(2,'Booking Update','Visa booking pending documents.');
