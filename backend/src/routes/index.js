import express from 'express';
import { body } from 'express-validator';
import { loginController, meController } from '../controllers/authController.js';
import { requireAuth, requireRole } from '../middleware/auth.js';
import { createCustomer, deleteCustomer, listCustomers, updateCustomer } from '../controllers/customerController.js';
import { createBooking, listBookings, updateBookingStatus } from '../controllers/bookingController.js';
import { dashboardSummary, recordExpense, recordPayment } from '../controllers/accountingController.js';
import { createEmployee, listEmployees } from '../controllers/employeeController.js';
import { createInvoice, downloadInvoicePdf, listInvoices } from '../controllers/invoiceController.js';
import { exportSalesExcel, financeReport, salesReport } from '../controllers/reportController.js';
import { createNotification, getSettings, listNotifications, upsertSettings } from '../controllers/metaController.js';

const router = express.Router();

router.post('/auth/login', [body('email').isEmail(), body('password').isLength({ min: 6 })], loginController);
router.get('/auth/me', requireAuth, meController);

router.get('/dashboard', requireAuth, dashboardSummary);

router.get('/customers', requireAuth, listCustomers);
router.post('/customers', requireAuth, createCustomer);
router.put('/customers/:id', requireAuth, updateCustomer);
router.delete('/customers/:id', requireAuth, requireRole('Admin', 'Manager'), deleteCustomer);

router.get('/bookings', requireAuth, listBookings);
router.post('/bookings', requireAuth, createBooking);
router.patch('/bookings/:id/status', requireAuth, updateBookingStatus);

router.post('/payments', requireAuth, recordPayment);
router.post('/expenses', requireAuth, recordExpense);

router.get('/employees', requireAuth, requireRole('Admin'), listEmployees);
router.post('/employees', requireAuth, requireRole('Admin'), createEmployee);

router.get('/invoices', requireAuth, listInvoices);
router.post('/invoices', requireAuth, createInvoice);
router.get('/invoices/:id/pdf', requireAuth, downloadInvoicePdf);

router.get('/reports/sales', requireAuth, salesReport);
router.get('/reports/finance', requireAuth, financeReport);
router.get('/reports/sales-export', requireAuth, exportSalesExcel);

router.get('/notifications', requireAuth, listNotifications);
router.post('/notifications', requireAuth, createNotification);

router.get('/settings', requireAuth, getSettings);
router.put('/settings', requireAuth, requireRole('Admin', 'Manager'), upsertSettings);

export default router;
