import asyncHandler from '../utils/asyncHandler.js'; // Utility to handle async errors
import mongoose from 'mongoose';  
import Exam from '../models/exam/Exam.js';
import ExamCategory from '../models/category/ExamCategory.js';
import { protect, admin, examManager } from '../middleware/auth/authMiddleware.js';

// @desc    Get all exams
// @route   GET /api/exams
// @access  Public
export const getExams = asyncHandler(async (req, res) => {
  const exams = await Exam.find()
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.json(exams);
});

// @desc    Get exam by ID
// @route   GET /api/exams/:id
// @access  Public
export const getExamById = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id)
    .populate('category', 'name');

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  res.json(exam);
});

// @desc    Create new exam
// @route   POST /api/exams
// @access  Private/Admin or Exam Manager
export const createExam = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    durationMinutes,
    totalMarks,
    passingMarks,
    isActive,
  } = req.body;

  // Basic validation
  if (!name || !description || !category || !durationMinutes || !totalMarks || passingMarks === undefined) {
    res.status(400);
    throw new Error('Please provide all required exam details');
  }

  // Check if category exists
  const categoryExists = await ExamCategory.findById(category);
  if (!categoryExists) {
    res.status(404);
    throw new Error('Invalid Exam Category ID');
  }

  // Check if exam name is unique
  const examExists = await Exam.findOne({ name });
  if (examExists) {
    res.status(400);
    throw new Error('An exam with this name already exists');
  }

  const exam = await Exam.create({
    name,
    description,
    category,
    durationMinutes,
    totalMarks,
    passingMarks,
    isActive,
  });

  res.status(201).json(exam);
});

// @desc    Update exam
// @route   PUT /api/exams/:id
// @access  Private/Admin or Exam Manager
export const updateExam = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    category,
    durationMinutes,
    totalMarks,
    passingMarks,
    isActive,
  } = req.body;

  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Validate category if provided
  if (category && category !== exam.category.toString()) {
      const categoryExists = await ExamCategory.findById(category);
      if (!categoryExists) {
          res.status(404);
          throw new Error('Invalid Exam Category ID for update');
      }
      exam.category = category;
  }

  // Check uniqueness if name changes
  if (name && name !== exam.name) {
      const examExists = await Exam.findOne({ name });
      if (examExists) {
          res.status(400);
          throw new Error('Another exam with this name already exists');
      }
      exam.name = name;
  }

  // Update fields selectively
  exam.description = description !== undefined ? description : exam.description;
  exam.durationMinutes = durationMinutes !== undefined ? durationMinutes : exam.durationMinutes;
  exam.totalMarks = totalMarks !== undefined ? totalMarks : exam.totalMarks;
  exam.passingMarks = passingMarks !== undefined ? passingMarks : exam.passingMarks;
  exam.isActive = isActive !== undefined ? isActive : exam.isActive;

  // Re-validate passing marks against potentially updated total marks
  if (exam.passingMarks > exam.totalMarks) {
      res.status(400);
      throw new Error('Passing marks cannot exceed total marks');
  }

  const updatedExam = await exam.save();
  res.status(200).json(updatedExam);
});

/**
 * @desc    Delete an exam
 * @route   DELETE /api/exams/:id
 * @access  Private/Admin or ExamManager
 */
const deleteExam = asyncHandler(async (req, res) => {
  const exam = await Exam.findById(req.params.id);

  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Optional: Add checks before deletion (e.g., check for associated results)

  await Exam.deleteOne({ _id: req.params.id });
  res.status(200).json({ message: 'Exam removed successfully' });
});

/**
 * @desc    Get exam statistics
 * @route   GET /api/exams/stats
 * @access  Private/Admin or Exam Manager
 */
export const getExamStats = asyncHandler(async (req, res) => {
  const stats = await Exam.aggregate([
    {
      $group: {
        _id: null,
        totalExams: { $sum: 1 },
        activeExams: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        avgDuration: { $avg: '$durationMinutes' },
        avgTotalMarks: { $avg: '$totalMarks' },
      },
    },
  ]);

  res.json(stats[0]);
});

// @desc    Get exams by category
// @route   GET /api/exams/category/:categoryId
// @access  Public
export const getExamsByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(categoryId)) {
    res.status(400);
    throw new Error('Invalid category ID format');
  }

  const exams = await Exam.find({ category: categoryId })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.json(exams);
});

// @desc    Get exams by category with statistics
// @route   GET /api/exams/stats/category
// @access  Private/Admin or Exam Manager
export const getExamsByCategoryWithStats = asyncHandler(async (req, res) => {
  const stats = await Exam.aggregate([
    {
      $lookup: {
        from: 'examcategories',
        localField: 'category',
        foreignField: '_id',
        as: 'categoryInfo',
      },
    },
    {
      $unwind: '$categoryInfo',
    },
    {
      $group: {
        _id: '$categoryInfo.name',
        category: { $first: '$categoryInfo' },
        totalExams: { $sum: 1 },
        activeExams: { $sum: { $cond: [{ $eq: ['$isActive', true] }, 1, 0] } },
        avgDuration: { $avg: '$durationMinutes' },
        avgTotalMarks: { $avg: '$totalMarks' },
      },
    },
    {
      $sort: { totalExams: -1 },
    },
  ]);

  res.json(stats);
});

export default {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  getExamStats,
  getExamsByCategory,
  getExamsByCategoryWithStats
};
