import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import useAuth from './useAuth';
import { orderApi } from '../api/orderApi';

export function useCheckout() {
  const [checkingOut, setCheckingOut] = useState(false);
  const { rawCartItems, cartTotal, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const checkout = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/cart' } } });
      return { success: false, reason: 'auth' };
    }

    if (rawCartItems.length === 0) {
      return { success: false, reason: 'empty' };
    }

    setCheckingOut(true);
    try {
      await orderApi.create({
        items: rawCartItems.map((item) => ({
          id: item.productId,
          quantity: item.quantity,
        })),
        total: cartTotal,
      });
      await clearCart();
      navigate('/orders');
      return { success: true };
    } catch (err) {
      alert(err?.response?.data?.message || 'Checkout failed. Please try again.');
      return { success: false, reason: 'error' };
    } finally {
      setCheckingOut(false);
    }
  };

  return { checkout, checkingOut };
}

export default useCheckout;
