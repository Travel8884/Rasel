CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS customers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) NOT NULL,
    email VARCHAR(150),
    address TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    destination VARCHAR(120) NOT NULL,
    days INT NOT NULL,
    base_price DECIMAL(12,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    customer_id INT NOT NULL,
    package_id INT NOT NULL,
    travel_date DATE NOT NULL,
    traveler_count INT NOT NULL,
    total_price DECIMAL(12,2) NOT NULL,
    paid_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    due_amount DECIMAL(12,2) NOT NULL DEFAULT 0,
    status ENUM('paid','partial') DEFAULT 'partial',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_booking_customer FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE,
    CONSTRAINT fk_booking_package FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS transactions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    type ENUM('income','expense') NOT NULL,
    category VARCHAR(100) NOT NULL,
    amount DECIMAL(12,2) NOT NULL,
    note VARCHAR(255),
    date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO admins (username, password)
VALUES ('admin', '$2y$10$D8CuqYJr7x4hQKxDKhXh5eeQwQ1eqk8v3vI4zAbOeXtfLOcAfeUim')
ON DUPLICATE KEY UPDATE username=username;

INSERT INTO customers (name, phone, email, address) VALUES
('Rahim Travels', '01700000001', 'rahim@example.com', 'Dhaka'),
('Karim Uddin', '01800000002', 'karim@example.com', 'Chattogram');

INSERT INTO packages (title, destination, days, base_price, description) VALUES
('Coxs Bazar Couple Tour', 'Coxs Bazar', 3, 18000.00, 'Hotel + Transport'),
('Sajek Family Package', 'Sajek', 2, 22000.00, 'Resort + Jeep');

INSERT INTO bookings (customer_id, package_id, travel_date, traveler_count, total_price, paid_amount, due_amount, status) VALUES
(1, 1, CURDATE(), 2, 18000.00, 10000.00, 8000.00, 'partial');

INSERT INTO transactions (type, category, amount, note, date) VALUES
('income', 'Booking', 10000.00, 'Initial booking payment', CURDATE()),
('expense', 'Office Rent', 3000.00, 'Monthly office rent', CURDATE());
