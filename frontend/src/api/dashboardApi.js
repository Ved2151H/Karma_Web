import axiosClient from '../services/axiosClient';

export const dashboardApi = {
  getStats: () => axiosClient.get('/dashboard/stats'),
};

export default dashboardApi;
