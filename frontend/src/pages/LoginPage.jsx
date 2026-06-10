import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../context/AuthContext';
import { FirebasePhoneAuth } from '../components/auth/FirebasePhoneAuth';

export function LoginPage() {
  const { loginWithFirebase } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  const handleFirebaseSuccess = async (idToken) => {
    await loginWithFirebase(idToken);
    navigate(from, { replace: true });
  };

  return (
    <div className="w-full min-h-screen bg-neutral-50 flex items-center justify-center font-sans py-16 px-6 select-none">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-full max-w-[640px] flex flex-col sm:flex-row min-h-[380px]">
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

        <div className="w-full sm:w-[58%] p-8 flex flex-col justify-center bg-white">
          <FirebasePhoneAuth onSuccess={handleFirebaseSuccess} submitLabel="Send OTP" />

          <p className="text-center text-xs text-neutral-400 mt-6">
            Prefer email login?{' '}
            <Link to="/register" className="text-[#E31E24] font-bold hover:underline">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
