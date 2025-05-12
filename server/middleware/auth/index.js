import authMiddleware from './authMiddleware.js';

// Export all middleware functions
export const {
  protect,
  admin,
  examManager,
  isLoggedIn,
  isVerified,
  restrictTo,
} = authMiddleware;

// Export default for backward compatibility
export default authMiddleware;
