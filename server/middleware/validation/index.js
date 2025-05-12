import Joi from 'joi';
import { logger } from '../../utils/logger.js';
import ApiError from '../../utils/ApiError.js';

/**
 * Validate request body against Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateRequest = (schema) => (req, res, next) => {
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

      throw new ApiError(400, 'Validation failed', { errors });
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
 * Validate request query parameters against Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateQuery = (schema) => (req, res, next) => {
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

      throw new ApiError(400, 'Invalid query parameters', { errors });
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
 * Validate request URL parameters against Joi schema
 * @param {Joi.Schema} schema - Joi validation schema
 * @returns {Function} Express middleware function
 */
const validateParams = (schema) => (req, res, next) => {
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

      throw new ApiError(400, 'Invalid URL parameters', { errors });
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

export { validateRequest, validateQuery, validateParams };

export default {
  validateRequest,
  validateQuery,
  validateParams,
};
