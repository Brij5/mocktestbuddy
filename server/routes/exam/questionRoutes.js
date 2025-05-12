import express from 'express';
import {
  getQuestionsByExam,
  getQuestionsByCategoryAndSubject,
  createQuestion,
  updateQuestion,
  deleteQuestion,
  getQuestionStats,
  getQuestionsByDifficultyAndSubject
} from '../controllers/questionController.js';
import { protect, admin, examManager } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router
  .route('/exam/:examId')
  .get(protect, admin, examManager, getQuestionsByExam);

router
  .route('/category/:categoryId/subject/:subject')
  .get(getQuestionsByCategoryAndSubject);

// Protected routes (Admin or Exam Manager only)
router
  .route('/')
  .post(protect, admin, examManager, createQuestion);

router
  .route('/:id')
  .put(protect, admin, examManager, updateQuestion)
  .delete(protect, admin, deleteQuestion);

// Admin/Exam Manager statistics routes
router
  .route('/stats')
  .get(protect, admin, examManager, getQuestionStats);

router
  .route('/stats/difficulty')
  .get(protect, admin, examManager, getQuestionsByDifficultyAndSubject);

export default router;
