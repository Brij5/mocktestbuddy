import asyncHandler from '../../utils/asyncHandler.js';
import Progress from '../../models/progress/Progress.js';
import TestAttempt from '../../models/TestAttempt.js';
import Exam from '../../models/exam/Exam.js';
import Question from '../../models/Question.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

// @desc    Get user's progress
// @route   GET /api/progress/me
// @access  Private
export const getUserProgress = asyncHandler(async (req, res) => {
  // 1. Fetch Recent Test Attempts directly
  const recentTestAttempts = await TestAttempt.find({ user: req.user._id })
    .sort({ endTime: -1 }) // Sort by completion time, newest first
    .limit(5) // Limit to the 5 most recent attempts
    .populate('exam', 'name totalMarks passingMarks') // Populate exam details needed for display
    .lean(); // Use .lean() for plain JS objects if not modifying

  // Map TestAttempt data to the format expected by the frontend
  const recentAttempts = recentTestAttempts.map(attempt => ({
    _id: attempt._id, // Use the actual TestAttempt ID
    examName: attempt.exam?.name || 'N/A',
    completedAt: attempt.endTime, // Use endTime from TestAttempt
    // Calculate accuracy on the fly or ensure it's stored on TestAttempt
    accuracy: attempt.totalQuestions > 0 
                ? parseFloat(((attempt.correctlyAnsweredQuestions / attempt.totalQuestions) * 100).toFixed(1))
                : 0,
    score: attempt.marksObtained,
    totalQuestions: attempt.totalQuestions,
    // Add other fields if needed by the frontend table (e.g., passed status)
    passed: attempt.passed,
    examId: attempt.exam?._id // Include examId if needed for links
  }));

  // 2. Fetch Aggregate Progress Data (as before)
  const userProgressDocs = await Progress.find({ user: req.user._id })
    .populate('exam', 'name subject') // Populate exam to get name and subject
    .populate('category', 'name')
    .sort({ lastAttemptedAt: -1 });

  if (!userProgressDocs) {
    // Send a structured empty response if no progress found
    return res.json({
      data: {
        recentAttempts,
        overallProgress: {
          averageAccuracy: 0,
          totalStudyTime: 0,
          examsCompleted: 0,
          strongSubjects: [],
          weakSubjects: [],
        },
      },
    });
  }

  let totalCorrectOverall = 0;
  let totalAttemptedOverall = 0;
  let totalStudyTimeOverallSeconds = 0;
  const subjectStats = {};

  userProgressDocs.forEach(p => {
    totalCorrectOverall += p.correctAnswers;
    totalAttemptedOverall += p.totalQuestionsAttempted;
    totalStudyTimeOverallSeconds += p.timeTaken || 0; // timeTaken is in seconds

    const subjectName = p.exam.subject || p.subject; // Prefer exam.subject if available
    if (subjectName) {
      if (!subjectStats[subjectName]) {
        subjectStats[subjectName] = { totalCorrect: 0, totalAttempted: 0, count: 0 };
      }
      subjectStats[subjectName].totalCorrect += p.correctAnswers;
      subjectStats[subjectName].totalAttempted += p.totalQuestionsAttempted;
      subjectStats[subjectName].count++;
    }
  });

  const averageAccuracyOverall = totalAttemptedOverall > 0 ? (totalCorrectOverall / totalAttemptedOverall) * 100 : 0;
  const examsCompletedOverall = userProgressDocs.length; // Each doc is progress for one exam

  const subjectPerformance = Object.entries(subjectStats).map(([subject, stats]) => ({
    subject,
    accuracy: stats.totalAttempted > 0 ? (stats.totalCorrect / stats.totalAttempted) * 100 : 0,
  }));

  subjectPerformance.sort((a, b) => b.accuracy - a.accuracy);
  const strongSubjectsOverall = subjectPerformance.slice(0, 3).filter(s => s.accuracy >= 70); // Top 3, min 70% accuracy
  const weakSubjectsOverall = subjectPerformance.slice(-3).filter(s => s.accuracy < 70).reverse(); // Bottom 3, less than 70% accuracy
  
  const overallProgress = {
    averageAccuracy: parseFloat(averageAccuracyOverall.toFixed(2)),
    totalStudyTime: Math.round(totalStudyTimeOverallSeconds / 60), // Convert to minutes
    examsCompleted: examsCompletedOverall,
    strongSubjects: strongSubjectsOverall,
    weakSubjects: weakSubjectsOverall,
  };

  // 3. Send Combined Response
  res.json({
    data: {
      recentAttempts, // Use the newly fetched recent attempts
      overallProgress, // Use the calculated overall progress
    },
  });
});

