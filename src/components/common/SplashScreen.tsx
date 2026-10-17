import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Tag, MapPin, Zap, ArrowRight, ShieldCheck, Sparkles, Smartphone } from 'lucide-react';
import imgGrocery from '../../assets/images/hero_local_store_mart_1791781363191.jpg';

export const SplashScreen: React.FC = () => {
  const { setShowSplashScreen, setIsAuthModalOpen, setAuthTargetRole, setAuthInitialTab, quickSwitchUser } = useApp();

  const handleStartExploring = () => {
    quickSwitchUser('shopper');
    setShowSplashScreen(false);
  };

  const handleMerchantEntry = () => {
    setAuthTargetRole('store_owner');
    setAuthInitialTab('login');
    setIsAuthModalOpen(true);
    setShowSplashScreen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 text-white overflow-y-auto">
      {/* Background ambient lighting */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/15 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl h-96 bg-indigo-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-xl mx-auto p-6 md:p-8 flex flex-col items-center text-center z-10">
        {/* App Logo & Badge */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-400 flex items-center justify-center shadow-2xl shadow-amber-500/25 ring-4 ring-amber-500/20">
            <Store className="w-10 h-10 text-slate-950" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-slate-950 p-1.5 rounded-xl shadow-lg ring-2 ring-slate-950">
            <Zap className="w-4 h-4 fill-slate-950" />
          </div>
        </div>

        {/* Title */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <span>Hyperlocal Commerce Hub</span>
            <span>·</span>
            <span>स्पॉटलॉक · SpotLock</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight font-display text-white">
            Spot<span className="text-amber-400">Lock</span>
          </h1>
          <p className="text-slate-300 text-sm md:text-base max-w-md mx-auto leading-relaxed">
            Discover today's biggest discounts, flash deals & exclusive coupons from neighborhood stores around you.
          </p>
        </div>

        {/* Hero Visual Preview */}
        <div className="w-full relative rounded-2xl overflow-hidden border border-slate-800 mb-6 group shadow-2xl">
          <img
            src={imgGrocery}
            alt="Local Supermarket Showcase"
            className="w-full h-44 object-cover brightness-90 group-hover:scale-105 transition-transform duration-700"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent flex flex-col justify-end p-4 text-left">
            <div className="flex items-center gap-2 text-xs text-amber-300 font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real-time discounts from local kiranas, bakeries & boutiques</span>
            </div>
            <div className="flex items-center justify-between text-xs text-slate-300">
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                <span>Search by City or 6-digit Pincode</span>
              </span>
              <span className="text-emerald-400 font-medium">Recharge & Go Active</span>
            </div>
          </div>
        </div>

        {/* 3 Pillars */}
        <div className="grid grid-cols-3 gap-2.5 w-full mb-8 text-left">
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <Tag className="w-4 h-4 text-amber-400 mb-1.5" />
            <h2 className="text-xs font-semibold text-white">Daily Deals</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Fresh offers updated daily by store owners</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <MapPin className="w-4 h-4 text-rose-400 mb-1.5" />
            <h2 className="text-xs font-semibold text-white">Interactive Map</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">See stores around your exact street & radius</p>
          </div>
          <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3">
            <ShieldCheck className="w-4 h-4 text-emerald-400 mb-1.5" />
            <h2 className="text-xs font-semibold text-white">Tata Play Model</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight">Prepaid recharge plans with 7-day free demo</p>
          </div>
        </div>

        {/* 2 Primary Entry Paths */}
        <div className="w-full space-y-3">
          <button
            onClick={handleStartExploring}
            className="w-full py-3.5 px-6 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.99]"
          >
            <span>Explore Stores as Shopper</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={handleMerchantEntry}
            className="w-full py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-white font-semibold text-sm flex items-center justify-center gap-2 transition-colors active:scale-[0.99]"
          >
            <Store className="w-4 h-4 text-amber-400" />
            <span>Store Owner Portal (List & Recharge)</span>
          </button>
        </div>

        {/* Footer skip */}
        <div className="mt-5 flex items-center justify-between w-full text-xs text-slate-500">
          <span>Designed for React Native (iOS & Android)</span>
          <button
            onClick={() => setShowSplashScreen(false)}
            className="text-slate-400 hover:text-white underline underline-offset-4"
          >
            Skip Splash
          </button>
        </div>
      </div>
    </div>
  );
};
