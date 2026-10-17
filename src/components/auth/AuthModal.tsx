import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { UserRole, Store } from '../../types';
import { CITIES, PINCODES } from '../../data/mockData';
import { api } from '../../services/api';
import {
  X,
  Store as StoreIcon,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Clock,
  KeyRound,
  RotateCcw,
  Check,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    isAuthModalOpen,
    setIsAuthModalOpen,
    authInitialTab,
    authTargetRole,
    loginAs,
    registerShopper,
    registerStoreOwner,
    quickSwitchUser,
  } = useApp();

  const [authMethod, setAuthMethod] = useState<'mobile_otp' | 'google' | 'quick_demo'>('mobile_otp');
  const [selectedRole, setSelectedRole] = useState<UserRole>(authTargetRole);

  // Mobile OTP state
  const [phoneNumber, setPhoneNumber] = useState('9820011223');
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [demoReceivedOtp, setDemoReceivedOtp] = useState<string | null>(null);
  const [otpTimer, setOtpTimer] = useState(30);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // New store registration details
  const [isNewStoreOwner, setIsNewStoreOwner] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [storeCategory, setStoreCategory] = useState<Store['category']>('Grocery');
  const [storeAddress, setStoreAddress] = useState('');
  const [storeCity, setStoreCity] = useState('Mumbai');
  const [storePincode, setStorePincode] = useState('400050');
  const [ownerName, setOwnerName] = useState('Rajesh Sharma');

  useEffect(() => {
    setSelectedRole(authTargetRole);
    setErrorMessage(null);
  }, [authTargetRole, isAuthModalOpen]);

  // OTP Countdown timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => {
        setOtpTimer((t) => t - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  if (!isAuthModalOpen) return null;

  // 1. Send Mobile OTP
  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const clean = phoneNumber.replace(/\D/g, '');
    if (clean.length < 10) {
      setErrorMessage('Please enter a valid 10-digit mobile number.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.sendMobileOtp(clean);
      setOtpSent(true);
      setOtpTimer(30);
      if (res.demoOtp) {
        setDemoReceivedOtp(res.demoOtp);
        // Pre-fill test OTP for frictionless experience
        setOtpCode(res.demoOtp);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to send OTP.');
    } finally {
      setIsLoading(false);
    }
  };

  // 2. Verify Mobile OTP
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!otpCode || otpCode.length < 4) {
      setErrorMessage('Please enter the 6-digit OTP received on your mobile.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await api.verifyMobileOtp({
        phone: phoneNumber,
        otp: otpCode,
        role: selectedRole,
        name: ownerName,
        city: storeCity,
        pincode: storePincode,
      });

      if (selectedRole === 'store_owner' && isNewStoreOwner) {
        registerStoreOwner(
          {
            name: storeName || 'My Local Store',
            category: storeCategory,
            city: storeCity,
            pincode: storePincode,
            address: storeAddress || 'Market Road',
            phone: `+91 ${phoneNumber}`,
            whatsapp: phoneNumber,
            timing: '8:30 AM - 10:00 PM',
            description: 'Local neighborhood verified store on SpotLock.',
          },
          {
            name: ownerName,
            email: `${phoneNumber}@spotlock.local`,
            phone: `+91 ${phoneNumber}`,
          }
        );
      } else {
        loginAs(res.user);
      }
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'OTP verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Google Sign-In
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const googleEmail =
        selectedRole === 'store_owner' ? 'rajesh.sharma@mahalaxmi.com' : 'priya.sharma@gmail.com';
      const googleName = selectedRole === 'store_owner' ? 'Rajesh Sharma' : 'Priya Sharma';

      const res = await api.loginWithGoogle({
        email: googleEmail,
        name: googleName,
        role: selectedRole,
      });

      loginAs(res.user);
      setIsAuthModalOpen(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Google sign-in failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 text-white text-left">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-slate-800 bg-slate-950/40">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-md bg-amber-400 text-slate-950 font-black text-xs flex items-center justify-center">
                SL
              </span>
              <h2 className="text-lg font-bold font-display text-white">
                SpotLock Account Access
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Secure Mobile OTP & Google Authentication
            </p>
          </div>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* 1. Account Role Switcher: 2 Distinct Profiles */}
          <div>
            <label className="block text-xs font-semibold text-slate-400 mb-2">
              Select Your Access Role:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Option 1: Normal Shopper */}
              <button
                type="button"
                onClick={() => {
                  setSelectedRole('shopper');
                  setIsNewStoreOwner(false);
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'shopper'
                    ? 'border-amber-400 bg-amber-400/10 text-white ring-1 ring-amber-400/30'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedRole === 'shopper'
                        ? 'bg-amber-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  {selectedRole === 'shopper' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
                  )}
                </div>
                <div className="font-bold text-xs text-white">Shopper / User</div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  Explore deals, map view & copy coupons
                </p>
              </button>

              {/* Option 2: Store Owner */}
              <button
                type="button"
                onClick={() => setSelectedRole('store_owner')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedRole === 'store_owner'
                    ? 'border-emerald-400 bg-emerald-400/10 text-white ring-1 ring-emerald-400/30'
                    : 'border-slate-800 bg-slate-800/40 text-slate-400 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      selectedRole === 'store_owner'
                        ? 'bg-emerald-400 text-slate-950'
                        : 'bg-slate-800 text-slate-300'
                    }`}
                  >
                    <StoreIcon className="w-4 h-4" />
                  </div>
                  {selectedRole === 'store_owner' && (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="font-bold text-xs text-white">Store Owner</div>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">
                  List store, post offers & manage recharge
                </p>
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs">
              {errorMessage}
            </div>
          )}

          {/* 2. Login Options: Mobile Number OTP vs Google */}
          <div className="flex items-center gap-2 p-1 bg-slate-800/80 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setAuthMethod('mobile_otp');
                setOtpSent(false);
              }}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                authMethod === 'mobile_otp'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Mobile Number OTP</span>
            </button>

            <button
              type="button"
              onClick={() => setAuthMethod('google')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
                authMethod === 'google'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Login with Google</span>
            </button>
          </div>

          {/* METHOD A: MOBILE NUMBER OTP LOGIN */}
          {authMethod === 'mobile_otp' && (
            <div className="space-y-4">
              {!otpSent ? (
                /* Step 1: Enter Phone Number */
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Enter Mobile Number (India +91) *
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 border-r border-slate-700 pr-2">
                        +91
                      </div>
                      <input
                        type="tel"
                        required
                        maxLength={10}
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        placeholder="98200 11223"
                        className="w-full pl-16 pr-4 py-2.5 text-sm font-mono bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
                      />
                    </div>
                    <p className="text-[11px] text-slate-400 mt-1">
                      We'll send a 6-digit OTP code to verify your account.
                    </p>
                  </div>

                  {selectedRole === 'store_owner' && (
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-800/60 border border-slate-700">
                      <input
                        type="checkbox"
                        id="newStoreToggle"
                        checked={isNewStoreOwner}
                        onChange={(e) => setIsNewStoreOwner(e.target.checked)}
                        className="rounded accent-emerald-400"
                      />
                      <label htmlFor="newStoreToggle" className="text-xs text-slate-300 cursor-pointer">
                        This is a brand new store (Activate 7-Day Free Demo)
                      </label>
                    </div>
                  )}

                  {selectedRole === 'store_owner' && isNewStoreOwner && (
                    <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700 space-y-2.5">
                      <div>
                        <label className="block text-[11px] text-slate-300 mb-1">Store Name *</label>
                        <input
                          type="text"
                          required
                          value={storeName}
                          onChange={(e) => setStoreName(e.target.value)}
                          placeholder="e.g. Apex Kirana & Supermarket"
                          className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Category</label>
                          <select
                            value={storeCategory}
                            onChange={(e) => setStoreCategory(e.target.value as Store['category'])}
                            className="w-full px-2 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                          >
                            <option value="Grocery">Grocery</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Fashion">Fashion</option>
                            <option value="Bakery & Cafe">Bakery</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-[11px] text-slate-300 mb-1">Pincode</label>
                          <input
                            type="text"
                            maxLength={6}
                            value={storePincode}
                            onChange={(e) => setStorePincode(e.target.value)}
                            className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.99] disabled:opacity-50"
                  >
                    <span>Get 6-Digit OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              ) : (
                /* Step 2: Enter OTP */
                <form onSubmit={handleVerifyOtp} className="space-y-4">
                  <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-slate-400">OTP sent to: </span>
                      <strong className="text-white">+91 {phoneNumber}</strong>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOtpSent(false)}
                      className="text-amber-400 hover:underline font-semibold text-[11px]"
                    >
                      Change
                    </button>
                  </div>

                  {demoReceivedOtp && (
                    <div className="p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                        <span>
                          Test OTP Code: <strong className="font-mono text-white text-sm">{demoReceivedOtp}</strong>
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setOtpCode(demoReceivedOtp)}
                        className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 text-[10px] font-bold"
                      >
                        Auto Fill
                      </button>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-medium text-slate-300 mb-1.5">
                      Enter 6-Digit Verification Code *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                      placeholder="e.g. 123456"
                      className="w-full text-center tracking-[0.5em] text-xl font-bold font-mono py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-amber-400 placeholder-slate-600 focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">
                      {otpTimer > 0 ? (
                        `Resend code in ${otpTimer}s`
                      ) : (
                        <button
                          type="button"
                          onClick={handleSendOtp}
                          className="text-amber-400 hover:underline font-semibold"
                        >
                          Resend OTP Code
                        </button>
                      )}
                    </span>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center gap-2 transition-colors shadow-lg shadow-emerald-500/20 active:scale-[0.99] disabled:opacity-50"
                  >
                    <Check className="w-4 h-4" />
                    <span>Verify OTP & Sign In</span>
                  </button>
                </form>
              )}
            </div>
          )}

          {/* METHOD B: LOGIN WITH GOOGLE */}
          {authMethod === 'google' && (
            <div className="space-y-4 text-center py-2">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 space-y-2">
                <p className="text-xs text-slate-300 leading-relaxed">
                  Sign in instantly with your verified Google Account as{' '}
                  <strong className="text-white">
                    {selectedRole === 'store_owner' ? 'Store Owner' : 'Shopper'}
                  </strong>
                  .
                </p>
                <div className="text-[11px] text-slate-400">
                  Profile information and authentication tokens are automatically linked to SpotLock's PostgreSQL database.
                </div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isLoading}
                className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs sm:text-sm flex items-center justify-center gap-3 transition-colors shadow-lg active:scale-[0.99]"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Continue with Google</span>
              </button>
            </div>
          )}

          {/* Quick Demo Credentials Footer */}
          <div className="pt-3 border-t border-slate-800">
            <div className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Instant 1-Click Test Personas
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  quickSwitchUser('shopper');
                  setIsAuthModalOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left text-slate-200 border border-slate-700"
              >
                <div className="font-semibold text-amber-300">Shopper: Priya</div>
                <div className="text-[10px] text-slate-400">Mobile +91 9820011223</div>
              </button>
              <button
                type="button"
                onClick={() => {
                  quickSwitchUser('merchant_active');
                  setIsAuthModalOpen(false);
                }}
                className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-left text-slate-200 border border-slate-700"
              >
                <div className="font-semibold text-emerald-300">Merchant: Rajesh</div>
                <div className="text-[10px] text-slate-400">Active Tata Play Pack</div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
