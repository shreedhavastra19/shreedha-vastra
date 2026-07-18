// ================================================================
// Shreedha Vastra — Centralized Error Handling Middleware
// ================================================================
// Two middlewares:
//  1. notFound   — catches requests to routes that don't exist
//  2. errorHandler — catches every error thrown/passed anywhere in
//     the app (via next(err) or express-async-handler) and returns
//     a clean, consistent JSON response instead of leaking stack
//     traces or crashing the server.
// ================================================================

// ----------------------------------------------------------------
// 404 Handler — runs when no route matched the request
// ----------------------------------------------------------------
const notFound = (req, res, next) => {
  const error = new Error(`Route not found - ${req.originalUrl}`);
  error.statusCode = 404;
  next(error); // passes to errorHandler below
};

// ----------------------------------------------------------------
// Global Error Handler — must be registered LAST in server.js
// ----------------------------------------------------------------
const errorHandler = (err, req, res, next) => {
  console.error('ERROR:', err);
  let statusCode =
  res.statusCode && res.statusCode >= 400
    ? res.statusCode
    : err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // ---- Mongoose: Invalid ObjectId (e.g. /api/products/bad-id) ----
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    statusCode = 404;
    message = 'Resource not found';
  }

  // ---- Mongoose: Duplicate key error (e.g. email already exists) ----
  if (err.code === 11000) {
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0];
    message = field
      ? `An account/record with that ${field} already exists`
      : 'Duplicate field value entered';
  }

  // ---- Mongoose: Schema validation errors ----
  if (err.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(', ');
  }

  // ---- JWT: Invalid or malformed token ----
  if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token. Please log in again.';
  }

  // ---- JWT: Expired token ----
  if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Your session has expired. Please log in again.';
  }

  res.status(statusCode).json({
    success: false,
    message,
    // Stack traces are only exposed in development — never in production
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

export { notFound, errorHandler };
