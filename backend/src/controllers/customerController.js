import { query } from '../config/db.js';
import { created, ok } from '../utils/http.js';

export const listCustomers = async (req, res) => {
  const { q = '' } = req.query;
  const rows = await query(
    `SELECT * FROM customers
     WHERE name LIKE :q OR email LIKE :q OR phone LIKE :q
     ORDER BY id DESC`,
    { q: `%${q}%` }
  );
  return ok(res, rows);
};

export const createCustomer = async (req, res) => {
  const { name, email, phone, passport_no, nid_no, address } = req.body;
  const result = await query(
    `INSERT INTO customers (name, email, phone, passport_no, nid_no, address)
     VALUES (:name,:email,:phone,:passport_no,:nid_no,:address)`,
    { name, email, phone, passport_no, nid_no, address }
  );
  return created(res, { id: result.insertId });
};

export const updateCustomer = async (req, res) => {
  const id = Number(req.params.id);
  const { name, email, phone, passport_no, nid_no, address } = req.body;
  await query(
    `UPDATE customers SET name=:name,email=:email,phone=:phone,passport_no=:passport_no,nid_no=:nid_no,address=:address
     WHERE id=:id`,
    { id, name, email, phone, passport_no, nid_no, address }
  );
  return ok(res, { id }, 'Updated');
};

export const deleteCustomer = async (req, res) => {
  await query('DELETE FROM customers WHERE id=:id', { id: Number(req.params.id) });
  return ok(res, null, 'Deleted');
};
