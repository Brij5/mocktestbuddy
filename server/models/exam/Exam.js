console.log('[DEBUG_EXAM_MODEL] Top of server/models/exam/Exam.js');
import mongoose from 'mongoose';

const examSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide an exam name'],
      trim: true,
      unique: true, // Assuming exam names within the system should be unique
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'Please provide a description for the exam'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ExamCategory', // Reference to the ExamCategory model
      required: [true, 'Please assign the exam to a category'],
    },
    durationMinutes: {
      type: Number,
      required: [true, 'Please specify the exam duration in minutes'],
      min: [1, 'Duration must be at least 1 minute'],
    },
    totalMarks: {
      type: Number,
      required: [true, 'Please specify the total marks for the exam'],
      min: [1, 'Total marks must be at least 1'],
    },
    passingMarks: {
      type: Number,
      required: [true, 'Please specify the passing marks for the exam'],
      min: [0, 'Passing marks cannot be negative'],
      // Optional: Add validation to ensure passingMarks <= totalMarks
      validate: {
        validator: function (value) {
          // `this` refers to the document being validated
          return value <= this.totalMarks;
        },
        message: 'Passing marks cannot exceed total marks',
      },
    },
    // We can add more fields like:
    // - syllabus: String
    // - negativeMarking: Boolean (or details object)
    // - questionCount: Number
    // - isActive: Boolean (to control visibility)
    // - createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Link to admin/manager who created it
    isActive: {
        type: Boolean,
        default: true, // Exams are active by default
    },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Optional: Add index for category for faster querying
examSchema.index({ category: 1 });

// Optional: Pre-populate category details when finding exams
examSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'category',
    select: 'name description', // Select fields to populate from ExamCategory
  });
  next();
});

const Exam = mongoose.model('Exam', examSchema);
console.log('[DEBUG_EXAM_MODEL] Successfully compiled Exam model');

export default Exam;
