import Category from '../models/Category.js';
import asyncHandler from 'express-async-handler';
import ApiError from '../utils/ApiError.js';

// @desc    Create a new category
// @route   POST /api/v1/categories
// @access  Private (Admin, ExamManager)
export const createCategory = asyncHandler(async (req, res, next) => {
  // req.body should contain name, description
  // req.user.id will be used for createdBy
  const { name, description } = req.body;
  const userId = req.user.id; // Assuming user ID is available from auth middleware

  if (!name) {
    return next(new ApiError(400, 'Category name is required.'));
  }

  const category = await Category.create({
    name,
    description,
    createdBy: userId,
  });

  res.status(201).json({
    success: true,
    data: category,
  });
});

// @desc    Get all categories
// @route   GET /api/v1/categories
// @access  Public (or Private if only for logged-in users)
export const getAllCategories = asyncHandler(async (req, res, next) => {
  // TODO: Add filtering for isActive: true for general users if needed
  // TODO: Add pagination
  const categories = await Category.find().populate('createdBy', 'name email').populate('updatedBy', 'name email');
  
  res.status(200).json({
    success: true,
    count: categories.length,
    data: categories,
  });
});

// @desc    Get a single category by ID
// @route   GET /api/v1/categories/:id
// @access  Public (or Private)
export const getCategoryById = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id).populate('createdBy', 'name email').populate('updatedBy', 'name email');

  if (!category) {
    return next(new ApiError(404, `Category not found with id of ${req.params.id}`));
  }

  // Optional: Check if category is active for certain roles
  // if (!category.isActive && req.user.role !== 'Admin') { // Example
  //   return next(new ApiError(404, `Category not found with id of ${req.params.id}`));
  // }

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Update a category
// @route   PUT /api/v1/categories/:id
// @access  Private (Admin, ExamManager)
export const updateCategory = asyncHandler(async (req, res, next) => {
  const { name, description, isActive } = req.body;
  const userId = req.user.id; // Assuming user ID is available

  let category = await Category.findById(req.params.id);

  if (!category) {
    return next(new ApiError(404, `Category not found with id of ${req.params.id}`));
  }

  // Update fields
  if (name) category.name = name;
  // Allow clearing description by passing empty string or null
  if (description !== undefined) category.description = description;
  if (typeof isActive === 'boolean') category.isActive = isActive;
  category.updatedBy = userId;

  await category.save();

  res.status(200).json({
    success: true,
    data: category,
  });
});

// @desc    Delete a category (soft delete by default)
// @route   DELETE /api/v1/categories/:id
// @access  Private (Admin, ExamManager)
export const deleteCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  const userId = req.user.id;

  if (!category) {
    return next(new ApiError(404, `Category not found with id of ${req.params.id}`));
  }

  // Option 1: Soft delete
  category.isActive = false;
  category.updatedBy = userId; // Record who performed the soft delete
  await category.save();
  // res.status(200).json({ success: true, data: {}, message: 'Category marked as inactive.' });

  // Option 2: Hard delete (Uncomment to use)
  // await category.remove(); // .remove() is deprecated, use .deleteOne() or .deleteMany()
  // await Category.deleteOne({ _id: req.params.id });
  // res.status(200).json({ success: true, data: {}, message: 'Category deleted successfully.' });

  // For now, let's stick with soft delete and return the updated (inactive) category object
  res.status(200).json({
    success: true,
    data: category, // Send back the category marked as inactive
    message: `Category '${category.name}' has been deactivated.`
  });
});
