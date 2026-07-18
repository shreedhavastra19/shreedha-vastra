// ================================================================
// Shreedha Vastra — Coupon Model
// ================================================================
import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, 'Coupon code is required'],
      unique: true,
      uppercase: true,
      trim: true,
    },
    description: { type: String, default: '' },
    discountType: {
      type: String,
      enum: ['percentage', 'flat'],
      required: true,
    },
    discountValue: {
      type: Number,
      required: true,
      min: [0, 'Discount value cannot be negative'],
    },
    minOrderValue: { type: Number, default: 0 },
    maxDiscountAmount: {
      type: Number, // caps discount for percentage-type coupons
      default: null,
    },
    expiryDate: { type: Date, required: true },
    usageLimit: { type: Number, default: null }, // null = unlimited
    usedCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ---------------- Instance method: is this coupon currently usable? ----------------
couponSchema.methods.isValid = function (orderValue) {
  if (!this.isActive) return { valid: false, message: 'This coupon is no longer active' };
  if (this.expiryDate < new Date())
    return { valid: false, message: 'This coupon has expired' };
  if (this.usageLimit !== null && this.usedCount >= this.usageLimit)
    return { valid: false, message: 'This coupon has reached its usage limit' };
  if (orderValue < this.minOrderValue)
    return {
      valid: false,
      message: `Minimum order value of ₹${this.minOrderValue} required for this coupon`,
    };
  return { valid: true, message: 'Coupon applied successfully' };
};

// ---------------- Instance method: calculate discount amount ----------------
couponSchema.methods.calculateDiscount = function (orderValue) {
  let discount =
    this.discountType === 'percentage'
      ? (orderValue * this.discountValue) / 100
      : this.discountValue;

  if (this.maxDiscountAmount) {
    discount = Math.min(discount, this.maxDiscountAmount);
  }
  return Math.round(Math.min(discount, orderValue));
};

const Coupon = mongoose.model('Coupon', couponSchema);
export default Coupon;
