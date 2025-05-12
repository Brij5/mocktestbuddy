import express from 'express';
import { categoryController } from '../../controllers';
import { protect, admin } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.getCategoryById);

// Protected admin routes
router.post('/', protect, admin, categoryController.createCategory);
router.put('/:id', protect, admin, categoryController.updateCategory);
router.delete('/:id', protect, admin, categoryController.deleteCategory);

export default router;
