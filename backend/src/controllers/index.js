import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/db.js';
import { env } from '../config/env.js';
import { buildExcel, buildInvoicePdf } from '../services/reportService.js';

export const login = async (req, res) => {
  const [user] = await query('SELECT id, full_name, email, role, password_hash FROM employees WHERE email = ?', [req.body.email]);
  if (!user) return res.status(401).json({ message: 'Invalid credentials' });

  const ok = await bcrypt.compare(req.body.password, user.password_hash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });

  await query('INSERT INTO activity_logs (employee_id, action) VALUES (?, ?)', [user.id, 'login']);
  const token = jwt.sign({ id: user.id, name: user.full_name, role: user.role }, env.jwtSecret, { expiresIn: '12h' });
  res.json({ token, user: { id: user.id, name: user.full_name, email: user.email, role: user.role } });
};

export const dashboard = async (_req, res) => {
  const [summary] = await query(`
    SELECT
      IFNULL((SELECT SUM(amount) FROM bookings),0) total_sales,
      IFNULL((SELECT SUM(b.amount - IFNULL(p.total_paid,0))
        FROM bookings b LEFT JOIN (SELECT booking_id, SUM(amount) total_paid FROM payments GROUP BY booking_id) p
        ON b.id = p.booking_id),0) due_amount,
      IFNULL((SELECT SUM(amount - cost) FROM bookings),0) gross_profit,
      (SELECT COUNT(*) FROM bookings) total_bookings
  `);

  const monthly = await query(`
    SELECT DATE_FORMAT(travel_date, '%Y-%m') month,
    SUM(amount) income,
    SUM(cost) costs
    FROM bookings
    GROUP BY DATE_FORMAT(travel_date, '%Y-%m')
    ORDER BY month
  `);

  const expenses = await query(`
    SELECT DATE_FORMAT(expense_date, '%Y-%m') month, SUM(amount) expenses
    FROM expenses GROUP BY DATE_FORMAT(expense_date, '%Y-%m') ORDER BY month
  `);

  res.json({ summary, monthly, expenses });
};

export const listCustomers = async (_req, res) => res.json(await query('SELECT * FROM customers ORDER BY id DESC'));
export const createCustomer = async (req, res) => {
  const result = await query('INSERT INTO customers (full_name,email,phone,passport_no,nid_no,address) VALUES (?,?,?,?,?,?)', Object.values(req.body));
  res.status(201).json({ id: result.insertId, ...req.body });
};
export const updateCustomer = async (req, res) => {
  await query('UPDATE customers SET full_name=?,email=?,phone=?,passport_no=?,nid_no=?,address=? WHERE id=?', [...Object.values(req.body), req.params.id]);
  res.json({ message: 'Updated' });
};
export const deleteCustomer = async (req, res) => {
  await query('DELETE FROM customers WHERE id=?', [req.params.id]);
  res.json({ message: 'Deleted' });
};

export const customerHistory = async (req, res) => {
  const history = await query('SELECT * FROM bookings WHERE customer_id=? ORDER BY travel_date DESC', [req.params.id]);
  res.json(history);
};

export const listBookings = async (_req, res) => {
  const rows = await query(`SELECT b.*, c.full_name customer_name,
    IFNULL((SELECT SUM(amount) FROM payments p WHERE p.booking_id=b.id),0) paid_amount,
    b.amount - IFNULL((SELECT SUM(amount) FROM payments p WHERE p.booking_id=b.id),0) due_amount
    FROM bookings b JOIN customers c ON c.id=b.customer_id ORDER BY b.id DESC`);
  res.json(rows);
};
export const createBooking = async (req, res) => {
  const data = { ...req.body, created_by: req.user.id };
  const result = await query('INSERT INTO bookings (customer_id,booking_type,destination,travel_date,amount,cost,status,notes,created_by) VALUES (?,?,?,?,?,?,?,?,?)', Object.values(data));
  const invoiceNo = `INV-${new Date().getFullYear()}-${String(result.insertId).padStart(6, '0')}`;
  await query('INSERT INTO invoices (booking_id,invoice_no,invoice_date) VALUES (?,?,CURDATE())', [result.insertId, invoiceNo]);
  await query('INSERT INTO notifications (customer_id,title,message) VALUES (?, ?, ?)', [data.customer_id, 'Booking Created', `Your ${data.booking_type} booking is ${data.status}.`]);
  res.status(201).json({ id: result.insertId, invoice_no: invoiceNo });
};
export const updateBookingStatus = async (req, res) => {
  await query('UPDATE bookings SET status=? WHERE id=?', [req.body.status, req.params.id]);
  const [booking] = await query('SELECT customer_id, booking_type FROM bookings WHERE id=?', [req.params.id]);
  await query('INSERT INTO notifications (customer_id,title,message) VALUES (?,?,?)', [booking.customer_id, 'Booking Updated', `${booking.booking_type} booking is now ${req.body.status}.`]);
  res.json({ message: 'Status updated' });
};

