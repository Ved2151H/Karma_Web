import axiosClient from '../services/axiosClient';

export const orderApi = {
  getAll: (params) => axiosClient.get('/orders', { params }),
  create: (data) => axiosClient.post('/orders', data),
  update: (id, data) => axiosClient.put(`/orders/${id}`, data),
  cancel: (id) => axiosClient.put(`/orders/${id}/cancel`),
};

export default orderApi;
