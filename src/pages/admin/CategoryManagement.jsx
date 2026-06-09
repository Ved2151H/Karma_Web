import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit3, Trash2, Search, X, FolderKanban, Loader } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';
import { useProductContext } from '../../context/ProductContext';

function CategoryManagement() {
  const { categories, createCategory, updateCategory, deleteCategory, loading } = useCategories();
  const { products } = useProductContext();

  const [searchTerm, setSearchTerm] = useState('');
  
  // Modals state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState('Active');

  const getProductCount = (categorySlug) => {
    return products.filter(p => p.category === categorySlug).length;
  };

  // Delete category
  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this category? All associated products will remain, but their category mappings might be affected.')) {
      deleteCategory(id);
    }
  };

  // Open add modal
  const openAddModal = () => {
    setFormName('');
    setFormStatus('Active');
    setIsAddOpen(true);
  };

  // Handle add submit
  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    // Generate a clean slug from name to be used as ID
    const generatedSlug = formName
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newCategory = {
      id: generatedSlug,
      name: formName.trim(),
      label: formName.trim().replace(/\s+Protection$/i, ''),
      status: formStatus
    };

    createCategory(newCategory);
    setIsAddOpen(false);
  };

  // Open edit modal
  const openEditModal = (cat) => {
    setCurrentCategory(cat);
    setFormName(cat.name);
    setFormStatus(cat.status);
    setIsEditOpen(true);
  };

  // Handle edit submit
  const handleEditSubmit = (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    updateCategory(currentCategory.id, {
      name: formName.trim(),
      label: formName.trim().replace(/\s+Protection$/i, ''),
      status: formStatus
    });
    setIsEditOpen(false);
  };

  // Filter categories
  const filteredCategories = categories.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 select-none">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wider text-white">Categories Configuration</h1>
          <p className="text-gray-400 text-xs mt-1">Manage safety equipment classifications and product counts.</p>
        </div>
        <button
          onClick={openAddModal}
          className="bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider px-5 py-3.5 rounded-xl shadow-lg hover:shadow-brand-red/10 transition-all duration-200 cursor-pointer flex items-center gap-2 self-start active:scale-[0.98]"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Category</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-4 shadow-md">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
          />
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-gray-400 select-none">
            <thead className="bg-[#1f2937]/50 text-gray-300 uppercase font-bold text-[10px] tracking-wider border-b border-gray-800">
              <tr>
                <th className="px-4 py-3.5">Category Name</th>
                <th className="px-4 py-3.5">Products Count</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/80 text-gray-350">
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500 font-medium animate-pulse">
                    <div className="flex items-center justify-center gap-2">
                      <Loader className="w-5 h-5 animate-spin text-brand-red" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-12 text-gray-500 font-medium">
                    No categories found.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => {
                  const isActive = cat.status === 'Active';
                  const statusClass = isActive 
                    ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-500/20' 
                    : 'bg-gray-800 text-gray-455 border border-gray-700/30';

                  return (
                    <tr key={cat.id} className="hover:bg-gray-850/20 transition-colors">
                      {/* Name & ID */}
                      <td className="px-4 py-4">
                        <div className="font-semibold text-white">{cat.name}</div>
                        <div className="text-[10px] font-mono text-gray-500 mt-0.5">{cat.id}</div>
                      </td>

                      {/* Products Count */}
                      <td className="px-4 py-4 font-mono font-semibold text-gray-300">
                        {getProductCount(cat.id)} items
                      </td>

                      {/* Status */}
                      <td className="px-4 py-4">
                        <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusClass}`}>
                          {cat.status}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-4 py-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            onClick={() => openEditModal(cat)}
                            className="p-2 bg-gray-800 text-gray-350 hover:bg-gray-700 hover:text-white rounded-lg transition-colors cursor-pointer"
                            aria-label="Edit"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(cat.id)}
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

      {/* Add Category Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsAddOpen(false)} />
          
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden font-sans">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center select-none">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Add New Category</h3>
              <button onClick={() => setIsAddOpen(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Welding Shields"
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  ADD CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {isEditOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsEditOpen(false)} />
          
          <div className="bg-[#111827] border border-gray-800 rounded-2xl w-full max-w-md shadow-2xl relative z-10 overflow-hidden font-sans">
            <div className="p-6 border-b border-gray-800 flex justify-between items-center select-none">
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-white">Edit Category Details</h3>
              <button onClick={() => setIsEditOpen(false)} className="text-gray-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Category Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Status</label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value)}
                  className="w-full px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white focus:outline-none focus:border-brand-red focus:bg-[#1f2937] cursor-pointer"
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
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
                  UPDATE CATEGORY
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default CategoryManagement;
