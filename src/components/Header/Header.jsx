import React from 'react';
import { Link } from 'react-router-dom';
import { User, Heart, ShoppingCart } from 'lucide-react';
import SearchBar from '../SearchBar/SearchBar';
import { useCart } from '../../context/CartContext';
import { useUI } from '../../context/UIContext';

function Header() {
  const { cartCount } = useCart();
  const { setIsCartOpen, setIsLoginOpen } = useUI();

  return (
    <header className="w-full font-sans select-none">
      
      {/* Top Information Bar (Height: 36px) */}
      <div 
        className="h-9 text-white text-[13px] px-6 sm:px-12 flex items-center justify-between"
        style={{ background: 'linear-gradient(90deg, #2b2b2b, #1f1f1f)' }}
      >
        <div>Free Shipping on Orders Above ₹499</div>
        <div className="flex gap-1.5 items-center font-medium opacity-90">
          <a href="https://www.karam.in" target="_blank" rel="noreferrer" className="hover:text-[#E31E24] transition-colors">
            Corporate Website: www.karam.in
          </a>
          <span className="text-neutral-600">|</span>
          <a href="#track" className="hover:text-[#E31E24] transition-colors">Track Order</a>
          <span className="text-neutral-600">|</span>
          <a href="#ppe" className="hover:text-[#E31E24] transition-colors">PPE</a>
        </div>
      </div>

      {/* Main Header (Height: 128px) */}
      <div className="h-[128px] bg-black text-white flex items-center px-6 sm:px-12 border-b border-neutral-900">
        <div className="w-full flex items-center justify-between">
          
          {/* Left: Logo Section (Width: 280px, Aligned Left) */}
          <div className="w-[280px] flex items-center justify-start shrink-0">
            <Link to="/" className="text-[28px] font-black tracking-tight text-white leading-none">
              KARAM <span className="text-[#E31E24]">PPE</span>
            </Link>
          </div>

          {/* Center: Search Bar (Width: 650px) */}
          <div className="flex-grow max-w-[650px] mx-4 shrink-0">
            <SearchBar />
          </div>

          {/* Right: Icons (Gap: 30px, Size: 26px, Hover Red) */}
          <div className="flex items-center gap-[30px] justify-end shrink-0">
            {/* User */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-white hover:text-[#E31E24] cursor-pointer transition-colors duration-200 focus:outline-none"
              aria-label="Account"
            >
              <User className="w-[26px] h-[26px]" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-white hover:text-[#E31E24] transition-colors duration-200"
              aria-label="Wishlist"
            >
              <Heart className="w-[26px] h-[26px]" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-[#E31E24] cursor-pointer transition-colors duration-200 relative focus:outline-none"
              aria-label="Cart"
            >
              <ShoppingCart className="w-[26px] h-[26px]" />
              {cartCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#E31E24] text-white text-[9px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center border border-black animate-scale-in">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>
      
    </header>
  );
}

export default Header;
