import { useState, useEffect, useMemo } from 'react';
import { PRODUCTS as mockProducts } from '../data/mockProducts';
import { productApi } from '../api/productApi';
import { filterProducts } from '../utils/filterProducts';
import { sortProducts } from '../utils/sortProducts';

/**
 * Custom hook managing the filters, sorting, and processed products list.
 * Supports API queries with automatic fallback to mockProducts.
 * 
 * @param {string} category Category parameter (hand, face, eye, hearing)
 */
export function useProducts(category) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Filtering checkbox states
  const [subcategories, setSubcategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [industries, setIndustries] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [priceMax, setPriceMax] = useState(6000);
  const [resistances, setResistances] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [lenses, setLenses] = useState([]);
  const [snrs, setSnrs] = useState([]);
  const [reusables, setReusables] = useState([]);
  const [sort, setSort] = useState('relevant');

  const selections = useMemo(() => ({
    subcategories,
    brands,
    industries,
    origins,
    priceMax,
    resistances,
    materials,
    lenses,
    snrs,
    reusables
  }), [subcategories, brands, industries, origins, priceMax, resistances, materials, lenses, snrs, reusables]);

  // Reset filters when route category shifts
  useEffect(() => {
    setSubcategories([]);
    setBrands([]);
    setIndustries([]);
    setOrigins([]);
    setPriceMax(6000);
    setResistances([]);
    setMaterials([]);
    setLenses([]);
    setSnrs([]);
    setReusables([]);
  }, [category]);

  // Load products list from backend API
  const getProducts = async (params) => {
    setLoading(true);
    setError(null);
    try {
      const apiResponse = await productApi.getAll(params);
      // Verify response structure
      if (Array.isArray(apiResponse)) {
        setProducts(apiResponse);
      } else if (apiResponse && Array.isArray(apiResponse.data)) {
        setProducts(apiResponse.data);
      } else {
        setProducts([]);
      }
    } catch (err) {
      console.warn('Backend API connection offline. Returning empty product list.', err.message);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const getProductById = async (id) => {
    try {
      return await productApi.getById(id);
    } catch (err) {
      console.warn(`Failed to fetch product details for ${id}.`);
      return null;
    }
  };

  const createProduct = async (data) => {
    try {
      return await productApi.create(data);
    } catch (err) {
      console.warn('Creating product offline...');
      return data;
    }
  };

  const updateProduct = async (id, data) => {
    try {
      return await productApi.update(id, data);
    } catch (err) {
      console.warn('Updating product offline...');
      return data;
    }
  };

  const deleteProduct = async (id) => {
    try {
      return await productApi.delete(id);
    } catch (err) {
      console.warn('Deleting product offline...');
      return id;
    }
  };

  useEffect(() => {
    getProducts();
  }, []);

  const toggleVal = (state, setState, val) => {
    if (state.includes(val)) {
      setState(state.filter((item) => item !== val));
    } else {
      setState([...state, val]);
    }
  };

  // computed filtered and sorted products list
  const processedProducts = useMemo(() => {
    const filtered = filterProducts(products, category, selections);
    return sortProducts(filtered, sort);
  }, [products, category, selections, sort]);

  return {
    products: processedProducts,
    loading,
    error,
    sort,
    setSort,
    selections,
    priceMax,
    setPriceMax,
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    toggleSubcategory: (val) => toggleVal(subcategories, setSubcategories, val),
    toggleBrand: (val) => toggleVal(brands, setBrands, val),
    toggleIndustry: (val) => toggleVal(industries, setIndustries, val),
    toggleOrigin: (val) => toggleVal(origins, setOrigins, val),
    toggleResistance: (val) => toggleVal(resistances, setResistances, val),
    toggleMaterial: (val) => toggleVal(materials, setMaterials, val),
    toggleLens: (val) => toggleVal(lenses, setLenses, val),
    toggleSNR: (val) => toggleVal(snrs, setSnrs, val),
    toggleReusable: (val) => toggleVal(reusables, setReusables, val)
  };
}

export default useProducts;
