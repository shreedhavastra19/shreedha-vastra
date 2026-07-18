import api from './api';

const userService = {
  updateProfile: (data) => api.put('/users/profile', data).then((res) => res.data),

  getAddresses: () => api.get('/users/addresses').then((res) => res.data),
  addAddress: (data) => api.post('/users/addresses', data).then((res) => res.data),
  updateAddress: (id, data) => api.put(`/users/addresses/${id}`, data).then((res) => res.data),
  deleteAddress: (id) => api.delete(`/users/addresses/${id}`).then((res) => res.data),

  getWishlist: () => api.get('/users/wishlist').then((res) => res.data),
  addToWishlist: (productId) => api.post(`/users/wishlist/${productId}`).then((res) => res.data),
  removeFromWishlist: (productId) => api.delete(`/users/wishlist/${productId}`).then((res) => res.data),

  getCart: () => api.get('/users/cart').then((res) => res.data),
  addToCart: (data) => api.post('/users/cart', data).then((res) => res.data),
  updateCartItem: (itemId, quantity) =>
    api.put(`/users/cart/${itemId}`, { quantity }).then((res) => res.data),
  removeFromCart: (itemId) => api.delete(`/users/cart/${itemId}`).then((res) => res.data),
  clearCart: () => api.delete('/users/cart').then((res) => res.data),

  // Admin
  getAllUsers: (params) => api.get('/users', { params }).then((res) => res.data),
  getUserById: (id) => api.get(`/users/${id}`).then((res) => res.data),
  deleteUser: (id) => api.delete(`/users/${id}`).then((res) => res.data),
};

export default userService;
