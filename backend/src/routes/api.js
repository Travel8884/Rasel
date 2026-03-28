import { Router } from 'express';
import {
  backupSql,
  createBooking,
  createCustomer,
  createEmployee,
  createExpense,
  createPayment,
  customerHistory,
  dashboard,
  deleteCustomer,
  exportSalesExcel,
  financialReport,
  getSettings,
  invoicePdf,
  listBookings,
  listCustomers,
  listEmployees,
  listExpenses,
  listNotifications,
  listPayments,
  login,
  salesReport,
  updateBookingStatus,
  updateCustomer,
  updateSettings
} from '../controllers/index.js';
import { authRequired, authorize } from '../middleware/auth.js';
import { validate } from '../middleware/validate.js';
import { bookingSchema, customerSchema, employeeSchema, expenseSchema, loginSchema, paymentSchema, settingsSchema } from '../utils/schemas.js';

const router = Router();

router.post('/auth/login', validate(loginSchema), login);
router.use(authRequired);

router.get('/dashboard', dashboard);

router.get('/customers', listCustomers);
router.get('/customers/:id/history', customerHistory);
router.post('/customers', validate(customerSchema), createCustomer);
router.put('/customers/:id', validate(customerSchema), updateCustomer);
router.delete('/customers/:id', authorize('admin', 'manager'), deleteCustomer);

router.get('/bookings', listBookings);
router.post('/bookings', validate(bookingSchema), createBooking);
router.patch('/bookings/:id/status', updateBookingStatus);

router.get('/payments', listPayments);
router.post('/payments', validate(paymentSchema), createPayment);
router.get('/expenses', listExpenses);
router.post('/expenses', validate(expenseSchema), createExpense);

router.get('/employees', authorize('admin', 'manager'), listEmployees);
router.post('/employees', authorize('admin'), validate(employeeSchema), createEmployee);

router.get('/reports/sales', salesReport);
router.get('/reports/financial', financialReport);
router.get('/reports/sales/export', exportSalesExcel);

router.get('/invoice/:bookingId/pdf', invoicePdf);
router.get('/notifications', listNotifications);

router.get('/settings', getSettings);
router.put('/settings', authorize('admin', 'manager'), validate(settingsSchema), updateSettings);

router.get('/backup', authorize('admin'), backupSql);

export default router;
