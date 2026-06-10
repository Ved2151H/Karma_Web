import React from 'react';
import { useCart } from '../context/CartContext';
import { useCheckout } from '../hooks/useCheckout';
import { Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

export function Cart() {
  const { cartItems, cartTotal, updateQuantity, removeFromCart } = useCart();
  const { checkout, checkingOut } = useCheckout();

  return (
    <div className="w-full bg-white min-h-screen font-sans select-none pb-16">
      <div className="max-w-[1320px] mx-auto px-5 py-12 w-full">
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-800 mb-8">
          Your Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 text-sm font-medium">No products available.</p>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-10">
            {/* Cart Items List */}
            <div className="flex-grow space-y-6">
              {cartItems.map((item) => (
                <div key={item.id} className="flex items-center gap-4 sm:gap-6 p-4 border border-neutral-100 rounded-xl bg-white shadow-xs">
                  {/* Image */}
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-20 h-20 object-cover rounded-lg border border-neutral-100 bg-neutral-50"
                  />
                  {/* Title & Price */}
                  <div className="flex-grow min-w-0">
                    <Link to={`/product/${item.id}`} className="block text-sm font-bold text-neutral-800 hover:text-[#E31E24] truncate">
                      {item.title}
                    </Link>
                    <span className="block text-xs font-semibold text-neutral-400 capitalize mt-0.5">
                      {item.category} Protection
                    </span>
                    <span className="block text-sm font-extrabold text-neutral-800 mt-2 font-display">
                      ₹{item.price}
                    </span>
                  </div>
                  {/* Quantity Actions */}
                  <div className="flex items-center gap-2 border border-neutral-200 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer"
                      disabled={item.quantity <= 1}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold px-2.5 min-w-[20px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1 hover:bg-neutral-100 rounded text-neutral-500 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="p-2.5 bg-neutral-50 text-neutral-400 hover:text-[#E31E24] hover:bg-neutral-100 rounded-lg cursor-pointer transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="w-full lg:w-[380px] bg-neutral-50 border border-neutral-100 rounded-2xl p-6 h-fit">
              <h2 className="text-sm font-black uppercase tracking-wider text-neutral-800 mb-6 pb-3 border-b border-neutral-200">
                Order Summary
              </h2>
              <div className="space-y-4 text-xs font-semibold mb-6">
                <div className="flex justify-between text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-800 font-display">₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-neutral-500">
                  <span>Shipping</span>
                  <span className="text-emerald-600 uppercase font-bold">Free</span>
                </div>
                <div className="flex justify-between text-neutral-600 border-t border-neutral-200 pt-4 text-sm font-black">
                  <span>Total Amount</span>
                  <span className="text-neutral-900 font-display">₹{cartTotal}</span>
                </div>
              </div>
              <button
                onClick={checkout}
                disabled={checkingOut}
                className="w-full bg-[#E31E24] text-white hover:bg-red-700 disabled:opacity-60 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-lg hover:shadow-brand-red/10 cursor-pointer transition-colors"
              >
                {checkingOut ? 'Processing...' : 'Proceed To Checkout'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Cart;
