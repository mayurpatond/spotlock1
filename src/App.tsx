import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/common/Header';
import { SplashScreen } from './components/common/SplashScreen';
import { AuthModal } from './components/auth/AuthModal';
import { ShopperHome } from './components/shopper/ShopperHome';
import { InteractiveMap } from './components/shopper/InteractiveMap';
import { FavoritesView } from './components/shopper/FavoritesView';
import { StoreDetailModal } from './components/shopper/StoreDetailModal';
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { Store } from './types';
import {
  Compass,
  MapPin,
  Heart,
  User,
  LayoutDashboard,
  Sparkles,
  Tag,
  CreditCard,
  Edit3,
  Wifi,
  Battery,
  Smartphone,
  Store as StoreIcon,
} from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    currentUser,
    showSplashScreen,
    activeStoreModal,
    setActiveStoreModal,
    shopperTab,
    setShopperTab,
    merchantTab,
    setMerchantTab,
    viewDeviceFrame,
    setIsAuthModalOpen,
    setAuthTargetRole,
    setAuthInitialTab,
  } = useApp();

  const isMerchant = currentUser?.role === 'store_owner';

  // Navigation handlers
  const handleOpenStore = (store: Store) => {
    setActiveStoreModal(store);
  };

  const appContent = (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Top Application Bar */}
      <Header />

      {/* Main Screen Content Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-12">
        {isMerchant ? (
          /* Store Owner Screen */
          <MerchantDashboard />
        ) : (
          /* Normal Shopper Screens */
          <>
            {shopperTab === 'explore' && <ShopperHome onOpenStoreModal={handleOpenStore} />}
            {shopperTab === 'map' && <InteractiveMap onOpenStoreModal={handleOpenStore} />}
            {shopperTab === 'saved' && <FavoritesView onOpenStoreModal={handleOpenStore} />}
            {shopperTab === 'profile' && (
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-xl mx-auto text-left space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-full bg-amber-400 text-slate-950 font-black text-xl flex items-center justify-center">
                    {currentUser?.name.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white font-display">
                      {currentUser?.name || 'Shopper Profile'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {currentUser?.email || 'shopper@example.com'} · {currentUser?.city} ({currentUser?.pincode})
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Account Type</span>
                    <span className="text-amber-400 font-semibold">Local Shopper & Explorer</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Phone Number</span>
                    <span className="text-white">{currentUser?.phone}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800/60">
                    <span className="text-slate-400">Preferred City & Pincode</span>
                    <span className="text-white">{currentUser?.city} - {currentUser?.pincode}</span>
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    onClick={() => {
                      setAuthTargetRole('store_owner');
                      setAuthInitialTab('login');
                      setIsAuthModalOpen(true);
                    }}
                    className="w-full py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-400/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                  >
                    <StoreIcon className="w-4 h-4 text-amber-400" />
                    <span>Have a local shop? List Your Store Now</span>
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* MOBILE-NATIVE FIXED BOTTOM TAB BAR (Pattern 1 from Mobile skill) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 backdrop-blur-md border-t border-slate-800">
        {!isMerchant ? (
          /* Shopper 4-Tab Bar */
          <div className="grid grid-cols-4 items-center h-16">
            <button
              onClick={() => setShopperTab('explore')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                shopperTab === 'explore' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Compass className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Explore</span>
            </button>

            <button
              onClick={() => setShopperTab('map')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                shopperTab === 'map' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Map</span>
            </button>

            <button
              onClick={() => setShopperTab('saved')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                shopperTab === 'saved' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Heart className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Saved</span>
            </button>

            <button
              onClick={() => setShopperTab('profile')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                shopperTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <User className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Profile</span>
            </button>
          </div>
        ) : (
          /* Merchant 5-Tab Bar */
          <div className="grid grid-cols-5 items-center h-16">
            <button
              onClick={() => setMerchantTab('overview')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                merchantTab === 'overview' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutDashboard className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Home</span>
            </button>

            <button
              onClick={() => setMerchantTab('offers')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                merchantTab === 'offers' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Deals</span>
            </button>

            <button
              onClick={() => setMerchantTab('coupons')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                merchantTab === 'coupons' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Tag className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Coupons</span>
            </button>

            <button
              onClick={() => setMerchantTab('recharge')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                merchantTab === 'recharge' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Recharge</span>
            </button>

            <button
              onClick={() => setMerchantTab('profile')}
              className={`flex flex-col items-center justify-center py-1 transition-colors ${
                merchantTab === 'profile' ? 'text-amber-400 font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              <Edit3 className="w-5 h-5" />
              <span className="text-[10px] tracking-tight mt-1">Edit</span>
            </button>
          </div>
        )}
      </nav>

      {/* Global Modals */}
      <AuthModal />
      <StoreDetailModal store={activeStoreModal} onClose={() => setActiveStoreModal(null)} />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center">
      {/* Splash Screen */}
      {showSplashScreen && <SplashScreen />}

      {/* Render either inside React Native Smartphone Frame Simulator or standard Responsive view */}
      {viewDeviceFrame ? (
        <div className="py-8 px-4 flex flex-col items-center">
          {/* Top Frame Info */}
          <div className="text-xs text-slate-400 mb-3 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-emerald-400" />
            <span>
              <strong>React Native Mobile Simulator</strong> (iOS & Android preview)
            </span>
          </div>

          {/* Smartphone Bezel & Hardware Chassis */}
          <div className="relative w-[412px] h-[870px] bg-slate-900 rounded-[52px] shadow-[0_0_60px_rgba(0,0,0,0.8)] border-[10px] border-slate-800 overflow-hidden flex flex-col">
            {/* Dynamic Island / Speaker notch */}
            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-50 flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-slate-900 border border-slate-800 mr-2" />
              <div className="w-2 h-2 rounded-full bg-indigo-950" />
            </div>

            {/* Mobile Top Status Bar */}
            <div className="h-9 px-6 pt-2 bg-slate-900 flex items-center justify-between text-[11px] font-semibold text-slate-300 z-40 select-none">
              <span>9:41</span>
              <div className="flex items-center gap-1.5">
                <Wifi className="w-3 h-3" />
                <span className="text-[10px] font-bold">5G</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400" />
              </div>
            </div>

            {/* Screen Inner Viewport (Scrollable) */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative flex flex-col">
              {appContent}
            </div>

            {/* iOS/Android Home Indicator Bar */}
            <div className="h-4 bg-slate-900 flex items-center justify-center pb-1 z-50">
              <div className="w-32 h-1 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      ) : (
        /* Full-Width Responsive Standard View */
        <div className="w-full min-h-screen flex flex-col">{appContent}</div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
