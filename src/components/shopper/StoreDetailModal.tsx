import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store } from '../../types';
import {
  X,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  Tag,
  Sparkles,
  Copy,
  Check,
  Heart,
  Share2,
  Navigation,
  ShieldCheck,
  Info,
} from 'lucide-react';

interface StoreDetailModalProps {
  store: Store | null;
  onClose: () => void;
}

export const StoreDetailModal: React.FC<StoreDetailModalProps> = ({ store, onClose }) => {
  const { favorites, toggleFavorite, incrementCouponCopy, recordLeadClick } = useApp();
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  if (!store) return null;

  const isFav = favorites.includes(store.id);

  const handleCopyCoupon = (couponId: string, code: string) => {
    navigator.clipboard?.writeText(code);
    incrementCouponCopy(store.id, couponId);
    setCopiedCouponId(couponId);
    setTimeout(() => setCopiedCouponId(null), 2000);
  };

  const handleCall = () => {
    recordLeadClick(store.id, 'call');
    window.location.href = `tel:${store.phone.replace(/\s+/g, '')}`;
  };

  const handleWhatsapp = () => {
    recordLeadClick(store.id, 'whatsapp');
    const msg = encodeURIComponent(
      `Hi ${store.name}! I found your store on SpotLock and would like to ask about your daily offers.`
    );
    window.open(`https://wa.me/${store.whatsapp}?text=${msg}`, '_blank');
  };

  const handleDirections = () => {
    recordLeadClick(store.id, 'directions');
    const query = encodeURIComponent(`${store.name}, ${store.address}, ${store.city}`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden my-6 text-white max-h-[90vh] flex flex-col">
        {/* Header Hero Image */}
        <div className="relative h-56 sm:h-64 w-full shrink-0 overflow-hidden bg-slate-800">
          <img
            src={store.image}
            alt={store.name}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />

          {/* Top navigation controls */}
          <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
            <span className="px-2.5 py-1 rounded-lg bg-slate-950/70 backdrop-blur-md border border-slate-700/60 text-xs font-semibold text-amber-400">
              {store.category}
            </span>

            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleFavorite(store.id)}
                className={`p-2 rounded-full backdrop-blur-md transition-colors ${
                  isFav
                    ? 'bg-rose-500 text-white'
                    : 'bg-slate-950/70 text-slate-300 hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isFav ? 'fill-white' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 rounded-full bg-slate-950/70 hover:bg-slate-950 text-slate-300 hover:text-white backdrop-blur-md transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Store title in hero scrim */}
          <div className="absolute bottom-4 left-4 right-4 text-left">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="text-xl sm:text-2xl font-bold font-display text-white">
                {store.name}
              </h2>
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-label="Verified Store" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 line-clamp-1">{store.tagline}</p>
          </div>
        </div>

        {/* Scrollable Content Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-6 flex-1 text-left">
          {/* Metadata Row: Unboxed clean typography */}
          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 border-b border-slate-800 pb-4">
            <span className="text-amber-400 font-bold">★ {store.rating} ({store.reviewCount} reviews)</span>
            <span aria-hidden="true">·</span>
            <span>{store.distanceKm} km away</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              <span>{store.timing}</span>
            </span>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Pincode {store.pincode}</span>
          </div>

          {/* Store Address & Direct Connect Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-800/60 border border-slate-800 rounded-xl p-3.5">
            <div className="flex items-start gap-2.5">
              <MapPin className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="text-xs text-slate-200 leading-snug">{store.address}, {store.city} - {store.pincode}</p>
                <button
                  onClick={handleDirections}
                  className="text-[11px] text-amber-400 hover:underline flex items-center gap-1 mt-1 font-semibold"
                >
                  <Navigation className="w-3 h-3" />
                  <span>Get Directions on Map</span>
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={handleCall}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Call Store</span>
              </button>
              <button
                onClick={handleWhatsapp}
                className="flex-1 sm:flex-initial px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-xs font-semibold text-white flex items-center justify-center gap-1.5 transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              About This Store
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">{store.description}</p>
          </div>

          {/* TODAY'S DAILY DISCOUNTS & FLASH DEALS */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Today's Daily Discounts ({store.dailyDiscounts.filter((d) => d.isActive).length})
                </h3>
              </div>
              <span className="text-[11px] text-amber-400 font-medium">Updated Daily</span>
            </div>

            {store.dailyDiscounts.filter((d) => d.isActive).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No daily offers active today. Check back tomorrow!</p>
            ) : (
              <div className="space-y-2.5">
                {store.dailyDiscounts
                  .filter((d) => d.isActive)
                  .map((offer) => (
                    <div
                      key={offer.id}
                      className="p-3.5 rounded-xl bg-gradient-to-r from-amber-500/10 via-slate-800 to-slate-800 border border-amber-500/20"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-amber-400 text-slate-950">
                              {offer.categoryTag}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Valid until {offer.validUntil}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-white">{offer.title}</h4>
                          {offer.minBillAmount && (
                            <p className="text-xs text-slate-300 mt-1">
                              Minimum bill amount: ₹{offer.minBillAmount}
                            </p>
                          )}
                          {offer.terms && (
                            <p className="text-[11px] text-slate-400 mt-1">{offer.terms}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* ACTIVE STORE COUPONS (1-Tap Copy) */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="w-4 h-4 text-emerald-400" />
                <h3 className="text-sm font-bold text-white font-display">
                  Active Coupons & Vouchers ({store.coupons.filter((c) => c.isActive).length})
                </h3>
              </div>
              <span className="text-[11px] text-slate-400">Tap to copy code & show at billing</span>
            </div>

            {store.coupons.filter((c) => c.isActive).length === 0 ? (
              <p className="text-xs text-slate-400 italic">No coupons currently available for this store.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {store.coupons
                  .filter((c) => c.isActive)
                  .map((coupon) => (
                    <div
                      key={coupon.id}
                      className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="font-mono text-xs font-bold text-amber-300 bg-amber-400/10 px-2 py-1 rounded border border-amber-400/30">
                            {coupon.code}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            Expires {coupon.expiryDate}
                          </span>
                        </div>
                        <h4 className="text-xs font-bold text-white">{coupon.discountDescription}</h4>
                        <p className="text-[11px] text-slate-400 mt-1">
                          Min spend: ₹{coupon.minSpend} {coupon.maxDiscount ? `· Max cap: ₹${coupon.maxDiscount}` : ''}
                        </p>
                      </div>

                      <button
                        onClick={() => handleCopyCoupon(coupon.id, coupon.code)}
                        className={`mt-3 w-full py-1.5 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                          copiedCouponId === coupon.id
                            ? 'bg-emerald-500 text-slate-950 font-bold'
                            : 'bg-slate-700 hover:bg-slate-600 text-white'
                        }`}
                      >
                        {copiedCouponId === coupon.id ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Coupon Copied to Clipboard!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5 text-amber-400" />
                            <span>Copy Coupon Code</span>
                          </>
                        )}
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sticky Modal Bottom Action Bar */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-400">
            <span>Show coupon codes or daily offer at checkout to redeem savings</span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
