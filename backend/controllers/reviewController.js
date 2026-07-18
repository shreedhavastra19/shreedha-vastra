// ================================================================
// Shreedha Vastra — Review Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import Review from '../models/Review.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { uploadImage } from '../config/cloudinary.js';
import { bufferToDataURI } from '../middleware/uploadMiddleware.js';

// @desc    Get all reviews for a product
// @route   GET /api/products/:productId/reviews
// @access  Public
const getProductReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ product: req.params.productId })
    .populate('user', 'name')
    .sort('-createdAt');

  res.status(200).json({ success: true, count: reviews.length, reviews });
});

// @desc    Add a review to a product
// @route   POST /api/products/:productId/reviews
// @access  Private
const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const { productId } = req.params;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const alreadyReviewed = await Review.findOne({ product: productId, user: req.user._id });
  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  // Check if this user has an order containing this product (verified purchase badge)
  const hasPurchased = await Order.exists({
    user: req.user._id,
    isPaid: true,
    'orderItems.product': productId,
  });

 let images = [];
  if (req.files && req.files.length > 0) {
    const uploaded = await Promise.all(
      req.files.map((file) => uploadImage(bufferToDataURI(file), 'shreedha-vastra/reviews'))
    );
    images = uploaded.map((img) => ({ url: img.secure_url, public_id: img.public_id }));
  }

  const review = await Review.create({
    product: productId,
    user: req.user._id,
    name: req.user.name,
    rating,
    comment,
    images,
    isVerifiedPurchase: !!hasPurchased,
  });
  res.status(201).json({ success: true, review });
});

// @desc    Delete a review (owner or admin)
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) {
    res.status(404);
    throw new Error('Review not found');
  }

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to delete this review');
  }

  await Review.findOneAndDelete({ _id: req.params.id }); // triggers post-hook to recalc ratings

  res.status(200).json({ success: true, message: 'Review deleted successfully' });
});

export { getProductReviews, addReview, deleteReview };
