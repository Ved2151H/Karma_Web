import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Filter } from 'lucide-react';
import useProducts from '../hooks/useProducts';
import Filters from '../components/Filters/Filters';
import ProductGrid from '../components/ProductGrid/ProductGrid';
import { useCategories } from '../hooks/useCategories';

function CategoryPage() {
  const { category, subcategory } = useParams();
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState(false);
  const { categories } = useCategories();

  // Find the category display name dynamically
  const currentCategoryObj = categories.find(c => c.id === category);
  const categoryTitle = currentCategoryObj 
    ? currentCategoryObj.name 
    : (category ? category.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ') : 'Safety Products');

  // Mount the custom hook to handle all filter state and sorting computation
  const {
    products,
    sort,
    setSort,
    selections,
    priceMax,
    setPriceMax,
    toggleSubcategory,
    toggleBrand,
    toggleIndustry,
    toggleOrigin,
    toggleResistance,
    toggleMaterial,
    toggleLens,
    toggleSNR,
    toggleReusable
  } = useProducts(category, subcategory);

  return (
    <div className="w-full bg-white min-h-screen font-sans">
      {/* Dynamic Category Banner */}
      <div className="w-full bg-[#1B1B1B] text-white py-12 px-5 select-none border-b border-neutral-900 shadow-inner">
        <div className="max-w-[1320px] mx-auto">
          <div className="text-[10px] uppercase font-bold text-brand-red tracking-widest mb-1.5">
            KARAM Safety Equipment
          </div>
          <h1 className="text-3xl font-black uppercase tracking-wider font-display">
            {categoryTitle}
          </h1>
          <p className="text-neutral-400 text-xs sm:text-sm mt-2 font-medium max-w-2xl leading-relaxed">
            Professional-grade {categoryTitle.toLowerCase()} solutions engineered to provide maximum security, comfort, and durability in hazardous industrial work environments.
          </p>
        </div>
      </div>

      {/* Category split layout starts immediately below the banner */}
      <div className="max-w-[1320px] mx-auto px-5 py-8 flex flex-col md:flex-row gap-[32px] items-start w-full">
        
        {/* Desktop Sidebar Filters (280px Width, Hidden on Mobile/Tablet) */}
        <aside className="hidden md:block w-[280px] shrink-0 bg-white border border-neutral-200 rounded-xl p-6 h-fit sticky top-[160px] max-h-[calc(100vh-200px)] overflow-y-auto scrollbar-none shadow-xs">
          <div className="flex items-center gap-2 pb-4 mb-4 border-b border-neutral-200 select-none">
            <Filter className="w-4 h-4 text-neutral-800" />
            <h3 className="font-display text-xs font-extrabold uppercase tracking-widest text-neutral-800">
              Filters
            </h3>
          </div>
          
          <Filters
            category={category}
            selections={selections}
            priceMax={priceMax}
            setPriceMax={setPriceMax}
            toggleSubcategory={toggleSubcategory}
            toggleBrand={toggleBrand}
            toggleIndustry={toggleIndustry}
            toggleOrigin={toggleOrigin}
            toggleResistance={toggleResistance}
            toggleMaterial={toggleMaterial}
            toggleLens={toggleLens}
            toggleSNR={toggleSNR}
            toggleReusable={toggleReusable}
          />
        </aside>

        {/* Product Grid Area (Remaining width on Desktop) */}
        <div className="flex-1 w-full">
          {/* Mobile Filter Toggle Row (Visible below 768px) */}
          <div className="md:hidden flex justify-between items-center mb-6 select-none">
            <button
               onClick={() => setIsFilterDrawerOpen(true)}
               className="bg-[#1B1B1B] text-white px-4.5 py-2.5 rounded-lg text-xs font-extrabold uppercase tracking-wider flex items-center gap-2 cursor-pointer shadow-sm active:bg-neutral-800 transition-colors"
            >
              <Filter className="w-3.5 h-3.5" /> Filter Products
            </button>
            <div className="text-neutral-500 text-xs font-semibold">
              {products.length} Items Found
            </div>
          </div>

          <ProductGrid
            products={products}
            currentSort={sort}
            onSortChange={setSort}
          />
        </div>
      </div>

      {/* Mobile/Tablet Filter Drawer (AnimatePresence) */}
      <AnimatePresence>
        {isFilterDrawerOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFilterDrawerOpen(false)}
              className="fixed inset-0 bg-black z-50 pointer-events-auto"
            />

            {/* Slide up/right panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.25 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-[320px] bg-white z-50 shadow-2xl flex flex-col p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-4 mb-4 border-b border-neutral-200">
                <span className="font-display text-xs font-extrabold uppercase tracking-widest text-neutral-800 flex items-center gap-2">
                  <Filter className="w-4 h-4" /> Filters
                </span>
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="p-1.5 text-neutral-500 hover:text-brand-red rounded-full hover:bg-neutral-50 transition-colors cursor-pointer"
                  aria-label="Close filters"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto scrollbar-none pr-1">
                <Filters
                  category={category}
                  selections={selections}
                  priceMax={priceMax}
                  setPriceMax={setPriceMax}
                  toggleSubcategory={toggleSubcategory}
                  toggleBrand={toggleBrand}
                  toggleIndustry={toggleIndustry}
                  toggleOrigin={toggleOrigin}
                  toggleResistance={toggleResistance}
                  toggleMaterial={toggleMaterial}
                  toggleLens={toggleLens}
                  toggleSNR={toggleSNR}
                  toggleReusable={toggleReusable}
                />
              </div>

              <div className="pt-4 border-t border-neutral-200 mt-6">
                <button
                  onClick={() => setIsFilterDrawerOpen(false)}
                  className="w-full bg-[#1B1B1B] text-white py-3 rounded-lg text-xs font-extrabold uppercase tracking-wider cursor-pointer active:bg-neutral-850 transition-colors"
                >
                  Apply Filters
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

export default CategoryPage;
