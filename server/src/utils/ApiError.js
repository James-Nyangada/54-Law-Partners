/** An error carrying an HTTP status, thrown anywhere and handled centrally. */
export class ApiError extends Error {
  constructor(status, message, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
    Error.captureStackTrace?.(this, ApiError);
  }

  static badRequest(message = 'Bad request', details) {
    return new ApiError(400, message, details);
  }

  static unauthorized(message = 'Sign in to continue') {
    return new ApiError(401, message);
  }

  static forbidden(message = 'You do not have access to this') {
    return new ApiError(403, message);
  }

  static notFound(message = 'Not found') {
    return new ApiError(404, message);
  }

  static conflict(message = 'That already exists', details) {
    return new ApiError(409, message, details);
  }

  static tooLarge(message = 'That file is too large') {
    return new ApiError(413, message);
  }
}
