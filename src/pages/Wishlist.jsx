import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import ProductCard from '../components/ProductCard/ProductCard';

export function Wishlist() {
  const { wishlistItems } = useWishlist();

  return (
    <div className="w-full bg-white min-h-screen font-sans select-none pb-16">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-800 mb-8">
          Your Wishlist
        </h1>

        {wishlistItems.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <h2 className="text-base font-black text-neutral-800 uppercase tracking-wider mb-2">Your Wishlist is Empty</h2>
            <p className="text-neutral-500 text-xs font-semibold">Start adding products to your wishlist.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {wishlistItems.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Wishlist;
