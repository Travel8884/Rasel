import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { fail } from '../utils/http.js';

dotenv.config();

export const requireAuth = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) return fail(res, 401, 'Unauthorized');
  try {
    const token = auth.split(' ')[1];
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch {
    return fail(res, 401, 'Invalid token');
  }
};

export const requireRole = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) return fail(res, 403, 'Forbidden');
  return next();
};
