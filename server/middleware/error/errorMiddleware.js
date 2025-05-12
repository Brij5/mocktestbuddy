import { logger } from '../../utils/logger.js';
import ApiError from '../../utils/ApiError.js';
import config from '../../config/config.js';

/**
 * Middleware to handle 404 Not Found errors
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Not Found - ${req.originalUrl}`));
};

/**
 * Global error handler middleware
 * @param {Error} err - Error object
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  // Default to 500 Internal Server Error if status code not set
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';
  let errors = [];
  let stack = {};

  // In development, send error stack trace
  if (config.env === 'development') {
    stack = { stack: err.stack };
  }

  // Handle specific error types
  if (err.name === 'CastError' && err.kind === 'ObjectId') {
    // Mongoose bad ObjectId
    statusCode = 404;
    message = 'Resource not found';
  } else if (err.code === 11000) {
    // Mongoose duplicate key
    statusCode = 400;
    const field = Object.keys(err.keyValue || {})[0] || 'field';
    message = `Duplicate field value: ${field}`;
    errors = [{ field, message: `This ${field} is already in use` }];
  } else if (err.name === 'ValidationError') {
    // Mongoose validation error
    statusCode = 400;
    message = 'Validation failed';
    errors = Object.values(err.errors).map((e) => ({
      field: e.path,
      message: e.message,
    }));
  } else if (err.name === 'JsonWebTokenError') {
    // JWT error
    statusCode = 401;
    message = 'Invalid token. Please log in again!';
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired
    statusCode = 401;
    message = 'Your token has expired! Please log in again.';
  } else if (err.name === 'MongoServerError') {
    // Other MongoDB errors
    statusCode = 500;
    message = 'Database operation failed';
  } else if (err.name === 'RateLimitExceeded') {
    // Rate limiter error
    statusCode = 429;
    message = 'Too many requests, please try again later';
  } else if (err.name === 'TokenExpiredError') {
    // JWT expired
    statusCode = 401;
    message = 'Token expired';
  } else if (err instanceof ApiError) {
    // Our custom ApiError
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors || [];
  }

  // Send error response
  res.status(statusCode).json({
    success: false,
    message,
    errors: errors.length > 0 ? errors : undefined,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
};

/**
 * Handle 404 errors for API routes
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const apiNotFound = (req, res) => {
  throw new ApiError(404, `API endpoint not found: ${req.originalUrl}`);
};

export { notFound, errorHandler, apiNotFound };