// @desc    Get progress by exam
// @route   GET /api/progress/exam/:examId
// @access  Private
export const getProgressByExam = asyncHandler(async (req, res) => {
  const { examId } = req.params;

  const progress = await Progress.findOne({
    user: req.user._id,
    exam: examId
  })
    .populate('exam', 'name')
    .populate('category', 'name');

  if (!progress) {
    res.status(404);
    throw new Error('No progress found for this exam');
  }

  res.json(progress);
});

// @desc    Get progress by category
// @route   GET /api/progress/category/:categoryId
// @access  Private
export const getProgressByCategory = asyncHandler(async (req, res) => {
  const { categoryId } = req.params;

  const progress = await Progress.find({
    user: req.user._id,
    category: categoryId
  })
    .populate('exam', 'name')
    .populate('category', 'name')
    .sort({ lastAttemptedAt: -1 });

  res.json(progress);
});

// @desc    Get progress by subject
// @route   GET /api/progress/subject/:subject
// @access  Private
export const getProgressBySubject = asyncHandler(async (req, res) => {
  const { subject } = req.params;

  const progress = await Progress.find({
    user: req.user._id,
    subject
  })
    .populate('exam', 'name')
    .populate('category', 'name')
    .sort({ lastAttemptedAt: -1 });

  res.json(progress);
});

// @desc    Update progress
// @route   POST /api/progress/update
// @access  Private
export const updateProgress = asyncHandler(async (req, res) => {
  const { testAttemptId } = req.body;

  // Validate test attempt
  const testAttempt = await TestAttempt.findById(testAttemptId);
  if (!testAttempt) {
    res.status(404);
    throw new Error('Test attempt not found');
  }

  // Validate ownership
  if (testAttempt.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to update progress');
  }

  // Get or create progress record
  let progress = await Progress.findOne({
    user: req.user._id,
    exam: testAttempt.exam
  });

  if (!progress) {
    progress = new Progress({
      user: req.user._id,
      exam: testAttempt.exam,
      category: testAttempt.exam.category,
      subject: testAttempt.questions[0].subject
    });
  }

  // Update progress statistics
  progress.totalQuestionsAttempted += testAttempt.questions.length;
  progress.correctAnswers += testAttempt.correctAnswers;
  progress.lastAttemptedAt = testAttempt.completedAt;
  progress.timeTaken += testAttempt.timeTaken;

  // Update accuracy
  progress.accuracy = (progress.correctAnswers / progress.totalQuestionsAttempted) * 100;

  // Update average time per question
  progress.averageTimePerQuestion = progress.timeTaken / progress.totalQuestionsAttempted;

  // Update strengths and weaknesses
  const topicStats = {};
  testAttempt.questions.forEach(q => {
    const topic = q.topic;
    if (!topicStats[topic]) {
      topicStats[topic] = { correct: 0, total: 0 };
    }
    topicStats[topic].total++;
    if (q.isCorrect) {
      topicStats[topic].correct++;
    }
  });

  // Update strengths
  progress.strengths = Object.entries(topicStats)
    .filter(([_, stats]) => stats.total >= 5) // Only consider topics with enough attempts
    .map(([topic, stats]) => ({
      topic,
      accuracy: (stats.correct / stats.total) * 100,
      lastImprovedAt: testAttempt.completedAt
    }))
    .sort((a, b) => b.accuracy - a.accuracy)
    .slice(0, 5); // Keep top 5 strengths

  // Update weaknesses
  progress.weaknesses = Object.entries(topicStats)
    .filter(([_, stats]) => stats.total >= 5) // Only consider topics with enough attempts
    .map(([topic, stats]) => ({
      topic,
      accuracy: (stats.correct / stats.total) * 100,
      lastAttemptedAt: testAttempt.completedAt
    }))
    .sort((a, b) => a.accuracy - b.accuracy)
    .slice(0, 5); // Keep top 5 weaknesses

  // Update streak
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const lastAttemptDay = new Date(progress.lastAttemptedAt);
  lastAttemptDay.setHours(0, 0, 0, 0);

  if (today - lastAttemptDay <= 24 * 60 * 60 * 1000) {
    progress.currentStreak++;
  } else {
    progress.currentStreak = 1;
  }

  if (progress.currentStreak > progress.longestStreak) {
    progress.longestStreak = progress.currentStreak;
  }

  // Save progress
  const updatedProgress = await progress.save();
  res.json(updatedProgress);
});

