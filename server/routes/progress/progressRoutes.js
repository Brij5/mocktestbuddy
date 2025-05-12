import express from 'express';
import {
  getUserProgress,
  getProgressByExam,
  getProgressByCategory,
  getProgressBySubject,
  updateProgress,
  getUserAchievements
} from '../../controllers/progress/progressController.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

const router = express.Router();

// Protected routes (User only)
router
  .route('/me')
  .get(protect, getUserProgress);

router
  .route('/exam/:examId')
  .get(protect, getProgressByExam);

router
  .route('/category/:categoryId')
  .get(protect, getProgressByCategory);

router
  .route('/subject/:subject')
  .get(protect, getProgressBySubject);

router
  .route('/update')
  .post(protect, updateProgress);

router
  .route('/achievements')
  .get(protect, getUserAchievements);

export default router;
