import React, { createContext, useState, useContext, useMemo, useEffect, useCallback } from 'react';
import { ProductContext } from './ProductContext';
import { useAuthContext } from './AuthContext';
import { wishlistApi } from '../api/wishlistApi';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const [wishlistIds, setWishlistIds] = useState([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, token } = useAuthContext();
  const { products } = useContext(ProductContext) || { products: [] };

  const loadWishlist = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    try {
      const data = await wishlistApi.getAll();
      setWishlistIds(Array.isArray(data.ids) ? data.ids : []);
    } catch (error) {
      console.warn('Failed to load wishlist from API', error);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      loadWishlist();
    } else {
      setWishlistIds([]);
    }
  }, [isAuthenticated, token, loadWishlist]);

  const addWishlist = async (productId) => {
    if (!productId) return;

    if (isAuthenticated) {
      try {
        await wishlistApi.add(productId);
        setWishlistIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
      } catch (error) {
        console.error('Failed to add wishlist item', error);
      }
      return;
    }

    setWishlistIds((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  };

  const removeWishlist = async (productId) => {
    if (!productId) return;

    if (isAuthenticated) {
      try {
        await wishlistApi.remove(productId);
        setWishlistIds((prev) => prev.filter((id) => id !== productId));
      } catch (error) {
        console.error('Failed to remove wishlist item', error);
      }
      return;
    }

    setWishlistIds((prev) => prev.filter((id) => id !== productId));
  };

  const toggleWishlist = async (productId) => {
    if (wishlistIds.includes(productId)) {
      await removeWishlist(productId);
    } else {
      await addWishlist(productId);
    }
  };

  const isInWishlist = (productId) => wishlistIds.includes(productId);

  const detailedWishlistItems = useMemo(
    () => wishlistIds.map((id) => products.find((p) => p.id === id)).filter(Boolean),
    [wishlistIds, products]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems: detailedWishlistItems,
        wishlistIds,
        addWishlist,
        removeWishlist,
        toggleWishlist,
        isInWishlist,
        loading,
        reloadWishlist: loadWishlist,
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
