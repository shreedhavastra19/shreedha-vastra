// ================================================================
// Shreedha Vastra — Order Routes
// ================================================================
import express from 'express';
import { body } from 'express-validator';
import { protect, authorize } from '../middleware/authMiddleware.js';
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

router.use(protect); // every order route requires login

router.get('/my-orders', getMyOrders);

router.post(
  '/',
  [
    body('orderItems').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod')
      .isIn(['UPI', 'Card', 'NetBanking', 'COD', 'Razorpay'])
      .withMessage('Invalid payment method'),
  ],
  validate,
  createOrder
);

router.get('/:id', getOrderById);
router.put('/:id/pay', updateOrderToPaid);

// Admin
router.get('/', authorize('admin'), getAllOrders);
router.put('/:id/status', authorize('admin'), updateOrderStatus);

export default router;
