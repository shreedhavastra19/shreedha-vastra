import api from './api';

const paymentService = {
  createRazorpayOrder: (amount, orderId) =>
    api.post('/payments/create-order', { amount, orderId }).then((res) => res.data),
  verifyPayment: (data) => api.post('/payments/verify', data).then((res) => res.data),
};

export default paymentService;
