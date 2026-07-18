// ================================================================
// Shreedha Vastra — Product Routes
// ================================================================
import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';
import {
  getProducts,
  getProductBySlug,
  getSimilarProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
} from '../controllers/productController.js';
import { getProductReviews, addReview } from '../controllers/reviewController.js';

const router = express.Router();

// ---------------- Public: curated lists (must come before /:slug) ----------------
router.get('/featured', getFeaturedProducts);
router.get('/best-sellers', getBestSellers);
router.get('/new-arrivals', getNewArrivals);

// ---------------- Admin: full list including drafts (before /:slug too) ----------------
router.get('/admin/all', protect, authorize('admin'), getAdminProducts);

// ---------------- Public: browse & search ----------------
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:slug/similar', getSimilarProducts);

// ---------------- Reviews (nested under product) ----------------
router.get('/:productId/reviews', getProductReviews);
router.post(
  '/:productId/reviews',
  protect,
  [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').trim().notEmpty().withMessage('Review comment is required'),
  ],
  validate,
  addReview
);

// ---------------- Admin: CRUD ----------------
const productValidation = [
  body('name').trim().notEmpty().withMessage('Product name is required'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('sku').trim().notEmpty().withMessage('SKU is required'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('fabric').trim().notEmpty().withMessage('Fabric details are required'),
  body('careInstructions').trim().notEmpty().withMessage('Care instructions are required'),
];

router.post(
  '/',
  protect,

  
  authorize('admin'),
  upload.array('images', 4),
  productValidation,
  validate,
  createProduct
);

router.put('/:id', protect, authorize('admin'), upload.array('images', 6), updateProduct);

router.delete('/:id', protect, authorize('admin'), deleteProduct);

export default router;
