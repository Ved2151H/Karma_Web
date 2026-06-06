import React, { useState, useContext } from 'react';
import FilterSection from './FilterSection';
import { ProductContext } from '../../context/ProductContext';
import { CATEGORY_SUBCATEGORIES } from '../../constants/categories';

function Filters({
  category,
  selections,
  priceMax,
  setPriceMax,
  toggleSubcategory,
  toggleBrand,
  toggleIndustry,
  toggleOrigin,
  toggleResistance,
  toggleMaterial,
  toggleLens,
  toggleSNR,
  toggleReusable
}) {
  const { products: allProducts = [] } = useContext(ProductContext) || {};

  const {
    subcategories = [],
    brands = [],
    industries = [],
    origins = [],
    resistances = [],
    materials = [],
    lenses = [],
    snrs = [],
    reusables = []
  } = selections;

  // Track accordion expand state
  const [expanded, setExpanded] = useState({
    subcategory: true,
    industry: true,
    origin: true,
    brand: true,
    price: true,
    resistance: true,
    material: true,
    lens: true,
    snr: true,
    reusable: true
  });

  const toggleAccordion = (section) => {
    setExpanded((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const getSubcategoryCount = (subVal) => {
    return allProducts.filter(p => p.category === category && p.subcategory === subVal).length;
  };

  return (
    <div className="flex flex-col gap-1 pr-1 font-sans select-none">
      
      {/* SECTION 1: Subcategory */}
      {CATEGORY_SUBCATEGORIES[category] && (
        <FilterSection title="Category" isExpanded={expanded.subcategory} onToggle={() => toggleAccordion('subcategory')}>
          <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
            {CATEGORY_SUBCATEGORIES[category].map((sub) => (
              <label key={sub.value} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                <input
                  type="checkbox"
                  checked={subcategories.includes(sub.value)}
                  onChange={() => toggleSubcategory(sub.value)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                />
                <span>{sub.label} ({getSubcategoryCount(sub.value)})</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {/* SECTION 2: Shop Industries */}
      <FilterSection title="Shop Industries" isExpanded={expanded.industry} onToggle={() => toggleAccordion('industry')}>
        <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
          {['Construction', 'Manufacturing', 'Oil & Gas', 'Mining'].map((ind) => (
            <label key={ind} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
              <input
                type="checkbox"
                checked={industries.includes(ind)}
                onChange={() => toggleIndustry(ind)}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
              />
              <span>{ind}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* SECTION 3: Origin (except Face) */}
      {category !== 'face' && (
        <FilterSection title="Country of Origin" isExpanded={expanded.origin} onToggle={() => toggleAccordion('origin')}>
          <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
            <label className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
              <input
                type="checkbox"
                checked={origins.includes('India')}
                onChange={() => toggleOrigin('India')}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
              />
              <span>India</span>
            </label>
          </div>
        </FilterSection>
      )}

      {/* SECTION 4: Brand */}
      <FilterSection title="Brand" isExpanded={expanded.brand} onToggle={() => toggleAccordion('brand')}>
        <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
          {['KARAM', 'K-Lite', 'SafeArmor'].map((b) => (
            <label key={b} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
              <input
                type="checkbox"
                checked={brands.includes(b)}
                onChange={() => toggleBrand(b)}
                className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
              />
              <span>{b}</span>
            </label>
          ))}
        </div>
      </FilterSection>

      {/* SECTION 5: Price Range Slider */}
      <FilterSection title="Price" isExpanded={expanded.price} onToggle={() => toggleAccordion('price')}>
        <div className="flex flex-col gap-3 px-1 text-xs text-neutral-700">
          <input
            type="range"
            min="0"
            max="6000"
            step="100"
            value={priceMax}
            onChange={(e) => setPriceMax(parseInt(e.target.value))}
            className="w-full accent-brand-red cursor-pointer"
          />
          <div className="flex justify-between items-center text-xs font-bold text-neutral-800">
            <span>₹0</span>
            <span>Max: ₹{priceMax}</span>
          </div>
        </div>
      </FilterSection>

      {/* SECTION 6: Technical attributes based on category */}
      {category === 'hand' && (
        <FilterSection title="Resistance Type" isExpanded={expanded.resistance} onToggle={() => toggleAccordion('resistance')}>
          <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
            {['General Purpose', 'Cut Resistant', 'Heat Resistant', 'Chemical Protection', 'Impact Resistant', 'Cold Protection', 'Electrical Protection'].map((res) => (
              <label key={res} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                <input
                  type="checkbox"
                  checked={resistances.includes(res)}
                  onChange={() => toggleResistance(res)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                />
                <span>{res}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {category === 'face' && (
        <FilterSection title="Material of Lens" isExpanded={expanded.material} onToggle={() => toggleAccordion('material')}>
          <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
            {['Polycarbonate', 'Polyamide', 'Acetate', 'Steel Mesh', 'Gold Polycarbonate', 'Canvas & Glass', 'Polyester'].map((mat) => (
              <label key={mat} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                <input
                  type="checkbox"
                  checked={materials.includes(mat)}
                  onChange={() => toggleMaterial(mat)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                />
                <span>{mat}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {category === 'eye' && (
        <FilterSection title="Lens Type" isExpanded={expanded.lens} onToggle={() => toggleAccordion('lens')}>
          <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
            {['Clear', 'Clear Anti-Fog', 'Polarized Smoke', 'Shade 5 IR', 'Sealed Clear', 'Laser Shield', 'Accessories', 'Clear Over-Spec'].map((lens) => (
              <label key={lens} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                <input
                  type="checkbox"
                  checked={lenses.includes(lens)}
                  onChange={() => toggleLens(lens)}
                  className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                />
                <span>{lens}</span>
              </label>
            ))}
          </div>
        </FilterSection>
      )}

      {category === 'hearing' && (
        <>
          <FilterSection title="SNR and DNR" isExpanded={expanded.snr} onToggle={() => toggleAccordion('snr')}>
            <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
              {['SNR 32dB', 'SNR 31dB', 'SNR 30dB', 'SNR 29dB', 'SNR 28dB', 'SNR 26dB'].map((snr) => (
                <label key={snr} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                  <input
                    type="checkbox"
                    checked={snrs.includes(snr)}
                    onChange={() => toggleSNR(snr)}
                    className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{snr}</span>
                </label>
              ))}
            </div>
          </FilterSection>

          <FilterSection title="Reusable" isExpanded={expanded.reusable} onToggle={() => toggleAccordion('reusable')}>
            <div className="flex flex-col gap-2.5 text-xs text-neutral-700 font-medium">
              {['Yes', 'No'].map((re) => (
                <label key={re} className="flex items-center gap-2 cursor-pointer hover:text-brand-red">
                  <input
                    type="checkbox"
                    checked={reusables.includes(re)}
                    onChange={() => toggleReusable(re)}
                    className="rounded border-neutral-300 text-brand-red focus:ring-brand-red w-3.5 h-3.5 cursor-pointer"
                  />
                  <span>{re === 'Yes' ? 'Reusable' : 'Disposable'}</span>
                </label>
              ))}
            </div>
          </FilterSection>
        </>
      )}
    </div>
  );
}

export default Filters;
