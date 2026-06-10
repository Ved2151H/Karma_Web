import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Search, X, Loader } from 'lucide-react';
import { useCategories } from '../../hooks/useCategories';

function CategoryManagement() {
  const { categories, loading, error: loadError, createCategory, updateCategory, deleteCategory } = useCategories();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formName, setFormName] = useState('');
  const [formStatus, setFormStatus] = useState('Active');
  const [formSubcategories, setFormSubcategories] = useState([]);
  const [newSubName, setNewSubName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      setError('');
      await deleteCategory(id);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to delete category');
    }
  };

  const openAddModal = () => {
    setFormName('');
    setFormStatus('Active');
    setFormSubcategories([]);
    setNewSubName('');
    setError('');
    setIsAddOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim()) return;

    setSaving(true);
    setError('');
    try {
      await createCategory({
        name: formName.trim(),
        status: formStatus,
        subcategories: formSubcategories,
      });
      setIsAddOpen(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create category');
    } finally {
      setSaving(false);
    }
  };

  const openEditModal = (cat) => {
    setCurrentCategory(cat);
    setFormName(cat.name);
    setFormStatus(cat.status);
    setFormSubcategories(cat.subcategories || []);
    setNewSubName('');
    setError('');
    setIsEditOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!formName.trim() || !currentCategory) return;

    setSaving(true);
    setError('');
    try {
      await updateCategory(currentCategory.id, {
        name: formName.trim(),
        status: formStatus,
        subcategories: formSubcategories,
      });
      setIsEditOpen(false);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to update category');
    } finally {
      setSaving(false);
    }
  };

  const addSubcategory = () => {
    if (newSubName.trim()) {
      if (
        formSubcategories.some((sub) => sub.name.toLowerCase() === newSubName.trim().toLowerCase())
      ) {
        setError('Subcategory name must be unique');
        return;
      }
      setFormSubcategories([...formSubcategories, { name: newSubName.trim(), subsections: [] }]);
      setNewSubName('');
      setError('');
    }
  };

  const removeSubcategory = (index) => {
    setFormSubcategories(formSubcategories.filter((_, idx) => idx !== index));
  };

  const addSubsectionToSub = (subIdx, subsecName) => {
    if (!subsecName.trim()) return;
    setFormSubcategories(prev => prev.map((sub, idx) => {
      if (idx !== subIdx) return sub;
      const subsections = sub.subsections || [];
      if (subsections.some(ss => ss.name.toLowerCase() === subsecName.trim().toLowerCase())) {
        setError('Subsection name must be unique within this subcategory');
        return sub;
      }
      return {
        ...sub,
        subsections: [...subsections, { name: subsecName.trim() }]
      };
    }));
  };

  const removeSubsectionFromSub = (subIdx, ssIdx) => {
    setFormSubcategories(prev => prev.map((sub, idx) => {
      if (idx !== subIdx) return sub;
      return {
        ...sub,
        subsections: (sub.subsections || []).filter((_, sIdx) => sIdx !== ssIdx)
      };
    }));
  };

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="font-sans space-y-6">
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

      {(loadError || error) && (
        <div className="bg-red-950/40 border border-red-500/30 text-red-300 text-xs font-semibold px-4 py-3 rounded-xl">
          {error || loadError}
        </div>
      )}

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
            className="w-full pl-10 pr-4 py-2.5 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
          />
        </div>
      </div>

      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 shadow-xl">
        {loading ? (
          <div className="flex items-center justify-center gap-2 py-12 text-gray-400 text-xs">
            <Loader className="w-4 h-4 animate-spin" />
            Loading categories...
          </div>
        ) : (
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
                {filteredCategories.length === 0 ? (
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
                        <td className="px-4 py-4">
                          <div className="font-semibold text-white">{cat.name}</div>
                          <div className="text-[10px] font-mono text-gray-500 mt-0.5">{cat.slug}</div>
                          {cat.subcategories && cat.subcategories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {cat.subcategories.map((sub) => {
                                const subSecNames = (sub.subsections || []).map(ss => ss.name).join(', ');
                                return (
                                  <span key={sub.id} className="px-2 py-0.5 bg-gray-800/80 text-gray-400 rounded text-[9px] font-bold uppercase tracking-wider border border-gray-750">
                                    {sub.name}
                                    {subSecNames && <span className="text-[8px] text-gray-500 font-normal pl-1">({subSecNames})</span>}
                                  </span>
                                );
                              })}
                            </div>
                          )}
                        </td>
                        <td className="px-4 py-4 font-mono font-semibold text-gray-300">
                          {cat.count} items
                        </td>
                        <td className="px-4 py-4">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider ${statusClass}`}>
                            {cat.status}
                          </span>
                        </td>
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
        )}
      </div>

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
              
              {/* Subcategories Management */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subcategories</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="Add subcategory (e.g. Visors)"
                    className="flex-grow px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubcategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="px-4 bg-brand-red hover:bg-red-700 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    ADD
                  </button>
                </div>
                
                <div className="space-y-3 pt-2 max-h-[220px] overflow-y-auto pr-1">
                  {formSubcategories.length === 0 ? (
                    <span className="text-[10px] text-gray-500 italic">No subcategories added yet.</span>
                  ) : (
                    formSubcategories.map((sub, idx) => {
                      const subsecs = sub.subsections || [];
                      return (
                        <div key={idx} className="p-3 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{sub.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSubcategory(idx)}
                              className="text-gray-500 hover:text-red-500 transition-colors cursor-pointer p-1 rounded hover:bg-gray-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Nested Subsections */}
                          <div className="space-y-1.5 pl-2 border-l border-gray-800">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Subsections:</span>
                            <div className="flex flex-wrap gap-1">
                              {subsecs.length === 0 ? (
                                <span className="text-[9px] text-gray-650 italic">None</span>
                              ) : (
                                subsecs.map((ss, sIdx) => (
                                  <span key={sIdx} className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded text-[9px] font-medium border border-gray-750">
                                    <span>{ss.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeSubsectionFromSub(idx, sIdx)}
                                      className="text-gray-550 hover:text-red-400 cursor-pointer"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))
                              )}
                            </div>
                            
                            {/* Inline Add Subsection */}
                            <div className="flex gap-1.5 pt-1">
                              <input
                                type="text"
                                placeholder="Add sub-section..."
                                className="px-2 py-1 bg-gray-950 border border-gray-800 rounded-lg text-[10px] text-white placeholder-gray-650 focus:outline-none focus:border-brand-red w-full"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSubsectionToSub(idx, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800/80 flex justify-end gap-3">
                <button type="button" onClick={() => setIsAddOpen(false)} className="px-4 py-2.5 bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  CANCEL
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-brand-red/10 transition-colors cursor-pointer disabled:opacity-60">
                  {saving ? 'SAVING...' : 'ADD CATEGORY'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

              {/* Subcategories Management */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Subcategories</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    placeholder="Add subcategory (e.g. Visors)"
                    className="flex-grow px-4.5 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-550 focus:outline-none focus:border-brand-red focus:bg-[#1f2937]"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addSubcategory();
                      }
                    }}
                  />
                  <button
                    type="button"
                    onClick={addSubcategory}
                    className="px-4 bg-brand-red hover:bg-red-700 text-white rounded-xl text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                  >
                    ADD
                  </button>
                </div>
                
                <div className="space-y-3 pt-2 max-h-[220px] overflow-y-auto pr-1">
                  {formSubcategories.length === 0 ? (
                    <span className="text-[10px] text-gray-500 italic">No subcategories added yet.</span>
                  ) : (
                    formSubcategories.map((sub, idx) => {
                      const subsecs = sub.subsections || [];
                      return (
                        <div key={idx} className="p-3 bg-gray-900 border border-gray-800 rounded-xl space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-white uppercase tracking-wider">{sub.name}</span>
                            <button
                              type="button"
                              onClick={() => removeSubcategory(idx)}
                              className="text-gray-550 hover:text-red-500 transition-colors cursor-pointer p-1 rounded hover:bg-gray-800"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {/* Nested Subsections */}
                          <div className="space-y-1.5 pl-2 border-l border-gray-800">
                            <span className="text-[9px] font-extrabold uppercase tracking-wider text-gray-500">Subsections:</span>
                            <div className="flex flex-wrap gap-1">
                              {subsecs.length === 0 ? (
                                <span className="text-[9px] text-gray-650 italic">None</span>
                              ) : (
                                subsecs.map((ss, sIdx) => (
                                  <span key={sIdx} className="flex items-center gap-1 px-1.5 py-0.5 bg-gray-800 text-gray-400 rounded text-[9px] font-medium border border-gray-750">
                                    <span>{ss.name}</span>
                                    <button
                                      type="button"
                                      onClick={() => removeSubsectionFromSub(idx, sIdx)}
                                      className="text-gray-550 hover:text-red-400 cursor-pointer"
                                    >
                                      <X className="w-2.5 h-2.5" />
                                    </button>
                                  </span>
                                ))
                              )}
                            </div>
                            
                            {/* Inline Add Subsection */}
                            <div className="flex gap-1.5 pt-1">
                              <input
                                type="text"
                                placeholder="Add sub-section..."
                                className="px-2 py-1 bg-gray-950 border border-gray-800 rounded-lg text-[10px] text-white placeholder-gray-650 focus:outline-none focus:border-brand-red w-full"
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    addSubsectionToSub(idx, e.target.value);
                                    e.target.value = '';
                                  }
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
              <div className="pt-4 border-t border-gray-800/80 flex justify-end gap-3">
                <button type="button" onClick={() => setIsEditOpen(false)} className="px-4 py-2.5 bg-gray-800 text-gray-400 hover:text-white rounded-xl text-xs font-bold transition-colors cursor-pointer">
                  CANCEL
                </button>
                <button type="submit" disabled={saving} className="px-5 py-2.5 bg-brand-red hover:bg-red-700 text-white rounded-xl text-xs font-bold shadow-lg hover:shadow-brand-red/10 transition-colors cursor-pointer disabled:opacity-60">
                  {saving ? 'SAVING...' : 'UPDATE CATEGORY'}
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
