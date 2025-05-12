import { logger } from '../../utils/logger.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Middleware to validate request data against a Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validate = (schema) => (req, res, next) => {
  try {
    // Validate request body against the schema
    const { error, value } = schema.validate(req.body, {
      abortEarly: false, // Return all errors not just the first one
      stripUnknown: true, // Remove unknown properties
      allowUnknown: true, // Allow unknown properties that are not in the schema
    });

    if (error) {
      // Format Joi validation errors
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw new ApiError(400, 'Validation failed', false, { errors });
    }

    // Replace request body with validated value
    req.body = value;
    next();
  } catch (error) {
    logger.error(`Validation error: ${error.message}`, {
      error,
      body: req.body,
      url: req.originalUrl,
    });
    next(error);
  }
};

/**
 * Middleware to validate request query parameters
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateQuery = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.query, {
      abortEarly: false,
      stripUnknown: true,
      allowUnknown: true,
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw new ApiError(400, 'Invalid query parameters', false, { errors });
    }

    // Replace query with validated value
    req.query = value;
    next();
  } catch (error) {
    logger.error(`Query validation error: ${error.message}`, {
      error,
      query: req.query,
      url: req.originalUrl,
    });
    next(error);
  }
};

/**
 * Middleware to validate request URL parameters
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
export const validateParams = (schema) => (req, res, next) => {
  try {
    const { error, value } = schema.validate(req.params, {
      abortEarly: false,
      stripUnknown: true,
      convert: true, // Convert string values to their appropriate types
    });

    if (error) {
      const errors = error.details.map((detail) => ({
        field: detail.path.join('.'),
        message: detail.message,
      }));

      throw new ApiError(400, 'Invalid URL parameters', false, { errors });
    }

    // Replace params with validated value
    req.params = value;
    next();
  } catch (error) {
    logger.error(`Params validation error: ${error.message}`, {
      error,
      params: req.params,
      url: req.originalUrl,
    });
    next(error);
  }
};
