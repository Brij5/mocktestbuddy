import mongoose from 'mongoose';

const examCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a category name'],
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    // We can add other fields later, like an icon URL or slug
    // slug: {
    //   type: String,
    //   required: true,
    //   unique: true,
    // },
  },
  {
    timestamps: true, // Adds createdAt and updatedAt timestamps
  }
);

// Optional: Add middleware or static methods if needed later

const ExamCategory = mongoose.model('ExamCategory', examCategorySchema);

export default ExamCategory;
