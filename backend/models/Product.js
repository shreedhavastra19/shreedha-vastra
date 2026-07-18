// ================================================================
// Shreedha Vastra — Product Model
// ================================================================
import mongoose from 'mongoose';
import slugify from 'slugify';

const sizeStockSchema = new mongoose.Schema(
  {
    size: { type: String, required: true }, // e.g. XS, S, M, L, XL, XXL
    stock: { type: Number, required: true, min: 0, default: 0 },
  },
  { _id: false }
);

const colorVariantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Peach Gold"
    hex: { type: String, required: true }, // e.g. "#F5C6A5"
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
  },
  { _id: false }
);

const specificationSchema = new mongoose.Schema(
  {
    key: { type: String, required: true }, // e.g. "Neckline"
    value: { type: String, required: true }, // e.g. "V-Neck"
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [150, 'Product name cannot exceed 150 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
    },
    shortDescription: {
      type: String,
      maxlength: [200, 'Short description cannot exceed 200 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
    },
    collections: [
      {
        type: String,
        enum: [
          'Suit Sets',
          'Kurta Sets',
          'Cord Sets',
          'Festive Collection',
          'Wedding Collection',
          'Raja Rani Collection',
          'New Arrivals',
          'Best Sellers',
        ],
      },
    ],
    brand: { type: String, default: 'Shreedha Vastra' },
    sku: {
      type: String,
      unique: true,
      required: [true, 'SKU is required'],
      uppercase: true,
    },
    price: {
      type: Number,
      required: [true, 'Product price is required'],
      min: [0, 'Price cannot be negative'],
    },
    discountPrice: {
      type: Number,
      min: [0, 'Discount price cannot be negative'],
      validate: {
        validator: function (val) {
          return !val || val < this.price;
        },
        message: 'Discount price must be less than the regular price',
      },
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      },
    ],
    colors: [colorVariantSchema],
    sizes: [sizeStockSchema],
    fabric: {
      type: String,
      required: [true, 'Fabric details are required'],
    },
    careInstructions: {
      type: String,
      required: [true, 'Care instructions are required'],
    },
    specifications: [specificationSchema],
    deliveryInfo: {
      type: String,
      default:
        'Standard delivery in 5-9 business days. Express delivery available at checkout.',
    },
    returnPolicy: {
      type: String,
      default:
        '7-day easy return from the date of delivery. Product must be unused, unwashed, and with original tags attached.',
    },
    weightInGrams: {
      type: Number,
      default: 500, // used for shipping charge calculation
    },
    tags: [String],
    isFeatured: { type: Boolean, default: false },
    isBestSeller: { type: Boolean, default: false },
    isNewArrival: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['active', 'draft', 'archived'],
      default: 'active',
    },
    ratingsAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      set: (val) => Math.round(val * 10) / 10,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// ---------------- Virtuals ----------------

productSchema.virtual('totalStock').get(function () {
  return (this.sizes || []).reduce((sum, s) => sum + s.stock, 0);
});

productSchema.virtual('finalPrice').get(function () {
  return this.discountPrice || this.price;
});

productSchema.virtual('discountPercent').get(function () {
  if (!this.discountPrice) return 0;
  return Math.round(((this.price - this.discountPrice) / this.price) * 100);
});

productSchema.set('toJSON', { virtuals: true });
productSchema.set('toObject', { virtuals: true });

// ---------------- Hooks ----------------

productSchema.pre('save', function (next) {
  if (this.isModified('name')) {
    this.slug = `${slugify(this.name, { lower: true, strict: true })}-${this._id
      .toString()
      .slice(-6)}`;
  }
  next();
});

// ---------------- Indexes ----------------

productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1 });
productSchema.index({ isBestSeller: 1 });
productSchema.index({ isNewArrival: 1 });

const Product = mongoose.model('Product', productSchema);
export default Product;
