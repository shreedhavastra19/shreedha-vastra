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

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// @desc    Create a Razorpay order for a given amount (called at checkout, before payment)
// @route   POST /api/payments/create-order
// @access  Private
const createRazorpayOrder = asyncHandler(async (req, res) => {
  const { amount, orderId } = req.body; // amount in rupees

  if (!amount || amount <= 0) {
    res.status(400);
    throw new Error('Invalid payment amount');
  }

  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(amount * 100), // Razorpay expects paise
    currency: 'INR',
    receipt: orderId || `receipt_${Date.now()}`,
  });
  // Save the mapping immediately — BEFORE the customer even pays.
  // This way, whichever path completes first (the browser's verify
  // callback, or this webhook), can always find the matching order.
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      'paymentResult.razorpay_order_id': razorpayOrder.id,
    });
  }

  // Save the Razorpay order ID onto our own Order right away — this lets
  // the webhook (which can fire independently of the browser) find and
  // confirm this order even if the customer closes the tab right after paying.
  if (orderId) {
    await Order.findByIdAndUpdate(orderId, {
      'paymentResult.razorpay_order_id': razorpayOrder.id,
    });
  }

  res.status(200).json({
    success: true,
    razorpayOrderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    keyId: process.env.RAZORPAY_KEY_ID, // public key, safe to send to frontend
  });
});

// Shared "mark this order as paid" logic — used by both the browser-confirmed
// path (verifyRazorpayPayment) and the server-to-server webhook path. The
// isPaid check makes this idempotent: safe to call twice for the same order
// without double-processing anything.
const markOrderAsPaid = async (order, { razorpay_order_id, razorpay_payment_id, razorpay_signature }) => {
  if (order.isPaid) return order;

  order.isPaid = true;
  order.paidAt = Date.now();
  order.orderStatus = 'Confirmed';
  order.paymentResult = {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    status: 'paid',
  };
  order.statusHistory.push({ status: 'Confirmed', note: 'Payment confirmed' });

  await order.save();
  return order;
};

// @desc    Verify a completed Razorpay payment and mark the order as paid
// @route   POST /api/payments/verify
// @access  Private
const verifyRazorpayPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } = req.body;

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
  }

  await markOrderAsPaid(order, { razorpay_order_id, razorpay_payment_id, razorpay_signature });

  res.status(200).json({ success: true, message: 'Payment verified successfully', order });
});

// @desc    Receive server-to-server payment confirmations directly from Razorpay.
//          This is the reliability backup for verifyRazorpayPayment above — it
//          fires even if the customer closes their browser right after paying,
//          so an order can never get "stuck" as unpaid when it was actually paid.
// @route   POST /api/payments/webhook
// @access  Public (but cryptographically verified via signature below —
//          this is safe and standard practice for webhooks)
const handleWebhook = asyncHandler(async (req, res) => {
  const signature = req.headers['x-razorpay-signature'];

  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET)
    .update(req.body) // raw request body — see server.js, this route bypasses the JSON parser on purpose
    .digest('hex');

  if (signature !== expectedSignature) {
    return res.status(400).json({ success: false });
  }

  const event = JSON.parse(req.body.toString());

  if (event.event === 'payment.captured') {
    const payload = event.payload.payment.entity;
    const order = await Order.findOne({ 'paymentResult.razorpay_order_id': payload.order_id });

    if (order) {
      await markOrderAsPaid(order, {
        razorpay_order_id: payload.order_id,
        razorpay_payment_id: payload.id,
        razorpay_signature: signature,
      });
    }
    // If no matching order is found, we still return 200 below — Razorpay
    // will keep retrying otherwise, and a retry won't fix a missing order.
  }

  res.status(200).json({ received: true });
});

export { createRazorpayOrder, verifyRazorpayPayment, handleWebhook };