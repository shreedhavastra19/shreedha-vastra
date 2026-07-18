import api from './api';

const productService = {
  getProducts: (params) => api.get('/products', { params }).then((res) => res.data),
  getProductBySlug: (slug) => api.get(`/products/${slug}`).then((res) => res.data),
  getSimilarProducts: (slug) => api.get(`/products/${slug}/similar`).then((res) => res.data),
  getFeatured: () => api.get('/products/featured').then((res) => res.data),
  getBestSellers: () => api.get('/products/best-sellers').then((res) => res.data),
  getNewArrivals: () => api.get('/products/new-arrivals').then((res) => res.data),
  getReviews: (productId) => api.get(`/products/${productId}/reviews`).then((res) => res.data),
 addReview: (productId, formData) =>
    api
      .post(`/products/${productId}/reviews`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      .then((res) => res.data),
  // Admin
  getAdminProducts: (params) => api.get('/products/admin/all', { params }).then((res) => res.data),
  createProduct: (formData) =>
    api.post('/products', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  updateProduct: (id, formData) =>
    api.put(`/products/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  deleteProduct: (id) => api.delete(`/products/${id}`).then((res) => res.data),
};

export default productService;
