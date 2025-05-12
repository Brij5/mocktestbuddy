import asyncHandler from 'express-async-handler';
import TestAttempt from '../models/TestAttempt.js';
import Question from '../models/Question.js';
import Exam from '../models/Exam.js';
import { protect } from '../middleware/authMiddleware.js';

// @desc    Start a new test attempt
// @route   POST /api/test-attempts/start
// @access  Private
export const startTestAttempt = asyncHandler(async (req, res) => {
  const { examId } = req.body;

  // Validate exam
  const exam = await Exam.findById(examId);
  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // Check if user already has an active attempt for this exam
  const existingAttempt = await TestAttempt.findOne({
    user: req.user._id,
    exam: examId,
    status: 'in_progress'
  });

  if (existingAttempt) {
    res.status(400);
    throw new Error('You already have an active attempt for this exam');
  }

  // Create new test attempt
  const testAttempt = new TestAttempt({
    user: req.user._id,
    exam: examId,
    totalQuestions: exam.totalQuestions,
    attemptedInLanguage: req.body.language || 'English'
  });

  // Get questions for the exam
  const questions = await Question.find({
    exam: examId,
    isPublished: true
  }).populate('category', 'name');

  // Shuffle questions if exam allows random order
  if (exam.shuffleQuestions) {
    questions.sort(() => Math.random() - 0.5);
  }

  // Add questions to test attempt
  testAttempt.questions = questions.map(q => ({
    question: q._id,
    text: q.questionText,
    options: q.options,
    marks: q.marks,
    negativeMarks: q.negativeMarks
  }));

  // Save test attempt
  const savedAttempt = await testAttempt.save();
  
  res.status(201).json(savedAttempt);
});

// @desc    Submit answer for a question
// @route   POST /api/test-attempts/:attemptId/answer
// @access  Private
export const submitAnswer = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { questionId, selectedOption, timeTaken } = req.body;

  // Validate test attempt
  const testAttempt = await TestAttempt.findById(attemptId);
  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Validate ownership
  if (testAttempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to submit answers for this attempt');
  }

  // Find question in attempt
  const questionIndex = testAttempt.questions.findIndex(q => q.question.toString() === questionId);
  if (questionIndex === -1) {
    res.status(404);
    throw new Error('Question not found in this attempt');
  }

  // Get the actual question to verify answer
  const question = await Question.findById(questionId);
  if (!question) {
    res.status(404);
    throw new Error('Question not found');
  }

  // Calculate if answer is correct
  const isCorrect = question.questionType === 'MCQ'
    ? question.options.find(o => o.isCorrect)?.text === selectedOption
    : question.correctAnswer === selectedOption;

  // Calculate marks
  const marksObtained = isCorrect ? question.marks : -question.negativeMarks;

  // Update question details
  testAttempt.questions[questionIndex] = {
    ...testAttempt.questions[questionIndex],
    selectedOption,
    isCorrect,
    marksObtained,
    timeTaken
  };

  // Update attempt statistics
  testAttempt.answeredQuestions++;
  testAttempt.correctAnswers += isCorrect ? 1 : 0;
  testAttempt.marksObtained += marksObtained;
  testAttempt.timeTaken += timeTaken;

  // Save attempt
  const updatedAttempt = await testAttempt.save();
  res.json(updatedAttempt);
});

// @desc    Mark question for review
// @route   POST /api/test-attempts/:attemptId/mark-review
// @access  Private
export const markForReview = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;
  const { questionId } = req.body;

  // Validate test attempt
  const testAttempt = await TestAttempt.findById(attemptId);
  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Validate ownership
  if (testAttempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to mark questions for review');
  }

  // Find question in attempt
  const questionIndex = testAttempt.questions.findIndex(q => q.question.toString() === questionId);
  if (questionIndex === -1) {
    res.status(404);
    throw new Error('Question not found in this attempt');
  }

  // Toggle review mark
  testAttempt.questions[questionIndex].isMarkedForReview = !testAttempt.questions[questionIndex].isMarkedForReview;

  // Save attempt
  const updatedAttempt = await testAttempt.save();
  res.json(updatedAttempt);
});

// @desc    Complete test attempt
// @route   POST /api/test-attempts/:attemptId/complete
// @access  Private
export const completeTestAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  // Validate test attempt
  const testAttempt = await TestAttempt.findById(attemptId);
  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Validate ownership
  if (testAttempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to complete this attempt');
  }

  // Update attempt status
  testAttempt.status = 'completed';
  testAttempt.completedAt = new Date();

  // Calculate final statistics
  let totalMarks = 0;
  let negativeMarks = 0;
  testAttempt.questions.forEach(q => {
    if (q.isCorrect) {
      totalMarks += q.marksObtained;
    } else if (q.marksObtained < 0) {
      negativeMarks += Math.abs(q.marksObtained);
    }
  });

  testAttempt.marksObtained = totalMarks;
  testAttempt.negativeMarks = negativeMarks;

  // Save attempt
  const completedAttempt = await testAttempt.save();
  res.json(completedAttempt);
});

// @desc    Get test attempt details
// @route   GET /api/test-attempts/:attemptId
// @access  Private
export const getTestAttempt = asyncHandler(async (req, res) => {
  const { attemptId } = req.params;

  const testAttempt = await TestAttempt.findById(attemptId)
    .populate('exam', 'name durationMinutes totalMarks passingMarks')
    .populate('questions.question', 'questionText options explanation');

  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Validate ownership
  if (testAttempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to view this attempt');
  }

  res.json(testAttempt);
});

// @desc    Get user's test attempts
// @route   GET /api/test-attempts
// @access  Private
export const getUserTestAttempts = asyncHandler(async (req, res) => {
  const testAttempts = await TestAttempt.find({ user: req.user._id })
    .populate('exam', 'name')
    .sort({ startedAt: -1 });

  res.json(testAttempts);
});

// @desc    Get test attempt statistics
// @route   GET /api/test-attempts/stats
// @access  Private
export const getTestAttemptStats = asyncHandler(async (req, res) => {
  const stats = await TestAttempt.aggregate([
    {
      $match: { user: mongoose.Types.ObjectId(req.user._id) }
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        completedAttempts: { $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] } },
        avgMarks: { $avg: '$marksObtained' },
        avgTime: { $avg: '$timeTaken' },
        avgAccuracy: {
          $avg: {
            $multiply: [
              { $divide: ['$correctAnswers', '$totalQuestions'] },
              100
            ]
          }
        }
      }
    }
  ]);

  res.json(stats[0]);
});
