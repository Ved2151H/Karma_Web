import { useWishlist as useWishlistContext } from '../context/WishlistContext';

export function useWishlist() {
  const { wishlistItems, toggleWishlist, isInWishlist } = useWishlistContext();

  const addWishlist = (productId) => {
    if (!wishlistItems.includes(productId)) {
      toggleWishlist(productId);
    }
  };

  const removeWishlist = (productId) => {
    if (wishlistItems.includes(productId)) {
      toggleWishlist(productId);
    }
  };

  return {
    wishlistItems,
    addWishlist,
    removeWishlist,
    toggleWishlist,
    isInWishlist
  };
}

export default useWishlist;
