import api from './api';

const categoryService = {
  getCategories: () => api.get('/categories').then((res) => res.data),
  getCategoryBySlug: (slug) => api.get(`/categories/${slug}`).then((res) => res.data),
  createCategory: (formData) =>
    api.post('/categories', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  updateCategory: (id, formData) =>
    api.put(`/categories/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  deleteCategory: (id) => api.delete(`/categories/${id}`).then((res) => res.data),
};

export default categoryService;
