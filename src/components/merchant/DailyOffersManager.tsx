import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, DailyDiscount } from '../../types';
import {
  Tag,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Sparkles,
  Clock,
  AlertCircle,
  CreditCard,
} from 'lucide-react';

interface DailyOffersManagerProps {
  store: Store;
}

export const DailyOffersManager: React.FC<DailyOffersManagerProps> = ({ store }) => {
  const {
    addDailyDiscount,
    toggleDailyDiscount,
    deleteDailyDiscount,
    setMerchantTab,
  } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [title, setTitle] = useState('');
  const [discountType, setDiscountType] = useState<'percent' | 'flat'>('percent');
  const [discountValue, setDiscountValue] = useState<number>(20);
  const [minBillAmount, setMinBillAmount] = useState<number>(250);
  const [categoryTag, setCategoryTag] = useState('Daily Flash Deal');
  const [validUntil, setValidUntil] = useState('Today, 9:00 PM');
  const [terms, setTerms] = useState('');

  const activeOffersCount = store.dailyDiscounts.filter((d) => d.isActive).length;
  const offerLimit = store.subscription.dailyOfferLimit;
  const isLimitReached = activeOffersCount >= offerLimit;
  const isRechargeActive = store.subscription.isActive;

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addDailyDiscount(store.id, {
      title,
      discountPercentage: discountType === 'percent' ? Number(discountValue) : undefined,
      flatDiscount: discountType === 'flat' ? Number(discountValue) : undefined,
      minBillAmount: minBillAmount ? Number(minBillAmount) : undefined,
      categoryTag,
      validUntil,
      isActive: true,
      terms: terms || undefined,
    });

    // Reset form
    setTitle('');
    setTerms('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Banner / Status Alert */}
      {!isRechargeActive && (
        <div className="p-4 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5 text-rose-400" />
          <div className="flex-1 text-xs">
            <h4 className="font-bold text-sm text-white">
              Subscription Due - Store & Offers Currently Unlisted
            </h4>
            <p className="mt-1 text-rose-200">
              In accordance with our Tata Play-style prepaid model, new offers won't appear to shoppers until your store recharge is renewed.
            </p>
            <button
              onClick={() => setMerchantTab('recharge')}
              className="mt-2.5 px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition-colors flex items-center gap-1.5"
            >
              <CreditCard className="w-3.5 h-3.5" />
              <span>Recharge Store Now</span>
            </button>
          </div>
        </div>
      )}

      {/* Header bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold font-display text-white">Daily Discounts & Flash Sales</h2>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-slate-800 text-amber-400 border border-slate-700">
              {activeOffersCount} / {offerLimit} Active
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Publish today's fresh discounts to bring local shoppers into your shop right now.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          disabled={!isRechargeActive || isLimitReached}
          className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm shrink-0 ${
            !isRechargeActive || isLimitReached
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
              : 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-amber-500/20'
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Publish New Daily Offer'}</span>
        </button>
      </div>

      {/* New Offer Creation Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateOffer}
          className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl animate-in slide-in-from-top-2"
        >
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-bold text-white font-display">New Daily Flash Offer</h3>
            </div>
            <span className="text-[11px] text-amber-400 font-semibold">Live immediately on Marketplace</span>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Offer Headline *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Flat 25% OFF on Dairy & FMCG or Buy 1 Get 1 on All Breads"
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percent' | 'flat')}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="percent">Percentage (% OFF)</option>
                <option value="flat">Flat Amount (₹ OFF)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {discountType === 'percent' ? 'Discount Percentage (%)' : 'Flat Discount (₹)'} *
              </label>
              <input
                type="number"
                required
                min={1}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Minimum Bill Amount (₹)
              </label>
              <input
                type="number"
                value={minBillAmount}
                onChange={(e) => setMinBillAmount(Number(e.target.value))}
                placeholder="0"
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Badge Tag</label>
              <select
                value={categoryTag}
                onChange={(e) => setCategoryTag(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="Daily Flash Deal">Daily Flash Deal</option>
                <option value="Today Only">Today Only</option>
                <option value="Weekend Special">Weekend Special</option>
                <option value="Happy Hour">Happy Hour</option>
                <option value="Festival Special">Festival Special</option>
                <option value="Clearance Sale">Clearance Sale</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Valid Until *</label>
              <input
                type="text"
                required
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
                placeholder="e.g. Today, 9:00 PM or Till Sunday"
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Terms & Conditions (Optional)
            </label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              placeholder="e.g. Valid on in-store billing only. Applicable till stocks last."
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-amber-400"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsAdding(false)}
              className="px-4 py-2 text-xs text-slate-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs rounded-xl shadow-md transition-colors"
            >
              Publish Offer Live
            </button>
          </div>
        </form>
      )}

      {/* List of Existing Offers */}
      <div className="space-y-3">
        {store.dailyDiscounts.length === 0 ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            <Tag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No daily offers created yet</h4>
            <p className="text-xs text-slate-400 mt-1">
              Publish daily deals to attract nearby shoppers who are searching by city or pincode.
            </p>
          </div>
        ) : (
          store.dailyDiscounts.map((offer) => (
            <div
              key={offer.id}
              className={`p-4 rounded-xl border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                offer.isActive
                  ? 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  : 'bg-slate-900/50 border-slate-800/50 opacity-60'
              }`}
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                      offer.isActive ? 'bg-amber-400 text-slate-950' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {offer.categoryTag}
                  </span>
                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{offer.validUntil}</span>
                  </span>
                  <span
                    className={`text-[11px] font-semibold ${
                      offer.isActive ? 'text-emerald-400' : 'text-slate-500'
                    }`}
                  >
                    · {offer.isActive ? 'Active on App' : 'Paused'}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white">{offer.title}</h4>

                {offer.minBillAmount && (
                  <p className="text-xs text-slate-400">
                    Min bill: ₹{offer.minBillAmount}
                  </p>
                )}
                {offer.terms && <p className="text-[11px] text-slate-500">{offer.terms}</p>}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                <button
                  onClick={() => toggleDailyDiscount(store.id, offer.id)}
                  className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                    offer.isActive
                      ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                      : 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  }`}
                >
                  {offer.isActive ? (
                    <>
                      <XCircle className="w-3.5 h-3.5 text-slate-400" />
                      <span>Pause</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Activate</span>
                    </>
                  )}
                </button>

                <button
                  onClick={() => deleteDailyDiscount(store.id, offer.id)}
                  className="p-2 text-slate-400 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Delete Offer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
