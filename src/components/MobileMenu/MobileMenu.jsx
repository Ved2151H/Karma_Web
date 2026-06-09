import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, LogIn } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useCategories } from '../../hooks/useCategories';
import SearchBar from '../SearchBar/SearchBar';

function MobileMenu({ isOpen, onClose }) {
  const location = useLocation();
  const { categories } = useCategories();

  // Show only active categories
  const activeCategories = categories.filter(c => c.status === 'Active');

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-50 pointer-events-auto"
          />

          {/* Left slide drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.25 }}
            className="fixed top-0 left-0 bottom-0 w-[300px] bg-white z-50 shadow-2xl flex flex-col p-6 overflow-y-auto"
          >
            {/* Header section inside Mobile Menu */}
            <div className="flex items-center justify-between mb-6">
              <span className="text-xl font-bold font-display tracking-tight text-[#161616]">
                KARAM <span className="text-brand-red">PPE</span>
              </span>
              <button
                onClick={onClose}
                className="p-1.5 text-gray-500 hover:text-brand-red rounded-full hover:bg-gray-100 transition-all cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="mb-6">
              <SearchBar />
            </div>

            {/* Navigation links */}
            <div className="flex flex-col gap-1 flex-1">
              {activeCategories.map((link) => {
                const categoryPath = `/category/${link.id}`;
                const isActive = location.pathname === categoryPath;
                return (
                  <Link
                    key={link.id}
                    to={categoryPath}
                    onClick={onClose}
                    className={`px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-brand-red text-white'
                        : 'text-gray-700 hover:bg-gray-50 hover:text-brand-red'
                    }`}
                  >
                    {link.label || link.name}
                  </Link>
                );
              })}
            </div>

            {/* Login Button at bottom */}
            <div className="mt-auto pt-6 border-t border-brand-border">
              <button
                onClick={() => {
                  onClose();
                  // Login Modal toggle will be integrated later
                }}
                className="w-full flex items-center justify-center gap-2 bg-brand-red text-white py-2.5 rounded-full text-sm font-medium hover:bg-red-700 transition-colors shadow-md cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                Login / Sign Up
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default MobileMenu;
