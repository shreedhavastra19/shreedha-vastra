// ================================================================
// Shreedha Vastra — Coupon Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import Coupon from '../models/Coupon.js';


// @desc    Validate & preview a coupon's discount for a given order value
// @route   POST /api/coupons/apply
// @access  Private
const applyCoupon = asyncHandler(async (req, res) => {
  const { code, orderValue } = req.body;

  const coupon = await Coupon.findOne({ code: code?.toUpperCase() });
  if (!coupon) {
    res.status(404);
    throw new Error('Invalid coupon code');
  }

  const validity = coupon.isValid(orderValue);
  if (!validity.valid) {
    res.status(400);
    throw new Error(validity.message);
  }

  const discountAmount = coupon.calculateDiscount(orderValue);

  res.status(200).json({
    success: true,
    code: coupon.code,
    discountAmount,
    message: validity.message,
  });
  // @desc    Check if any coupon is currently active & usable (no code needed)
// @route   GET /api/coupons/active
// @access  Public
const hasActiveCoupon = asyncHandler(async (req, res) => {
  const activeCoupon = await Coupon.findOne({
    isActive: true,
    expiryDate: { $gte: new Date() },
    $or: [
      { usageLimit: null },
      { $expr: { $lt: ['$usedCount', '$usageLimit'] } },
    ],
  });

  res.status(200).json({ success: true, hasActiveCoupon: !!activeCoupon });
});
});

// ---------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------

// @desc    Get all coupons (admin)
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = asyncHandler(async (req, res) => {
  const coupons = await Coupon.find().sort('-createdAt');
  res.status(200).json({ success: true, coupons });
});

// @desc    Create a coupon (admin)
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.create(req.body);
  res.status(201).json({ success: true, coupon });
});

// @desc    Update a coupon (admin)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  res.status(200).json({ success: true, coupon });
});

// @desc    Delete a coupon (admin)
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findById(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error('Coupon not found');
  }
  await coupon.deleteOne();
  res.status(200).json({ success: true, message: 'Coupon deleted successfully' });
});

export { applyCoupon, hasActiveCoupon , getCoupons, createCoupon, updateCoupon, deleteCoupon };
