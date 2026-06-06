import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { Phone } from 'lucide-react';

export function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { login } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (phoneNumber.length < 10) {
      alert('Please enter a valid 10-digit mobile number.');
      return;
    }
    try {
      await login({ email: `${phoneNumber}@karam.in`, role: 'CUSTOMER' });
      navigate(from, { replace: true });
    } catch (err) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 flex items-center justify-center font-sans py-16 px-6 select-none">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-[640px] flex flex-col sm:flex-row min-h-[380px]">
        {/* Left Side: Brand Red Panel */}
        <div className="w-full sm:w-[42%] bg-[#E31E24] text-white p-8 flex flex-col justify-center">
          <h3 className="font-display text-2xl font-black uppercase tracking-wider mb-3 leading-tight">
            Login /<br />Sign Up
          </h3>
          <p className="text-white/85 text-xs leading-relaxed max-w-[200px]">
            Access your wishlist, cart, and track orders instantly by logging in.
          </p>
          <div className="mt-8 text-white/50 text-[10px] font-bold uppercase tracking-widest">
            KARAM Safety
          </div>
        </div>

        {/* Right Side: Form Input Area */}
        <div className="w-full sm:w-[58%] p-8 flex flex-col justify-center bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div>
              <h4 className="font-display text-base font-extrabold uppercase tracking-wider text-neutral-800 mb-1">
                Welcome Back
              </h4>
              <p className="text-neutral-400 text-xs">
                Enter your mobile number to receive an OTP.
              </p>
            </div>

            {/* Phone input with country code */}
            <div className="flex flex-col gap-1.5">
              <label htmlFor="phone" className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                Mobile Number
              </label>
              <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 focus-within:border-[#E31E24] focus-within:bg-white transition-all">
                <span className="px-3.5 py-3 text-xs font-bold text-neutral-550 border-r border-neutral-200 bg-neutral-100/50">
                  +91
                </span>
                <div className="flex-grow flex items-center px-3.5 gap-2">
                  <Phone className="w-4 h-4 text-neutral-400" />
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
              className="w-full bg-[#E31E24] hover:bg-red-700 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-lg shadow-md cursor-pointer transition-colors mt-2"
            >
              Continue
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
