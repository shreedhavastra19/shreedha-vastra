// ================================================================
// Shreedha Vastra — Category Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import Category from '../models/Category.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { bufferToDataURI } from '../middleware/uploadMiddleware.js';

// @desc    Get all active categories
// @route   GET /api/categories
// @access  Public
const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive: true }).sort('displayOrder');
  res.status(200).json({ success: true, categories });
});

// @desc    Get single category by slug
// @route   GET /api/categories/:slug
// @access  Public
const getCategoryBySlug = asyncHandler(async (req, res) => {
  const category = await Category.findOne({ slug: req.params.slug, isActive: true });
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }
  res.status(200).json({ success: true, category });
});

// @desc    Create a category (admin)
// @route   POST /api/categories
// @access  Private/Admin
const createCategory = asyncHandler(async (req, res) => {
  const categoryData = { ...req.body };

  if (req.file) {
    const uploaded = await uploadImage(bufferToDataURI(req.file), 'shreedha-vastra/categories');
    categoryData.image = { url: uploaded.secure_url, public_id: uploaded.public_id };
  }

  const category = await Category.create(categoryData);
  res.status(201).json({ success: true, category });
});

// @desc    Update a category (admin)
// @route   PUT /api/categories/:id
// @access  Private/Admin
const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  if (req.file) {
    await deleteImage(category.image?.public_id);
    const uploaded = await uploadImage(bufferToDataURI(req.file), 'shreedha-vastra/categories');
    req.body.image = { url: uploaded.secure_url, public_id: uploaded.public_id };
  }

  Object.assign(category, req.body);
  await category.save();

  res.status(200).json({ success: true, category });
});

// @desc    Delete a category (admin)
// @route   DELETE /api/categories/:id
// @access  Private/Admin
const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error('Category not found');
  }

  await deleteImage(category.image?.public_id);
  await category.deleteOne();

  res.status(200).json({ success: true, message: 'Category deleted successfully' });
});

export { getCategories, getCategoryBySlug, createCategory, updateCategory, deleteCategory };
