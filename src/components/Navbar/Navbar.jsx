import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../hooks/useCategories';

const SUB_CATEGORIES = {
  'face': [
    { label: 'Welding and Face Shield', path: '/face/welding-face-shield' },
    { label: 'Visors', path: '/face/visors' },
    { label: 'Accessories', path: '/face/accessories' },
  ],
  'foot': [
    { label: 'Safety Shoes', path: '/foot/safety-shoes' },
    { label: 'PVC Boots', path: '/foot/pvc-boots' },
  ],
  'eye': [
    { label: 'Safety Goggles and Spectacles', path: '/eye/safety-goggles-spectacles' },
    { label: 'Eye Accessories', path: '/eye/eye-accessories' },
    { label: 'Lens Accessories', path: '/eye/lens-accessories' },
  ],
  'hand': [
    { label: 'Safety Gloves', path: '/hand/safety-gloves' },
    { label: 'Cut Resistant Gloves', path: '/hand/cut-resistant-gloves' },
    { label: 'Chemical Resistant Gloves', path: '/hand/chemical-resistant-gloves' },
    { label: 'Welding Gloves', path: '/hand/welding-gloves' },
  ],
  'head': [
    { label: 'Industrial Helmets', path: '/head/industrial-helmets' },
    { label: 'Helmet Accessories', path: '/head/helmet-accessories' },
  ],
  'hearing': [
    { label: 'Ear Plugs', path: '/hearing/ear-plugs' },
    { label: 'Ear Muffs', path: '/hearing/ear-muffs' },
  ],
  'fall-protection': [
    { label: 'Harnesses', path: '/fall-protection/harnesses' },
    { label: 'Lanyards', path: '/fall-protection/lanyards' },
    { label: 'Connectors', path: '/fall-protection/connectors' },
  ],
  'respiratory': [
    { label: 'Masks', path: '/respiratory/masks' },
    { label: 'Respirators', path: '/respiratory/respirators' },
  ],
  'workwear': [
    { label: 'Coveralls', path: '/workwear/coveralls' },
    { label: 'Rainwear', path: '/workwear/rainwear' },
  ],
  'gas-detector': [
    { label: 'Single Gas Detector', path: '/gas-detector/single-gas-detector' },
    { label: 'Multi Gas Detector', path: '/gas-detector/multi-gas-detector' },
  ],
};

function Navbar() {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const { categories } = useCategories();

  // Show only active categories on the navigation bar
  const activeCategories = categories.filter(c => c.status === 'Active');

  return (
    <nav 
      className="h-[42px] text-white select-none border-y border-neutral-900 shadow-md flex items-center justify-center p-0 relative"
      style={{ background: 'linear-gradient(90deg, #1f1f1f, #292929)', padding: 0 }}
    >
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-center">
        <div className="flex items-center h-full">
          {activeCategories.map((link, index) => {
            const path = `/category/${link.id}`;
            return (
              <div
                key={link.id}
                className="h-full relative flex items-center justify-center"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <NavLink
                  to={path}
                  className="h-full flex items-center justify-center border-r border-[rgba(255,255,255,0.18)] text-[15px] font-medium text-white select-none cursor-pointer hover:bg-[rgba(255,255,255,0.05)] transition-all duration-200 px-[30px] tracking-normal"
                >
                  {({ isActive }) => (
                    <span 
                      className={isActive ? 'border border-white/50 bg-transparent rounded-[4px] px-[14px] flex items-center justify-center h-[28px]' : ''}
                      style={isActive ? { border: '1px solid rgba(255,255,255,0.5)', background: 'transparent', borderRadius: '4px', padding: '0 14px', height: '28px', display: 'flex', alignItems: 'center', justifycontent: 'center' } : {}}
                    >
                      {link.label || link.name}
                    </span>
                  )}
                </NavLink>

                {/* Hover Dropdown panel (Desktop Only) */}
                <AnimatePresence>
                  {hoveredIndex === index && SUB_CATEGORIES[link.id] && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.2 }}
                      className="hidden md:block absolute top-[100%] left-1/2 -translate-x-1/2 mt-0.5 z-50 text-left shadow-2xl"
                      style={{ 
                        width: '280px', 
                        padding: '20px', 
                        backgroundColor: '#1f1f1f', 
                        borderRadius: '8px', 
                        border: '1px solid rgba(255,255,255,0.08)' 
                      }}
                    >
                      <div className="flex flex-col gap-3.5 select-none">
                        {SUB_CATEGORIES[link.id].map((sub) => (
                          <Link
                            key={sub.label}
                            to={sub.path}
                            className="text-neutral-400 hover:text-[#E31E24] text-[13px] font-semibold tracking-wide transition-colors duration-200"
                          >
                            {sub.label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
