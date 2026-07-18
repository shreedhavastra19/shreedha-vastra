import api from './api';

const couponService = {
  applyCoupon: (code, orderValue) =>
    api.post('/coupons/apply', { code, orderValue }).then((res) => res.data),
  // Admin
  getCoupons: () => api.get('/coupons').then((res) => res.data),
  createCoupon: (data) => api.post('/coupons', data).then((res) => res.data),
  updateCoupon: (id, data) => api.put(`/coupons/${id}`, data).then((res) => res.data),
  deleteCoupon: (id) => api.delete(`/coupons/${id}`).then((res) => res.data),
};

export default couponService;
