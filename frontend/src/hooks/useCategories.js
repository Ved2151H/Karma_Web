import { useState, useEffect } from 'react';
import { categoryApi } from '../api/categoryApi';

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getCategories = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await categoryApi.getAll();
      setCategories(Array.isArray(response) ? response : []);
    } catch (err) {
      console.warn('Failed to load categories.', err);
      setError('Failed to load categories');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const createCategory = async (data) => {
    const created = await categoryApi.create(data);
    setCategories((prev) => [...prev, created]);
    return created;
  };

  const updateCategory = async (id, data) => {
    const updated = await categoryApi.update(id, data);
    setCategories((prev) => prev.map((category) => (category.id === id ? updated : category)));
    return updated;
  };

  const deleteCategory = async (id) => {
    await categoryApi.delete(id);
    setCategories((prev) => prev.filter((category) => category.id !== id));
    return id;
  };

  useEffect(() => {
    getCategories();
  }, []);

  return {
    categories,
    loading,
    error,
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}

export default useCategories;