// @desc    Submit a test attempt
// @route   POST /api/progress/submit-attempt
// @access  Private
export const submitTestAttempt = asyncHandler(async (req, res) => {
  const { examId, answers, startTime, endTime, attemptedInLanguage } = req.body;
  const userId = req.user._id;

  console.log(`[submitTestAttempt] Received submission for exam ${examId} from user ${userId}`);

  // 1. Fetch Exam details
  const exam = await Exam.findById(examId);
  if (!exam) {
    res.status(404);
    throw new Error('Exam not found');
  }

  // 2. Fetch associated Questions
  const questions = await Question.find({ exam: examId });
  if (!questions || questions.length === 0) {
    res.status(404);
    throw new Error('Questions not found for this exam');
  }

  // 3. Process and Grade the Answers
  let marksObtainedCalc = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  const attemptedQuestionsDetails = [];
  const questionMap = new Map(questions.map(q => [q._id.toString(), q]));
  // Assuming negative marking schema exists on Exam model
  const negativeMarksPerQuestion = exam.negativeMarkingSchema && exam.negativeMarksPerQuestion ? exam.negativeMarksPerQuestion : 0;

  answers.forEach(attempt => {
    const question = questionMap.get(attempt.questionId);
    if (question) {
      let isCorrect = false;
      let marksForThisQuestion = 0;

      // Simple comparison (adjust for different question types if needed)
      if (attempt.selectedAnswer && question.correctAnswer === attempt.selectedAnswer) {
        isCorrect = true;
        marksForThisQuestion = question.marks || 0;
        correctCount++;
      } else {
        // Mark as incorrect only if an answer was selected
        if (attempt.selectedAnswer) {
          isCorrect = false;
          marksForThisQuestion = -negativeMarksPerQuestion;
          incorrectCount++;
        } else {
          // Unanswered is handled separately later, no marks change here
          marksForThisQuestion = 0;
        }
      }

      // Ensure marks don't go below zero due to negative marking if needed (optional rule)
      // marksForThisQuestion = Math.max(0, marksForThisQuestion); // Uncomment if negative marks shouldn't make total negative

      marksObtainedCalc += marksForThisQuestion;

      attemptedQuestionsDetails.push({
        question: question._id,
        selectedAnswer: attempt.selectedAnswer,
        isCorrect: isCorrect,
        marksObtained: marksForThisQuestion,
      });
    } else {
      console.warn(`Attempted question ID ${attempt.questionId} not found in exam ${examId}`);
      // Optionally handle this case, e.g., mark as incorrect or ignore
    }
  });

  const unansweredCount = questions.length - (correctCount + incorrectCount);

  // 4. Create TestAttempt Document
  const newTestAttempt = new TestAttempt({
    user: userId,
    exam: examId,
    startTime: new Date(startTime), // Ensure dates are stored as Date objects
    endTime: new Date(endTime),
    status: 'completed',
    totalQuestions: questions.length,
    correctlyAnsweredQuestions: correctCount,
    incorrectlyAnsweredQuestions: incorrectCount,
    unansweredQuestions: unansweredCount,
    marksObtained: marksObtainedCalc,
    totalMarks: exam.totalMarks, // Use total marks from the Exam model
    passingMarks: exam.passingMarks,
    passed: marksObtainedCalc >= exam.passingMarks,
    attemptedQuestions: attemptedQuestionsDetails,
    attemptedInLanguage: attemptedInLanguage,
    // Add other relevant fields from Exam model if needed, e.g., duration
    durationTaken: (new Date(endTime).getTime() - new Date(startTime).getTime()) / 1000 // Duration in seconds
  });

  // 5. Save the TestAttempt
  const savedAttempt = await newTestAttempt.save();

  // TODO: Optionally, update UserProgress based on this attempt
  // await updateProgress(userId, examId, marksObtainedCalc, savedAttempt.passed);

  // 6. Send Response
  res.status(201).json({
    success: true,
    message: 'Test attempt submitted successfully.',
    data: savedAttempt,
  });
});

