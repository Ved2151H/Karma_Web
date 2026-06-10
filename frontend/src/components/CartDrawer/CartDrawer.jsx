import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, Plus, Minus } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';
import { useCheckout } from '../../hooks/useCheckout';

function CartDrawer() {
  const { isCartOpen, setIsCartOpen } = useUI();
  const { cartItems, removeFromCart, updateQuantity, cartTotal } = useCart();
  const { checkout, checkingOut } = useCheckout();

  const handleCheckout = async () => {
    const result = await checkout();
    if (result.success) {
      setIsCartOpen(false);
    }
  };

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.55 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black z-[1000] pointer-events-auto"
            transition={{ duration: 0.3, ease: 'linear' }}
          />

          {/* Slide Drawer (420px desktop, 100% mobile) */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed top-0 right-0 bottom-0 w-full sm:w-[420px] h-screen bg-white z-[1001] shadow-2xl flex flex-col font-sans"
          >
            {/* Header (Height: 82px, Background: #f7f7f7) */}
            <div className="h-[82px] bg-[#f7f7f7] px-5 flex items-center justify-between select-none">
              <span className="text-[32px] sm:text-[42px] font-medium text-[#111] leading-none">
                Shopping Cart
              </span>
              <button
                onClick={() => setIsCartOpen(false)}
                className="text-neutral-900 hover:text-[#E31E24] cursor-pointer transition-colors p-1"
                aria-label="Close cart"
              >
                <X className="w-[34px] h-[34px]" />
              </button>
            </div>

            {/* Scrollable Items Container */}
            <div className="flex-grow overflow-y-auto p-5 scrollbar-none">
              {cartItems.length === 0 ? (
                /* Empty Cart Layout */
                <div className="flex flex-col items-center justify-center select-none pt-[90px]">
                  {/* Line art cart illustration (220px) */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="0.75"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-[220px] h-[220px] text-neutral-200 mb-8"
                  >
                    <circle cx="9" cy="21" r="1" />
                    <circle cx="20" cy="21" r="1" />
                    <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
                  </svg>
                  
                  {/* Close link */}
                  <div
                    onClick={() => setIsCartOpen(false)}
                    className="text-center text-sm cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <span className="text-[#E31E24] font-medium">Click here</span>
                    <span className="text-[#222]"> to continue shopping.</span>
                  </div>
                </div>
              ) : (
                /* Cart Items List */
                <div className="flex flex-col gap-5">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 border border-neutral-100 rounded-lg bg-white relative"
                    >
                      {/* Product Thumbnail (80x80) */}
                      <div className="w-[80px] h-[80px] rounded-md overflow-hidden bg-neutral-50 shrink-0 border border-neutral-100">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Product Title, Price, and Quantity */}
                      <div className="flex flex-col flex-1 justify-between">
                        <div>
                          <h5 className="text-base font-semibold text-neutral-900 line-clamp-1 pr-6 leading-tight">
                            {item.title}
                          </h5>
                          <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider block mt-0.5">
                            {item.category} Protection
                          </span>
                        </div>

                        <div className="flex items-center justify-between mt-2 select-none">
                          {/* Quantity control selector: - 1 + */}
                          <div className="flex items-center border border-neutral-200 rounded bg-neutral-50/50">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-neutral-500 hover:text-[#E31E24] cursor-pointer"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-neutral-800 w-6 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-neutral-500 hover:text-[#E31E24] cursor-pointer"
                              aria-label="Increase quantity"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price in Red */}
                          <span className="text-sm font-bold text-[#E31E24] font-display">
                            ₹{item.price * item.quantity}
                          </span>
                        </div>
                      </div>

                      {/* Remove Button (Gray to Red hover) */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="absolute top-4 right-4 text-neutral-400 hover:text-[#E31E24] cursor-pointer transition-colors p-1"
                        aria-label="Remove item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Sticky Footer (Background: white, Border top: 1px solid #ececec) */}
            {cartItems.length > 0 && (
              <div className="p-5 border-t border-[#ececec] bg-white select-none">
                <div className="flex justify-between items-baseline mb-4">
                  <span className="text-sm text-neutral-900 font-medium">
                    Subtotal
                  </span>
                  <span className="text-xl font-extrabold text-[#E31E24] font-display">
                    ₹{cartTotal}
                  </span>
                </div>
                
                {/* Checkout Button (Height: 56px, Border radius: 0px) */}
                <button
                  onClick={handleCheckout}
                  disabled={checkingOut}
                  className="w-full h-[56px] bg-[#E31E24] hover:bg-[#c91a20] disabled:opacity-60 text-white text-sm font-bold uppercase tracking-widest rounded-none shadow-sm cursor-pointer transition-colors flex items-center justify-center"
                >
                  {checkingOut ? 'PROCESSING...' : 'PROCEED TO CHECKOUT'}
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default CartDrawer;
