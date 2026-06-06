import axiosClient from '../services/axiosClient';

export const authApi = {
  login: (credentials) => axiosClient.post('/auth/login', credentials),
  register: (userData) => axiosClient.post('/auth/register', userData),
  logout: () => axiosClient.post('/auth/logout'),
  refreshToken: (token) => axiosClient.post('/auth/refresh', { refreshToken: token }),
};

export default authApi;
