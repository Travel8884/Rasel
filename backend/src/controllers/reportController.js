import ExcelJS from 'exceljs';
import { query } from '../config/db.js';
import { ok } from '../utils/http.js';

export const salesReport = async (req, res) => {
  const rows = await query(
    `SELECT b.id, b.title, b.booking_type, b.status, b.selling_price,
      COALESCE((SELECT SUM(p.amount) FROM payments p WHERE p.booking_id=b.id),0) paid
     FROM bookings b ORDER BY b.id DESC`
  );
  return ok(res, rows);
};

export const financeReport = async (req, res) => {
  const [income] = await query('SELECT COALESCE(SUM(amount),0) amount FROM payments');
  const [expense] = await query('SELECT COALESCE(SUM(amount),0) amount FROM expenses');
  return ok(res, { totalIncome: income.amount, totalExpense: expense.amount, netProfit: income.amount - expense.amount });
};

export const exportSalesExcel = async (req, res) => {
  const rows = await query('SELECT id, title, booking_type, status, selling_price FROM bookings ORDER BY id DESC');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Sales');
  sheet.columns = [
    { header: 'ID', key: 'id', width: 10 },
    { header: 'Title', key: 'title', width: 30 },
    { header: 'Type', key: 'booking_type', width: 15 },
    { header: 'Status', key: 'status', width: 15 },
    { header: 'Amount', key: 'selling_price', width: 15 }
  ];
  rows.forEach((row) => sheet.addRow(row));
  res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
  res.setHeader('Content-Disposition', 'attachment; filename=sales-report.xlsx');
  await workbook.xlsx.write(res);
  res.end();
};
