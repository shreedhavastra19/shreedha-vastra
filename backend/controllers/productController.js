// ================================================================
// Shreedha Vastra — Product Controller
// ================================================================
import asyncHandler from 'express-async-handler';
import Product from '../models/Product.js';
import APIFeatures from '../utils/apiFeatures.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import { bufferToDataURI } from '../middleware/uploadMiddleware.js';

// ---------------------------------------------------------------
// PUBLIC
// ---------------------------------------------------------------

// @desc    Get products with filtering, search, sorting, pagination
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const baseQuery = Product.find({ status: 'active' }).populate('category', 'name slug');

  const features = new APIFeatures(baseQuery, req.query).filter().search().sort().limitFields().paginate();

  const products = await features.query;

  // Total count for pagination UI (respecting the same filters, minus pagination)
  const countFeatures = new APIFeatures(
    Product.find({ status: 'active' }),
    req.query
  )
    .filter()
    .search();
  const total = await countFeatures.query.countDocuments();

  const limit = parseInt(req.query.limit, 10) || 20;
  const page = parseInt(req.query.page, 10) || 1;

  res.status(200).json({
    success: true,
    count: products.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    products,
  });
});

// @desc    Get single product by slug
// @route   GET /api/products/:slug
// @access  Public
const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug, status: 'active' }).populate(
    'category',
    'name slug'
  );

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.status(200).json({ success: true, product });
});

// @desc    Get similar products (same category, excluding current product)
// @route   GET /api/products/:slug/similar
// @access  Public
const getSimilarProducts = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const similar = await Product.find({
    category: product.category,
    _id: { $ne: product._id },
    status: 'active',
  })
    .limit(20)
    .select('name slug price discountPrice images ratingsAverage sizes');

  res.status(200).json({ success: true, products: similar });
});

// @desc    Get featured products (homepage)
// @route   GET /api/products/featured
// @access  Public
const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, status: 'active' })
    .limit(20)
    .select('name slug price discountPrice images ratingsAverage sizes');
  res.status(200).json({ success: true, products });
});

// @desc    Get best sellers (homepage)
// @route   GET /api/products/best-sellers
// @access  Public
const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isBestSeller: true, status: 'active' })
    .limit(20)
    .select('name slug price discountPrice images ratingsAverage sizes');
  res.status(200).json({ success: true, products });
});

// @desc    Get new arrivals (homepage)
// @route   GET /api/products/new-arrivals
// @access  Public
const getNewArrivals = asyncHandler(async (req, res) => {
  const products = await Product.find({ isNewArrival: true, status: 'active' })
    .sort('-createdAt')
    .limit(20)
    .select('name slug price discountPrice images ratingsAverage sizes');
  res.status(200).json({ success: true, products });
});

// ---------------------------------------------------------------
// ADMIN
// ---------------------------------------------------------------

// @desc    Create a new product (with image upload)
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const productData = { ...req.body };

  // Parse JSON-stringified fields sent via multipart/form-data
  ['sizes', 'colors', 'specifications', 'collections', 'tags'].forEach((field) => {
    if (typeof productData[field] === 'string') {
      productData[field] = JSON.parse(productData[field]);
    }
  });

  // Upload main product images to Cloudinary
  if (req.files && req.files.length > 0) {
    const uploaded = await Promise.all(
      req.files.map((file) => uploadImage(bufferToDataURI(file)))
    );
    productData.images = uploaded.map((img) => ({ url: img.secure_url, public_id: img.public_id }));
  }

  const product = await Product.create(productData);
  res.status(201).json({ success: true, product });
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const updateData = { ...req.body };
  ['sizes', 'colors', 'specifications', 'collections', 'tags'].forEach((field) => {
    if (typeof updateData[field] === 'string') {
      updateData[field] = JSON.parse(updateData[field]);
    }
  });

  // If new images were uploaded, add them (old ones kept unless explicitly removed via separate endpoint logic)
  if (req.files && req.files.length > 0) {
    const uploaded = await Promise.all(
      req.files.map((file) => uploadImage(bufferToDataURI(file)))
    );
    const newImages = uploaded.map((img) => ({ url: img.secure_url, public_id: img.public_id }));
    updateData.images = [...product.images, ...newImages];
  }

  Object.assign(product, updateData);
  await product.save();

  res.status(200).json({ success: true, product });
});

// @desc    Delete a product (and its Cloudinary images)
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  await Promise.all(product.images.map((img) => deleteImage(img.public_id)));
  await product.deleteOne();

  res.status(200).json({ success: true, message: 'Product deleted successfully' });
});

// @desc    Get all products for admin (includes drafts/archived, no status filter)
// @route   GET /api/products/admin/all
// @access  Private/Admin
const getAdminProducts = asyncHandler(async (req, res) => {
  const features = new APIFeatures(Product.find().populate('category', 'name'), req.query)
    .filter()
    .search()
    .sort()
    .paginate();

  const products = await features.query;
  const total = await Product.countDocuments();

  res.status(200).json({ success: true, count: products.length, total, products });
});

export {
  getProducts,
  getProductBySlug,
  getSimilarProducts,
  getFeaturedProducts,
  getBestSellers,
  getNewArrivals,
  createProduct,
  updateProduct,
  deleteProduct,
  getAdminProducts,
};
