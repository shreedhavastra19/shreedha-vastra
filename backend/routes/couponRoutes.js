// ================================================================
// Shreedha Vastra — Coupon Routes
// ================================================================
import express from 'express';
import { protectOptional, authorize, protect } from '../middleware/authMiddleware.js';
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
} from '../controllers/couponController.js';

const router = express.Router();

router.post('/apply', protectOptional, applyCoupon);

// Admin
router.get('/',protect, authorize('admin'), getCoupons);
router.post('/',protect, authorize('admin'), createCoupon);
router.put('/:id',protect, authorize('admin'), updateCoupon);
router.delete('/:id',protect, authorize('admin'), deleteCoupon);

export default router;
