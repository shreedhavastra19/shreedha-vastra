// ================================================================
// Shreedha Vastra — Payment Routes
// ================================================================
import express from 'express';
import { protectOptional } from '../middleware/authMiddleware.js';
import { createRazorpayOrder, verifyRazorpayPayment } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/create-order',protectOptional, createRazorpayOrder);
router.post('/verify', protectOptional , verifyRazorpayPayment);

export default router;
