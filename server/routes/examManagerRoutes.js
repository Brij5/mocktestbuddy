console.log('[DEBUG_EXAM_MANAGER_ROUTES] Top of server/routes/examManagerRoutes.js'); // Add this line
import express from 'express';
import {
  getExamManagerStats,
  getRecentActivity,
  getManagedExams,
} from '../controllers/examManagerController.js'; // Adjusted path for controllers
import { protect, authorize } from '../middleware/auth/authMiddleware.js'; // Corrected path for middleware
console.log('[DEBUG_EXAM_MANAGER_ROUTES] Imports completed in examManagerRoutes.js');

const router = express.Router();

// All routes in this file will be protected and require 'ExamManager' role
router.use(protect);
router.use(authorize(['ExamManager'])); // Ensure only ExamManagers can access

// @route   GET /api/exam-manager/stats
router.get('/stats', getExamManagerStats);

// @route   GET /api/exam-manager/recent-activity
router.get('/recent-activity', getRecentActivity);

// @route   GET /api/exam-manager/exams
router.get('/exams', getManagedExams);

// Add other routes for exam manager as needed, e.g., POST to create an exam within managed categories
// router.post('/exams', createManagedExam);
// router.put('/exams/:id', updateManagedExam);
// router.delete('/exams/:id', deleteManagedExam);

export default router;
