// Realistic test results data
export const testResults = {
  testId: 'upsc-01',
  examId: 'upsc',
  testName: 'UPSC Prelims Mock Test 1',
  totalQuestions: 100,
  attemptedQuestions: 95,
  correctAnswers: 75,
  incorrectAnswers: 15,
  unattempted: 5,
  score: 225, // Calculated: 75 correct * 3 + 15 incorrect * (-1)
  percentile: 85.2,
  timeTaken: 150, // minutes
  maxTime: 180,
  date: '2025-05-12',
  subjectWise: {
    'General Studies I': {
      questions: 50,
      attempted: 48,
      correct: 38,
      incorrect: 10,
      score: 114,
      percentile: 88.5,
    },
    'General Studies II': {
      questions: 50,
      attempted: 47,
      correct: 37,
      incorrect: 10,
      score: 111,
      percentile: 82.3,
    },
  },
  timeAnalysis: {
    averagePerQuestion: 1.58, // minutes
    timeEfficiency: 83.3, // percentage
    timePerSubject: {
      'General Studies I': 78, // minutes
      'General Studies II': 72, // minutes
    },
  },
  difficultyAnalysis: {
    easy: {
      questions: 30,
      correct: 28,
      percentile: 93.2,
    },
    medium: {
      questions: 40,
      correct: 25,
      percentile: 62.5,
    },
    hard: {
      questions: 30,
      correct: 22,
      percentile: 73.3,
    },
  },
  comparison: {
    nationalAverage: {
      score: 180,
      correct: 60,
      percentile: 60,
    },
    top10Percent: {
      score: 240,
      correct: 80,
      percentile: 90,
    },
  },
};
