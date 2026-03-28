import dayjs from 'dayjs';
import { query } from '../config/db.js';
import { created, ok } from '../utils/http.js';

export const recordPayment = async (req, res) => {
  const { booking_id, amount, method, note } = req.body;
  const result = await query(
    `INSERT INTO payments (booking_id, amount, method, note)
     VALUES (:booking_id,:amount,:method,:note)`,
    { booking_id, amount, method, note }
  );
  return created(res, { id: result.insertId }, 'Payment recorded');
};

export const recordExpense = async (req, res) => {
  const { category, amount, expense_date, note } = req.body;
  const result = await query(
    `INSERT INTO expenses (category, amount, expense_date, note)
     VALUES (:category,:amount,:expense_date,:note)`,
    { category, amount, expense_date, note }
  );
  return created(res, { id: result.insertId }, 'Expense recorded');
};

export const dashboardSummary = async (req, res) => {
  const [summary] = await query(
    `SELECT
      COALESCE(SUM(selling_price),0) total_sales,
      COALESCE(SUM(selling_price - base_cost),0) gross_profit,
      COUNT(*) total_bookings,
      COALESCE(SUM(selling_price) - (SELECT COALESCE(SUM(amount),0) FROM payments),0) due_amount
    FROM bookings`
  );

  const monthlyIncome = await query(
    `SELECT DATE_FORMAT(created_at,'%Y-%m') month, COALESCE(SUM(amount),0) income
     FROM payments GROUP BY DATE_FORMAT(created_at,'%Y-%m') ORDER BY month ASC`
  );

  const monthlyExpense = await query(
    `SELECT DATE_FORMAT(expense_date,'%Y-%m') month, COALESCE(SUM(amount),0) expense
     FROM expenses GROUP BY DATE_FORMAT(expense_date,'%Y-%m') ORDER BY month ASC`
  );

  const today = dayjs().format('YYYY-MM-DD');
  const [todayReport] = await query(
    `SELECT
      (SELECT COALESCE(SUM(amount),0) FROM payments WHERE DATE(created_at)=:today) today_income,
      (SELECT COALESCE(SUM(amount),0) FROM expenses WHERE expense_date=:today) today_expense`,
    { today }
  );

  return ok(res, { summary, monthlyIncome, monthlyExpense, todayReport });
};
