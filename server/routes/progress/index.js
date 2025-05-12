import express from 'express';
import { progressController } from '../../controllers';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Protected routes
router.get('/', protect, progressController.getUserProgress);
router.get('/:examId', protect, progressController.getExamProgress);
router.post('/:examId/complete', protect, progressController.completeExam);

export default router;
