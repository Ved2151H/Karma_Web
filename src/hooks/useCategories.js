import { useContext } from 'react';
import { CategoryContext } from '../context/CategoryContext';

export function useCategories() {
  const context = useContext(CategoryContext);
  if (!context) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return {
    categories: context.categories,
    loading: context.loading,
    getCategories: context.refreshCategories,
    createCategory: context.addCategory,
    updateCategory: context.updateCategory,
    deleteCategory: context.deleteCategory
  };
}

export default useCategories;
