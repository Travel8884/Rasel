import { fail } from '../utils/http.js';

export const errorHandler = (err, req, res, next) => {
  console.error(err);
  return fail(res, err.status || 500, err.message || 'Server error');
};
