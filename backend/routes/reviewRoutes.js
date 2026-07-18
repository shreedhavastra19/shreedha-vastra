// ================================================================
// Shreedha Vastra — Review Routes (standalone)
// ================================================================
// Note: GET and POST for reviews live in productRoutes.js since
// they're nested under a product (/api/products/:productId/reviews).
// This file only handles deletion by review ID.
// ================================================================
import express from 'express';
import { protect } from '../middleware/authMiddleware.js';
import { deleteReview } from '../controllers/reviewController.js';

const router = express.Router();

router.delete('/:id', protect, deleteReview);

export default router;
