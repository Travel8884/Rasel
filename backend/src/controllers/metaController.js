import { query } from '../config/db.js';
import { created, ok } from '../utils/http.js';

export const getSettings = async (req, res) => {
  const rows = await query('SELECT `key`, `value` FROM settings');
  const data = rows.reduce((acc, row) => ({ ...acc, [row.key]: row.value }), {});
  return ok(res, data);
};

export const upsertSettings = async (req, res) => {
  const payload = req.body;
  for (const [key, value] of Object.entries(payload)) {
    await query(
      `INSERT INTO settings (
        \`key\`, \`value\`
      ) VALUES (:key,:value)
      ON DUPLICATE KEY UPDATE \`value\`=:value`,
      { key, value: String(value) }
    );
  }
  return ok(res, payload, 'Settings updated');
};

export const listNotifications = async (req, res) => {
  const rows = await query('SELECT * FROM notifications ORDER BY id DESC LIMIT 50');
  return ok(res, rows);
};

export const createNotification = async (req, res) => {
  const { type, title, body, target_role } = req.body;
  const result = await query(
    'INSERT INTO notifications (type,title,body,target_role) VALUES (:type,:title,:body,:target_role)',
    { type, title, body, target_role }
  );
  return created(res, { id: result.insertId });
};
