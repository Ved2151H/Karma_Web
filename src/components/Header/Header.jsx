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
    <header className="w-full font-sans select-none bg-black border-b border-neutral-900">
      {/* Top Strip (Height: 18px) */}
      <div 
        className="h-[18px] text-white text-[12px] flex items-center justify-between font-sans leading-none"
        style={{ background: 'linear-gradient(90deg, #2b2b2b, #1f1f1f)', padding: '0 48px' }}
      >
        <div>Free Shipping on Orders Above ₹499</div>
        <div className="flex gap-3 items-center font-medium opacity-90">
          <a href="https://www.karam.in" target="_blank" rel="noreferrer" className="hover:text-[#E31E24] transition-colors">
            Corporate Website: www.karam.in
          </a>
          <span className="text-neutral-600">|</span>
          <a href="#track" className="hover:text-[#E31E24] transition-colors">Track Order</a>
          <span className="text-neutral-600">|</span>
          <a href="#ppe" className="hover:text-[#E31E24] transition-colors">PPE</a>
        </div>
      </div>

      {/* Main Header (Height: 88px) */}
      <div className="h-[88px] bg-black text-white flex items-center" style={{ padding: '0 48px' }}>
        <div className="w-full flex items-center">
          
          {/* Left Section (Width: 20%) */}
          <div className="w-1/5 flex items-center justify-center shrink-0">
            <Link to="/" className="text-[24px] font-black tracking-tight text-white leading-none h-[60px] flex items-center">
              KARAM <span className="text-[#E31E24] ml-1">PPE</span>
            </Link>
          </div>

          {/* Center Section (Width: 60%) */}
          <div className="w-3/5 flex items-center justify-center shrink-0">
            <SearchBar />
          </div>

          {/* Right Section (Width: 20%) */}
          <div className="w-1/5 flex items-center justify-center gap-[30px] shrink-0">
            {/* User */}
            <button
              onClick={() => setIsLoginOpen(true)}
              className="text-white hover:text-[#E31E24] cursor-pointer transition-colors duration-200 focus:outline-none flex items-center justify-center"
              aria-label="Account"
            >
              <User className="w-[26px] h-[26px]" />
            </button>

            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="text-white hover:text-[#E31E24] transition-colors duration-200 flex items-center justify-center"
              aria-label="Wishlist"
            >
              <Heart className="w-[26px] h-[26px]" />
            </Link>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="text-white hover:text-[#E31E24] cursor-pointer transition-colors duration-200 relative focus:outline-none flex items-center justify-center"
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
