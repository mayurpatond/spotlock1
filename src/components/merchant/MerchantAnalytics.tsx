import React from 'react';
import { Store } from '../../types';
import { Eye, Copy, Phone, MessageCircle, TrendingUp, Users, Sparkles } from 'lucide-react';

interface MerchantAnalyticsProps {
  store: Store;
}

export const MerchantAnalytics: React.FC<MerchantAnalyticsProps> = ({ store }) => {
  return (
    <div className="space-y-6 text-left">
      <div>
        <h2 className="text-xl font-bold font-display text-white">Store Analytics & Inquiries</h2>
        <p className="text-xs text-slate-400 mt-0.5">
          Track customer engagement, deal views, coupon redemptions and direct call/WhatsApp leads
        </p>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Store Page Views</span>
            <Eye className="w-4 h-4 text-sky-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {store.viewsCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18% from last week</span>
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Coupons Copied</span>
            <Copy className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {store.couponsCopiedCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-amber-400 mt-1 font-medium">
            Saved by nearby shoppers
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">WhatsApp & Call Leads</span>
            <MessageCircle className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {store.leadsCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1 font-medium">
            Direct shopper inquiries
          </div>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center justify-between text-slate-400 mb-2">
            <span className="text-xs font-semibold">Lead Conversion</span>
            <Sparkles className="w-4 h-4 text-indigo-400" />
          </div>
          <div className="text-2xl font-black text-white font-mono tabular-nums">
            {((store.leadsCount / (store.viewsCount || 1)) * 100).toFixed(1)}%
          </div>
          <div className="text-[11px] text-slate-400 mt-1">High purchase intent</div>
        </div>
      </div>

      {/* Engagement Breakdown */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <h3 className="text-sm font-bold text-white font-display">
          Active Coupon Performance Breakdown
        </h3>

        {store.coupons.length === 0 ? (
          <p className="text-xs text-slate-400 italic">No coupons created yet to measure.</p>
        ) : (
          <div className="space-y-3">
            {store.coupons.map((coupon) => (
              <div
                key={coupon.id}
                className="p-3.5 rounded-xl bg-slate-800/60 border border-slate-700/60 flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-mono font-bold text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">
                    {coupon.code}
                  </span>
                  <div className="font-semibold text-slate-200 mt-1">
                    {coupon.discountDescription}
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-white font-mono text-sm">
                    {coupon.usageCount} copies
                  </div>
                  <div className="text-[10px] text-slate-400">Expires {coupon.expiryDate}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
