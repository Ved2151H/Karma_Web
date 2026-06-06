import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  const getCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryApi.getAll();
      if (Array.isArray(response)) {
        setCategories(response);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.warn('Failed to load categories. Using fallback list.');
      setCategories([
        { id: 'cat-1', name: 'Face Protection', slug: 'face' },
        { id: 'cat-2', name: 'Foot Protection', slug: 'foot' },
        { id: 'cat-3', name: 'Eye Protection', slug: 'eye' },
        { id: 'cat-4', name: 'Hand Protection', slug: 'hand' },
        { id: 'cat-5', name: 'Head Protection', slug: 'head' },
        { id: 'cat-6', name: 'Hearing Protection', slug: 'hearing' },
        { id: 'cat-7', name: 'Fall Protection', slug: 'fall-protection' },
        { id: 'cat-8', name: 'Respiratory Protection', slug: 'respiratory' },
        { id: 'cat-9', name: 'Workwear', slug: 'workwear' },
        { id: 'cat-10', name: 'Gas Detector', slug: 'gas-detector' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data) => {
    try {
      return await categoryApi.create(data);
    } catch (err) {
      console.warn('Offline mode: Created category mock.');
      return data;
    }
  };

  const updateCategory = async (id, data) => {
    try {
      return await categoryApi.update(id, data);
    } catch (err) {
      console.warn('Offline mode: Updated category mock.');
      return data;
    }
  };

  const deleteCategory = async (id) => {
    try {
      return await categoryApi.delete(id);
    } catch (err) {
      console.warn('Offline mode: Deleted category mock.');
      return id;
    }
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    loading,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
  };
}

export default useCategories;
