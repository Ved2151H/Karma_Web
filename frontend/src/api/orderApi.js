import axiosClient from '../services/axiosClient';

export const orderApi = {
  getAll: (params) => axiosClient.get('/orders', { params }),
  getAdminAll: () => axiosClient.get('/orders', { params: { view: 'admin' } }),
  create: (data) => axiosClient.post('/orders', data),
  update: (id, data, params) => axiosClient.put(`/orders/${id}`, data, { params }),
  updateAdmin: (id, data) => axiosClient.put(`/orders/${id}`, data, { params: { view: 'admin' } }),
  cancel: (id) => axiosClient.put(`/orders/${id}/cancel`),
};

export default orderApi;
