import mongoose from 'mongoose';

const testAttemptSchema = new mongoose.Schema({
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
  startedAt: {
    type: Date,
    required: true
  },
  completedAt: {
    type: Date,
    required: false
  },
  status: {
    type: String,
    required: true,
    enum: ['in_progress', 'completed', 'abandoned'],
    default: 'in_progress'
  },
  totalQuestions: {
    type: Number,
    required: true
  },
  answeredQuestions: {
    type: Number,
    required: true,
    default: 0
  },
  correctAnswers: {
    type: Number,
    required: true,
    default: 0
  },
  marksObtained: {
    type: Number,
    required: true,
    default: 0
  },
  negativeMarks: {
    type: Number,
    required: true,
    default: 0
  },
  timeTaken: {
    type: Number, // in seconds
    required: true,
    default: 0
  },
  questions: [{
    question: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Question',
      required: true
    },
    selectedOption: {
      type: String,
      required: false
    },
    isCorrect: {
      type: Boolean,
      required: false
    },
    marksObtained: {
      type: Number,
      required: false
    },
    timeTaken: {
      type: Number, // in seconds
      required: false
    }
  }],
  isMarkedForReview: {
    type: Boolean,
    default: false
  },
  attemptedInLanguage: {
    type: String,
    required: true,
    enum: ['English', 'Hindi']
  }
}, {
  timestamps: true
});

// Indexes for better query performance
testAttemptSchema.index({ user: 1, exam: 1 });
testAttemptSchema.index({ status: 1 });
testAttemptSchema.index({ startedAt: -1 });

// Pre-save hook to calculate total marks and status
testAttemptSchema.pre('save', function(next) {
  if (this.status === 'completed') {
    this.completedAt = new Date();
    
    // Calculate total marks
    let totalMarks = 0;
    let negativeMarks = 0;
    this.questions.forEach(q => {
      if (q.isCorrect) {
        totalMarks += q.marksObtained;
      } else if (q.marksObtained < 0) {
        negativeMarks += Math.abs(q.marksObtained);
      }
    });
    
    this.marksObtained = totalMarks;
    this.negativeMarks = negativeMarks;
  }
  
  next();
});

export default mongoose.model('TestAttempt', testAttemptSchema);
