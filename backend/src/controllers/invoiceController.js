import PDFDocument from 'pdfkit';
import { query } from '../config/db.js';
import { created, ok } from '../utils/http.js';

export const createInvoice = async (req, res) => {
  const { booking_id } = req.body;
  const invoiceNo = `INV-${Date.now()}`;
  const result = await query('INSERT INTO invoices (booking_id, invoice_no) VALUES (:booking_id,:invoice_no)', { booking_id, invoice_no: invoiceNo });
  return created(res, { id: result.insertId, invoice_no: invoiceNo });
};

export const downloadInvoicePdf = async (req, res) => {
  const id = Number(req.params.id);
  const rows = await query(
    `SELECT i.invoice_no, i.created_at, b.title, b.destination, b.selling_price, c.name customer_name
     FROM invoices i JOIN bookings b ON i.booking_id=b.id
     JOIN customers c ON b.customer_id=c.id WHERE i.id=:id`,
    { id }
  );
  const invoice = rows[0];
  if (!invoice) return res.status(404).json({ success: false, message: 'Not found' });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename=${invoice.invoice_no}.pdf`);

  const doc = new PDFDocument({ size: 'A4', margin: 40 });
  doc.pipe(res);
  doc.fontSize(22).text('Travel Agency Invoice', { align: 'center' });
  doc.moveDown();
  doc.fontSize(12).text(`Invoice: ${invoice.invoice_no}`);
  doc.text(`Date: ${new Date(invoice.created_at).toLocaleString()}`);
  doc.text(`Customer: ${invoice.customer_name}`);
  doc.text(`Service: ${invoice.title}`);
  doc.text(`Destination: ${invoice.destination}`);
  doc.text(`Total: $${Number(invoice.selling_price).toFixed(2)}`);
  doc.moveDown();
  doc.text('Thank you for choosing us.', { align: 'center' });
  doc.end();
};

export const listInvoices = async (req, res) => {
  const rows = await query('SELECT * FROM invoices ORDER BY id DESC');
  return ok(res, rows);
};
