import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required()
});

export const customerSchema = Joi.object({
  full_name: Joi.string().min(2).required(),
  email: Joi.string().email().allow('', null),
  phone: Joi.string().min(5).max(25).required(),
  passport_no: Joi.string().allow('', null),
  nid_no: Joi.string().allow('', null),
  address: Joi.string().allow('', null)
});

export const bookingSchema = Joi.object({
  customer_id: Joi.number().integer().required(),
  booking_type: Joi.string().valid('flight', 'hotel', 'package', 'visa').required(),
  destination: Joi.string().required(),
  travel_date: Joi.date().required(),
  amount: Joi.number().precision(2).min(0).required(),
  cost: Joi.number().precision(2).min(0).required(),
  status: Joi.string().valid('pending', 'confirmed', 'completed').default('pending'),
  notes: Joi.string().allow('', null)
});

export const paymentSchema = Joi.object({
  booking_id: Joi.number().integer().required(),
  payment_method: Joi.string().valid('cash', 'bank', 'mobile').required(),
  amount: Joi.number().precision(2).min(0.01).required(),
  payment_date: Joi.date().required(),
  reference: Joi.string().allow('', null)
});

export const expenseSchema = Joi.object({
  category: Joi.string().required(),
  amount: Joi.number().precision(2).min(0.01).required(),
  expense_date: Joi.date().required(),
  note: Joi.string().allow('', null)
});

export const employeeSchema = Joi.object({
  full_name: Joi.string().required(),
  email: Joi.string().email().required(),
  phone: Joi.string().required(),
  role: Joi.string().valid('admin', 'manager', 'staff').required(),
  password: Joi.string().min(6).required()
});

export const settingsSchema = Joi.object({
  company_name: Joi.string().required(),
  company_address: Joi.string().required(),
  company_logo: Joi.string().allow('', null),
  currency: Joi.string().max(10).required(),
  dark_mode: Joi.boolean().required()
});
