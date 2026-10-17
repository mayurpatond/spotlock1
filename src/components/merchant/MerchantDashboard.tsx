import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { StoreProfileEditor } from './StoreProfileEditor';
import { DailyOffersManager } from './DailyOffersManager';
import { CouponsManager } from './CouponsManager';
import { SubscriptionPlans } from './SubscriptionPlans';
import { MerchantAnalytics } from './MerchantAnalytics';
import { PaymentGatewayModal } from './PaymentGatewayModal';
import { RechargePlan } from '../../types';
import {
  Store as StoreIcon,
  LayoutDashboard,
  Tag,
  CreditCard,
  BarChart3,
  Edit3,
  AlertCircle,
  CheckCircle2,
  Clock,
  Sparkles,
  ExternalLink,
  MapPin,
  ShieldAlert,
  ArrowRight,
  Eye,
  MessageCircle,
  Copy,
} from 'lucide-react';

export const MerchantDashboard: React.FC = () => {
  const {
    currentUser,
    stores,
    merchantTab,
    setMerchantTab,
    setIsAuthModalOpen,
    setAuthTargetRole,
    setAuthInitialTab,
    quickSwitchUser,
    setActiveStoreModal,
  } = useApp();

  // Selected recharge plan for checkout modal
  const [activePaymentModalPlan, setActivePaymentModalPlan] = useState<{
    plan: RechargePlan;
    customDays?: number;
    customPrice?: number;
  } | null>(null);

  // Strict role verification: Normal shoppers cannot access this screen!
  if (currentUser?.role !== 'store_owner') {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 max-w-xl mx-auto my-12 text-center text-white space-y-4 shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold font-display text-white">
          Store Owner Management Access Only
        </h2>
        <p className="text-xs text-slate-300 max-w-sm mx-auto leading-relaxed">
          This portal is reserved strictly for registered local store owners to manage store profiles, publish daily deals, and maintain their Tata Play-style prepaid recharge plan.
        </p>

        <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
          <button
            onClick={() => quickSwitchUser('merchant_active')}
            className="px-4 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs transition-colors shadow-md"
          >
            Demo as Active Store Owner
          </button>
          <button
            onClick={() => {
              setAuthTargetRole('store_owner');
              setAuthInitialTab('login');
              setIsAuthModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs border border-slate-700 transition-colors"
          >
            Sign In with Merchant Account
          </button>
        </div>
      </div>
    );
  }

  // Find store matching current merchant
  const myStore =
    stores.find((s) => s.ownerId === currentUser.id || s.id === currentUser.storeId) || stores[0];

  const sub = myStore.subscription;

  const handleOpenPayment = (plan: RechargePlan, customDays?: number, customPrice?: number) => {
    setActivePaymentModalPlan({ plan, customDays, customPrice });
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Merchant Hero Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="relative">
            <img
              src={myStore.image}
              alt={myStore.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border border-slate-700"
              referrerPolicy="no-referrer"
            />
            {sub.isActive ? (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center text-slate-950" title="Store Live">
                <CheckCircle2 className="w-3.5 h-3.5" />
              </span>
            ) : (
              <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-rose-500 border-2 border-slate-900 flex items-center justify-center text-white" title="Subscription Due">
                <AlertCircle className="w-3.5 h-3.5" />
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-bold font-display text-white">
                {myStore.name}
              </h1>
              <span className="text-[11px] font-semibold bg-slate-800 text-amber-400 px-2.5 py-0.5 rounded-full border border-slate-700">
                {myStore.category}
              </span>
            </div>
            <p className="text-xs text-slate-400 flex items-center gap-1.5 mt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>{myStore.address}, {myStore.city} ({myStore.pincode})</span>
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={() => setActiveStoreModal(myStore)}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5 text-amber-400" />
            <span>Customer View</span>
          </button>

          <button
            onClick={() => setMerchantTab('recharge')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm ${
              !sub.isActive
                ? 'bg-rose-600 hover:bg-rose-500 text-white animate-pulse'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>{!sub.isActive ? 'Recharge Now (Required)' : 'Manage Pack'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar border-b border-slate-800 pb-2">
        <button
          onClick={() => setMerchantTab('overview')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            merchantTab === 'overview'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" />
          <span>Dashboard Overview</span>
        </button>

        <button
          onClick={() => setMerchantTab('offers')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            merchantTab === 'offers'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Daily Discounts & Deals ({myStore.dailyDiscounts.filter((d) => d.isActive).length})</span>
        </button>

        <button
          onClick={() => setMerchantTab('coupons')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            merchantTab === 'coupons'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Tag className="w-3.5 h-3.5" />
          <span>Coupons & Codes ({myStore.coupons.filter((c) => c.isActive).length})</span>
        </button>

        <button
          onClick={() => setMerchantTab('recharge')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            merchantTab === 'recharge'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <CreditCard className="w-3.5 h-3.5" />
          <span>Tata Play Recharge Plans</span>
        </button>

        <button
          onClick={() => setMerchantTab('profile')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            merchantTab === 'profile'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Store Profile Editor</span>
        </button>

        <button
          onClick={() => setMerchantTab('analytics')}
          className={`px-4 py-2 text-xs font-bold rounded-xl whitespace-nowrap shrink-0 flex items-center gap-2 transition-colors ${
            merchantTab === 'analytics'
              ? 'bg-amber-400 text-slate-950 shadow-sm'
              : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
          }`}
        >
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analytics & Leads</span>
        </button>
      </div>

      {/* SUB-TAB VIEWS */}
      {merchantTab === 'overview' && (
        <div className="space-y-6">
          {/* Status banner */}
          <div
            className={`p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              !sub.isActive
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                : sub.isTrial
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
            }`}
          >
            <div className="flex items-start gap-3">
              {!sub.isActive ? (
                <AlertCircle className="w-6 h-6 text-rose-400 shrink-0 mt-0.5" />
              ) : sub.isTrial ? (
                <Clock className="w-6 h-6 text-amber-400 shrink-0 mt-0.5" />
              ) : (
                <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
              )}
              <div>
                <h3 className="font-bold text-sm text-white">
                  {!sub.isActive
                    ? 'Recharge Required · Store Currently Hidden from Shoppers'
                    : sub.isTrial
                    ? `Complimentary 7-Day Demo Active (${sub.trialDaysRemaining} Days Left)`
                    : `Active Prepaid Pack: ${sub.planName}`}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  {!sub.isActive
                    ? 'Your monthly pack has lapsed. Recharge now to make your store visible and accept customer leads.'
                    : `Valid until ${sub.expiryDate}. Active stores appear in search, pincode lookups, and interactive map.`}
                </p>
              </div>
            </div>

            <button
              onClick={() => setMerchantTab('recharge')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap shrink-0 transition-colors shadow-sm ${
                !sub.isActive
                  ? 'bg-rose-500 hover:bg-rose-400 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-white border border-slate-700'
              }`}
            >
              {!sub.isActive ? 'Recharge Now' : 'Extend Validity'}
            </button>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs">Shopper Views</span>
                <Eye className="w-4 h-4 text-sky-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{myStore.viewsCount}</div>
              <span className="text-[10px] text-slate-400">Total profile visits</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs">Coupons Copied</span>
                <Copy className="w-4 h-4 text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{myStore.couponsCopiedCount}</div>
              <span className="text-[10px] text-amber-400">Saved by customers</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs">Direct Leads</span>
                <MessageCircle className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">{myStore.leadsCount}</div>
              <span className="text-[10px] text-emerald-400">Calls & WhatsApp</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <div className="flex items-center justify-between text-slate-400 mb-1">
                <span className="text-xs">Active Deals</span>
                <Sparkles className="w-4 h-4 text-purple-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono">
                {myStore.dailyDiscounts.filter((d) => d.isActive).length} / {sub.dailyOfferLimit}
              </div>
              <span className="text-[10px] text-slate-400">Daily limit</span>
            </div>
          </div>

          {/* Quick Shortcuts */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => setMerchantTab('offers')}
              className="bg-slate-900 border border-slate-800 hover:border-amber-400/50 p-5 rounded-2xl text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-400/10 text-amber-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Sparkles className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Publish Today's Discount</h4>
              <p className="text-xs text-slate-400 mt-1">
                Push today's special offers (e.g. 20% OFF on Dairy) live to nearby customers instantly.
              </p>
              <div className="mt-3 text-xs font-semibold text-amber-400 flex items-center gap-1">
                <span>Manage Offers</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => setMerchantTab('coupons')}
              className="bg-slate-900 border border-slate-800 hover:border-emerald-400/50 p-5 rounded-2xl text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-400/10 text-emerald-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <Tag className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Create Promo Coupons</h4>
              <p className="text-xs text-slate-400 mt-1">
                Add digital voucher codes for festival specials or first-time customer discounts.
              </p>
              <div className="mt-3 text-xs font-semibold text-emerald-400 flex items-center gap-1">
                <span>Manage Coupons</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            <button
              onClick={() => setMerchantTab('recharge')}
              className="bg-slate-900 border border-slate-800 hover:border-sky-400/50 p-5 rounded-2xl text-left transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-400/10 text-sky-400 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                <CreditCard className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-bold text-white font-display">Prepaid Recharge Plans</h4>
              <p className="text-xs text-slate-400 mt-1">
                Tata Play-style monthly or flexi packs. Keep your store listed and ranked high.
              </p>
              <div className="mt-3 text-xs font-semibold text-sky-400 flex items-center gap-1">
                <span>Recharge Plans</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        </div>
      )}

      {merchantTab === 'profile' && <StoreProfileEditor store={myStore} />}
      {merchantTab === 'offers' && <DailyOffersManager store={myStore} />}
      {merchantTab === 'coupons' && <CouponsManager store={myStore} />}
      {merchantTab === 'recharge' && (
        <SubscriptionPlans store={myStore} onOpenPaymentModal={handleOpenPayment} />
      )}
      {merchantTab === 'analytics' && <MerchantAnalytics store={myStore} />}

      {/* Payment Gateway Modal */}
      {activePaymentModalPlan && (
        <PaymentGatewayModal
          store={myStore}
          plan={activePaymentModalPlan.plan}
          customDays={activePaymentModalPlan.customDays}
          customPrice={activePaymentModalPlan.customPrice}
          onClose={() => setActivePaymentModalPlan(null)}
        />
      )}
    </div>
  );
};
