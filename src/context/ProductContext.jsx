import React, { createContext, useState, useEffect, useContext } from 'react';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load products from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('karam_products');
      if (stored) {
        setProducts(JSON.parse(stored));
      } else {
        setProducts([]);
      }
    } catch (e) {
      console.error('Failed to load products from localStorage:', e);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  // Add Product: Appends to context state & saves to localStorage
  const addProduct = (product) => {
    setProducts((prev) => {
      const updated = [product, ...prev];
      localStorage.setItem('karam_products', JSON.stringify(updated));
      return updated;
    });
  };

  // Update Product: Updates matching product by ID in context state & localStorage
  const updateProduct = (id, data) => {
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...data } : p));
      localStorage.setItem('karam_products', JSON.stringify(updated));
      return updated;
    });
  };

  // Delete Product: Filters out matching product by ID in context state & localStorage
  const deleteProduct = (id) => {
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem('karam_products', JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        setProducts,
        loading,
        addProduct,
        updateProduct,
        deleteProduct,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
}

export function useProductContext() {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
}

export default ProductContext;
