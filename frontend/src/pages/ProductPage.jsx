import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useProducts } from '../hooks/useProducts';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuthContext } from '../context/AuthContext';
import { useProductContext } from '../context/ProductContext';
import axiosClient from '../services/axiosClient';
import {
  Star, Heart, Plus, Minus, ChevronDown, ChevronUp, Mail,
  ArrowRight, ShieldCheck, CheckCircle2, ShoppingCart, Zap,
  ZoomIn, ChevronLeft, ChevronRight
} from 'lucide-react';

export function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProductById, loading } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { user: authUser } = useAuthContext();
  const { reloadProducts } = useProductContext();

  const product = useMemo(() => getProductById(id), [id, getProductById]);

  /* ---------- Local State ---------- */
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState({});
  const [accordions, setAccordions] = useState({ highlights: false, specs: false, reviews: false });

  // Cart animation
  const [cartAdded, setCartAdded] = useState(false);

  // Reviews
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ rating: 5, author: '', comment: '' });
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  /* ---------- Derived Data ---------- */

  // Build full image list: main image + additional images
  const allImages = useMemo(() => {
    if (!product) return [];
    const extras = Array.isArray(product.images) ? product.images : [];
    return [product.image, ...extras].filter(Boolean);
  }, [product]);

  // Parse attributes (support both {title,types} and old {label,values})
  const attributes = useMemo(() => {
    if (!product?.attributes) return [];
    const raw = Array.isArray(product.attributes) ? product.attributes : [];
    return raw.map(attr => ({
      title: attr.title || attr.label || '',
      types: Array.isArray(attr.types || attr.values) ? (attr.types || attr.values) : []
    })).filter(a => a.title);
  }, [product]);

  const highlights = useMemo(() => {
    if (!product?.highlights) return [];
    return Array.isArray(product.highlights) ? product.highlights : [];
  }, [product]);

  const specs = useMemo(() => {
    if (!product?.specs) return [];
    return Array.isArray(product.specs) ? product.specs : [];
  }, [product]);

  /* ---------- Effects ---------- */

  // Load product state on product change
  useEffect(() => {
    if (!product) return;
    setActiveImageIdx(0);
    setQuantity(1);
    setCartAdded(false);
    setReviewSubmitted(false);

    // Set initial selected types
    const initTypes = {};
    attributes.forEach(attr => {
      if (attr.types.length > 0) initTypes[attr.title] = attr.types[0];
    });
    setSelectedTypes(initTypes);

    // Load reviews from product data (DB-backed)
    const dbReviews = Array.isArray(product.reviews) ? product.reviews : [];
    setReviews(dbReviews);
    setNewReview({ rating: 5, author: authUser?.name || '', comment: '' });
  }, [product, authUser]);

  /* ---------- Computed Values ---------- */

  const isWishlisted = isInWishlist(id);

  const displayRating = useMemo(() => {
    if (!reviews.length) return product?.rating || 4.5;
    return parseFloat((reviews.reduce((a, r) => a + Number(r.rating), 0) / reviews.length).toFixed(1));
  }, [reviews, product]);

  /* ---------- Handlers ---------- */

  const handleAddToCart = useCallback(() => {
    if (!product || product.stock === 0) return;
    addToCart(product, quantity);
    setCartAdded(true);
    setTimeout(() => setCartAdded(false), 2200);
  }, [product, quantity, addToCart]);

  const handleBuyNow = useCallback(() => {
    if (!product || product.stock === 0) return;
    addToCart(product, quantity);
    navigate('/cart');
  }, [product, quantity, addToCart, navigate]);

  const toggleAccordion = (section) =>
    setAccordions(prev => ({ ...prev, [section]: !prev[section] }));

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newReview.author.trim() || !newReview.comment.trim()) return;

    setReviewSubmitting(true);
    try {
      const updated = await axiosClient.post(`/products/${id}/reviews`, {
        author: newReview.author.trim(),
        rating: Number(newReview.rating),
        comment: newReview.comment.trim(),
      });
      // Updated product returned — refresh reviews and rating
      const updatedReviews = Array.isArray(updated.reviews) ? updated.reviews : reviews;
      setReviews(updatedReviews);
      setReviewSubmitted(true);
      setNewReview({ rating: 5, author: authUser?.name || '', comment: '' });
      // Refresh global product list so rating propagates
      reloadProducts?.();
    } catch (err) {
      console.error('Failed to submit review:', err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const prevImage = () => setActiveImageIdx(i => (i - 1 + allImages.length) % allImages.length);
  const nextImage = () => setActiveImageIdx(i => (i + 1) % allImages.length);

  // Mailto link
  const emailSubject = product ? encodeURIComponent(`Enquiry for ${product.title}`) : '';
  const emailBody = product ? encodeURIComponent(`Hello KARAM Safety,\n\nI am interested in: ${product.title}\nSKU: ${id.slice(-8).toUpperCase()}\n\nPlease provide availability and pricing.\n\nThank you.`) : '';
  const enquireMailto = `mailto:support@karam.in?subject=${emailSubject}&body=${emailBody}`;

  /* ---------- Early Returns ---------- */

  if (loading) {
    return (
      <div className="w-full bg-[#FCFCFD] min-h-screen flex items-center justify-center font-sans">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#E31E24] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-neutral-500 text-sm font-semibold">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="w-full bg-white min-h-screen flex flex-col items-center justify-center font-sans py-20 px-6">
        <h2 className="text-2xl font-bold text-neutral-800 mb-2">Product Not Found</h2>
        <p className="text-neutral-500 text-sm mb-8 text-center max-w-md">
          This product does not exist or has been removed from the catalog.
        </p>
        <Link to="/" className="bg-[#1B1B1B] text-white px-8 py-3.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors">
          Go Back Home
        </Link>
      </div>
    );
  }

  const { title, price, originalPrice, discount, badge, description, stock, category, brand } = product;

  return (
    <div className="w-full bg-[#FAFBFB] min-h-screen font-sans select-none pb-20">
      <div className="max-w-[1240px] mx-auto px-4 py-6 sm:py-10">

        {/* Breadcrumb */}
        <nav className="text-xs font-medium text-neutral-400 mb-6 flex flex-wrap items-center gap-1.5 bg-white py-2.5 px-4 rounded-lg border border-neutral-100 shadow-xs">
          <Link to="/" className="hover:text-[#E31E24] transition-colors">Home</Link>
          <span className="text-neutral-300">/</span>
          <Link to={`/category/${category}`} className="capitalize hover:text-[#E31E24] transition-colors">{category} Protection</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-700 font-semibold truncate max-w-[250px]">{title}</span>
        </nav>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-4 sm:p-8 rounded-2xl border border-neutral-150 shadow-xs mb-8">

          {/* ===== LEFT: Image Gallery ===== */}
          <div className="lg:col-span-6 flex flex-col gap-4">

            {/* Main Image with navigation arrows */}
            <div className="w-full aspect-square rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50 relative group flex items-center justify-center p-4">
              {badge && (
                <span className="absolute top-4 left-4 z-10 bg-[#E31E24] text-white text-[10px] font-black px-3.5 py-1 rounded-sm uppercase tracking-wider shadow-xs">
                  {badge}
                </span>
              )}

              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  src={allImages[activeImageIdx]}
                  alt={`${title} - image ${activeImageIdx + 1}`}
                  className="max-h-full max-w-full object-contain"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.2 }}
                />
              </AnimatePresence>

              {/* Arrows - only show if more than 1 image */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <ChevronLeft className="w-4 h-4 text-neutral-600" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 hover:bg-white border border-neutral-200 rounded-full flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer z-10"
                  >
                    <ChevronRight className="w-4 h-4 text-neutral-600" />
                  </button>
                </>
              )}

              {/* Image counter */}
              {allImages.length > 1 && (
                <div className="absolute bottom-3 right-3 bg-black/40 text-white text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm">
                  {activeImageIdx + 1} / {allImages.length}
                </div>
              )}
            </div>

            {/* Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="flex gap-2.5 flex-wrap">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-16 rounded-lg overflow-hidden border-2 p-1 bg-neutral-50 flex items-center justify-center transition-all cursor-pointer ${
                      idx === activeImageIdx
                        ? 'border-[#E31E24] shadow-sm shadow-red-100'
                        : 'border-neutral-200 hover:border-neutral-400'
                    }`}
                  >
                    <img src={img} alt={`thumb-${idx + 1}`} className="max-h-full max-w-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ===== RIGHT: Product Info ===== */}
          <div className="lg:col-span-6 flex flex-col justify-start">

            {/* Brand + Wishlist Row */}
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[#E31E24] bg-red-50 px-2 py-1 rounded-sm">
                {brand || 'KARAM'}
              </span>
              <button
                onClick={() => toggleWishlist(id)}
                className={`p-2 rounded-full transition-colors cursor-pointer border ${
                  isWishlisted
                    ? 'bg-red-50 border-red-200 text-[#E31E24]'
                    : 'bg-white border-neutral-200 text-neutral-400 hover:text-[#E31E24] hover:border-red-200'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Product Name */}
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-neutral-800 leading-tight mb-2">
              {title}
            </h1>

            {/* SKU */}
            <div className="text-xs font-semibold text-neutral-500 mb-4 bg-neutral-50 py-1.5 px-3 rounded-md w-fit border border-neutral-100">
              SKU: <span className="text-neutral-700 font-bold">{id.slice(-8).toUpperCase()}</span>
            </div>

            {/* Ratings */}
            <div className="flex items-center gap-3 mb-5 pb-5 border-b border-neutral-100">
              <div className="flex items-center gap-1 bg-[#161616] text-white px-2.5 py-1 rounded text-xs font-bold shadow-xs">
                <span className="text-amber-400 text-xs">★</span>
                <span>{displayRating}</span>
              </div>
              <button
                className="text-xs text-neutral-400 font-semibold hover:underline cursor-pointer"
                onClick={() => { setAccordions(p => ({ ...p, reviews: true })); }}
              >
                {reviews.length} Ratings & Reviews
              </button>
              <div className="text-neutral-200">|</div>
              <span className={`text-xs font-extrabold uppercase tracking-wider ${stock > 0 ? 'text-emerald-600' : 'text-[#E31E24]'}`}>
                {stock > 0 ? `In Stock (${stock} left)` : 'Out of Stock'}
              </span>
            </div>

            {/* Price Block */}
            <div className="bg-[#FAFBFB] p-4 rounded-xl border border-neutral-100 mb-5">
              <div className="flex items-baseline gap-3">
                <span className="text-3xl font-black text-neutral-900">₹{price}</span>
                {originalPrice && (
                  <>
                    <span className="text-sm font-semibold text-neutral-400 line-through">MRP ₹{originalPrice}</span>
                    <span className="text-xs font-extrabold text-[#E31E24] bg-red-50 px-2 py-0.5 rounded-sm">{discount}% OFF</span>
                  </>
                )}
              </div>
              <p className="text-[11px] font-semibold text-neutral-400 mt-1.5">(Inclusive of all taxes)</p>
            </div>

            {/* Description */}
            <p className="text-neutral-600 text-sm leading-relaxed mb-4">
              {description || 'Premium safety equipment designed to meet international protection standards. Built for comfort and durability in demanding environments.'}
            </p>

            {/* Explore More */}
            <div className="mb-5">
              <Link
                to={`/category/${category}`}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E31E24] hover:text-red-700 transition-colors uppercase tracking-wider"
              >
                Explore More {category} Products
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Dynamic Attributes */}
            {attributes.length > 0 && (
              <div className="mb-5 space-y-4 border-t border-neutral-100 pt-4">
                {attributes.map((attr, idx) => (
                  <div key={idx} className="flex flex-col gap-2">
                    <span className="text-xs font-extrabold text-neutral-700 tracking-wider">
                      {attr.title}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {attr.types.map((type, tIdx) => {
                        const isSelected = selectedTypes[attr.title] === type;
                        return (
                          <button
                            key={tIdx}
                            onClick={() => setSelectedTypes(prev => ({ ...prev, [attr.title]: type }))}
                            className={`px-4 py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-neutral-900 border-neutral-900 text-white shadow-xs'
                                : 'bg-white border-neutral-250 text-neutral-700 hover:bg-neutral-50'
                            }`}
                          >
                            {type}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Quantity */}
            <div className="mb-5 border-t border-neutral-100 pt-4">
              <span className="text-xs font-extrabold text-neutral-700 tracking-wider block mb-2.5">QUANTITY</span>
              <div className="flex items-center border border-neutral-250 rounded-lg w-fit bg-white overflow-hidden">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="px-3.5 py-2 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="px-5 py-2 text-xs font-extrabold text-neutral-800 min-w-10 text-center border-x border-neutral-100">
                  {quantity}
                </span>
                <button
                  onClick={() => setQuantity(q => (stock > 0 && q >= stock ? q : q + 1))}
                  className="px-3.5 py-2 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 border-t border-neutral-100 pt-5">

              {/* Add to Cart — animated */}
              <motion.button
                disabled={stock === 0}
                onClick={handleAddToCart}
                whileTap={stock > 0 ? { scale: 0.94 } : {}}
                animate={cartAdded ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.3 }}
                className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                  stock === 0
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : cartAdded
                    ? 'bg-emerald-600 text-white cursor-pointer shadow-md shadow-emerald-100'
                    : 'bg-[#E31E24] text-white hover:bg-red-700 cursor-pointer shadow-md shadow-red-100'
                }`}
              >
                <AnimatePresence mode="wait">
                  {cartAdded ? (
                    <motion.span
                      key="added"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Added to Cart!
                    </motion.span>
                  ) : (
                    <motion.span
                      key="add"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-2"
                    >
                      <ShoppingCart className="w-4 h-4" /> Add to Cart
                    </motion.span>
                  )}
                </AnimatePresence>
              </motion.button>

              {/* Buy Now */}
              <button
                disabled={stock === 0}
                onClick={handleBuyNow}
                className={`flex-1 py-3.5 px-6 rounded-lg text-xs font-black uppercase tracking-wider transition-all border-2 flex items-center justify-center gap-2 ${
                  stock > 0
                    ? 'border-[#E31E24] text-[#E31E24] bg-white hover:bg-red-50 cursor-pointer'
                    : 'border-neutral-200 text-neutral-400 cursor-not-allowed bg-neutral-50'
                }`}
              >
                <Zap className="w-4 h-4" /> Buy Now
              </button>

              {/* Enquire */}
              <a
                href={enquireMailto}
                className="py-3.5 px-5 rounded-lg text-xs font-black uppercase tracking-wider bg-[#161616] text-white hover:bg-neutral-800 transition-colors text-center flex items-center justify-center gap-2"
              >
                <Mail className="w-4 h-4" /> Enquire
              </a>
            </div>

          </div>
        </div>

        {/* ===== ACCORDIONS ===== */}
        <div className="flex flex-col gap-4">

          {/* Key Highlights */}
          <div className="bg-white border border-neutral-150 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('highlights')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E31E24]" /> Key Highlights
              </span>
              {accordions.highlights ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>
            {accordions.highlights && (
              <div className="px-6 pb-6 pt-2 border-t border-neutral-100 bg-[#FAFBFB]">
                {highlights.length > 0 ? (
                  <ul className="space-y-3 mt-2">
                    {highlights.map((item, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-neutral-600 font-medium leading-relaxed">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-neutral-400 text-xs font-medium py-3 italic">No highlights specified for this product.</p>
                )}
              </div>
            )}
          </div>

          {/* Product Specifications */}
          <div className="bg-white border border-neutral-150 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('specs')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-[#E31E24]" /> Product Specifications
              </span>
              {accordions.specs ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>
            {accordions.specs && (
              <div className="px-6 pb-6 pt-2 border-t border-neutral-100 bg-[#FAFBFB]">
                {specs.length > 0 ? (
                  <table className="w-full mt-3 border border-neutral-150 rounded-lg overflow-hidden text-left">
                    <tbody>
                      {specs.map((item, idx) => (
                        <tr key={idx} className={`border-b border-neutral-100 last:border-0 ${idx % 2 === 0 ? 'bg-white' : 'bg-neutral-50'}`}>
                          <td className="px-4 py-3 text-xs font-bold text-neutral-500 w-1/3 bg-neutral-50/60">{item.name}</td>
                          <td className="px-4 py-3 text-xs font-semibold text-neutral-700">{item.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-neutral-400 text-xs font-medium py-3 italic">No specifications added for this product.</p>
                )}
              </div>
            )}
          </div>

          {/* Ratings & Reviews */}
          <div className="bg-white border border-neutral-150 rounded-xl overflow-hidden shadow-xs">
            <button
              onClick={() => toggleAccordion('reviews')}
              className="w-full px-6 py-4 flex items-center justify-between hover:bg-neutral-50 transition-colors cursor-pointer"
            >
              <span className="text-xs font-black uppercase tracking-wider text-neutral-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#E31E24]" /> Customer Ratings & Reviews
              </span>
              {accordions.reviews ? <ChevronUp className="w-4 h-4 text-neutral-500" /> : <ChevronDown className="w-4 h-4 text-neutral-500" />}
            </button>

            {accordions.reviews && (
              <div className="px-6 pb-6 pt-4 border-t border-neutral-100 bg-[#FAFBFB]">

                {/* Summary Row */}
                <div className="flex flex-col sm:flex-row gap-6 items-center bg-white p-5 rounded-xl border border-neutral-150 mb-6">
                  <div className="text-center sm:text-left shrink-0">
                    <div className="text-4xl font-black text-neutral-800 mb-1">{displayRating}</div>
                    <div className="flex gap-1 text-amber-500 justify-center sm:justify-start mb-1">
                      {[1, 2, 3, 4, 5].map(s => (
                        <Star key={s} className={`w-4 h-4 ${s <= Math.round(displayRating) ? 'fill-current' : 'text-neutral-250'}`} />
                      ))}
                    </div>
                    <div className="text-xs text-neutral-400 font-semibold">{reviews.length} Reviews</div>
                  </div>
                  <div className="flex-1 max-w-xs w-full space-y-1.5">
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      const pct = reviews.length ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} className="flex items-center gap-2 text-xs font-bold text-neutral-500">
                          <span className="w-3">{stars}</span>
                          <span className="text-amber-500">★</span>
                          <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 transition-all" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="w-5 text-right">{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Content Grid */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-8">

                  {/* Write Review */}
                  <div className="md:col-span-5 bg-white p-5 rounded-xl border border-neutral-150 h-fit">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 mb-4 pb-2 border-b border-neutral-100">
                      Write a Review
                    </h4>
                    {reviewSubmitted ? (
                      <div className="text-center py-6">
                        <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2" />
                        <p className="text-xs font-bold text-neutral-700">Thank you for your review!</p>
                        <p className="text-neutral-400 text-[11px] mt-1 font-medium">Your feedback has been saved.</p>
                        <button
                          onClick={() => setReviewSubmitted(false)}
                          className="mt-4 text-xs font-bold text-[#E31E24] hover:underline cursor-pointer"
                        >
                          Write another review
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={handleReviewSubmit} className="space-y-4">
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-2">Overall Rating</label>
                          <div className="flex gap-1.5 text-amber-500">
                            {[1, 2, 3, 4, 5].map(s => (
                              <button key={s} type="button"
                                onClick={() => setNewReview(p => ({ ...p, rating: s }))}
                                className="hover:scale-110 transition-transform cursor-pointer"
                              >
                                <Star className={`w-6 h-6 ${s <= newReview.rating ? 'fill-current' : 'text-neutral-250'}`} />
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Your Name</label>
                          <input
                            type="text" required
                            placeholder="Enter your name"
                            value={newReview.author}
                            onChange={e => setNewReview(p => ({ ...p, author: e.target.value }))}
                            className="w-full border border-neutral-250 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-[#E31E24]"
                          />
                        </div>
                        <div>
                          <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wider mb-1.5">Comments</label>
                          <textarea
                            required rows={3}
                            placeholder="Share your experience..."
                            value={newReview.comment}
                            onChange={e => setNewReview(p => ({ ...p, comment: e.target.value }))}
                            className="w-full border border-neutral-250 rounded-lg p-2.5 text-xs font-semibold focus:outline-none focus:border-[#E31E24] resize-none"
                          />
                        </div>
                        <button
                          type="submit"
                          disabled={reviewSubmitting}
                          className="w-full bg-[#161616] text-white hover:bg-neutral-800 py-3 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer disabled:opacity-60"
                        >
                          {reviewSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                      </form>
                    )}
                  </div>

                  {/* Reviews List */}
                  <div className="md:col-span-7 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-neutral-800 pb-2 border-b border-neutral-100">
                      Recent Reviews
                    </h4>
                    {reviews.length > 0 ? (
                      <div className="space-y-3 max-h-[400px] overflow-y-auto pr-1">
                        {reviews.map((rev, idx) => (
                          <div key={rev.id || idx} className="bg-white p-4 rounded-xl border border-neutral-150">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <div className="text-xs font-extrabold text-neutral-800">{rev.author}</div>
                                <div className="flex gap-0.5 text-amber-500 mt-1">
                                  {[1, 2, 3, 4, 5].map(s => (
                                    <Star key={s} className={`w-3 h-3 ${s <= rev.rating ? 'fill-current' : 'text-neutral-250'}`} />
                                  ))}
                                </div>
                              </div>
                              <span className="text-[10px] text-neutral-400 font-semibold">{rev.date}</span>
                            </div>
                            <p className="text-neutral-600 text-xs font-medium leading-relaxed">{rev.comment}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-neutral-400 text-xs font-medium py-8 italic text-center">
                        No reviews yet. Be the first to share your experience!
                      </p>
                    )}
                  </div>

                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

export default ProductPage;
