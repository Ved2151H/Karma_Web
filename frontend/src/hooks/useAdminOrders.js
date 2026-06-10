import { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';

export function useAdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getAdminAll();
      setOrders(Array.isArray(response) ? response : []);
    } catch (err) {
      console.warn('Failed to load admin orders.', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (id, status) => {
    try {
      const updated = await orderApi.updateAdmin(id, { status });
      setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
      return updated;
    } catch (err) {
      console.error('Failed to update order status.', err);
      throw err;
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    getOrders,
    updateOrderStatus,
  };
}

export default useAdminOrders;
