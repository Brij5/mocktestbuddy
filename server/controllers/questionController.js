import asyncHandler from 'express-async-handler';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import ExamCategory from '../models/ExamCategory.js';
import { protect, admin, examManager } from '../middleware/authMiddleware.js';

// @desc    Get questions for an exam
// @route   GET /api/questions/exam/:examId
// @access  Private/Admin or Exam Manager
export const getQuestionsByExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  const questions = await Question.find({ exam: examId })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  if (questions.length === 0) {
    res.status(404);
    throw new Error('No questions found for this exam');
  }

  res.json(questions);
});

// @desc    Get questions by category and subject
// @route   GET /api/questions/category/:categoryId/subject/:subject
// @access  Public
export const getQuestionsByCategoryAndSubject = asyncHandler(async (req, res) => {
  const { categoryId, subject } = req.params;

  const questions = await Question.find({
    category: categoryId,
    subject,
    isPublished: true
  })
    .populate('category', 'name')
    .sort({ createdAt: -1 });

  res.json(questions);
});

// @desc    Create new question
// @route   POST /api/questions
// @access  Private/Admin or Exam Manager
export const createQuestion = asyncHandler(async (req, res) => {
  const { 
    exam, 
    category, 
    subject, 
    topic, 
    questionType, 
    questionText, 
    options, 
    correctAnswer, 
    explanation, 
    difficultyLevel, 
    marks, 
    negativeMarks, 
    tags 
  } = req.body;

  // Validate required fields
  if (!exam || !category || !subject || !topic || !questionType || !questionText || !difficultyLevel || !marks) {
    res.status(400);
    throw new Error('Please fill in all required fields');
  }

  // Validate question type specific fields
  if (questionType === 'MCQ' && (!options || options.length < 2)) {
    res.status(400);
    throw new Error('MCQ questions must have at least 2 options');
  }

  if (questionType === 'FillInTheBlanks' && !correctAnswer) {
    res.status(400);
    throw new Error('Fill in the blanks questions must have a correct answer');
  }

  // Validate marks
  if (negativeMarks > marks) {
    res.status(400);
    throw new Error('Negative marks cannot be greater than positive marks');
  }

  // Check if exam exists
  const examExists = await Exam.findById(exam);
  if (!examExists) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Check if category exists
  const categoryExists = await ExamCategory.findById(category);
  if (!categoryExists) {
    res.status(404);
    throw new Error('Category not found');
  }

  const question = new Question({
    exam,
    category,
    subject,
    topic,
    questionType,
    questionText,
    options,
    correctAnswer,
    explanation,
    difficultyLevel,
    marks,
    negativeMarks,
    tags,
    createdBy: req.user._id
  });

  const createdQuestion = await question.save();
  res.status(201).json(createdQuestion);
});

// @desc    Update question
// @route   PUT /api/questions/:id
// @access  Private/Admin or Exam Manager
export const updateQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Only allow updates if user is admin or the creator
  if (req.user.role !== 'admin' && question.createdBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update this question');
  }

  const { 
    exam, 
    category, 
    subject, 
    topic, 
    questionType, 
    questionText, 
    options, 
    correctAnswer, 
    explanation, 
    difficultyLevel, 
    marks, 
    negativeMarks, 
    tags, 
    isPublished 
  } = req.body;

  // Validate question type specific fields
  if (questionType === 'MCQ' && options && options.length < 2) {
    res.status(400);
    throw new Error('MCQ questions must have at least 2 options');
  }

  if (questionType === 'FillInTheBlanks' && correctAnswer) {
    res.status(400);
    throw new Error('Fill in the blanks questions must have a correct answer');
  }

  // Validate marks if provided
  if (negativeMarks && marks && negativeMarks > marks) {
    res.status(400);
    throw new Error('Negative marks cannot be greater than positive marks');
  }

  // Update fields
  question.exam = exam || question.exam;
  question.category = category || question.category;
  question.subject = subject || question.subject;
  question.topic = topic || question.topic;
  question.questionType = questionType || question.questionType;
  question.questionText = questionText || question.questionText;
  question.options = options || question.options;
  question.correctAnswer = correctAnswer || question.correctAnswer;
  question.explanation = explanation || question.explanation;
  question.difficultyLevel = difficultyLevel || question.difficultyLevel;
  question.marks = marks || question.marks;
  question.negativeMarks = negativeMarks || question.negativeMarks;
  question.tags = tags || question.tags;
  question.isPublished = isPublished !== undefined ? isPublished : question.isPublished;

  const updatedQuestion = await question.save();
  res.json(updatedQuestion);
});

// @desc    Delete question
// @route   DELETE /api/questions/:id
// @access  Private/Admin
export const deleteQuestion = asyncHandler(async (req, res) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Only allow deletion if user is admin
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete questions');
  }

  await question.remove();
  res.json({ message: 'Question removed' });
});

// @desc    Get question statistics
// @route   GET /api/questions/stats
// @access  Private/Admin or Exam Manager
export const getQuestionStats = asyncHandler(async (req, res) => {
  const stats = await Question.aggregate([
    {
      $group: {
        _id: null,
        totalQuestions: { $sum: 1 },
        publishedQuestions: { $sum: { $cond: [{ $eq: ['$isPublished', true] }, 1, 0] } },
        avgDifficulty: {
          $avg: {
            $cond: [
              { $eq: ['$difficultyLevel', 'Easy'] },
              1,
              { $eq: ['$difficultyLevel', 'Medium'] },
              2,
              3
            ]
          }
        },
        avgMarks: { $avg: '$marks' },
        avgNegativeMarks: { $avg: '$negativeMarks' },
      },
    },
  ]);

  res.json(stats[0]);
});

// @desc    Get questions by difficulty and subject
// @route   GET /api/questions/stats/difficulty
// @access  Private/Admin or Exam Manager
export const getQuestionsByDifficultyAndSubject = asyncHandler(async (req, res) => {
  const stats = await Question.aggregate([
    {
      $group: {
        _id: {
          subject: '$subject',
          difficulty: '$difficultyLevel'
        },
        count: { $sum: 1 },
        avgMarks: { $avg: '$marks' },
        avgNegativeMarks: { $avg: '$negativeMarks' },
      },
    },
    {
      $sort: {
        '_id.subject': 1,
        '_id.difficulty': 1
      },
    },
  ]);

  res.json(stats);
});
