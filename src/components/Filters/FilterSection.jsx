import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';

function FilterSection({ title, isExpanded, onToggle, children }) {
  return (
    <div className="border-b border-neutral-200 py-4.5">
      <button
        type="button"
        onClick={onToggle}
        className="w-full flex items-center justify-between font-sans text-[11px] font-extrabold text-neutral-800 uppercase tracking-wider cursor-pointer py-1 select-none focus:outline-none"
      >
        <span>{title}</span>
        {isExpanded ? (
          <ChevronUp className="w-3.5 h-3.5 text-neutral-500" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
        )}
      </button>
      <AnimatePresence initial={false}>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: 'easeInOut' }}
            className="overflow-hidden mt-3"
          >
            <div className="pb-1">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default FilterSection;
