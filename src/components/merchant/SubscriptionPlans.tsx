import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, RechargePlan } from '../../types';
import { RECHARGE_PLANS } from '../../data/mockData';
import {
  CreditCard,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Sliders,
  ShieldCheck,
  Zap,
  ArrowRight,
  FileText,
  Calendar,
} from 'lucide-react';

interface SubscriptionPlansProps {
  store: Store;
  onOpenPaymentModal: (plan: RechargePlan, customDays?: number, customPrice?: number) => void;
}

export const SubscriptionPlans: React.FC<SubscriptionPlansProps> = ({
  store,
  onOpenPaymentModal,
}) => {
  const { transactions } = useApp();

  const [selectedPlanId, setSelectedPlanId] = useState<string>('quarterly');
  const [customDays, setCustomDays] = useState<number>(45);

  const sub = store.subscription;
  const isExpired = !sub.isActive;

  // Calculate remaining days
  const today = new Date();
  const expiry = new Date(sub.expiryDate);
  const diffTime = expiry.getTime() - today.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Custom plan calculation (e.g. ₹10/day base)
  const customPrice = customDays * 10;
  const customPlan: RechargePlan = {
    id: 'custom',
    name: `Custom Flexi Pack (${customDays} Days)`,
    tagline: 'Custom duration tailored for your store campaign requirements',
    durationDays: customDays,
    price: customPrice,
    monthlyEquivalent: Math.round((customPrice / customDays) * 30),
    dailyOfferLimit: 10,
    featuredBadge: customDays >= 60,
    prioritySearch: customDays >= 60,
    whatsappDirectLeads: true,
  };

  const handleSelectAndPay = (plan: RechargePlan, isCustom = false) => {
    if (isCustom) {
      onOpenPaymentModal(customPlan, customDays, customPrice);
    } else {
      onOpenPaymentModal(plan);
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Current Tata Play Recharge Status Hero Card */}
      <div
        className={`p-6 rounded-2xl border shadow-xl relative overflow-hidden ${
          !sub.isActive
            ? 'bg-gradient-to-br from-rose-950/80 via-slate-900 to-slate-900 border-rose-500/40'
            : sub.isTrial
            ? 'bg-gradient-to-br from-amber-950/60 via-slate-900 to-slate-900 border-amber-500/30'
            : 'bg-gradient-to-br from-emerald-950/60 via-slate-900 to-slate-900 border-emerald-500/30'
        }`}
      >
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full ${
                  !sub.isActive
                    ? 'bg-rose-500 text-white'
                    : sub.isTrial
                    ? 'bg-amber-400 text-slate-950'
                    : 'bg-emerald-500 text-slate-950'
                }`}
              >
                {!sub.isActive
                  ? 'Recharge Expired · Store Unlisted'
                  : sub.isTrial
                  ? '7-Day Free Demo Active'
                  : 'Active Prepaid Recharge'}
              </span>
              <span className="text-xs text-slate-400">· Tata Play Model</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-display text-white">
              {sub.planName}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
              {!sub.isActive ? (
                <span className="text-rose-300 font-medium">
                  Your store listing is currently hidden from shoppers. Recharging with a monthly or yearly pack instantly restores your listing, map pins, and deals.
                </span>
              ) : sub.isTrial ? (
                <span>
                  You are enjoying a 7-day complimentary trial to showcase your store and offers. Recharge before expiry to avoid deactivation.
                </span>
              ) : (
                <span>
                  Your store is live on SpotLock. Verified listings and daily offers are reaching local customers in {store.city}.
                </span>
              )}
            </p>
          </div>

          <div className="bg-slate-900/90 border border-slate-700/80 rounded-xl p-4 text-center shrink-0 w-full sm:w-auto">
            <div className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              Validity Balance
            </div>
            <div
              className={`text-3xl font-black font-display my-1 ${
                !sub.isActive
                  ? 'text-rose-400'
                  : sub.isTrial
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {sub.isActive ? `${daysRemaining} Days` : '0 Days'}
            </div>
            <div className="text-[11px] text-slate-400">
              {sub.isActive ? `Valid till ${sub.expiryDate}` : 'Expired on ' + sub.expiryDate}
            </div>
          </div>
        </div>

        {/* Informational Callout */}
        <div className="mt-4 pt-4 border-t border-slate-800/80 flex items-center gap-2 text-xs text-slate-400">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong>Prepaid Listing Rule:</strong> Just like DTH TV channels, your store is shown to shoppers as long as your recharge is active. Instant recharge adds days immediately.
          </span>
        </div>
      </div>

      {/* RECHARGE PACK OPTIONS */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-bold font-display text-white">
              Choose a Recharge Plan to Power Your Store
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Transparent monthly, quarterly, annual, or custom options
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {RECHARGE_PLANS.map((plan) => {
            const isSelected = selectedPlanId === plan.id;
            return (
              <div
                key={plan.id}
                onClick={() => setSelectedPlanId(plan.id)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                  isSelected
                    ? 'bg-slate-900 border-amber-400 ring-2 ring-amber-400/30 shadow-2xl'
                    : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                }`}
              >
                {plan.isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-400 text-slate-950 text-[10px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                    Most Popular Choice
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300">{plan.name}</span>
                    <span className="text-[11px] font-medium text-slate-400">
                      {plan.durationDays} Days
                    </span>
                  </div>

                  <div className="my-2">
                    <div className="flex items-baseline gap-1">
                      <span className="text-2xl sm:text-3xl font-black text-white font-display">
                        ₹{plan.price}
                      </span>
                      <span className="text-xs text-slate-400">+ 18% GST</span>
                    </div>
                    <p className="text-[11px] text-emerald-400 mt-0.5 font-medium">
                      ~₹{plan.monthlyEquivalent}/month pro-rata
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{plan.tagline}</p>

                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Up to {plan.dailyOfferLimit} daily active offers</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Interactive Map pin with deal radar</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>Direct WhatsApp & Call customer leads</span>
                    </li>
                    {plan.featuredBadge && (
                      <li className="flex items-center gap-2 font-semibold text-amber-300">
                        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>Featured badge on local store feed</span>
                      </li>
                    )}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleSelectAndPay(plan);
                  }}
                  className={`mt-6 w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-colors ${
                    isSelected
                      ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-500/20'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <CreditCard className="w-3.5 h-3.5" />
                  <span>Recharge ₹{plan.price}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* CUSTOMIZABLE / FLEXI PACK OPTION */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-amber-400" />
            <h3 className="text-base font-bold text-white font-display">
              Customizable Flexi Pack (Choose Exact Days)
            </h3>
          </div>
          <span className="text-xs text-amber-400 font-semibold">Flexible Days Duration</span>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Need a custom duration for a seasonal festival sale or trial period? Choose anywhere between 15 and 180 days with transparent ₹10/day pricing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          <div className="sm:col-span-8 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Duration: <strong className="text-amber-400 text-sm">{customDays} Days</strong></span>
              <span>Rate: ₹10 / Day</span>
            </div>
            <input
              type="range"
              min={15}
              max={180}
              step={5}
              value={customDays}
              onChange={(e) => setCustomDays(Number(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-500 font-mono">
              <span>15 Days</span>
              <span>45 Days</span>
              <span>90 Days</span>
              <span>180 Days</span>
            </div>
          </div>

          <div className="sm:col-span-4 bg-slate-800/80 border border-slate-700 rounded-xl p-3.5 text-center flex flex-col justify-between">
            <div>
              <div className="text-[11px] text-slate-400">Total Base Fee</div>
              <div className="text-2xl font-black text-white font-display">₹{customPrice}</div>
              <div className="text-[10px] text-slate-400">+ 18% GST (₹{(customPrice * 0.18).toFixed(0)})</div>
            </div>

            <button
              onClick={() => handleSelectAndPay(customPlan, true)}
              className="mt-3 w-full py-2 px-3 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Recharge {customDays} Days</span>
            </button>
          </div>
        </div>
      </div>

      {/* PAST RECHARGE TRANSACTIONS / GST INVOICES */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-emerald-400" />
            <h4 className="text-sm font-bold text-white font-display">Recharge Payment History & Invoices</h4>
          </div>
          <span className="text-[11px] text-slate-400">Auto-generated GST Receipts</span>
        </div>

        {transactions.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No past payment transactions recorded yet.</p>
        ) : (
          <div className="overflow-x-auto no-scrollbar">
            <table className="w-full text-left text-xs text-slate-300">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 text-[11px]">
                  <th className="py-2">Txn ID</th>
                  <th className="py-2">Plan</th>
                  <th className="py-2">Duration</th>
                  <th className="py-2">Total Paid</th>
                  <th className="py-2">Method</th>
                  <th className="py-2">Date</th>
                  <th className="py-2">Valid Until</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono">
                {transactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30">
                    <td className="py-2.5 font-bold text-amber-400">{tx.id}</td>
                    <td className="py-2.5 font-sans font-medium text-white">{tx.planName}</td>
                    <td className="py-2.5">{tx.durationDays} Days</td>
                    <td className="py-2.5 font-bold text-emerald-400">₹{tx.totalAmount}</td>
                    <td className="py-2.5 font-sans uppercase text-[11px]">{tx.paymentMethod} {tx.upiApp ? `(${tx.upiApp})` : ''}</td>
                    <td className="py-2.5 font-sans text-slate-400">{tx.timestamp}</td>
                    <td className="py-2.5 text-slate-300">{tx.newExpiryDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
