import React from 'react';
import { motion } from 'framer-motion';
import ProductCard from '../ProductCard/ProductCard';

function ProductGrid({ products = [], currentSort = 'relevant', onSortChange }) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div className="w-full font-sans">
      {/* Top Grid Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-6 mb-8 border-b border-brand-border select-none">
        <div className="text-neutral-500 text-xs sm:text-sm font-medium">
          Showing <span className="text-neutral-800 font-bold">{products.length}</span> safety products
        </div>

        {/* Sorting Dropdown */}
        <div className="flex items-center gap-2">
          <label htmlFor="sort-by" className="text-neutral-500 text-xs font-semibold uppercase tracking-wider">
            Sort By:
          </label>
          <select
            id="sort-by"
            value={currentSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="bg-[#f4f4f4] border border-transparent text-xs sm:text-sm text-neutral-800 font-semibold px-4 py-2 rounded-lg focus:bg-white focus:outline-none focus:border-brand-red cursor-pointer transition-all duration-200"
          >
            <option value="relevant">Relevant</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="newest">Newest</option>
          </select>
        </div>
      </div>

      {/* Grid Container */}
      {products.length === 0 ? (
        <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
          <p className="text-neutral-500 text-sm font-medium">No safety products found.</p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-center"
        >
          {products.map((product) => (
            <motion.div key={product.id} variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}

export default ProductGrid;
