import axiosClient from '../services/axiosClient';

export const settingsApi = {
  get: () => axiosClient.get('/settings'),
  update: (data) => axiosClient.put('/settings', data),
};

export default settingsApi;
