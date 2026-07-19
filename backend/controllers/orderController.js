// ================================================================
// Shreedha Vastra — Order Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import User from '../models/User.js';

const calculateShipping = (itemsPrice, totalWeightGrams) => {
  if (itemsPrice >= 1999) return 0;
  if (totalWeightGrams > 2000) return 149;
  return 99;
};

const calculateTax = (itemsPrice) => Math.round(itemsPrice * 0.05);

const generateOrderNumber = () => {
  const rand = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SV-${Date.now().toString().slice(-6)}-${rand}`;
};

// @desc    Create a new order (validates stock, deducts inventory, applies coupon)
// @route   POST /api/orders
// @access  Public (guest) or Private (logged-in)
const createOrder = asyncHandler(async (req, res) => {
  const { orderItems, shippingAddress, paymentMethod, couponCode, guestInfo } = req.body;

  // Guests must provide contact details since there's no account to fall back on
  if (!req.user && (!guestInfo || !guestInfo.email || !guestInfo.name || !guestInfo.phone)) {
    res.status(400);
    throw new Error('Name, email and phone are required to place an order without an account');
  }

  if (!orderItems || orderItems.length === 0) {
    res.status(400);
    throw new Error('No order items provided');
  }

  let itemsPrice = 0;
  let totalWeight = 0;
  const validatedItems = [];

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
      color: item.color,
      quantity: item.quantity,
      price,
    });

    sizeStock.stock -= item.quantity;
    await product.save();
  }

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
    user: req.user ? req.user._id : undefined,
    guestInfo: req.user ? undefined : guestInfo,
    orderItems: validatedItems,
    shippingAddress,
    paymentMethod,
    couponApplied,
    itemsPrice,
    shippingPrice,
    taxPrice,
    discountAmount,
    totalPrice,
    isPaid: paymentMethod === 'COD' ? false : false,
    estimatedDelivery: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000),
    statusHistory: [{ status: 'Processing', note: 'Order placed' }],
  });

  // Clear the user's saved cart after successful order placement (logged-in only —
  // guests keep their cart in localStorage, cleared on the frontend after this returns)
  if (req.user) {
    const user = await User.findById(req.user._id);
    user.cart = [];
    await user.save();
  }

  res.status(201).json({ success: true, order });
});

// @desc    Get a single order by ID (owner, admin, or anyone with the link for a guest order)
// @route   GET /api/orders/:id
// @access  Public (guest orders) or Private (own orders / admin)
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');

  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }

  const isAdmin = req.user?.role === 'admin';
  const isOwner = order.user && req.user && order.user._id.toString() === req.user._id.toString();
  const isGuestOrder = !order.user;

  if (!isAdmin && !isOwner && !isGuestOrder) {
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
// @access  Public/Private
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