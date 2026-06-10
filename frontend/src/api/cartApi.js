import axiosClient from '../services/axiosClient';

export const cartApi = {
  get: () => axiosClient.get('/cart'),
  addItem: (productId, quantity = 1) =>
    axiosClient.post('/cart/items', { productId, quantity }),
  updateItem: (productId, quantity) =>
    axiosClient.put(`/cart/items/${productId}`, { quantity }),
  removeItem: (productId) => axiosClient.delete(`/cart/items/${productId}`),
  clear: () => axiosClient.delete('/cart'),
};

export default cartApi;
