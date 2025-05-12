import express from 'express';
import {
  startTestAttempt,
  submitAnswer,
  markForReview,
  completeTestAttempt,
  getTestAttempt,
  getUserTestAttempts,
  getTestAttemptStats
} from '../controllers/testAttemptController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes (User only)
router
  .route('/start')
  .post(protect, startTestAttempt);

router
  .route('/:attemptId/answer')
  .post(protect, submitAnswer);

router
  .route('/:attemptId/mark-review')
  .post(protect, markForReview);

router
  .route('/:attemptId/complete')
  .post(protect, completeTestAttempt);

router
  .route('/:attemptId')
  .get(protect, getTestAttempt);

router
  .route('/')
  .get(protect, getUserTestAttempts);

router
  .route('/stats')
  .get(protect, getTestAttemptStats);

export default router;
