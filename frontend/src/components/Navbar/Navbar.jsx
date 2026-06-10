import React, { useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCategories } from '../../hooks/useCategories';

function Navbar() {
  const { categories, loading } = useCategories();
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const cleanCategoryName = (name) => {
    if (name.endsWith(' Protection')) {
      return name.slice(0, -11);
    }
    return name;
  };

  return (
    <nav 
      className="h-[42px] text-white select-none border-y border-neutral-900 shadow-md flex items-center justify-center p-0 relative"
      style={{ background: 'linear-gradient(90deg, #1f1f1f, #292929)', padding: 0 }}
    >
      <div className="max-w-[1600px] mx-auto h-full flex items-center justify-center">
        <div className="flex items-center h-full">
          {!loading && categories.map((cat, index) => {
            const label = cleanCategoryName(cat.name);
            const path = `/category/${cat.slug}`;
            const subcategories = cat.subcategories || [];

            return (
              <div
                key={cat.id}
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
                      {label}
                    </span>
                  )}
                </NavLink>

                {/* Hover Dropdown panel (Desktop Only) */}
                <AnimatePresence>
                  {hoveredIndex === index && subcategories.length > 0 && (
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
                        {subcategories.map((sub) => (
                          <div key={sub.id} className="flex flex-col gap-1">
                            <Link
                              to={`/${cat.slug}/${sub.slug}`}
                              className="text-neutral-400 hover:text-[#E31E24] text-[13px] font-semibold tracking-wide transition-colors duration-200"
                            >
                              {sub.name}
                            </Link>
                            {sub.subsections && sub.subsections.length > 0 && (
                              <div className="pl-3.5 flex flex-col gap-1 border-l border-neutral-800">
                                {sub.subsections.map((ss) => (
                                  <Link
                                    key={ss.id}
                                    to={`/${cat.slug}/${sub.slug}/${ss.slug}`}
                                    className="text-neutral-500 hover:text-[#E31E24] text-[11px] font-medium tracking-wide transition-colors duration-200"
                                  >
                                    {ss.name}
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
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
