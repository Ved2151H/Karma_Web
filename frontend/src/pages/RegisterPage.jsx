import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { User, Mail, Phone, Lock } from 'lucide-react';

export function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register({
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        phone: form.phone.replace(/\D/g, '') || undefined,
        password: form.password,
        role: 'CUSTOMER',
      });
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 flex items-center justify-center font-sans py-16 px-6 select-none">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-[640px] flex flex-col sm:flex-row min-h-[420px]">
        <div className="w-full sm:w-[42%] bg-[#E31E24] text-white p-8 flex flex-col justify-center">
          <h3 className="font-display text-2xl font-black uppercase tracking-wider mb-3 leading-tight">
            Create<br />Account
          </h3>
          <p className="text-white/85 text-xs leading-relaxed max-w-[200px]">
            Register to save your cart, wishlist, and order history.
          </p>
        </div>

        <div className="w-full sm:w-[58%] p-8 flex flex-col justify-center bg-white">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <h4 className="font-display text-base font-extrabold uppercase tracking-wider text-neutral-800 mb-1">
                Join KARAM Safety
              </h4>
              <p className="text-neutral-400 text-xs">Fill in your details to get started.</p>
            </div>

            {error && (
              <p className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">{error}</p>
            )}

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Full Name</span>
              <div className="flex items-center border border-neutral-200 rounded-lg px-3.5 gap-2 bg-neutral-50 focus-within:border-[#E31E24]">
                <User className="w-4 h-4 text-neutral-400" />
                <input required value={form.name} onChange={handleChange('name')} className="w-full py-3 bg-transparent text-xs font-semibold focus:outline-none" placeholder="Your name" />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Email</span>
              <div className="flex items-center border border-neutral-200 rounded-lg px-3.5 gap-2 bg-neutral-50 focus-within:border-[#E31E24]">
                <Mail className="w-4 h-4 text-neutral-400" />
                <input required type="email" value={form.email} onChange={handleChange('email')} className="w-full py-3 bg-transparent text-xs font-semibold focus:outline-none" placeholder="you@email.com" />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Phone (optional)</span>
              <div className="flex items-center border border-neutral-200 rounded-lg px-3.5 gap-2 bg-neutral-50 focus-within:border-[#E31E24]">
                <Phone className="w-4 h-4 text-neutral-400" />
                <input type="tel" maxLength="10" value={form.phone} onChange={handleChange('phone')} className="w-full py-3 bg-transparent text-xs font-semibold focus:outline-none" placeholder="10 digit number" />
              </div>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">Password</span>
              <div className="flex items-center border border-neutral-200 rounded-lg px-3.5 gap-2 bg-neutral-50 focus-within:border-[#E31E24]">
                <Lock className="w-4 h-4 text-neutral-400" />
                <input required type="password" minLength="4" value={form.password} onChange={handleChange('password')} className="w-full py-3 bg-transparent text-xs font-semibold focus:outline-none" placeholder="Min 4 characters" />
              </div>
            </label>

            <button type="submit" disabled={loading} className="w-full bg-[#E31E24] hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider py-4 rounded-lg shadow-md cursor-pointer transition-colors mt-2">
              {loading ? 'Creating account...' : 'Register'}
            </button>

            <p className="text-center text-xs text-neutral-400">
              Already have an account?{' '}
              <Link to="/login" className="text-[#E31E24] font-bold hover:underline">Login</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
