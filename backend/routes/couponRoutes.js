// ================================================================
// Shreedha Vastra — Coupon Routes
// ================================================================
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

router.use(protect);

router.post('/apply', applyCoupon);

// Admin
router.get('/', authorize('admin'), getCoupons);
router.post('/', authorize('admin'), createCoupon);
router.put('/:id', authorize('admin'), updateCoupon);
router.delete('/:id', authorize('admin'), deleteCoupon);

export default router;
