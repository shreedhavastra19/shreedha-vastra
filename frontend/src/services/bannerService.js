import api from './api';

const bannerService = {
  getActiveBanners: (position) =>
    api.get('/banners', { params: position ? { position } : {} }).then((res) => res.data),
  // Admin
  getAllBanners: () => api.get('/banners/admin/all').then((res) => res.data),
  createBanner: (formData) =>
    api.post('/banners', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  updateBanner: (id, formData) =>
    api.put(`/banners/${id}`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((res) => res.data),
  deleteBanner: (id) => api.delete(`/banners/${id}`).then((res) => res.data),
};

export default bannerService;
