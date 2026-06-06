import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard/ProductCard';

export function SearchResults() {
  const location = useLocation();
  const { searchProducts, loading } = useProducts();

  // Extract query from search string
  const query = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('q') || '';
  }, [location.search]);

  // Filter products using hook searchProducts function
  const filteredProducts = useMemo(() => {
    return searchProducts(query);
  }, [query, searchProducts]);

  if (loading) {
    return (
      <div className="w-full bg-white min-h-screen flex items-center justify-center font-sans">
        <p className="text-neutral-500 text-sm font-medium">Loading search results...</p>
      </div>
    );
  }

  return (
    <div className="w-full bg-white min-h-screen font-sans select-none">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16 py-12">
        <h1 className="text-2xl font-black uppercase tracking-wider text-neutral-800 mb-2">
          Search Results
        </h1>
        <p className="text-neutral-500 text-xs sm:text-sm font-semibold mb-8">
          Showing results for "{query}" — {filteredProducts.length} items found
        </p>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-neutral-50 rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 text-sm font-medium">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
