import { validationResult } from 'express-validator';
import { login } from '../services/authService.js';
import { fail, ok } from '../utils/http.js';

export const loginController = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return fail(res, 422, 'Validation failed', errors.array());
  const { email, password } = req.body;
  const result = await login(email, password);
  if (!result) return fail(res, 401, 'Invalid credentials');
  return ok(res, result, 'Login successful');
};

export const meController = async (req, res) => ok(res, req.user);
