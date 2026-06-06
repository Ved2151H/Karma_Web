import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Building, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

function Settings() {
  const [storeName, setStoreName] = useState('KARAM Safety Online Store');
  const [email, setEmail] = useState('support@karam.in');
  const [phone, setPhone] = useState('+91 120 4734400');
  const [address, setAddress] = useState('D-95, Sector 63, Noida, Uttar Pradesh 201301, India');
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Load from localStorage if present
  useEffect(() => {
    const savedSettings = localStorage.getItem('adminSettings');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        if (parsed.storeName) setStoreName(parsed.storeName);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.phone) setPhone(parsed.phone);
        if (parsed.address) setAddress(parsed.address);
      } catch (e) {
        console.error('Error loading settings', e);
      }
    }
  }, []);

  const handleSave = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setIsSaved(false);

    // Mock network request delay for premium save effect
    setTimeout(() => {
      const settingsObj = { storeName, email, phone, address };
      localStorage.setItem('adminSettings', JSON.stringify(settingsObj));
      setIsSaving(false);
      setIsSaved(true);

      // Auto-hide success alert after 3 seconds
      setTimeout(() => {
        setIsSaved(false);
      }, 3000);
    }, 600);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="font-sans max-w-4xl mx-auto"
    >
      {/* Page Header */}
      <div className="mb-8 select-none">
        <h1 className="text-2xl font-black uppercase tracking-wider text-white">System Settings</h1>
        <p className="text-gray-400 text-xs mt-1">Configure general store details and contact credentials.</p>
      </div>

      {/* Success Notification Banner */}
      <AnimatePresence>
        {isSaved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-xl flex items-center gap-3 text-emerald-400 text-xs font-semibold select-none"
          >
            <CheckCircle className="w-5 h-5 shrink-0" />
            <span>Store settings saved and updated successfully in localStorage!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Form Card */}
      <div className="bg-[#111827] border border-gray-800 rounded-2xl p-6 sm:p-8 shadow-xl">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Store Name */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-gray-500" />
                Store Name
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Enter store name"
                className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
                required
                disabled={isSaving}
              />
            </div>

            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-gray-500" />
                Store Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter store email"
                className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
                required
                disabled={isSaving}
              />
            </div>

            {/* Contact Phone */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-gray-500" />
                Contact Phone Number
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter phone number"
                className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200"
                required
                disabled={isSaving}
              />
            </div>

            {/* Address */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="text-[10px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-gray-500" />
                Physical Store Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Enter shop address"
                rows="3"
                className="w-full px-4 py-3 bg-[#1f2937]/50 border border-gray-800 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red focus:bg-[#1f2937] transition-all duration-200 resize-none"
                required
                disabled={isSaving}
              />
            </div>

          </div>

          {/* Form Actions (Save button only) */}
          <div className="flex justify-end pt-4 border-t border-gray-800/60">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-brand-red hover:bg-red-700 disabled:bg-red-800 text-white text-xs font-bold uppercase tracking-wider px-6 py-3 rounded-xl shadow-lg hover:shadow-brand-red/10 active:scale-[0.98] transition-all duration-200 flex items-center gap-2 cursor-pointer"
            >
              <Save className={`w-4 h-4 ${isSaving ? 'animate-pulse' : ''}`} />
              <span>{isSaving ? 'SAVING...' : 'SAVE SETTINGS'}</span>
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}

export default Settings;
