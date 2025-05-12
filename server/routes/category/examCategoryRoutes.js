// server/routes/examCategoryRoutes

import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../../controllers/category/examCategoryController.js';
import { protect, admin } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/')
  .get(getAllCategories)
  .post(protect, admin, createCategory);

router.route('/:id')
  .get(getCategoryById)
  .put(protect, admin, updateCategory)
  .delete(protect, admin, deleteCategory);

export default router;
