export const ok = (res, data, message = 'OK') => res.json({ success: true, message, data });
export const created = (res, data, message = 'Created') => res.status(201).json({ success: true, message, data });
export const fail = (res, status, message, details = null) => res.status(status).json({ success: false, message, details });
