import React, { createContext, useState, useContext, useMemo, useEffect, useRef, useCallback } from 'react';
import { ProductContext } from './ProductContext';
import { useAuthContext } from './AuthContext';
import { cartApi } from '../api/cartApi';

const CartContext = createContext();

function mapApiItems(items = []) {
  return items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
  }));
}

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuthContext();
  const { products } = useContext(ProductContext) || { products: [] };
  const wasAuthenticated = useRef(false);
  const cartItemsRef = useRef(cartItems);
  cartItemsRef.current = cartItems;

  const loadCart = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await cartApi.get();
      setCartItems(mapApiItems(data.items));
    } catch (error) {
      console.warn('Failed to load cart from API', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    const syncCart = async () => {
      if (isAuthenticated) {
        const guestItems = !wasAuthenticated.current ? cartItemsRef.current : [];
        if (guestItems.length > 0) {
          for (const item of guestItems) {
            try {
              await cartApi.addItem(item.productId, item.quantity);
            } catch (error) {
              console.warn('Failed to merge guest cart item', error);
            }
          }
        }
        await loadCart();
      } else if (wasAuthenticated.current) {
        setCartItems([]);
      }
      wasAuthenticated.current = isAuthenticated;
    };

    syncCart();
  }, [isAuthenticated, token, loadCart]);

  const addToCart = async (product, quantity = 1) => {
    const productId = product && typeof product === 'object' ? product.id : product;
    if (!productId) return;

    if (isAuthenticated) {
      try {
        const data = await cartApi.addItem(productId, quantity);
        setCartItems(mapApiItems(data.items));
      } catch (error) {
        console.error('Failed to add to cart', error);
      }
      return;
    }

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { productId, quantity }];
    });
  };

  const removeFromCart = async (productId) => {
    if (isAuthenticated) {
      try {
        const data = await cartApi.removeItem(productId);
        setCartItems(mapApiItems(data.items));
      } catch (error) {
        console.error('Failed to remove cart item', error);
      }
      return;
    }
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const updateQuantity = async (productId, quantity) => {
    if (quantity < 1) return;

    if (isAuthenticated) {
      try {
        const data = await cartApi.updateItem(productId, quantity);
        setCartItems(mapApiItems(data.items));
      } catch (error) {
        console.error('Failed to update cart item', error);
      }
      return;
    }

    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const clearCart = async () => {
    if (isAuthenticated) {
      try {
        await cartApi.clear();
        setCartItems([]);
      } catch (error) {
        console.error('Failed to clear cart', error);
      }
      return;
    }
    setCartItems([]);
  };

  const detailedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product,
        id: item.productId,
        title: product?.title || 'Unknown Product',
        image: product?.image || '',
        price: product?.price || 0,
        category: product?.category || '',
      };
    });
  }, [cartItems, products]);

  const cartCount = useMemo(() => cartItems.reduce((acc, item) => acc + item.quantity, 0), [cartItems]);

  const cartTotal = useMemo(
    () => detailedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0),
    [detailedCartItems]
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: detailedCartItems,
        rawCartItems: cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        reloadCart: loadCart,
        cartCount,
        cartTotal,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}

export default CartContext;