export const listPayments = async (_req, res) => res.json(await query('SELECT * FROM payments ORDER BY id DESC'));
export const createPayment = async (req, res) => {
  const result = await query('INSERT INTO payments (booking_id,payment_method,amount,payment_date,reference,created_by) VALUES (?,?,?,?,?,?)', [...Object.values(req.body), req.user.id]);
  const [booking] = await query('SELECT customer_id FROM bookings WHERE id=?', [req.body.booking_id]);
  await query('INSERT INTO notifications (customer_id,title,message) VALUES (?,?,?)', [booking.customer_id, 'Payment Received', `Payment of ${req.body.amount} received.`]);
  res.status(201).json({ id: result.insertId });
};
export const listExpenses = async (_req, res) => res.json(await query('SELECT * FROM expenses ORDER BY id DESC'));
export const createExpense = async (req, res) => {
  const result = await query('INSERT INTO expenses (category,amount,expense_date,note,created_by) VALUES (?,?,?,?,?)', [...Object.values(req.body), req.user.id]);
  res.status(201).json({ id: result.insertId });
};

export const listEmployees = async (_req, res) => res.json(await query('SELECT id,full_name,email,phone,role,created_at FROM employees ORDER BY id DESC'));
export const createEmployee = async (req, res) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  const result = await query('INSERT INTO employees (full_name,email,phone,role,password_hash) VALUES (?,?,?,?,?)', [req.body.full_name, req.body.email, req.body.phone, req.body.role, hash]);
  res.status(201).json({ id: result.insertId });
};

export const listNotifications = async (_req, res) => res.json(await query('SELECT * FROM notifications ORDER BY created_at DESC LIMIT 100'));

export const getSettings = async (_req, res) => {
  const [row] = await query('SELECT * FROM settings WHERE id=1');
  res.json(row);
};
export const updateSettings = async (req, res) => {
  await query('UPDATE settings SET company_name=?,company_address=?,company_logo=?,currency=?,dark_mode=? WHERE id=1', Object.values(req.body));
  res.json({ message: 'Settings saved' });
};

export const salesReport = async (req, res) => {
  const rows = await query('SELECT id, booking_type, destination, amount, cost, status, travel_date FROM bookings WHERE travel_date BETWEEN ? AND ? ORDER BY travel_date', [req.query.from, req.query.to]);
  res.json(rows);
};

export const financialReport = async (req, res) => {
  const [income] = await query('SELECT IFNULL(SUM(amount),0) total FROM bookings WHERE travel_date BETWEEN ? AND ?', [req.query.from, req.query.to]);
  const [expense] = await query('SELECT IFNULL(SUM(amount),0) total FROM expenses WHERE expense_date BETWEEN ? AND ?', [req.query.from, req.query.to]);
  res.json({ income: income.total, expenses: expense.total, profit: income.total - expense.total });
};

export const exportSalesExcel = async (req, res) => {
  const rows = await query('SELECT id, booking_type, destination, amount, cost, status, travel_date FROM bookings WHERE travel_date BETWEEN ? AND ?', [req.query.from, req.query.to]);
  const buffer = await buildExcel('Sales Report', ['ID', 'Type', 'Destination', 'Amount', 'Cost', 'Status', 'Travel Date'], rows.map((r) => [r.id, r.booking_type, r.destination, r.amount, r.cost, r.status, r.travel_date]));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename="sales-report.xlsx"');
  res.send(Buffer.from(buffer));
};

export const invoicePdf = async (req, res) => {
  const [invoice] = await query(`SELECT i.invoice_no, i.invoice_date, b.amount, b.booking_type, b.destination,
      c.full_name customer_name,
      IFNULL((SELECT SUM(amount) FROM payments WHERE booking_id=b.id),0) paid_amount,
      b.amount - IFNULL((SELECT SUM(amount) FROM payments WHERE booking_id=b.id),0) due_amount,
      s.company_name, s.company_address
    FROM invoices i
    JOIN bookings b ON b.id=i.booking_id
    JOIN customers c ON c.id=b.customer_id
    JOIN settings s ON s.id=1
    WHERE i.booking_id=?`, [req.params.bookingId]);
  if (!invoice) return res.status(404).json({ message: 'Invoice not found' });
  const pdf = await buildInvoicePdf(invoice);
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${invoice.invoice_no}.pdf"`);
  res.send(pdf);
};

export const backupSql = async (_req, res) => {
  const tables = ['customers', 'bookings', 'payments', 'expenses', 'invoices', 'employees', 'notifications', 'settings'];
  const dump = [];
  for (const table of tables) {
    const rows = await query(`SELECT * FROM ${table}`);
    dump.push(`-- ${table}`);
    rows.forEach((row) => {
      const cols = Object.keys(row).join(',');
      const values = Object.values(row)
        .map((v) => (v === null ? 'NULL' : `'${String(v).replaceAll("'", "''")}'`))
        .join(',');
      dump.push(`INSERT INTO ${table} (${cols}) VALUES (${values});`);
    });
    dump.push('');
  }
  res.setHeader('Content-Type', 'application/sql');
  res.setHeader('Content-Disposition', 'attachment; filename="backup.sql"');
  res.send(dump.join('\n'));
};
