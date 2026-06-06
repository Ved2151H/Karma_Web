import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../../context/WishlistContext';

function ProductCard({ product }) {
  const { id, title, image, price, originalPrice, discount, badge, description } = product;
  const { toggleWishlist, isInWishlist } = useWishlist();

  const isWishlisted = isInWishlist(id);

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleQuickView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Quick view behaviour placeholder
    alert(`Quick View details for: ${title}`);
  };

  return (
    <Link to={`/product/${id}`} className="group block select-none bg-white border border-neutral-100 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-300 h-full flex flex-col">
      <div className="relative">
        {/* Ribbon Badges */}
        {badge && (
          <div
            className={`absolute top-3 left-3 z-10 px-2.5 py-0.5 text-[9px] uppercase font-bold tracking-wider text-white shadow-xs ${
              badge === 'Sale'
                ? 'bg-emerald-600'
                : badge === 'New Launch'
                ? 'bg-orange-500'
                : 'bg-brand-red'
            }`}
          >
            {badge}
          </div>
        )}

        {/* Product Image */}
        <div className="relative pt-[80%] bg-neutral-50 overflow-hidden border-b border-neutral-100">
          <img
            src={image}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover"
            loading="lazy"
          />
        </div>
      </div>

      {/* Buttons row: Quick View & Add to Wishlist */}
      <div className="flex border-b border-neutral-100 text-[11px] text-neutral-600 font-bold select-none bg-neutral-50">
        <button
          onClick={handleQuickView}
          className="flex-1 flex items-center justify-center gap-1.5 py-2.5 hover:text-brand-red cursor-pointer transition-colors duration-200"
        >
          <span className="text-xs">👁</span> Quick View
        </button>
        
        {/* Divider line */}
        <div className="w-[1px] bg-neutral-200 self-stretch" />
        
        <button
          onClick={handleWishlist}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 cursor-pointer transition-colors duration-200 ${
            isWishlisted ? 'text-brand-red' : 'hover:text-brand-red'
          }`}
        >
          <span className="text-xs">{isWishlisted ? '♥' : '♡'}</span>{' '}
          {isWishlisted ? 'Wishlisted' : 'Wishlist'}
        </button>
      </div>

      {/* Details Container */}
      <div className="p-4 flex flex-col flex-grow">
        {/* Title */}
        <h3 className="font-sans text-xs sm:text-sm font-semibold text-neutral-800 tracking-tight line-clamp-2 mb-2 group-hover:text-brand-red transition-colors duration-200">
          {title}
        </h3>

        {/* Short description */}
        <p className="text-neutral-500 text-[11px] leading-relaxed line-clamp-2 mb-3">
          {description}
        </p>

        {/* Price layout */}
        <div className="mt-auto flex items-baseline gap-2">
          <span className="text-sm sm:text-base font-extrabold text-neutral-900 font-display">
            ₹{price}
          </span>
          {originalPrice && (
            <>
              <span className="text-xs text-neutral-400 line-through">
                ₹{originalPrice}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">
                ({discount}% Off)
              </span>
            </>
          )}
        </div>
      </div>
    </Link>
  );
}

export default ProductCard;
