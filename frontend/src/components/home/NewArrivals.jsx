import React from 'react';
import { useProducts } from '../../hooks/useProducts';
import ProductCard from '../ProductCard/ProductCard';

export function NewArrivals() {
  const { getNewArrivals, loading } = useProducts();
  
  // Show up to 8 of the newest products to keep home page layout clean
  const arrivals = getNewArrivals().slice(0, 8);

  if (loading) {
    return (
      <div className="py-12 text-center text-neutral-500 text-sm font-medium">
        Loading new arrivals...
      </div>
    );
  }

  return (
    <section className="py-16 bg-neutral-50 font-sans select-none border-t border-neutral-100 border-b border-neutral-100">
      <div className="max-w-[1600px] mx-auto px-6 sm:px-10 lg:px-16">
        <div className="flex flex-col mb-10">
          <span className="text-xs font-bold uppercase tracking-widest text-[#E31E24] mb-2">Fresh In Stock</span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-neutral-900">
            New Arrivals
          </h2>
        </div>

        {arrivals.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-neutral-200">
            <p className="text-neutral-500 text-sm font-medium">No products available.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8">
            {arrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

export default NewArrivals;
