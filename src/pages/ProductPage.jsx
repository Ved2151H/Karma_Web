import React, { useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';

export function ProductPage() {
  const { id } = useParams();
  const { getProductById, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();

  const product = useMemo(() => {
    return getProductById(id);
  }, [id, getProductById]);

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center font-sans">
        <p className="text-neutral-500 text-sm font-medium">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-white min-h-screen flex flex-col items-center justify-center font-sans py-20 px-6">
        <h2 className="text-xl font-bold text-neutral-800 mb-2">Product Not Found</h2>
        <p className="text-neutral-500 text-sm mb-6 text-center max-w-md">
          The product you are looking for does not exist or has been removed from the catalog.
        </p>
        <Link to="/" className="bg-[#1B1B1B] text-white px-6 py-3 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  const { title, image, price, originalPrice, discount, badge, description, stock, rating, category, brand, industry, material, resistanceType, countryOfOrigin } = product;
  const isWishlisted = isInWishlist(id);

  // Generate specs dynamically from available fields
  const specs = [
    { label: 'Brand', value: brand || 'KARAM' },
    { label: 'Category', value: category ? category.charAt(0).toUpperCase() + category.slice(1) + ' Protection' : 'Safety Equipment' },
    { label: 'Industry Scope', value: industry || 'General Purpose' },
    { label: 'Material Composition', value: material || 'N/A' },
    { label: 'Protection Type', value: resistanceType || 'N/A' },
    { label: 'Country of Origin', value: countryOfOrigin || 'India' }
  ].filter(s => s.value && s.value !== 'N/A');

  return (
    <div className="w-full bg-white min-h-screen font-sans select-none pb-16">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-8 sm:py-12">
        {/* Breadcrumb */}
        <div className="text-xs text-neutral-400 font-semibold mb-8">
          <Link to="/" className="hover:text-[#E31E24]">Home</Link>
          <span className="mx-2">/</span>
          <Link to={`/category/${category}`} className="capitalize hover:text-[#E31E24]">{category} Protection</Link>
          <span className="mx-2">/</span>
          <span className="text-neutral-850 truncate max-w-[200px] inline-block align-bottom">{title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Left: Product Image */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <div className="w-full max-w-[500px] aspect-square rounded-2xl overflow-hidden border border-neutral-100 bg-neutral-50 relative group">
              {badge && (
                <span className="absolute top-4 left-4 z-10 bg-[#E31E24] text-white text-[10px] font-bold px-3 py-1 uppercase tracking-wider">
                  {badge}
                </span>
              )}
              <img
                src={image}
                alt={title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
          </div>

          {/* Right: Details */}
          <div className="w-full lg:w-1/2 flex flex-col">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E31E24] mb-2">{brand || 'KARAM'}</span>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-800 leading-tight mb-4">
              {title}
            </h1>

            {/* Rating & Stock */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center gap-1 bg-neutral-100 px-2.5 py-1 rounded text-xs font-bold text-neutral-700">
                <span className="text-amber-500 text-sm">★</span> {rating || '4.5'}
              </div>
              <div className="text-neutral-300">|</div>
              <span className={`text-xs font-bold uppercase tracking-wider ${stock > 0 ? 'text-emerald-600' : 'text-[#E31E24]'}`}>
                {stock > 0 ? `In Stock (${stock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-2xl sm:text-3xl font-black text-neutral-900 font-display">
                ₹{price}
              </span>
              {originalPrice && (
                <>
                  <span className="text-sm text-neutral-400 line-through">₹{originalPrice}</span>
                  <span className="text-xs font-bold text-emerald-600">({discount}% Off)</span>
                </>
              )}
            </div>

            {/* Description */}
            <p className="text-neutral-500 text-sm leading-relaxed mb-8">
              {description || 'Premium safety equipment designed and tested to meet high standards of protection. Engineered for comfort and durability in challenging work environments.'}
            </p>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <button
                disabled={stock === 0}
                onClick={() => addToCart(product, 1)}
                className={`flex-1 py-4 rounded-lg text-xs font-black uppercase tracking-wider transition-colors select-none ${
                  stock > 0
                    ? 'bg-[#E31E24] text-white hover:bg-red-700 cursor-pointer shadow-md'
                    : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                }`}
              >
                {stock > 0 ? 'Add To Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => toggleWishlist(id)}
                className={`py-4 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-all select-none border cursor-pointer ${
                  isWishlisted
                    ? 'bg-neutral-100 border-neutral-100 text-[#E31E24]'
                    : 'bg-white border-neutral-250 text-neutral-800 hover:bg-neutral-50'
                }`}
              >
                {isWishlisted ? '♥ Wishlisted' : '♡ Add to Wishlist'}
              </button>
            </div>

            {/* Specifications */}
            <div className="border-t border-neutral-200 pt-8">
              <h3 className="text-xs font-extrabold uppercase tracking-widest text-neutral-800 mb-4">
                Specifications
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {specs.map((spec, index) => (
                  <div key={index} className="flex flex-col py-2.5 border-b border-neutral-50">
                    <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider mb-1">
                      {spec.label}
                    </span>
                    <span className="text-xs font-semibold text-neutral-700">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
