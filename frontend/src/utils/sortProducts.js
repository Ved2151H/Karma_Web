/**
 * Sorts a list of products.
 * 
 * @param {Array} products The filtered products list
 * @param {string} sortType Sorting identifier (relevant, price-low, price-high, newest)
 * @returns {Array} Sorted product array
 */
export function sortProducts(products, sortType) {
  if (!products) return [];
  const list = [...products];

  switch (sortType) {
    case 'price-low':
      return list.sort((a, b) => a.price - b.price);
    case 'price-high':
      return list.sort((a, b) => b.price - a.price);
    case 'newest':
      return list.sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
    case 'relevant':
    default:
      // In a real database, relevance might be based on rating or popularity.
      // We default to returning the original array order.
      return list;
  }
}
export default sortProducts;
