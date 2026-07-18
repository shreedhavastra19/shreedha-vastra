// ================================================================
// Shreedha Vastra — Order Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

// ---------------- Shipping calculation helper ----------------
// Simple weight + order-value based rule. Free shipping above a
// threshold, flat rate otherwise. Adjust freely as the business grows.
const calculateShipping = (itemsPrice, totalWeightGrams) => {
  if (itemsPrice >= 1999) return 0; // free shipping over ₹1999
  if (totalWeightGrams > 2000) return 149; // heavier orders (e.g. multiple lehengas)
  return 99;
};

const calculateTax = (itemsPrice) => Math.round(itemsPrice * 0.05); // 5% GST placeholder rate

const generateOrderNumber = () => {
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SV-${Date.now().toString().slice(-6)}-${rand}`;
};

// @desc    Create a new order (validates stock, deducts inventory, applies coupon)
// @route   POST /api/orders
// @access  Private
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode } = req.body;

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  let itemsPrice = 0;
  let totalWeight = 0;
  const validatedItems = [];

  // Validate stock and lock in current prices for each item
  for (const item of orderItems) {
    const product = await Product.findById(item.product);
    if (!product) {
      res.status(404);
      throw new Error(`Product not found: ${item.product}`);
    }

    const sizeStock = product.sizes.find((s) => s.size === item.size);
    if (!sizeStock || sizeStock.stock < item.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${product.name} (size ${item.size})`);
    }

    const price = product.finalPrice;
    itemsPrice += price * item.quantity;
    totalWeight += (product.weightInGrams || 500) * item.quantity;

    validatedItems.push({
      product: product._id,
      name: product.name,
      image: product.images[0]?.url || '',
      size: item.size,
      color: item.color || 'Default',
      quantity: item.quantity,
      price,
    });

    // Deduct stock
    sizeStock.stock -= item.quantity;
    await product.save();
  }

  // Apply coupon if provided
  let discountAmount = 0;
  let couponApplied = null;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });
    if (coupon) {
      const validity = coupon.isValid(itemsPrice);
      if (validity.valid) {
        discountAmount = coupon.calculateDiscount(itemsPrice);
        couponApplied = { code: coupon.code, discountAmount };
        coupon.usedCount += 1;
        await coupon.save();
      }
    }
  }

  const shippingPrice = calculateShipping(itemsPrice, totalWeight);
  const taxPrice = calculateTax(itemsPrice - discountAmount);
  const totalPrice = itemsPrice - discountAmount + shippingPrice + taxPrice;

  const order = await Order.create({
    orderNumber: generateOrderNumber(),
    user: req.user._id,
    orderItems: validatedItems,
    shippingAddress,
    paymentMethod,
    couponApplied,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    isPaid: paymentMethod === 'COD' ? false : false, // set true only after payment verification
    estimatedDelivery: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // ~9 days out
    statusHistory: [{ status: 'Processing', note: 'Order placed' }],
  });

  // Clear the user's cart after successful order placement
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.status(201).json({ success: true, order });
});

// @desc    Get a single order by ID (owner or admin only)
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('You do not have permission to view this order');
  }

  res.status(200).json({ success: true, order });
});

// @desc    Get logged-in user's order history
// @route   GET /api/orders/my-orders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
  res.status(200).json({ success: true, count: orders.length, orders });
});

// @desc    Mark an order as paid (called internally after payment verification)
// @route   PUT /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = req.body.paymentResult;
  order.orderStatus = 'Confirmed';
  order.statusHistory.push({ status: 'Confirmed', note: 'Payment received' });

  const updated = await order.save();
  res.status(200).json({ success: true, order: updated });
});

// ---------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------

// @desc    Get all orders (admin)
// @route   GET /api/orders
// @access  Private/Admin
const getAllOrders = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const filter = {};
  if (req.query.status) filter.orderStatus = req.query.status;

  const orders = await Order.find(filter)
    .populate('user', 'name email')
    .sort('-createdAt')
    .skip((page - 1) * limit)
    .limit(limit);

  const total = await Order.countDocuments(filter);

  res.status(200).json({
    success: true,
    count: orders.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    orders,
  });
});

// @desc    Update order status / tracking info (admin)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderStatus, trackingNumber, courierName, note } = req.body;

  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  if (orderStatus) {
    order.orderStatus = orderStatus;
    order.statusHistory.push({ status: orderStatus, note: note || '' });
    if (orderStatus === 'Delivered') {
      order.isDelivered = true;
      order.deliveredAt = Date.now();
    }
  }
  if (trackingNumber) order.trackingNumber = trackingNumber;
  if (courierName) order.courierName = courierName;

  const updated = await order.save();
  res.status(200).json({ success: true, order: updated });
});

export {
  createOrder,
  getOrderById,
  getMyOrders,
  updateOrderToPaid,
  getAllOrders,
  updateOrderStatus,
};
