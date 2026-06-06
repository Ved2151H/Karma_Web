import React, { createContext, useState, useContext, useMemo } from 'react';
import { ProductContext } from './ProductContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  // cartItems stores ONLY { productId, quantity }
  const [cartItems, setCartItems] = useState([]);
  
  const { products } = useContext(ProductContext) || { products: [] };

  // Adds an item to the cart, increments quantity if already exists
  const addToCart = (product, quantity = 1) => {
    const productId = product && typeof product === 'object' ? product.id : product;
    if (!productId) return;

    setCartItems((prev) => {
      const existing = prev.find((item) => item.productId === productId);
      if (existing) {
        return prev.map((item) =>
          item.productId === productId ? { ...item, quantity: item.quantity + quantity } : item
        );
      } else {
        return [
          ...prev,
          {
            productId,
            quantity,
          },
        ];
      }
    });
  };

  // Removes a product entirely from the cart
  const removeFromCart = (productId) => {
    setCartItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  // Updates quantity of a product in the cart (ensuring minimum of 1)
  const updateQuantity = (productId, quantity) => {
    if (quantity < 1) return;
    setCartItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  // Compute detailed cart items dynamically using ProductContext
  const detailedCartItems = useMemo(() => {
    return cartItems.map((item) => {
      const product = products.find((p) => p.id === item.productId);
      return {
        ...item,
        product,
        // Expose top level fields for backwards compatibility with existing UI components
        id: item.productId,
        title: product?.title || 'Unknown Product',
        image: product?.image || '',
        price: product?.price || 0,
        category: product?.category || '',
      };
    });
  }, [cartItems, products]);

  // Calculate cartCount
  const cartCount = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + item.quantity, 0);
  }, [cartItems]);

  // Calculate cartTotal
  const cartTotal = useMemo(() => {
    return detailedCartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [detailedCartItems]);

  return (
    <CartContext.Provider
      value={{
        cartItems: detailedCartItems, // Return computed detailed items to prevent breaking the UI
        rawCartItems: cartItems,      // Expose raw list if any component needs it
        addToCart,
        removeFromCart,
        updateQuantity,
        cartCount,
        cartTotal,
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
