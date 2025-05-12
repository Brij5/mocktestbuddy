import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
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
    required: true,
    enum: [
      'General Studies',
      'Quantitative Aptitude',
      'Reasoning',
      'English',
      'History',
      'Geography',
      'Polity',
      'Economy',
      'Science',
      'Current Affairs',
      'Mathematics',
      'Physics',
      'Chemistry',
      'Biology',
      'Computer Science'
    ]
  },
  topic: {
    type: String,
    required: true
  },
  questionType: {
    type: String,
    required: true,
    enum: ['MCQ', 'AssertionReason', 'MatchTheFollowing', 'TrueFalse', 'FillInTheBlanks']
  },
  questionText: {
    type: String,
    required: true
  },
  options: [{
    text: String,
    isCorrect: Boolean
  }],
  correctAnswer: {
    type: String,
    required: function() {
      return this.questionType === 'FillInTheBlanks';
    }
  },
  explanation: {
    type: String,
    required: false
  },
  difficultyLevel: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard']
  },
  marks: {
    type: Number,
    required: true,
    min: 0
  },
  negativeMarks: {
    type: Number,
    required: function() {
      return this.marks > 0;
    },
    min: 0
  },
  tags: [{
    type: String,
    required: false
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
questionSchema.index({ exam: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ subject: 1 });
questionSchema.index({ topic: 1 });
questionSchema.index({ difficultyLevel: 1 });

// Pre-save hook to validate negative marks
questionSchema.pre('save', function(next) {
  if (this.negativeMarks > this.marks) {
    next(new Error('Negative marks cannot be greater than positive marks'));
  } else {
    next();
  }
});

export default mongoose.model('Question', questionSchema);
