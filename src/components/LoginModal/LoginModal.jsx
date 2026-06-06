import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone } from 'lucide-react';
import { useUI } from '../../context/UIContext';

function LoginModal() {
  const { isLoginOpen, setIsLoginOpen } = useUI();
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    alert(`OTP sent successfully to +91-${phoneNumber}`);
    setIsLoginOpen(false);
  };

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginOpen(false)}
            className="fixed inset-0 bg-black z-50 pointer-events-auto flex items-center justify-center p-4 sm:p-6"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-[640px] flex flex-col sm:flex-row h-fit pointer-events-auto relative min-h-[360px]"
            >
              
              {/* Close Button */}
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-brand-red p-1 rounded-full hover:bg-neutral-50 transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Left Side: Brand Red Panel */}
              <div className="w-full sm:w-[42%] bg-brand-red text-white p-8 flex flex-col justify-center select-none">
                <h3 className="font-display text-2xl font-black uppercase tracking-wider mb-3 leading-tight">
                  Login /<br />Sign Up
                </h3>
                <p className="text-white/80 text-xs leading-relaxed max-w-[200px]">
                  Login or Sign up with your mobile number to get started and track orders.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  <span>KARAM Safety</span>
                </div>
              </div>

              {/* Right Side: Form Input Area */}
              <div className="w-full sm:w-[58%] p-8 flex flex-col justify-center bg-white">
                <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                  <div>
                    <h4 className="font-display text-sm font-extrabold uppercase tracking-wider text-neutral-800 mb-1">
                      Welcome Back
                    </h4>
                    <p className="text-neutral-400 text-xs">
                      Enter your mobile number to receive an OTP.
                    </p>
                  </div>

                  {/* Phone input with country code */}
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="phone" className="text-[10px] text-neutral-450 font-bold uppercase tracking-wider">
                      Mobile Number
                    </label>
                    <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 focus-within:border-brand-red focus-within:bg-white transition-all">
                      <span className="px-3.5 py-3 text-xs font-bold text-neutral-500 border-r border-neutral-200 bg-neutral-100/50">
                        +91
                      </span>
                      <div className="flex-grow flex items-center px-3.5 gap-2">
                        <Phone className="w-4 h-4 text-neutral-450" />
                        <input
                          id="phone"
                          type="tel"
                          pattern="[0-9]{10}"
                          maxLength="10"
                          value={phoneNumber}
                          onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                          placeholder="Enter 10 Digit Number"
                          className="w-full bg-transparent text-xs text-neutral-800 font-semibold focus:outline-none placeholder-neutral-400 py-3"
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-brand-red hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-md cursor-pointer transition-colors mt-2"
                  >
                    Continue
                  </button>
                </form>
              </div>
              
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
