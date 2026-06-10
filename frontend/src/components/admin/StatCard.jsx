import React from 'react';
import { motion } from 'framer-motion';

function StatCard({ label, value, description, icon: Icon }) {
  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      transition={{ duration: 0.2 }}
      className="bg-[#111827] border border-gray-800 p-6 rounded-2xl shadow-lg flex items-center justify-between select-none relative overflow-hidden group"
    >
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-brand-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

      <div className="flex-1 min-w-0 pr-4">
        <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest block mb-2">
          {label}
        </span>
        <div className="text-3xl font-extrabold text-white font-display mb-1 leading-none">
          {value}
        </div>
        <p className="text-gray-400 text-[11px] truncate mt-1">
          {description}
        </p>
      </div>

      {Icon && (
        <div className="w-12 h-12 rounded-xl bg-gray-800/40 border border-gray-700/50 flex items-center justify-center text-brand-red group-hover:bg-brand-red/10 group-hover:border-brand-red/20 transition-colors duration-300">
          <Icon className="w-6 h-6" />
        </div>
      )}
    </motion.div>
  );
}

export default StatCard;
