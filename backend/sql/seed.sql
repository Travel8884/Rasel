USE travel_agency;

-- password: Admin@123
INSERT INTO employees (name,email,role,password_hash) VALUES
('System Admin','admin@travelpro.com','Admin','$2a$10$MzWmkVNT1vG86OvJYxq3Iup/.3YMp0vQ6zPwuQ4oV8B/QcI2vA5t.'),
('Operations Manager','manager@travelpro.com','Manager','$2a$10$MzWmkVNT1vG86OvJYxq3Iup/.3YMp0vQ6zPwuQ4oV8B/QcI2vA5t.'),
('Support Staff','staff@travelpro.com','Staff','$2a$10$MzWmkVNT1vG86OvJYxq3Iup/.3YMp0vQ6zPwuQ4oV8B/QcI2vA5t.');

INSERT INTO customers (name,email,phone,passport_no,nid_no,address) VALUES
('John Carter','john@example.com','+1-555-1111','P99881','NID1234','New York'),
('Sara Khan','sara@example.com','+1-555-2222','P66521','NID2233','Chicago');

INSERT INTO bookings (customer_id,booking_type,title,destination,travel_date,return_date,base_cost,selling_price,status,visa_status) VALUES
(1,'Flight','NYC to Dubai Business Flight','Dubai','2026-04-10','2026-04-20',1100,1450,'Confirmed','Not Required'),
(2,'Package','Singapore Family Package','Singapore','2026-05-01','2026-05-08',1700,2200,'Pending','In Progress');

INSERT INTO payments (booking_id,amount,method,note) VALUES
(1,1000,'Bank','Advance payment'),
(2,800,'Mobile Banking','First installment');

INSERT INTO expenses (category,amount,expense_date,note) VALUES
('Office Rent',1200,'2026-03-01','Monthly rent'),
('Marketing',450,'2026-03-05','Social ads');

INSERT INTO settings (`key`,`value`) VALUES
('company_name','TravelPro Agency'),
('company_address','100 Madison Ave, New York'),
('currency','USD');
