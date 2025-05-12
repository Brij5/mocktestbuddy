// Export all controllers from a single entry point
import authController from './auth/index.js';
import categoryController from './category/index.js';
import adminController from './admin/index.js';
import progressController from './progress/index.js';

export {
  authController,
  categoryController,
  adminController,
  progressController
};

export default {
  authController,
  categoryController,
  adminController,
  progressController
};
