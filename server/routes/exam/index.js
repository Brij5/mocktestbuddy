import express from 'express';
import { examController } from '../../controllers';
import { protect } from '../../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', examController.getExams);
router.get('/:id', examController.getExamById);

// Protected routes
router.post('/', protect, examController.createExam);
router.put('/:id', protect, examController.updateExam);
router.delete('/:id', protect, examController.deleteExam);

// Nested routes for questions and attempts
router.use('/:examId/questions', examController.getQuestions);
router.use('/:examId/attempts', examController.getExamAttempts);

export default router;
