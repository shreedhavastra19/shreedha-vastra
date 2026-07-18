// ================================================================
// Shreedha Vastra — Banner Model
// ================================================================
import mongoose from 'mongoose';

const bannerSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    subtitle: { type: String, default: '' },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true },
    },
    mobileImage: {
      url: { type: String, default: '' },
      public_id: { type: String, default: '' },
    },
    ctaText: { type: String, default: 'Shop Now' },
    link: { type: String, default: '/' }, // e.g. /category/wedding-collection
    position: {
      type: String,
      enum: ['hero', 'secondary', 'promo-strip'],
      default: 'hero',
    },
    displayOrder: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date, default: Date.now },
    endDate: { type: Date, default: null }, // null = no expiry
  },
  { timestamps: true }
);

bannerSchema.index({ position: 1, displayOrder: 1 });

const Banner = mongoose.model('Banner', bannerSchema);
export default Banner;
