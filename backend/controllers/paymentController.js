// ================================================================
// Shreedha Vastra — Payment Controller (Razorpay)
// ================================================================
// IMPORTANT: Payment confirmation is NEVER trusted from the
// frontend alone. We verify the Razorpay signature server-side
// using our secret key before marking any order as paid.
// ================================================================
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Razorpay from 'razorpay';
import Order from '../models/Order.js';

let razorpay;
function getRazorpay(){
  if(!razorpay) {
    razorpay= new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
    });
  }
  return razorpay;
}

// @desc    Create a Razorpay order for a given amount (called at checkout, before payment)
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body; // amount in rupees

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid payment amount');
  }

  const razorpayOrder = await getRazorpay().orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency: 'INR',
    receipt: orderId || `receipt_${Date.now()}`,
  });

  res.status(200).json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID, // public key, safe to send to frontend
  });
});

// @desc    Verify a completed Razorpay payment and mark the order as paid
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

  // Recreate the expected signature using our secret key
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    res.status(400);
    throw new Error('Payment verification failed. Signature mismatch.');
  }

  const order = await Order.findById(orderId);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
1  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'Confirmed';
  order.paymentResult = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: 'paid',
  };
  order.statusHistory.push({ status: 'Confirmed', note: 'Payment verified via Razorpay' });

  await order.save();

  res.status(200).json({ success: true, message: 'Payment verified successfully', order });
});

export { createRazorpayOrder, verifyRazorpayPayment };
