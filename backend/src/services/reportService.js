import ExcelJS from 'exceljs';
import PDFDocument from 'pdfkit';

export const buildExcel = async (title, headers, rows) => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet(title);
  sheet.addRow(headers);
  rows.forEach((r) => sheet.addRow(r));
  sheet.getRow(1).font = { bold: true };
  sheet.columns.forEach((c) => {
    c.width = 20;
  });
  return workbook.xlsx.writeBuffer();
};

export const buildInvoicePdf = (invoice) => new Promise((resolve) => {
  const doc = new PDFDocument({ margin: 40 });
  const chunks = [];
  doc.on('data', (c) => chunks.push(c));
  doc.on('end', () => resolve(Buffer.concat(chunks)));

  doc.fontSize(20).text(invoice.company_name || 'Travel Agency', { align: 'center' });
  doc.fontSize(12).text(invoice.company_address || '', { align: 'center' });
  doc.moveDown();
  doc.fontSize(16).text(`Invoice #${invoice.invoice_no}`);
  doc.text(`Date: ${new Date(invoice.invoice_date).toISOString().slice(0, 10)}`);
  doc.text(`Customer: ${invoice.customer_name}`);
  doc.text(`Type: ${invoice.booking_type}`);
  doc.text(`Destination: ${invoice.destination}`);
  doc.moveDown();
  doc.text(`Total Amount: ${invoice.amount.toFixed(2)}`);
  doc.text(`Paid Amount: ${invoice.paid_amount.toFixed(2)}`);
  doc.text(`Due Amount: ${invoice.due_amount.toFixed(2)}`);
  doc.end();
});
