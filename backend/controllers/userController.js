// ================================================================
// Shreedha Vastra — User Controller
// ================================================================
// Handles: profile, addresses, wishlist, cart (all self-service
// for the logged-in customer), plus admin customer management.
// ================================================================
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';
import Product from '../models/Product.js';

// ---------------------------------------------------------------
// PROFILE
// ---------------------------------------------------------------

// @desc    Update logged-in user's profile (name, phone, avatar handled separately)
// @route   PUT /api/users/profile
// @access  Private
const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;

  const updated = await user.save();

  res.status(200).json({
    success: true,
    user: { _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone },
  });
});

// ---------------------------------------------------------------
// ADDRESSES
// ---------------------------------------------------------------

// @desc    Get all saved addresses
// @route   GET /api/users/addresses
// @access  Private
const getAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Add a new address
// @route   POST /api/users/addresses
// @access  Private
const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // If this is marked default, unset any existing default
  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  user.addresses.push(req.body);
  await user.save();

  res.status(201).json({ success: true, addresses: user.addresses });
});

// @desc    Update an existing address
// @route   PUT /api/users/addresses/:addressId
// @access  Private
const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error('Address not found');
  }

  if (req.body.isDefault) {
    user.addresses.forEach((addr) => (addr.isDefault = false));
  }

  Object.assign(address, req.body);
  await user.save();

  res.status(200).json({ success: true, addresses: user.addresses });
});

// @desc    Delete an address
// @route   DELETE /api/users/addresses/:addressId
// @access  Private
const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.addressId);
  await user.save();

  res.status(200).json({ success: true, addresses: user.addresses });
});

// ---------------------------------------------------------------
// WISHLIST
// ---------------------------------------------------------------

// @desc    Get wishlist (populated with product details)
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'wishlist',
    select: 'name slug price discountPrice images ratingsAverage sizes',
  });
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Add a product to wishlist
// @route   POST /api/users/wishlist/:productId
// @access  Private
const addToWishlist = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const user = await User.findById(req.user._id);
  if (!user.wishlist.includes(req.params.productId)) {
    user.wishlist.push(req.params.productId);
    await user.save();
  }
 await user.populate({path: 'wishlist',select: 'name slug price discountprice images ratingsaverage sizes'})
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// @desc    Remove a product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
const removeFromWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.wishlist = user.wishlist.filter((id) => id.toString() !== req.params.productId);
  await user.save();
await user.populate({path: 'wishlist',select: 'name slug price discountprice images ratingsaverage sizes'})
  res.status(200).json({ success: true, wishlist: user.wishlist });
});

// ---------------------------------------------------------------
// CART
// ---------------------------------------------------------------

// @desc    Get cart
// @route   GET /api/users/cart
// @access  Private
const getCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({
    path: 'cart.product',
    select: 'name slug images sizes',
  });
  res.status(200).json({ success: true, cart: user.cart });
});

// @desc    Add an item to cart (or increase quantity if same product/size/color exists)
// @route   POST /api/users/cart
// @access  Private
const addToCart = asyncHandler(async (req, res) => {
  const { productId, size, color, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  const sizeStock = product.sizes.find((s) => s.size === size);
  if (!sizeStock || sizeStock.stock < quantity) {
    res.status(400);
    throw new Error(`Insufficient stock for size ${size}`);
  }

  const user = await User.findById(req.user._id);
  const existingItem = user.cart.find(
    (item) => item.product.toString() === productId && item.size === size && item.color === color
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    user.cart.push({
      product: productId,
      name: product.name,
      image: product.images[0]?.url || '',
      size,
      color,
      price: product.finalPrice,
      quantity,
    });
  }

  await user.save();
  res.status(200).json({ success: true, cart: user.cart });
});

// @desc    Update quantity of a cart item
// @route   PUT /api/users/cart/:itemId
// @access  Private
const updateCartItem = asyncHandler(async (req, res) => {
  const { quantity } = req.body;
  const user = await User.findById(req.user._id);
  const item = user.cart.id(req.params.itemId);

  if (!item) {
    res.status(404);
    throw new Error('Cart item not found');
  }

  if (quantity < 1) {
    res.status(400);
    throw new Error('Quantity must be at least 1');
  }

  item.quantity = quantity;
  await user.save();

  res.status(200).json({ success: true, cart: user.cart });
});

// @desc    Remove an item from cart
// @route   DELETE /api/users/cart/:itemId
// @access  Private
const removeFromCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = user.cart.filter((item) => item._id.toString() !== req.params.itemId);
  await user.save();

  res.status(200).json({ success: true, cart: user.cart });
});

// @desc    Clear entire cart (used after successful order placement)
// @route   DELETE /api/users/cart
// @access  Private
const clearCart = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.cart = [];
  await user.save();

  res.status(200).json({ success: true, cart: [] });
});

// ---------------------------------------------------------------
// ADMIN: CUSTOMER MANAGEMENT
// ---------------------------------------------------------------

// @desc    Get all customers (admin)
// @route   GET /api/users
// @access  Private/Admin
const getAllUsers = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 20;

  const users = await User.find({ role: 'customer' })
    .select('-password')
    .skip((page - 1) * limit)
    .limit(limit)
    .sort('-createdAt');

  const total = await User.countDocuments({ role: 'customer' });

  res.status(200).json({
    success: true,
    count: users.length,
    total,
    page,
    pages: Math.ceil(total / limit),
    users,
  });
});

// @desc    Get single customer by ID (admin)
// @route   GET /api/users/:id
// @access  Private/Admin
const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  res.status(200).json({ success: true, user });
});

// @desc    Delete a customer account (admin)
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }
  await user.deleteOne();
  res.status(200).json({ success: true, message: 'User deleted successfully' });
});

export {
  updateProfile,
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
  getAllUsers,
  getUserById,
  deleteUser,
};
