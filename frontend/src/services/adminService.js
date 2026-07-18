import api from './api';

const adminService = {
  getDashboardStats: () => api.get('/admin/dashboard').then((res) => res.data),
  getSalesReport: (params) => api.get('/admin/sales-report', { params }).then((res) => res.data),
};

export default adminService;
