console.log('[DEBUG_EXAM_MANAGER_CONTROLLER] Top of server/controllers/examManagerController.js');

import asyncHandler from '../utils/asyncHandler.js';
import Exam from '../models/exam/Exam.js'; // Assuming Exam model is needed
import User from '../models/user/User.js'; // Assuming User model might be needed
console.log('[DEBUG_EXAM_MANAGER_CONTROLLER] Imports completed in examManagerController.js');

// @desc    Get dashboard statistics for an Exam Manager
// @route   GET /api/exam-manager/stats
// @access  Private (ExamManager)
export const getExamManagerStats = asyncHandler(async (req, res) => {
  // managedCategoryIds will be available from req.user (added by auth middleware from JWT)
  const { managedCategoryIds } = req.user;

  if (!managedCategoryIds || managedCategoryIds.length === 0) {
    return res.status(403).json({ message: 'Access denied: No categories managed.' });
  }

  // Placeholder logic: Count exams in managed categories
  const totalExams = await Exam.countDocuments({ category: { $in: managedCategoryIds } });
  const activeExams = await Exam.countDocuments({
    category: { $in: managedCategoryIds },
    status: 'Published', // Assuming 'Published' status for active exams
    // Add other criteria for active exams if needed, e.g., date ranges
  });

  // More stats can be added here, e.g., total questions, average pass rate etc.

  res.json({
    totalExams,
    activeExams,
    // other stats...
  });
});

// @desc    Get recent activity for an Exam Manager
// @route   GET /api/exam-manager/recent-activity
// @access  Private (ExamManager)
export const getRecentActivity = asyncHandler(async (req, res) => {
  const { managedCategoryIds } = req.user;

  if (!managedCategoryIds || managedCategoryIds.length === 0) {
    return res.status(403).json({ message: 'Access denied: No categories managed.' });
  }

  // Placeholder: Fetch recently modified exams in managed categories
  // This is a simplified example. Real recent activity might involve more complex queries or an audit log.
  const recentExams = await Exam.find({ category: { $in: managedCategoryIds } })
    .sort({ updatedAt: -1 })
    .limit(5) // Get last 5 updated exams
    .select('title updatedAt status'); // Select relevant fields

  const activity = recentExams.map(exam => ({
    type: exam.status === 'Draft' ? 'EXAM_UPDATED' : 'EXAM_PUBLISHED_OR_UPDATED',
    message: `Exam '${exam.title}' was last updated.`,
    timestamp: exam.updatedAt,
    examId: exam._id
  }));

  res.json(activity);
});

// @desc    Get all exams managed by the Exam Manager
// @route   GET /api/exam-manager/exams
// @access  Private (ExamManager)
export const getManagedExams = asyncHandler(async (req, res) => {
  const { managedCategoryIds } = req.user;

  if (!managedCategoryIds || managedCategoryIds.length === 0) {
    return res.status(403).json({ message: 'Access denied: No categories managed.' });
  }

  const exams = await Exam.find({ category: { $in: managedCategoryIds } })
    .populate('category', 'name') // Populate category name
    .populate('createdBy', 'name email'); // Populate creator details
    // Add other necessary populates or selections

  res.json(exams);
});
