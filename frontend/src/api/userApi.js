import axiosClient from '../services/axiosClient';

export const userApi = {
  getAll: () => axiosClient.get('/users'),
  getProfile: () => axiosClient.get('/users/profile'),
  update: (id, data) => axiosClient.put(`/users/${id}`, data),
  delete: (id) => axiosClient.delete(`/users/${id}`),
};

export default userApi;
