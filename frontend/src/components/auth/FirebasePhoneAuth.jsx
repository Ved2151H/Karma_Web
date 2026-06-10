import React, { useEffect, useRef, useState } from 'react';
import { Phone } from 'lucide-react';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth, isFirebaseConfigured } from '../../lib/firebase';

function getFirebaseAuthErrorMessage(err) {
  const code = err?.code || '';
  const messages = {
    'auth/operation-not-allowed':
      'SMS is blocked for this region. In Firebase Console → Authentication → Settings → SMS region policy, choose Allow and add India (+91). Also enable Phone sign-in under Sign-in method.',
    'auth/invalid-phone-number': 'Invalid phone number. Use a 10-digit Indian mobile number.',
    'auth/too-many-requests': 'Too many OTP requests. Wait a few minutes or use a Firebase test phone number.',
    'auth/captcha-check-failed': 'reCAPTCHA failed. Disable ad blockers, refresh the page, and try again.',
    'auth/quota-exceeded': 'SMS quota exceeded. Add a test phone under Authentication → Sign-in method → Phone numbers for testing.',
    'auth/billing-not-enabled':
      'Real SMS requires the Firebase Blaze plan. For development, use a test phone number in Firebase Console.',
  };

  if (messages[code]) return messages[code];
  return err?.message || 'Failed to send OTP. Please try again.';
}

export function FirebasePhoneAuth({ onSuccess, submitLabel = 'Continue' }) {
  const [step, setStep] = useState('phone');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);
  const confirmationRef = useRef(null);
  const recaptchaRef = useRef(null);

  useEffect(() => {
    if (resendCooldown <= 0) return undefined;
    const timer = setInterval(() => {
      setResendCooldown((value) => Math.max(0, value - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    return () => {
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    };
  }, []);

  const getRecaptchaVerifier = () => {
    if (recaptchaRef.current) {
      recaptchaRef.current.clear();
      recaptchaRef.current = null;
    }

    recaptchaRef.current = new RecaptchaVerifier(auth, 'firebase-recaptcha-container', {
      size: 'invisible',
    });

    return recaptchaRef.current;
  };

  const isMockMode = !isFirebaseConfigured;

  const sendOtp = async () => {
    if (phoneNumber.length !== 10) {
      setError('Please enter a valid 10-digit mobile number.');
      return;
    }

    setLoading(true);
    setError('');

    if (isMockMode) {
      setTimeout(() => {
        setStep('otp');
        setOtp('123456');
        setLoading(false);
      }, 500);
      return;
    }

    try {
      const verifier = getRecaptchaVerifier();
      const confirmation = await signInWithPhoneNumber(auth, `+91${phoneNumber}`, verifier);
      confirmationRef.current = confirmation;
      setStep('otp');
      setResendCooldown(30);
    } catch (err) {
      console.error('Firebase sendVerificationCode failed:', err?.code, err?.message);
      setError(getFirebaseAuthErrorMessage(err));
      if (recaptchaRef.current) {
        recaptchaRef.current.clear();
        recaptchaRef.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (isMockMode) {
      setLoading(true);
      if (otp.length !== 6) {
        setError('Enter the 6-digit OTP.');
        setLoading(false);
        return;
      }
      setTimeout(() => {
        onSuccess('mock-firebase-id-token-123456');
        setLoading(false);
      }, 500);
      return;
    }

    if (!confirmationRef.current) {
      setError('Please request OTP again.');
      setStep('phone');
      return;
    }

    if (otp.length !== 6) {
      setError('Enter the 6-digit OTP.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await confirmationRef.current.confirm(otp);
      const idToken = await result.user.getIdToken();
      await onSuccess(idToken);
    } catch (err) {
      console.error('Firebase OTP verify failed:', err?.code, err?.message);
      setError(getFirebaseAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    await sendOtp();
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    await verifyOtp();
  };

  return (
    <div className="flex flex-col gap-5">
      {isMockMode && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2.5 font-medium leading-relaxed">
          ⚠️ <strong>Firebase Config Missing:</strong> Running in local development mock mode. Enter any 10-digit number to log in (OTP code is pre-filled as <strong>123456</strong>).
        </div>
      )}
      <div id="firebase-recaptcha-container" />

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {step === 'phone' ? (
        <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-5">
          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-wider text-neutral-800 mb-1">
              Welcome Back
            </h4>
            <p className="text-neutral-400 text-xs">Enter your mobile number to receive an OTP via Firebase.</p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="firebase-phone" className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              Mobile Number
            </label>
            <div className="flex items-center border border-neutral-200 rounded-lg overflow-hidden bg-neutral-50 focus-within:border-[#E31E24] focus-within:bg-white transition-all">
              <span className="px-3.5 py-3 text-xs font-bold text-neutral-500 border-r border-neutral-200 bg-neutral-100/50">
                +91
              </span>
              <div className="flex-grow flex items-center px-3.5 gap-2">
                <Phone className="w-4 h-4 text-neutral-400" />
                <input
                  id="firebase-phone"
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
            disabled={loading}
            className="w-full bg-[#E31E24] hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {loading ? 'Sending OTP...' : submitLabel}
          </button>
        </form>
      ) : (
        <form onSubmit={handleOtpSubmit} className="flex flex-col gap-5">
          <div>
            <h4 className="font-display text-sm font-extrabold uppercase tracking-wider text-neutral-800 mb-1">
              Verify OTP
            </h4>
            <p className="text-neutral-400 text-xs">
              Enter the 6-digit code sent to +91 {phoneNumber}
            </p>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="firebase-otp" className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider">
              OTP Code
            </label>
            <input
              id="firebase-otp"
              type="text"
              inputMode="numeric"
              maxLength="6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              placeholder="6 digit OTP"
              className="w-full px-4 py-3 border border-neutral-200 rounded-lg text-sm font-semibold tracking-[0.3em] text-center focus:outline-none focus:border-[#E31E24]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E31E24] hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold uppercase tracking-wider py-3.5 rounded-lg shadow-md cursor-pointer transition-colors"
          >
            {loading ? 'Verifying...' : 'Verify & Login'}
          </button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => {
                setStep('phone');
                setOtp('');
                setError('');
              }}
              className="text-neutral-500 hover:text-[#E31E24] font-semibold cursor-pointer"
            >
              Change number
            </button>
            <button
              type="button"
              disabled={resendCooldown > 0 || loading}
              onClick={sendOtp}
              className="text-[#E31E24] font-bold disabled:opacity-50 cursor-pointer"
            >
              {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend OTP'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

export default FirebasePhoneAuth;
