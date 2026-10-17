import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store, Coupon } from '../../types';
import { Tag, Plus, Trash2, CheckCircle, XCircle, Copy, AlertCircle } from 'lucide-react';

interface CouponsManagerProps {
  store: Store;
}

export const CouponsManager: React.FC<CouponsManagerProps> = ({ store }) => {
  const { addCoupon, toggleCoupon, deleteCoupon } = useApp();

  const [isAdding, setIsAdding] = useState(false);
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('flat');
  const [discountValue, setDiscountValue] = useState<number>(100);
  const [minSpend, setMinSpend] = useState<number>(999);
  const [maxDiscount, setMaxDiscount] = useState<number>(200);
  const [expiryDate, setExpiryDate] = useState('2026-11-30');
  const [terms, setTerms] = useState('Show this code at billing counter to claim discount.');

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;

    const formattedCode = code.toUpperCase().replace(/\s+/g, '');

    const desc =
      discountType === 'flat'
        ? `Flat ₹${discountValue} OFF on purchase above ₹${minSpend}`
        : `${discountValue}% OFF on purchase above ₹${minSpend}`;

    addCoupon(store.id, {
      code: formattedCode,
      discountDescription: desc,
      discountType,
      discountValue: Number(discountValue),
      minSpend: Number(minSpend),
      maxDiscount: discountType === 'percentage' ? Number(maxDiscount) : undefined,
      expiryDate,
      terms,
      isActive: true,
    });

    setCode('');
    setIsAdding(false);
  };

  return (
    <div className="space-y-6 text-left">
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Store Coupon Codes</h2>
          <p className="text-xs text-slate-400 mt-1">
            Generate digital coupon codes for local shoppers to copy and redeem in your store.
          </p>
        </div>

        <button
          onClick={() => setIsAdding(!isAdding)}
          className="px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center gap-1.5 transition-colors shadow-sm shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>{isAdding ? 'Cancel' : 'Create New Coupon'}</span>
        </button>
      </div>

      {/* Coupon Creation Form */}
      {isAdding && (
        <form
          onSubmit={handleCreateCoupon}
          className="bg-slate-900 border border-amber-500/30 rounded-2xl p-5 space-y-4 shadow-xl"
        >
          <h3 className="text-sm font-bold text-white font-display border-b border-slate-800 pb-3">
            Create Promotional Coupon Code
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Coupon Code (e.g. FESTIVE100, SAVE50) *
              </label>
              <input
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="FESTIVE50"
                className="w-full px-3 py-2 text-xs uppercase font-mono font-bold bg-slate-800 border border-slate-700 rounded-xl text-amber-400 placeholder-slate-500 focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Discount Type</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as 'percentage' | 'flat')}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              >
                <option value="flat">Flat Rupee Amount (₹ OFF)</option>
                <option value="percentage">Percentage Discount (% OFF)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                {discountType === 'flat' ? 'Discount Amount (₹)' : 'Discount Percentage (%)'} *
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
                Minimum Purchase (₹) *
              </label>
              <input
                type="number"
                required
                min={0}
                value={minSpend}
                onChange={(e) => setMinSpend(Number(e.target.value))}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Expiry Date *</label>
              <input
                type="date"
                required
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Redemption Terms
            </label>
            <input
              type="text"
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
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
              Save & Activate Coupon
            </button>
          </div>
        </form>
      )}

      {/* Coupons List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {store.coupons.length === 0 ? (
          <div className="md:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-10 text-center text-slate-400">
            <Tag className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <h4 className="text-sm font-bold text-white">No coupons created yet</h4>
            <p className="text-xs text-slate-400 mt-1">
              Create coupons that local users can easily copy and bring to your billing counter.
            </p>
          </div>
        ) : (
          store.coupons.map((coupon) => (
            <div
              key={coupon.id}
              className={`p-4 rounded-xl border flex flex-col justify-between space-y-3 ${
                coupon.isActive
                  ? 'bg-slate-900 border-slate-800'
                  : 'bg-slate-900/50 border-slate-800/50 opacity-60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded border border-amber-400/30">
                    {coupon.code}
                  </span>
                  <span className="text-[11px] text-slate-400">Expires {coupon.expiryDate}</span>
                </div>

                <h4 className="text-sm font-bold text-white">{coupon.discountDescription}</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Min spend: ₹{coupon.minSpend} · Copied {coupon.usageCount} times by shoppers
                </p>
              </div>

              <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                <span
                  className={`text-[11px] font-semibold ${
                    coupon.isActive ? 'text-emerald-400' : 'text-slate-500'
                  }`}
                >
                  {coupon.isActive ? 'Active on App' : 'Paused'}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleCoupon(store.id, coupon.id)}
                    className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
                  >
                    {coupon.isActive ? 'Pause' : 'Activate'}
                  </button>
                  <button
                    onClick={() => deleteCoupon(store.id, coupon.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-400 rounded hover:bg-slate-800"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
