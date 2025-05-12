import asyncHandler from '../../utils/asyncHandler.js';
import Progress from '../../models/progress/Progress.js';
import TestAttempt from '../../models/TestAttempt.js';
import { protect } from '../../middleware/auth/authMiddleware.js';

// @desc    Get user's progress
// @route   GET /api/progress/me
// @access  Private
export const getUserProgress = asyncHandler(async (req, res) => {
  const userProgressDocs = await Progress.find({ user: req.user._id })
    .populate('exam', 'name subject') // Populate exam to get name and subject
    .populate('category', 'name')
    .sort({ lastAttemptedAt: -1 });

  if (!userProgressDocs) {
    // Send a structured empty response if no progress found
    return res.json({
      data: {
        recentAttempts: [],
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

  const recentAttempts = userProgressDocs.map(p => ({
    _id: p.exam._id, // Using exam id for attempt identification, or p._id if progress doc is the attempt
    examName: p.exam.name,
    completedAt: p.lastAttemptedAt,
    accuracy: p.accuracy,
    score: p.correctAnswers, // Assuming score is number of correct answers
    totalQuestions: p.totalQuestionsAttempted,
  }));

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

  res.json({
    data: {
      recentAttempts,
      overallProgress,
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
