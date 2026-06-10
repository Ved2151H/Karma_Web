/**
 * Filters a list of products based on active category and filter selections.
 * 
 * @param {Array} products The full product array
 * @param {string} category The active category parameter (hand, face, eye, hearing)
 * @param {Object} selections An object containing selected filters
 * @returns {Array} Filtered products
 */
export function filterProducts(products, category, selections) {
  if (!products) return [];
  
  // 1. Filter by category first
  let list = products.filter(p => p.category === category);

  const {
    subcategories = [],
    brands = [],
    industries = [],
    origins = [],
    priceMax = 6000,
    resistances = [],
    materials = [],
    lenses = [],
    snrs = [],
    reusables = []
  } = selections;

  // 2. Subcategory (Safety Gloves, Welding/Face Shield, Goggles/Accessories, Plugs/Muffs)
  if (subcategories.length > 0) {
    list = list.filter(p => {
      if (category === 'hand') {
        return subcategories.includes('Safety Gloves') ? p.title.includes('Gloves') : p.title.includes('Sleeves');
      }
      if (category === 'face') {
        return subcategories.includes('Welding and Face Shield');
      }
      if (category === 'eye') {
        const isAccessory = p.lensType === 'Accessories';
        if (subcategories.includes('Safety Goggles and Spectacles') && !isAccessory) return true;
        if (subcategories.includes('Eye Accessories') && isAccessory) return true;
        return false;
      }
      if (category === 'hearing') {
        const isPlugs = p.title.includes('Plugs');
        if (subcategories.includes('Ear Plugs') && isPlugs) return true;
        if (subcategories.includes('Ear Muffs') && !isPlugs) return true;
        return false;
      }
      return true;
    });
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
  if (origins.length > 0 && (category === 'hand' || category === 'eye' || category === 'hearing')) {
    list = list.filter(p => origins.includes(p.countryOfOrigin));
  }

  // 6. Price
  list = list.filter(p => p.price <= priceMax);

  // 7. Hand Specific: Resistance
  if (category === 'hand' && resistances.length > 0) {
    list = list.filter(p => resistances.includes(p.resistanceType));
  }

  // 8. Face Specific: Material
  if (category === 'face' && materials.length > 0) {
    list = list.filter(p => materials.includes(p.material));
  }

  // 9. Eye Specific: Lens Type
  if (category === 'eye' && lenses.length > 0) {
    list = list.filter(p => lenses.includes(p.lensType));
  }

  // 10. Hearing Specific: SNR Rating
  if (category === 'hearing' && snrs.length > 0) {
    list = list.filter(p => snrs.includes(p.snrDnr));
  }

  // 11. Hearing Specific: Reusable
  if (category === 'hearing' && reusables.length > 0) {
    list = list.filter(p => reusables.includes(p.reusable));
  }

  return list;
}
export default filterProducts;
