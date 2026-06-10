import { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await orderApi.getAll();
      setOrders(Array.isArray(response) ? response : []);
    } catch (err) {
      console.warn('Failed to load orders.', err);
      setError('Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    const created = await orderApi.create(orderData);
    await getOrders();
    return created;
  };

  const updateOrder = async (id, orderData) => {
    const updated = await orderApi.update(id, orderData);
    setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
    return updated;
  };

  const cancelOrder = async (id) => {
    const updated = await orderApi.cancel(id);
    setOrders((prev) => prev.map((order) => (order.id === id ? updated : order)));
    return updated;
  };

  useEffect(() => {
    getOrders();
  }, []);

  return {
    orders,
    loading,
    error,
    getOrders,
    createOrder,
    updateOrder,
    cancelOrder,
  };
}

export default useOrders;
