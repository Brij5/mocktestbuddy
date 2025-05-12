import ExamCategory from '../../models/category/ExamCategory.js'; // Corrected model path to include 'category' subdirectory
import asyncHandler from '../../utils/asyncHandler.js'; // Path for asyncHandler should be correct from previous edit

/**
 * @desc    Create a new exam category
 * @route   POST /api/categories
 * @access  Private/Admin
 */
const createCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Category name is required');
  }

  const categoryExists = await ExamCategory.findOne({ name });

  if (categoryExists) {
    res.status(400);
    throw new Error('Category already exists');
  }

  const category = await ExamCategory.create({
    name,
    description,
    // createdBy: req.user._id // Optional: Link to the admin user who created it
  });

  res.status(201).json(category);
});

/**
 * @desc    Get all exam categories
 * @route   GET /api/categories
 * @access  Public
 */
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await ExamCategory.find({}); // Find all categories
  res.status(200).json(categories);
});

/**
 * @desc    Get a single exam category by ID
 * @route   GET /api/categories/:id
 * @access  Public
 */
const getCategoryById = asyncHandler(async (req, res) => {
  const category = await ExamCategory.findById(req.params.id);

  if (category) {
    res.status(200).json(category);
  } else {
    res.status(404);
    throw new Error('Category not found');
  }
});

/**
 * @desc    Update an exam category
 * @route   PUT /api/categories/:id
 * @access  Private/Admin
 */
const updateCategory = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  const category = await ExamCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Check if new name conflicts with another category
  if (name && name !== category.name) {
      const existingCategory = await ExamCategory.findOne({ name });
      if (existingCategory) {
          res.status(400);
          throw new Error('Another category with this name already exists');
      }
  }

  category.name = name || category.name;
  category.description = description !== undefined ? description : category.description;

  const updatedCategory = await category.save();
  res.status(200).json(updatedCategory);
});

/**
 * @desc    Delete an exam category
 * @route   DELETE /api/categories/:id
 * @access  Private/Admin
 */
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await ExamCategory.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  // Optional: Check if any exams are using this category before deleting
  // const examsInCategory = await Exam.countDocuments({ category: req.params.id });
  // if (examsInCategory > 0) {
  //   res.status(400);
  //   throw new Error('Cannot delete category with associated exams');
  // }

  await ExamCategory.deleteOne({ _id: req.params.id }); // Use deleteOne or findByIdAndDelete
  res.status(200).json({ message: 'Category removed successfully' });
});

export {
  createCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
  deleteCategory,
};
