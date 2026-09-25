import { ApiError } from '../utils/apiError.js';

export function notFound(req, res, next) {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(err, req, res, next) {
  const isValidationError = err.name === 'ValidationError';
  const isCastError = err.name === 'CastError';
  const isDuplicateKeyError = err.code === 11000;
  const isMalformedJson = err instanceof SyntaxError && err.status === 400 && 'body' in err;
  const status = err.statusCode
    || (isDuplicateKeyError ? 409 : 0)
    || (isValidationError || isCastError || isMalformedJson ? 400 : 500);
  const message = isValidationError
    ? 'Validation failed'
    : isDuplicateKeyError
      ? 'A record with these details already exists'
      : isCastError
        ? 'Invalid resource identifier'
        : isMalformedJson
          ? 'Malformed JSON request body'
          : (err.message || 'Internal server error');

  if (status >= 500) console.error(err);

  res.status(status).json({
    success: false,
    message,
    ...(err.details ? { details: err.details } : {}),
    ...(isValidationError ? { errors: Object.values(err.errors).map((item) => item.message) } : {}),
  });
}
