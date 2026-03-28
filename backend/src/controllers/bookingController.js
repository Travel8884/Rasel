import { query } from '../config/db.js';
import { created, ok } from '../utils/http.js';

export const listBookings = async (req, res) => {
  const { status, type } = req.query;
  const rows = await query(
    `SELECT b.*, c.name customer_name FROM bookings b
     JOIN customers c ON c.id=b.customer_id
     WHERE (:status IS NULL OR b.status=:status)
       AND (:type IS NULL OR b.booking_type=:type)
     ORDER BY b.id DESC`,
    { status: status || null, type: type || null }
  );
  return ok(res, rows);
};

export const createBooking = async (req, res) => {
  const { customer_id, booking_type, title, destination, travel_date, return_date, base_cost, selling_price, status, visa_status } = req.body;
  const result = await query(
    `INSERT INTO bookings (customer_id,booking_type,title,destination,travel_date,return_date,base_cost,selling_price,status,visa_status)
     VALUES (:customer_id,:booking_type,:title,:destination,:travel_date,:return_date,:base_cost,:selling_price,:status,:visa_status)`,
    { customer_id, booking_type, title, destination, travel_date, return_date, base_cost, selling_price, status, visa_status }
  );
  return created(res, { id: result.insertId });
};

export const updateBookingStatus = async (req, res) => {
  const { status, visa_status } = req.body;
  await query('UPDATE bookings SET status=:status, visa_status=:visa_status WHERE id=:id', { id: Number(req.params.id), status, visa_status });
  return ok(res, { id: Number(req.params.id) }, 'Status updated');
};
