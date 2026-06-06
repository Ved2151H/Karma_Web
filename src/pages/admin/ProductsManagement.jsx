import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductContext } from '../../context/ProductContext';
import { Plus, Edit3, Trash2, Search, X, Loader, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { CATEGORY_SUBCATEGORIES } from '../../constants/categories';

function ProductsManagement() {
  const { products, addProduct, updateProduct, deleteProduct, loading } = useProductContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState('hand');
  const [formSubcategory, setFormSubcategory] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formStock, setFormStock] = useState('');
  const [formImage, setFormImage] = useState('');

  // Helper to change category and auto-select its first subcategory
  const handleCategoryChange = (catVal) => {
    setFormCategory(catVal);
    setFormSubcategory(CATEGORY_SUBCATEGORIES[catVal]?.[0]?.value || '');
  };

  // Delete product action
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      deleteProduct(id);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setFormName('');
    setFormCategory('hand');
    setFormSubcategory(CATEGORY_SUBCATEGORIES['hand']?.[0]?.value || '');
    setFormPrice('');
    setFormStock('');
    setFormImage('https://images.unsplash.com/photo-1590786275628-309e52d713be?q=80&w=600');
    setIsAddOpen(true);
  };

  // Handle add submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formPrice || formStock === '') return;

    const newProduct = {
      id: `${formCategory}-${Date.now()}`,
      title: formName,
      category: formCategory,
      subcategory: formSubcategory,
      price: Number(formPrice),
      stock: Number(formStock),
      image: formImage || 'https://images.unsplash.com/photo-1590786275628-309e52d713be?q=80&w=600',
      brand: 'KARAM',
      rating: 4.5,
      dateAdded: new Date().toISOString().split('T')[0]
    };

    addProduct(newProduct);
    setIsAddOpen(false);
  };

  // Open edit modal
  const openEditModal = (product) => {
    setCurrentProduct(product);
    setFormName(product.title);
    setFormCategory(product.category);
    setFormSubcategory(product.subcategory || CATEGORY_SUBCATEGORIES[product.category]?.[0]?.value || '');
    setFormPrice(product.price.toString());
    setFormStock(product.stock.toString());
    setFormImage(product.image);
    setIsEditOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formName || !formPrice || formStock === '') return;

    updateProduct(currentProduct.id, {
      title: formName,
      category: formCategory,
      subcategory: formSubcategory,
      price: Number(formPrice),
      stock: Number(formStock),
      image: formImage
    });
    setIsEditOpen(false);
  };

  // Filter products
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="font-sans space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">Products Catalog</h1>
          <p className="text-gray-400 text-xs mt-1">Configure stock thresholds, prices, categories, and item layouts.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-lg hover:shadow-brand-red/10 transition-all duration-200 cursor-pointer flex items-center gap-2 self-start active:scale-[0.98]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Product</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center justify-between shadow-md">
        
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search products by title or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
          />
        </div>

        {/* Category Selector */}
        <div className="flex items-center gap-2.5 w-full md:w-auto shrink-0 select-none">
          <SlidersHorizontal className="w-4 h-4 text-gray-500" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category:</span>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-[#1f2937]/50 border border-gray-800 text-xs text-white px-3 py-2 rounded-xl focus:outline-none focus:border-brand-red cursor-pointer"
          >
            <option value="all">All Categories</option>
            <option value="hand">Hand Protection</option>
            <option value="face">Face Protection</option>
            <option value="eye">Eye Protection</option>
            <option value="hearing">Hearing Protection</option>
            <option value="foot">Foot Protection</option>
            <option value="head">Head Protection</option>
            <option value="fall-protection">Fall Protection</option>
            <option value="respiratory">Respiratory Protection</option>
            <option value="workwear">Workwear</option>
            <option value="gas-detector">Gas Detectors</option>
          </select>
        </div>
      </div>

      {/* Catalog Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-400 select-none">
            <thead className="bg-[#1f2937]/50 text-gray-300 uppercase font-bold text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-4 py-3.5">Image</th>
                <th className="px-4 py-3.5">Name</th>
                <th className="px-4 py-3.5">Category</th>
                <th className="px-4 py-3.5">Price</th>
                <th className="px-4 py-3.5">Stock</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-350">
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500 font-medium animate-pulse">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-brand-red" />
                      <span>Loading products catalog...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-12 text-gray-500 font-medium">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((prod) => {
                  const isOutOfStock = prod.stock === 0;
                  const statusText = isOutOfStock ? 'Out of Stock' : 'Active';
                  const statusClass = isOutOfStock 
                    ? 'bg-red-950/40 text-red-400 border border-red-500/20' 
                    : 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20';

                  return (
                    <tr key={prod.id} className="hover:bg-gray-850/20 transition-colors">
                      {/* Image */}
                      <td className="px-4 py-3.5 shrink-0">
                        {prod.image ? (
                          <img
                            src={prod.image}
                            alt={prod.title}
                            className="w-10 h-10 object-cover rounded-lg border border-gray-800 bg-gray-900"
                            onError={(e) => { e.target.src = 'placeholder'; }}
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-850 border border-gray-850 flex items-center justify-center text-gray-650">
                            <ImageIcon className="w-4 h-4" />
                          </div>
                        )}
                      </td>
                      
                      {/* Name & ID */}
                      <td className="px-4 py-3.5 max-w-xs md:max-w-sm">
                        <div className="font-semibold text-white truncate">{prod.title}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">{prod.id}</div>
                      </td>

                      {/* Category */}
                      <td className="px-4 py-3.5 capitalize font-medium text-gray-400">
                        {prod.category.replace('-', ' ')}
                      </td>

                      {/* Price */}
                      <td className="px-4 py-3.5 font-bold text-white">
                        ₹{prod.price.toLocaleString()}
                      </td>

                      {/* Stock */}
                      <td className="px-4 py-3.5 font-mono text-gray-300">
                        {prod.stock} items
                      </td>

                      {/* Status */}
                      <td className="px-4 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusClass}`}>
                          {statusText}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditModal(prod)}
                            className="p-2 bg-gray-800 text-gray-350 hover:bg-gray-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                            aria-label="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prod.id)}
                            className="p-2 bg-red-950/20 text-brand-red hover:bg-brand-red hover:text-white rounded-lg transition-colors cursor-pointer"
                            aria-label="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Product Modal Overlay */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden font-sans">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center select-none">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Add New Safety Product</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. KARAM HS91 Anti-Vibration TPR Impact Gloves"
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937] cursor-pointer"
                  >
                    <option value="face">Face Protection</option>
                    <option value="foot">Foot Protection</option>
                    <option value="eye">Eye Protection</option>
                    <option value="hand">Hand Protection</option>
                    <option value="head">Head Protection</option>
                    <option value="hearing">Hearing Protection</option>
                    <option value="fall-protection">Fall Protection</option>
                    <option value="respiratory">Respiratory Protection</option>
                    <option value="workwear">Workwear</option>
                    <option value="gas-detector">Gas Detector</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subcategory</label>
                  <select
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937] cursor-pointer"
                  >
                    {CATEGORY_SUBCATEGORIES[formCategory]?.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Price (INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    placeholder="e.g. 850"
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Initial Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    placeholder="e.g. 50"
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  placeholder="https://unsplash.com/..."
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                />
              </div>

              <div className="pt-4 border-t border-gray-800/80 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2.5 bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-brand-red/10 transition-colors cursor-pointer"
                >
                  ADD PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Product Modal Overlay */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-lg shadow-2xl relative z-10 overflow-hidden font-sans">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center select-none">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Edit Product Details</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Product Title</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => handleCategoryChange(e.target.value)}
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937] cursor-pointer"
                  >
                    <option value="face">Face Protection</option>
                    <option value="foot">Foot Protection</option>
                    <option value="eye">Eye Protection</option>
                    <option value="hand">Hand Protection</option>
                    <option value="head">Head Protection</option>
                    <option value="hearing">Hearing Protection</option>
                    <option value="fall-protection">Fall Protection</option>
                    <option value="respiratory">Respiratory Protection</option>
                    <option value="workwear">Workwear</option>
                    <option value="gas-detector">Gas Detector</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subcategory</label>
                  <select
                    value={formSubcategory}
                    onChange={(e) => setFormSubcategory(e.target.value)}
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937] cursor-pointer"
                  >
                    {CATEGORY_SUBCATEGORIES[formCategory]?.map((sub) => (
                      <option key={sub.value} value={sub.value}>
                        {sub.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Price (INR)</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Current Stock</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                    className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Image URL</label>
                <input
                  type="text"
                  value={formImage}
                  onChange={(e) => setFormImage(e.target.value)}
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                />
              </div>

              <div className="pt-4 border-t border-gray-800/80 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2.5 bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-brand-red/10 transition-colors cursor-pointer"
                >
                  UPDATE PRODUCT
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductsManagement;
