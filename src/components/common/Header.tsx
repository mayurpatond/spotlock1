import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Store,
  User,
  Smartphone,
  Monitor,
  LogOut,
  ChevronDown,
  Sparkles,
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  QrCode,
} from 'lucide-react';
import { MobileQRModal } from './MobileQRModal';

export const Header: React.FC = () => {
  const {
    currentUser,
    logout,
    setIsAuthModalOpen,
    setAuthTargetRole,
    setAuthInitialTab,
    shopperTab,
    setShopperTab,
    merchantTab,
    setMerchantTab,
    viewDeviceFrame,
    setViewDeviceFrame,
    quickSwitchUser,
    setShowSplashScreen,
    stores,
  } = useApp();

  const [showDemoMenu, setShowDemoMenu] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  const isMerchant = currentUser?.role === 'store_owner';
  const myStore = isMerchant
    ? stores.find((s) => s.ownerId === currentUser.id || s.id === currentUser.storeId)
    : null;

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white">
      {/* Top Banner Alert if Merchant Subscription Expired or in Free Trial */}
      {isMerchant && myStore && (
        <div
          className={`px-4 py-1.5 text-xs flex items-center justify-between ${
            myStore.subscription.isActive
              ? myStore.subscription.isTrial
                ? 'bg-amber-500/10 text-amber-300 border-b border-amber-500/20'
                : 'bg-emerald-500/10 text-emerald-300 border-b border-emerald-500/20'
              : 'bg-rose-500/15 text-rose-300 border-b border-rose-500/20'
          }`}
        >
          <div className="flex items-center gap-2 max-w-4xl mx-auto w-full">
            {myStore.subscription.isActive ? (
              myStore.subscription.isTrial ? (
                <>
                  <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span>
                    <strong>Free Demo Trial Active:</strong> {myStore.subscription.trialDaysRemaining} days remaining before recharge required.
                  </span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span>
                    <strong>Store Live:</strong> {myStore.subscription.planName} · Active until {myStore.subscription.expiryDate}
                  </span>
                </>
              )
            ) : (
              <>
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                <span>
                  <strong>Store Unlisted (Tata Play Recharge Model):</strong> Subscription expired. Recharge to make your store and offers visible!
                </span>
              </>
            )}
            <button
              onClick={() => setMerchantTab('recharge')}
              className="ml-auto underline underline-offset-2 font-semibold hover:text-white shrink-0"
            >
              Manage Recharge
            </button>
          </div>
        </div>
      )}

      {/* Main Top Bar Contract: Zone 1 Wordmark - Zone 2 Links - Zone 3 Primary Action */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (isMerchant) {
                setMerchantTab('overview');
              } else {
                setShopperTab('explore');
              }
            }}
            className="text-xl font-bold tracking-tight text-white font-display flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <span className="w-8 h-8 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
              SL
            </span>
            <span>
              Spot<span className="text-amber-400">Lock</span>
            </span>
          </button>

          {isMerchant && (
            <span className="hidden sm:inline-block text-[11px] font-semibold uppercase tracking-wider bg-slate-800 text-amber-300 px-2 py-0.5 rounded border border-slate-700">
              Store Owner Hub
            </span>
          )}
        </div>

        {/* Zone 2: 4-5 Single-line Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {!isMerchant ? (
            <>
              <button
                onClick={() => setShopperTab('explore')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  shopperTab === 'explore' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Local Stores
              </button>
              <button
                onClick={() => setShopperTab('map')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  shopperTab === 'map' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Interactive Map
              </button>
              <button
                onClick={() => setShopperTab('saved')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  shopperTab === 'saved' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Saved Stores
              </button>
              <button
                onClick={() => {
                  setShopperTab('explore');
                }}
                className="whitespace-nowrap shrink-0 hover:text-white transition-colors"
              >
                Daily Coupons
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setMerchantTab('overview')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  merchantTab === 'overview' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Dashboard
              </button>
              <button
                onClick={() => setMerchantTab('offers')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  merchantTab === 'offers' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Daily Offers
              </button>
              <button
                onClick={() => setMerchantTab('coupons')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  merchantTab === 'coupons' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Coupons
              </button>
              <button
                onClick={() => setMerchantTab('recharge')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  merchantTab === 'recharge' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Tata Play Plans
              </button>
              <button
                onClick={() => setMerchantTab('profile')}
                className={`whitespace-nowrap shrink-0 transition-colors ${
                  merchantTab === 'profile' ? 'text-amber-400 font-semibold' : 'hover:text-white'
                }`}
              >
                Edit Store
              </button>
            </>
          )}
        </nav>

        {/* Zone 3: Primary Action & Switcher Controls */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* Mobile frame simulator toggle for testing React Native experience */}
          <button
            onClick={() => setViewDeviceFrame(!viewDeviceFrame)}
            title={viewDeviceFrame ? 'Switch to Full-Width Responsive View' : 'Switch to Mobile App Frame View'}
            className="hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 text-xs rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition-colors"
          >
            {viewDeviceFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5 text-amber-400" />
                <span>Full Web</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Mobile Frame</span>
              </>
            )}
          </button>

          {/* Open on Real Phone QR Modal Button */}
          <button
            onClick={() => setShowQrModal(true)}
            title="Scan QR Code to open on your actual mobile phone"
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-400/10 hover:bg-amber-400/20 text-amber-300 border border-amber-400/30 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">Open on Phone</span>
          </button>

          {/* Quick Demo Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowDemoMenu(!showDemoMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200"
            >
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span className="truncate max-w-[110px] sm:max-w-none">
                {currentUser?.role === 'store_owner' ? 'Store Owner' : 'Shopper'}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {showDemoMenu && (
              <div className="absolute right-0 mt-2 w-72 rounded-xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 text-left">
                <div className="px-2 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Switch Active Role & Demo
                </div>
                <div className="space-y-1">
                  <button
                    onClick={() => {
                      quickSwitchUser('shopper');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">Shopper / User</div>
                      <div className="text-[11px] text-slate-400">Priya Sharma · Browse nearby deals</div>
                    </div>
                    {currentUser?.role === 'shopper' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      quickSwitchUser('merchant_active');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">Store Owner (Active)</div>
                      <div className="text-[11px] text-emerald-400">Mahalaxmi Supermarket · 3-Mo Plan</div>
                    </div>
                    {currentUser?.storeId === 'store-1' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      quickSwitchUser('merchant_trial');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">Store Owner (Free Demo)</div>
                      <div className="text-[11px] text-amber-400">Ethnic Elegance · 7-Day Trial</div>
                    </div>
                    {currentUser?.storeId === 'store-3' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>

                  <button
                    onClick={() => {
                      quickSwitchUser('merchant_expired');
                      setShowDemoMenu(false);
                    }}
                    className="w-full text-left p-2 rounded-lg hover:bg-slate-800 text-xs flex items-center justify-between"
                  >
                    <div>
                      <div className="font-semibold text-white">Store Owner (Recharge Due)</div>
                      <div className="text-[11px] text-rose-400">Apex Digital · Store Unlisted Demo</div>
                    </div>
                    {currentUser?.storeId === 'store-5' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    )}
                  </button>
                </div>

                <div className="border-t border-slate-800 mt-2 pt-2 flex items-center justify-between px-1">
                  <button
                    onClick={() => {
                      setShowSplashScreen(true);
                      setShowDemoMenu(false);
                    }}
                    className="text-[11px] text-amber-400 hover:underline"
                  >
                    View Splash Screen
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setShowDemoMenu(false);
                    }}
                    className="text-[11px] text-rose-400 hover:underline flex items-center gap-1"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Primary CTA Button */}
          {!currentUser ? (
            <button
              onClick={() => {
                setAuthTargetRole('shopper');
                setAuthInitialTab('login');
                setIsAuthModalOpen(true);
              }}
              className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 shadow-sm"
            >
              Sign In / Sign Up
            </button>
          ) : !isMerchant ? (
            <button
              onClick={() => {
                setAuthTargetRole('store_owner');
                setAuthInitialTab('login');
                setIsAuthModalOpen(true);
              }}
              className="px-3.5 py-2 text-xs font-semibold text-slate-950 bg-amber-400 hover:bg-amber-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Store className="w-3.5 h-3.5 text-slate-950" />
              <span>List Your Store</span>
            </button>
          ) : (
            <button
              onClick={() => setMerchantTab('recharge')}
              className="px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Recharge Plans</span>
            </button>
          )}
        </div>
      </div>

      {/* Real Mobile Phone QR & Install Modal */}
      <MobileQRModal
        isOpen={showQrModal}
        onClose={() => setShowQrModal(false)}
        sharedUrl={typeof window !== 'undefined' ? window.location.href : 'https://ais-pre-lrps56bpknaqkhjs252tre-968384056872.asia-east1.run.app'}
      />
    </header>
  );
};