// @desc    Get user's achievements
// @route   GET /api/progress/achievements
// @access  Private
export const getUserAchievements = asyncHandler(async (req, res) => {
  const progress = await Progress.find({ user: req.user._id })
    .populate('exam', 'name')
    .populate('category', 'name');

  // Calculate achievements
  const achievements = [];

  // Calculate total questions attempted
  const totalQuestions = progress.reduce((sum, p) => sum + p.totalQuestionsAttempted, 0);
  if (totalQuestions >= 1000) {
    achievements.push({
      name: 'Master Practitioner',
      description: 'Attempted 1000+ questions',
      points: 1000
    });
  } else if (totalQuestions >= 500) {
    achievements.push({
      name: 'Advanced Practitioner',
      description: 'Attempted 500+ questions',
      points: 500
    });
  } else if (totalQuestions >= 100) {
    achievements.push({
      name: 'Beginner Practitioner',
      description: 'Attempted 100+ questions',
      points: 100
    });
  }

  // Calculate accuracy achievements
  const avgAccuracy = progress.reduce((sum, p) => sum + p.accuracy, 0) / progress.length;
  if (avgAccuracy >= 85) {
    achievements.push({
      name: 'Master of Accuracy',
      description: 'Achieved 85%+ average accuracy',
      points: 500
    });
  } else if (avgAccuracy >= 70) {
    achievements.push({
      name: 'Advanced Accuracy',
      description: 'Achieved 70%+ average accuracy',
      points: 300
    });
  }

  // Calculate streak achievements
  const longestStreak = Math.max(...progress.map(p => p.longestStreak));
  if (longestStreak >= 30) {
    achievements.push({
      name: 'Month-long Streak',
      description: 'Maintained a 30-day streak',
      points: 1000
    });
  } else if (longestStreak >= 7) {
    achievements.push({
      name: 'Week-long Streak',
      description: 'Maintained a 7-day streak',
      points: 500
    });
  }

  // Calculate exam completion achievements
  const completedExams = progress.filter(p => p.totalQuestionsAttempted >= p.exam.totalQuestions);
  if (completedExams.length >= 5) {
    achievements.push({
      name: 'Exam Master',
      description: 'Completed 5+ exams',
      points: 1000
    });
  } else if (completedExams.length >= 3) {
    achievements.push({
      name: 'Exam Expert',
      description: 'Completed 3+ exams',
      points: 500
    });
  }

  // Calculate total points
  const totalPoints = achievements.reduce((sum, a) => sum + a.points, 0);

  res.json({
    achievements,
    totalPoints
  });
});
