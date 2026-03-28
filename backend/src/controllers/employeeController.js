import bcrypt from 'bcryptjs';
import { query } from '../config/db.js';
import { created, ok } from '../utils/http.js';

export const listEmployees = async (req, res) => {
  const rows = await query('SELECT id,name,email,role,is_active,last_login_at,created_at FROM employees ORDER BY id DESC');
  return ok(res, rows);
};

export const createEmployee = async (req, res) => {
  const { name, email, role, password } = req.body;
  const password_hash = await bcrypt.hash(password, 10);
  const result = await query(
    'INSERT INTO employees (name,email,role,password_hash) VALUES (:name,:email,:role,:password_hash)',
    { name, email, role, password_hash }
  );
  return created(res, { id: result.insertId });
};
