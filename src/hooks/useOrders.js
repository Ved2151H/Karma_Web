import { useState, useEffect } from 'react';
import { orderApi } from '../api/orderApi';

export function useOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);

  const getOrders = async () => {
    setLoading(true);
    try {
      const response = await orderApi.getAll();
      if (Array.isArray(response)) {
        setOrders(response);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.warn('Failed to load orders. Loading mock orders.');
      setOrders([
        {
          id: 'ord-101',
          date: '2026-05-10',
          total: 1080,
          status: 'Delivered',
          items: [
            { id: 'face-1', title: 'KARAM ES52 Industrial Face Shield', quantity: 1, price: 720 },
            { id: 'hand-1', title: 'KARAM HS701 Latex Coated Safety Gloves', quantity: 2, price: 180 }
          ]
        },
        {
          id: 'ord-102',
          date: '2026-06-02',
          total: 879,
          status: 'Processing',
          items: [
            { id: 'hand-2', title: 'KARAM HS61 Cut Resistant HPPE Gloves', quantity: 1, price: 879 }
          ]
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      return await orderApi.create(orderData);
    } catch (err) {
      console.warn('Offline mode: Created order mock.');
      return orderData;
    }
  };

  const updateOrder = async (id, orderData) => {
    try {
      return await orderApi.update(id, orderData);
    } catch (err) {
      console.warn('Offline mode: Updated order mock.');
      return orderData;
    }
  };

  const cancelOrder = async (id) => {
    try {
      return await orderApi.cancel(id);
    } catch (err) {
      console.warn('Offline mode: Cancelled order mock.');
      setOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'Cancelled' } : o))
      );
      return id;
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  return {
    orders,
    loading,
    getOrders,
    createOrder,
    updateOrder,
    cancelOrder
  };
}

export default useOrders;
