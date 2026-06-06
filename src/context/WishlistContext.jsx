import React, { createContext, useState, useContext, useMemo } from 'react';
import { ProductContext } from './ProductContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  // raw state storing only the product ID strings, initialized from localStorage
  const [wishlistIds, setWishlistIds] = useState(() => {
    try {
      const stored = localStorage.getItem('karam_wishlist');
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      console.error('Failed to parse karam_wishlist from localStorage:', e);
      return [];
    }
  });

  const { products } = useContext(ProductContext) || { products: [] };

  const addWishlist = (productId) => {
    if (!productId) return;
    setWishlistIds((prev) => {
      if (prev.includes(productId)) return prev;
      const updated = [...prev, productId];
      localStorage.setItem('karam_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const removeWishlist = (productId) => {
    if (!productId) return;
    setWishlistIds((prev) => {
      const updated = prev.filter((id) => id !== productId);
      localStorage.setItem('karam_wishlist', JSON.stringify(updated));
      return updated;
    });
  };

  const toggleWishlist = (productId) => {
    if (wishlistIds.includes(productId)) {
      removeWishlist(productId);
    } else {
      addWishlist(productId);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistIds.includes(productId);
  };

  // Compute detailed product list dynamically
  const detailedWishlistItems = useMemo(() => {
    return wishlistIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean);
  }, [wishlistIds, products]);

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: detailedWishlistItems, // returns detailed products to keep UI happy
        wishlistIds,                           // raw IDs
        addWishlist,
        removeWishlist,
        toggleWishlist,
        isInWishlist
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
export default WishlistContext;
