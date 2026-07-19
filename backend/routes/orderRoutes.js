// ================================================================
// Shreedha Vastra — Order Routes
// ================================================================
import express from 'express';
import { body } from 'express-validator';
import { protect, protectOptional, authorize } from '../middleware/authMiddleware.js';
import validate from '../middleware/validateMiddleware.js';
import {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
} from '../controllers/orderController.js';

const router = express.Router();

// Logged-in users only — a guest has no order history to list
router.get('/my-orders', protect, getMyOrders);

// Guests and logged-in users can both place and view an order
router.post(
  '/',
  protectOptional,
  [
    body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod')
      .isIn(['UPI', 'Card', 'NetBanking', 'Razorpay'])
      .withMessage('Invalid payment method'),
    body('guestInfo.email')
      .if((value, { req }) => !req.user)
      .isEmail()
      .withMessage('A valid email is required to place an order without an account'),
  ],
  validate,
  createOrder
);

router.get('/:id', protectOptional, getOrderById);
router.put('/:id/pay', protectOptional, updateOrderToPaid);

// Admin
router.get('/', protect, authorize('admin'), getAllOrders);
router.put('/:id/status', protect, authorize('admin'), updateOrderStatus);

export default router;