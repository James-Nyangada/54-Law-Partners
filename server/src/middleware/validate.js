import { ApiError } from '../utils/ApiError.js';

/**
 * Validates req.body against a Zod schema and replaces it with the parsed
 * result, so controllers receive only declared fields. This is what stops a
 * caller setting `role: "admin"` on themselves by adding it to a profile
 * update.
 */
export function validateBody(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.body ?? {});

    if (!result.success) {
      const details = {};
      for (const issue of result.error.issues) {
        details[issue.path.join('.') || '_'] = issue.message;
      }
      return next(ApiError.badRequest('Some fields need attention', details));
    }

    req.body = result.data;
    next();
  };
}

export function validateQuery(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse(req.query ?? {});
    if (!result.success) {
      return next(ApiError.badRequest('Those filters are not valid'));
    }
    req.validatedQuery = result.data;
    next();
  };
}
