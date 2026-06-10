import React, { createContext, useState, useEffect, useContext } from 'react';
import { productApi } from '../api/productApi';

export const ProductContext = createContext();

export function ProductProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await productApi.getAll();
      setProducts(Array.isArray(response) ? response : []);
    } catch (error) {
      console.warn('Failed to load products from API.', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const addProduct = async (product) => {
    const created = await productApi.create(product);
    await loadProducts(); // Reload fresh from DB
    return created;
  };

  const updateProduct = async (id, data) => {
    const updated = await productApi.update(id, data);
    await loadProducts(); // Reload fresh from DB
    return updated;
  };

  const deleteProduct = async (id) => {
    try {
      await productApi.delete(id);
      // Reload fresh list from DB to guarantee sync
      await loadProducts();
      return { success: true };
    } catch (error) {
      // If product is already gone (404), still refresh from DB
      if (error?.response?.status === 404) {
        await loadProducts();
        return { success: true };
      }
      console.error('Delete product failed:', error?.response?.data || error.message);
      throw error;
    }
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
        reloadProducts: loadProducts,
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
