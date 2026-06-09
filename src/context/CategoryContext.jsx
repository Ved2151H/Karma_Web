import React, { createContext, useState, useEffect, useContext } from 'react';
import { categoryApi } from '../api/categoryApi';

export const CategoryContext = createContext();

const defaultCategories = [
  { id: 'face', name: 'Face Protection', label: 'Face', status: 'Active' },
  { id: 'foot', name: 'Foot Protection', label: 'Foot', status: 'Active' },
  { id: 'eye', name: 'Eye Protection', label: 'Eye', status: 'Active' },
  { id: 'hand', name: 'Hand Protection', label: 'Hand', status: 'Active' },
  { id: 'head', name: 'Head Protection', label: 'Head', status: 'Active' },
  { id: 'hearing', name: 'Hearing Protection', label: 'Hearing', status: 'Active' },
  { id: 'fall-protection', name: 'Fall Protection', label: 'Fall Protection', status: 'Active' },
  { id: 'respiratory', name: 'Respiratory Protection', label: 'Respiratory', status: 'Active' },
  { id: 'workwear', name: 'Workwear', label: 'Workwear', status: 'Active' },
  { id: 'gas-detector', name: 'Gas Detector', label: 'Gas Detector', status: 'Active' }
];

export function CategoryProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      if (Array.isArray(response)) {
        // Ensure every loaded category has an id, name, status, label
        const normalized = response.map(cat => ({
          id: cat.id || cat.slug || '',
          name: cat.name || '',
          label: cat.label || cat.name || '',
          status: cat.status || 'Active'
        }));
        setCategories(normalized);
        localStorage.setItem('karam_categories', JSON.stringify(normalized));
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.warn('Failed to load categories from API. Using local storage or fallback.', err);
      const stored = localStorage.getItem('karam_categories');
      if (stored) {
        setCategories(JSON.parse(stored));
      } else {
        setCategories(defaultCategories);
        localStorage.setItem('karam_categories', JSON.stringify(defaultCategories));
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const addCategory = async (category) => {
    try {
      const saved = await categoryApi.create(category);
      const data = saved || category;
      setCategories((prev) => {
        const updated = [...prev, data];
        localStorage.setItem('karam_categories', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Offline mode: Created category mock.', err);
      setCategories((prev) => {
        const updated = [...prev, category];
        localStorage.setItem('karam_categories', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const updateCategory = async (id, data) => {
    try {
      const updatedData = await categoryApi.update(id, data);
      const res = updatedData || data;
      setCategories((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, ...res } : c));
        localStorage.setItem('karam_categories', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Offline mode: Updated category mock.', err);
      setCategories((prev) => {
        const updated = prev.map((c) => (c.id === id ? { ...c, ...data } : c));
        localStorage.setItem('karam_categories', JSON.stringify(updated));
        return updated;
      });
    }
  };

  const deleteCategory = async (id) => {
    try {
      await categoryApi.delete(id);
      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        localStorage.setItem('karam_categories', JSON.stringify(updated));
        return updated;
      });
    } catch (err) {
      console.warn('Offline mode: Deleted category mock.', err);
      setCategories((prev) => {
        const updated = prev.filter((c) => c.id !== id);
        localStorage.setItem('karam_categories', JSON.stringify(updated));
        return updated;
      });
    }
  };

  return (
    <CategoryContext.Provider
      value={{
        categories,
        loading,
        addCategory,
        updateCategory,
        deleteCategory,
        refreshCategories: fetchCategories
      }}
    >
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategoryContext() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategoryContext must be used within a CategoryProvider');
  }
  return context;
}
