import { ApiError } from '../utils/ApiError.js';
import { isProduction } from '../config/env.js';

export function notFound(req, _res, next) {
  next(ApiError.notFound(`No route for ${req.method} ${req.originalUrl}`));
}

/**
 * Central error handler. Translates the errors we actually see — validation,
 * duplicate keys, bad object ids, oversized uploads — into clean messages, and
 * refuses to leak internals in production.
 */
// eslint-disable-next-line no-unused-vars
export function errorHandler(error, req, res, _next) {
  let status = error.status || 500;
  let message = error.message || 'Something went wrong';
  let details = error.details;

  if (error.name === 'ValidationError') {
    status = 400;
    message = 'Some fields need attention';
    details = Object.fromEntries(
      Object.entries(error.errors).map(([field, item]) => [field, item.message])
    );
  } else if (error.name === 'CastError') {
    status = 400;
    message = `That ${error.path} is not valid`;
  } else if (error.code === 11000) {
    status = 409;
    const field = Object.keys(error.keyValue || {})[0] || 'value';
    message = `That ${field} is already taken`;
    details = error.keyValue;
  } else if (error.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'That file is too large';
  } else if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
    status = 401;
    message = 'Your session has expired. Sign in again.';
  }

  if (status >= 500) {
    console.error('[error]', req.method, req.originalUrl, error);
  }

  res.status(status).json({
    error: {
      message,
      ...(details ? { details } : {}),
      ...(isProduction || status >= 500 ? {} : { stack: error.stack }),
    },
  });
}
