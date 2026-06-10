import { useState, useEffect, useMemo, useContext } from 'react';
import { ProductContext } from '../context/ProductContext';

export function useProducts(category, subcategory, subsection) {
  const context = useContext(ProductContext);
  
  // Return dummy object if used outside ProductProvider to prevent early crashes
  const {
    products: contextProducts = [],
    loading = false,
    addProduct = () => {},
    updateProduct = () => {},
    deleteProduct = () => {},
  } = context || {};

  // Filtering checkbox states (for CategoryPage)
  const [subcategories, setSubcategories] = useState([]);
  const [subsections, setSubsections] = useState([]);
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
    subsections,
    brands,
    industries,
    origins,
    priceMax,
    resistances,
    materials,
    lenses,
    snrs,
    reusables
  }), [subcategories, subsections, brands, industries, origins, priceMax, resistances, materials, lenses, snrs, reusables]);

  // Reset filters when route category shifts
  useEffect(() => {
    setSubcategories([]);
    setSubsections([]);
    setBrands([]);
    setIndustries([]);
    setOrigins([]);
    setPriceMax(6000);
    setResistances([]);
    setMaterials([]);
    setLenses([]);
    setSnrs([]);
    setReusables([]);
  }, [category, subcategory, subsection]);

  // Expose business logic helper functions:
  const getProductById = (id) => {
    return contextProducts.find((p) => p.id === id);
  };

  const getProductsByCategory = (cat) => {
    return contextProducts.filter((p) => p.category === cat);
  };

  const getFeaturedProducts = () => {
    return contextProducts.slice(0, 8);
  };

  const getNewArrivals = () => {
    return [...contextProducts].sort((a, b) => {
      const dateA = new Date(a.dateAdded || a.createdAt || 0);
      const dateB = new Date(b.dateAdded || b.createdAt || 0);
      return dateB - dateA;
    });
  };

  const searchProducts = (query) => {
    if (!query) return contextProducts;
    const cleanQuery = query.toLowerCase();
    return contextProducts.filter(
      (p) =>
        (p.title && p.title.toLowerCase().includes(cleanQuery)) ||
        (p.category && p.category.toLowerCase().includes(cleanQuery)) ||
        (p.brand && p.brand.toLowerCase().includes(cleanQuery))
    );
  };

  // Pure filtering business logic function
  const filterProducts = (productsList, cat, select) => {
    if (!productsList) return [];
    
    // 1. Filter by category first if it is specified
    let list = cat ? productsList.filter(p => p.category === cat) : productsList;

    const {
      subcategories = [],
      subsections = [],
      brands = [],
      industries = [],
      origins = [],
      priceMax = 6000,
      resistances = [],
      materials = [],
      lenses = [],
      snrs = [],
      reusables = []
    } = select || {};

    // 2. Subcategory (using exact matching on subcategory field, not parsing titles)
    if (subcategories.length > 0) {
      list = list.filter(p => subcategories.includes(p.subcategory));
    }

    // 2b. Subsection
    if (subsections.length > 0) {
      list = list.filter(p => subsections.includes(p.subsection));
    }

    // 3. Brand
    if (brands.length > 0) {
      list = list.filter(p => brands.includes(p.brand));
    }

    // 4. Industry
    if (industries.length > 0) {
      list = list.filter(p => industries.includes(p.industry));
    }

    // 5. Origin
    if (origins.length > 0 && (cat === 'hand' || cat === 'eye' || cat === 'hearing')) {
      list = list.filter(p => origins.includes(p.countryOfOrigin));
    }

    // 6. Price
    list = list.filter(p => p.price <= priceMax);

    // 7. Hand Specific: Resistance
    if (cat === 'hand' && resistances.length > 0) {
      list = list.filter(p => resistances.includes(p.resistanceType));
    }

    // 8. Face Specific: Material
    if (cat === 'face' && materials.length > 0) {
      list = list.filter(p => materials.includes(p.material));
    }

    // 9. Eye Specific: Lens Type
    if (cat === 'eye' && lenses.length > 0) {
      list = list.filter(p => lenses.includes(p.lensType));
    }

    // 10. Hearing Specific: SNR Rating
    if (cat === 'hearing' && snrs.length > 0) {
      list = list.filter(p => snrs.includes(p.snrDnr));
    }

    // 11. Hearing Specific: Reusable
    if (cat === 'hearing' && reusables.length > 0) {
      list = list.filter(p => reusables.includes(p.reusable));
    }

    return list;
  };

  // Pure sorting business logic function
  const sortProducts = (productsList, sortType) => {
    if (!productsList) return [];
    const list = [...productsList];

    switch (sortType) {
      case 'price-low':
        return list.sort((a, b) => a.price - b.price);
      case 'price-high':
        return list.sort((a, b) => b.price - a.price);
      case 'newest':
        return list.sort((a, b) => new Date(b.dateAdded || b.createdAt || 0) - new Date(a.dateAdded || a.createdAt || 0));
      case 'relevant':
      default:
        return list;
    }
  };

  // Compute filtered & sorted list if category is provided, else return all contextProducts
  const processedProducts = useMemo(() => {
    if (!category) {
      return contextProducts;
    }
    // Filter first by category and hook-level subcategory if provided
    let list = contextProducts;
    if (category) {
      list = list.filter(p => p.category === category);
    }
    if (subcategory) {
      list = list.filter(p => p.subcategory === subcategory);
    }
    if (subsection) {
      list = list.filter(p => p.subsection === subsection);
    }
    const filtered = filterProducts(list, category, selections);
    return sortProducts(filtered, sort);
  }, [contextProducts, category, subcategory, subsection, selections, sort]);

  return {
    products: processedProducts,
    loading,
    sort,
    setSort,
    selections,
    priceMax,
    setPriceMax,
    addProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    getProductsByCategory,
    getFeaturedProducts,
    getNewArrivals,
    searchProducts,
    filterProducts,
    sortProducts,
    toggleSubcategory: (val) => setSubcategories((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleSubsection: (val) => setSubsections((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleBrand: (val) => setBrands((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleIndustry: (val) => setIndustries((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleOrigin: (val) => setOrigins((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleResistance: (val) => setResistances((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleMaterial: (val) => setMaterials((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleLens: (val) => setLenses((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleSNR: (val) => setSnrs((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
    toggleReusable: (val) => setReusables((prev) => prev.includes(val) ? prev.filter((i) => i !== val) : [...prev, val]),
  };
}

export default useProducts;
