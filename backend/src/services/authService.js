import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { query } from '../config/db.js';

dotenv.config();

export const login = async (email, password) => {
  const users = await query('SELECT id, name, email, password_hash, role, is_active FROM employees WHERE email=:email LIMIT 1', { email });
  const user = users[0];
  if (!user || !user.is_active) return null;
  const matched = await bcrypt.compare(password, user.password_hash);
  if (!matched) return null;
  const token = jwt.sign(
    { sub: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );
  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};
