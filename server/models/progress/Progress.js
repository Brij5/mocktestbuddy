import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  exam: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exam',
    required: true
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ExamCategory',
    required: true
  },
  subject: {
    type: String,
    required: true
  },
  totalQuestionsAttempted: {
    type: Number,
    default: 0
  },
  correctAnswers: {
    type: Number,
    default: 0
  },
  accuracy: {
    type: Number,
    default: 0
  },
  averageTimePerQuestion: {
    type: Number, // in seconds
    default: 0
  },
  timeTaken: { // Total time spent on the exam, in seconds
    type: Number,
    default: 0
  },
  lastAttemptedAt: {
    type: Date,
    default: Date.now
  },
  strengths: [{
    topic: String,
    accuracy: Number,
    lastImprovedAt: Date
  }],
  weaknesses: [{
    topic: String,
    accuracy: Number,
    lastAttemptedAt: Date
  }],
  achievements: [{
    name: String,
    description: String,
    achievedAt: {
      type: Date,
      default: Date.now
    },
    points: Number
  }],
  totalPoints: {
    type: Number,
    default: 0
  },
  currentStreak: {
    type: Number,
    default: 0
  },
  longestStreak: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Indexes for better query performance
progressSchema.index({ user: 1, exam: 1 });
progressSchema.index({ user: 1, category: 1 });
progressSchema.index({ user: 1, subject: 1 });
progressSchema.index({ 'achievements.name': 1 });

// Pre-save hook to calculate accuracy and average time
progressSchema.pre('save', function(next) {
  if (this.totalQuestionsAttempted > 0) {
    this.accuracy = (this.correctAnswers / this.totalQuestionsAttempted) * 100;
  }
  
  next();
});

export default mongoose.model('Progress', progressSchema);
