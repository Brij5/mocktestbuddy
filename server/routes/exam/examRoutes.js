import express from 'express';
import examController from '../../controllers/examController.js';
import { protect, admin, examManager } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Public routes
router.route('/').get(examController.getExams);
router.route('/category/:categoryId').get(examController.getExamsByCategory);
router.route('/:id').get(examController.getExamById);

// Protected routes (Admin or Exam Manager only)
router
  .route('/')
  .post(protect, [admin, examManager], examController.createExam);

// Protected routes (Admin or Exam Manager only)
router
  .route('/:id')
  .get(protect, examController.getExamById)
  .put(protect, [admin, examManager], examController.updateExam)
  .delete(protect, [admin, examManager], examController.deleteExam);

// Admin/Exam Manager statistics routes
router
  .route('/stats')
  .get(protect, admin, examManager, examController.getExamStats);

// Admin/Exam Manager statistics routes
router
  .route('/stats/category')
  .get(protect, admin, examManager, examController.getExamsByCategoryWithStats);

export default router;
