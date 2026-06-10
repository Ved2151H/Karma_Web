import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, User, Lock, AlertCircle, Loader } from 'lucide-react';
import { useUI } from '../../context/UIContext';
import { useAuthContext } from '../../context/AuthContext';
import { FirebasePhoneAuth } from '../auth/FirebasePhoneAuth';

function LoginModal() {
  const { isLoginOpen, setIsLoginOpen } = useUI();
  const { loginWithFirebase, login } = useAuthContext();
  const navigate = useNavigate();
  const [loginMethod, setLoginMethod] = useState('phone'); // 'phone' or 'credentials'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFirebaseSuccess = async (idToken) => {
    const response = await loginWithFirebase(idToken);
    setIsLoginOpen(false);
    if (response?.user?.role === 'ADMIN' || response?.user?.role === 'SUPER_ADMIN') {
      navigate('/admin/dashboard');
    }
  };

  const handleCredentialLogin = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await login({ username: username.trim(), password });
      setIsLoginOpen(false);
      // Reset form fields on success
      setUsername('');
      setPassword('');

      if (response?.user?.role === 'ADMIN' || response?.user?.role === 'SUPER_ADMIN') {
        navigate('/admin/dashboard');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isLoginOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsLoginOpen(false)}
            className="fixed inset-0 bg-black z-50 pointer-events-auto flex items-center justify-center p-4 sm:p-6"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none select-none">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              className="bg-white rounded-2xl shadow-2xl overflow-hidden w-full max-w-[640px] flex flex-col sm:flex-row h-fit pointer-events-auto relative min-h-[360px]"
            >
              <button
                onClick={() => setIsLoginOpen(false)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-brand-red p-1 rounded-full hover:bg-neutral-50 transition-colors z-10 cursor-pointer"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="w-full sm:w-[42%] bg-brand-red text-white p-8 flex flex-col justify-center select-none">
                <h3 className="font-display text-2xl font-black uppercase tracking-wider mb-3 leading-tight">
                  Login /<br />Sign Up
                </h3>
                <p className="text-white/80 text-xs leading-relaxed max-w-[200px]">
                  Access your wishlist, cart, and track orders instantly by logging in.
                </p>
                <div className="mt-8 flex items-center gap-2 text-white/50 text-[10px] font-bold uppercase tracking-widest">
                  <span>KARAM Safety</span>
                </div>
              </div>

              <div className="w-full sm:w-[58%] p-8 flex flex-col justify-center bg-white select-text">
                {/* Login Method Tabs */}
                <div className="flex border-b border-neutral-100 mb-5 select-none">
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('phone'); setError(''); }}
                    className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 cursor-pointer transition-colors ${loginMethod === 'phone' ? 'border-[#E31E24] text-[#E31E24]' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
                  >
                    Phone OTP
                  </button>
                  <button
                    type="button"
                    onClick={() => { setLoginMethod('credentials'); setError(''); }}
                    className={`flex-1 pb-2.5 text-xs font-bold uppercase tracking-wider text-center border-b-2 cursor-pointer transition-colors ${loginMethod === 'credentials' ? 'border-[#E31E24] text-[#E31E24]' : 'border-transparent text-neutral-400 hover:text-neutral-600'}`}
                  >
                    Credentials
                  </button>
                </div>

                {error && (
                  <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2.5 mb-4 flex items-center gap-2 font-medium">
                    <AlertCircle className="w-4.5 h-4.5 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {loginMethod === 'phone' ? (
                  <FirebasePhoneAuth onSuccess={handleFirebaseSuccess} submitLabel="Send OTP" />
                ) : (
                  <form onSubmit={handleCredentialLogin} className="flex flex-col gap-4">
                    <div>
                      <h4 className="font-display text-sm font-extrabold uppercase tracking-wider text-neutral-800 mb-1">
                        Sign In
                      </h4>
                      <p className="text-neutral-400 text-xs">Enter your credentials to log in.</p>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="modal-username" className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        Username / Email
                      </label>
                      <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 bg-neutral-50 focus-within:border-[#E31E24] focus-within:bg-white transition-all gap-2">
                        <User className="w-4 h-4 text-neutral-400 shrink-0" />
                        <input
                          id="modal-username"
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          placeholder="e.g. admin or rajesh@gmail.com"
                          className="w-full bg-transparent text-xs text-neutral-800 font-semibold focus:outline-none placeholder-neutral-400"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label htmlFor="modal-password" className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
                        Password
                      </label>
                      <div className="flex items-center border border-neutral-200 rounded-lg px-3 py-2.5 bg-neutral-50 focus-within:border-[#E31E24] focus-within:bg-white transition-all gap-2">
                        <Lock className="w-4 h-4 text-neutral-400 shrink-0" />
                        <input
                          id="modal-password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter password"
                          className="w-full bg-transparent text-xs text-neutral-800 font-semibold focus:outline-none placeholder-neutral-400"
                          disabled={isLoading}
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-[#E31E24] hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-md cursor-pointer transition-colors flex items-center justify-center gap-2 mt-2"
                    >
                      {isLoading ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          <span>Logging in...</span>
                        </>
                      ) : (
                        <span>Login</span>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

export default LoginModal;
