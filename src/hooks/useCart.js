import { useCart as useCartContext } from '../context/CartContext';

export function useCart() {
  return useCartContext();
}

export default useCart;
