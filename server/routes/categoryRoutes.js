import express from 'express';
import {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
} from '../controllers/categoryController.js'; 

const router = express.Router();

import { protect, examManager } from '../middleware/auth/index.js';

// Route definitions
router
  .route('/')
  .post(protect, examManager, createCategory) // Create: Needs auth and Admin/ExamManager role
  .get(getAllCategories); // Get all: Public for now

router
  .route('/:id')
  .get(getCategoryById) // Get single: Public for now
  .put(protect, examManager, updateCategory) // Update: Needs auth and Admin/ExamManager role
  .delete(protect, examManager, deleteCategory); // Delete: Needs auth and Admin/ExamManager role

export default router;
