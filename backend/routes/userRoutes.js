// ================================================================
// Shreedha Vastra — User Routes
// ================================================================
import express from 'express';
import { protect, authorize } from '../middleware/authMiddleware.js';
import {
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
} from '../controllers/userController.js';

const router = express.Router();

// All routes below require login
router.use(protect);

// Profile
router.put('/profile', updateProfile);

// Addresses
router.route('/addresses').get(getAddresses).post(addAddress);
router.route('/addresses/:addressId').put(updateAddress).delete(deleteAddress);

// Wishlist
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);

// Cart
router.route('/cart').get(getCart).post(addToCart).delete(clearCart);
router.route('/cart/:itemId').put(updateCartItem).delete(removeFromCart);

// Admin: customer management
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);
router.delete('/:id', authorize('admin'), deleteUser);

export default router;
