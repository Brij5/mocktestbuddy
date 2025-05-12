console.log('[DEBUG_AUTH_MIDDLEWARE] Top of authMiddleware.js');
import jwt from 'jsonwebtoken';
import { promisify } from 'util';
import User from '../../models/user/index.js';
import { logger } from '../../utils/logger.js';
import ApiError from '../../utils/ApiError.js';
import config from '../../config/config.js';
console.log('[DEBUG_AUTH_MIDDLEWARE] Imports completed in authMiddleware.js');

// Promisify jwt.verify
const verifyToken = promisify(jwt.verify);

/**
 * Protect routes - verify JWT token
 */
export const protect = async (req, res, next) => {
  try {
    let token;

    // 1) Check if token exists in headers
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
      // Get token from cookie
      token = req.cookies.jwt;
    }

    if (!token) {
      throw new ApiError(401, 'You are not logged in! Please log in to get access.');
    }

    // 2) Verify token
    const decoded = await verifyToken(token, config.jwt.secret);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      throw new ApiError(401, 'The user belonging to this token no longer exists.');
    }

    // 4) Check if user changed password after the token was issued
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      throw new ApiError(401, 'User recently changed password! Please log in again.');
    }

    // 5) Grant access to protected route
    req.user = currentUser;
    res.locals.user = currentUser; // Make user available in templates
    next();
  } catch (error) {
    logger.error(`Authentication error: ${error.message}`, {
      error,
      url: req.originalUrl,
    });
    next(error);
  }
};

/**
 * Restrict routes to specific roles
 * @param {...String} roles - Allowed roles
 */
export const authorize = (...roles) => {
  console.log('[DEBUG_AUTH_MIDDLEWARE] Authorize function called');
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ApiError(
        403,
        'You do not have permission to perform this action'
      );
    }
    next();
  };
};

/**
 * Middleware for admin authorization
 */
export const admin = authorize('Admin');

/**
 * Middleware for exam manager authorization
 */
export const examManager = authorize('Admin', 'ExamManager');

/**
 * Check if user is logged in (for frontend)
 */
export const isLoggedIn = async (req, res, next) => {
  try {
    if (req.cookies.jwt) {
      // 1) Verify token
      const decoded = await verifyToken(req.cookies.jwt, config.jwt.secret);

      // 2) Check if user still exists
      const currentUser = await User.findById(decoded.id);
      if (!currentUser) return next();

      // 3) Check if user changed password after the token was issued
      if (currentUser.changedPasswordAfter(decoded.iat)) {
        return next();
      }

      // There is a logged in user
      res.locals.user = currentUser;
    }
    next();
  } catch (err) {
    next();
  }
};

/**
 * Middleware to check if email is verified
 */
export const isVerified = (req, res, next) => {
  if (!req.user.isVerified) {
    throw new ApiError(
      403,
      'Please verify your email address to access this resource'
    );
  }
  next();
};

export default {
  protect,
  admin,
  examManager,
  isLoggedIn,
  isVerified,
  authorize,
};
console.log('[DEBUG_AUTH_MIDDLEWARE] End of authMiddleware.js');
