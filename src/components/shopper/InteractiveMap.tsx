import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store } from '../../types';
import {
  MapPin,
  Navigation,
  Compass,
  Tag,
  Phone,
  MessageCircle,
  ExternalLink,
  Plus,
  Minus,
  Sparkles,
  ShoppingBag,
  Clock,
  Check,
  Copy,
} from 'lucide-react';

interface InteractiveMapProps {
  onOpenStoreModal: (store: Store) => void;
}

export const InteractiveMap: React.FC<InteractiveMapProps> = ({ onOpenStoreModal }) => {
  const {
    stores,
    selectedCity,
    selectedPincode,
    selectedCategory,
    distanceRadius,
    setDistanceRadius,
    incrementCouponCopy,
    recordLeadClick,
  } = useApp();

  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [selectedPinStore, setSelectedPinStore] = useState<Store | null>(null);
  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);

  // Only active stores are listed on the map (Tata Play model)
  const activeStores = stores.filter((s) => {
    if (!s.subscription.isActive) return false;
    if (selectedCity && s.city.toLowerCase() !== selectedCity.toLowerCase()) return false;
    if (selectedPincode && selectedPincode !== 'all' && s.pincode !== selectedPincode) return false;
    if (selectedCategory && selectedCategory !== 'All' && s.category !== selectedCategory) return false;
    if (distanceRadius && s.distanceKm && s.distanceKm > distanceRadius) return false;
    return true;
  });

  const handleCopyCoupon = (storeId: string, couponId: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    incrementCouponCopy(storeId, couponId);
    setCopiedCouponId(couponId);
    setTimeout(() => setCopiedCouponId(null), 2000);
  };

  // Fixed coordinate mapping to map canvas (800x500 box)
  const getPinCoordinates = (index: number, store: Store) => {
    // Generate organic relative offset around center
    const offsets = [
      { x: 380, y: 220 },
      { x: 520, y: 160 },
      { x: 260, y: 310 },
      { x: 580, y: 340 },
      { x: 440, y: 380 },
    ];
    return offsets[index % offsets.length];
  };

  return (
    <div className="relative w-full h-[650px] bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 shadow-xl flex flex-col">
      {/* Map Header Overlay Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl px-3.5 py-2 shadow-lg flex items-center gap-2 pointer-events-auto">
          <Navigation className="w-4 h-4 text-amber-400 animate-pulse" />
          <div className="text-xs">
            <span className="font-bold text-white">{selectedCity}</span>
            {selectedPincode !== 'all' && (
              <span className="text-slate-400"> · Pincode {selectedPincode}</span>
            )}
            <span className="text-amber-400 font-medium ml-1">({activeStores.length} stores nearby)</span>
          </div>
        </div>

        {/* Radius Filter Pills */}
        <div className="bg-slate-900/90 backdrop-blur-md border border-slate-700/80 rounded-xl p-1 shadow-lg flex items-center gap-1 pointer-events-auto">
          <span className="text-[10px] text-slate-400 px-2 font-medium">Radius:</span>
          {[2, 5, 10, 999].map((rad) => (
            <button
              key={rad}
              onClick={() => setDistanceRadius(rad)}
              className={`px-2.5 py-1 text-[11px] font-semibold rounded-lg transition-colors ${
                distanceRadius === rad
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800'
              }`}
            >
              {rad === 999 ? 'All' : `${rad} km`}
            </button>
          ))}
        </div>
      </div>

      {/* Map Zoom Controls */}
      <div className="absolute top-16 right-3 z-20 flex flex-col gap-1.5 pointer-events-auto">
        <button
          onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.6))}
          className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 shadow-md"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.8))}
          className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-700 text-white flex items-center justify-center hover:bg-slate-800 shadow-md"
        >
          <Minus className="w-4 h-4" />
        </button>
        <button
          onClick={() => {
            setZoomLevel(1);
            setSelectedPinStore(null);
          }}
          title="Reset View"
          className="w-8 h-8 rounded-lg bg-slate-900/90 border border-slate-700 text-amber-400 flex items-center justify-center hover:bg-slate-800 shadow-md"
        >
          <Compass className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Map Vector Canvas */}
      <div className="relative flex-1 w-full h-full overflow-hidden select-none cursor-grab active:cursor-grabbing bg-[#0b1329]">
        <div
          className="w-full h-full transition-transform duration-300 origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg className="w-full h-full" viewBox="0 0 800 500" fill="none">
            {/* Background Map Grids & Waterway */}
            <path
              d="M-50,280 C150,290 280,240 450,290 C620,340 750,260 850,280 L850,550 L-50,550 Z"
              fill="#0d1b38"
              opacity="0.8"
            />
            {/* Coastal contour line */}
            <path
              d="M-50,280 C150,290 280,240 450,290 C620,340 750,260 850,280"
              stroke="#1e3a6a"
              strokeWidth="3"
            />

            {/* City Road Network */}
            <path
              d="M0,120 L800,120 M0,250 L800,250 M0,380 L800,380"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
            <path
              d="M180,0 L180,500 M350,0 L350,500 M550,0 L550,500 M700,0 L700,500"
              stroke="#1e293b"
              strokeWidth="2.5"
            />
            {/* Express Highway Diagonal */}
            <path
              d="M50,480 Q320,300 750,80"
              stroke="#334155"
              strokeWidth="5"
              strokeLinecap="round"
            />
            <path
              d="M50,480 Q320,300 750,80"
              stroke="#475569"
              strokeWidth="1.5"
              strokeDasharray="6 6"
            />

            {/* Neighborhood District Blocks */}
            <rect x="80" y="50" width="80" height="50" rx="6" fill="#131e3a" opacity="0.6" />
            <rect x="220" y="60" width="100" height="40" rx="6" fill="#131e3a" opacity="0.6" />
            <rect x="390" y="40" width="120" height="60" rx="6" fill="#131e3a" opacity="0.6" />
            <rect x="600" y="50" width="80" height="50" rx="6" fill="#131e3a" opacity="0.6" />

            <rect x="70" y="150" width="85" height="70" rx="6" fill="#131e3a" opacity="0.6" />
            <rect x="210" y="150" width="115" height="75" rx="6" fill="#131e3a" opacity="0.6" />
            <rect x="420" y="150" width="90" height="75" rx="6" fill="#131e3a" opacity="0.6" />
            <rect x="600" y="150" width="70" height="75" rx="6" fill="#131e3a" opacity="0.6" />

            {/* District Labels */}
            <text x="120" y="80" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
              MARKET NORTH
            </text>
            <text x="270" y="85" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
              HIGH STREET
            </text>
            <text x="450" y="75" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
              CENTRAL PLAZA
            </text>
            <text x="260" y="195" fill="#64748b" fontSize="11" fontWeight="600" textAnchor="middle">
              METRO STATION AREA
            </text>

            {/* User GPS Location Point with Radar Beacon */}
            <g transform="translate(360, 260)">
              <circle r="40" fill="#38bdf8" opacity="0.1" />
              <circle r="25" fill="#38bdf8" opacity="0.2" className="animate-ping origin-center" />
              <circle r="12" fill="#0284c7" stroke="#ffffff" strokeWidth="2.5" />
              <circle r="4" fill="#ffffff" />
              <text y="28" fill="#38bdf8" fontSize="10" fontWeight="bold" textAnchor="middle">
                You Are Here
              </text>
            </g>
          </svg>

          {/* Interactive HTML Store Pins Placed on Map */}
          {activeStores.map((store, idx) => {
            const coords = getPinCoordinates(idx, store);
            const isSelected = selectedPinStore?.id === store.id;
            const topOffer = store.dailyDiscounts[0];

            return (
              <div
                key={store.id}
                className="absolute transition-transform duration-200 cursor-pointer group"
                style={{
                  left: `${(coords.x / 800) * 100}%`,
                  top: `${(coords.y / 500) * 100}%`,
                  transform: 'translate(-50%, -100%)',
                  zIndex: isSelected ? 30 : 15,
                }}
                onClick={() => setSelectedPinStore(store)}
              >
                {/* Store Pin Card Tag */}
                <div
                  className={`flex flex-col items-center transition-all ${
                    isSelected ? 'scale-110' : 'hover:scale-105'
                  }`}
                >
                  {/* Floating Discount Badge */}
                  {topOffer && (
                    <div
                      className={`mb-1 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-lg flex items-center gap-1 whitespace-nowrap ${
                        isSelected
                          ? 'bg-amber-400 text-slate-950 ring-2 ring-white'
                          : 'bg-slate-900/90 text-amber-300 border border-amber-400/50'
                      }`}
                    >
                      <Sparkles className="w-2.5 h-2.5" />
                      <span>
                        {topOffer.discountPercentage
                          ? `${topOffer.discountPercentage}% OFF`
                          : `₹${topOffer.flatDiscount} OFF`}
                      </span>
                    </div>
                  )}

                  {/* Pin Body */}
                  <div
                    className={`w-9 h-9 rounded-2xl flex items-center justify-center shadow-2xl transition-colors ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/40'
                        : 'bg-slate-900 text-amber-400 border-2 border-amber-400 group-hover:bg-amber-400 group-hover:text-slate-950'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </div>
                  {/* Pin Pointer arrow */}
                  <div
                    className={`w-2.5 h-2.5 -mt-1 rotate-45 ${
                      isSelected ? 'bg-amber-400' : 'bg-slate-900 border-r-2 border-b-2 border-amber-400'
                    }`}
                  />

                  {/* Store Name Capsule */}
                  <div
                    className={`mt-1 px-2 py-0.5 rounded text-[11px] font-medium whitespace-nowrap shadow-md max-w-[140px] truncate ${
                      isSelected
                        ? 'bg-white text-slate-950 font-bold'
                        : 'bg-slate-900/90 text-slate-200 border border-slate-700'
                    }`}
                  >
                    {store.name}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Store Bottom Drawer Card */}
      {selectedPinStore ? (
        <div className="absolute bottom-3 left-3 right-3 z-30 bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-xl p-3.5 shadow-2xl animate-in slide-in-from-bottom-4 duration-200">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            {/* Store image & info */}
            <div className="flex items-center gap-3">
              <img
                src={selectedPinStore.image}
                alt={selectedPinStore.name}
                className="w-14 h-14 rounded-lg object-cover border border-slate-700 shrink-0"
                referrerPolicy="no-referrer"
              />
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-bold text-white truncate font-display">
                    {selectedPinStore.name}
                  </h4>
                  <span className="text-[11px] text-amber-400 font-semibold bg-amber-400/10 px-1.5 py-0.5 rounded">
                    ★ {selectedPinStore.rating}
                  </span>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">
                  {selectedPinStore.category} · {selectedPinStore.distanceKm} km away · {selectedPinStore.address}
                </p>

                {/* Daily Offer highlight */}
                {selectedPinStore.dailyDiscounts[0] && (
                  <div className="flex items-center gap-1.5 text-xs text-amber-300 font-medium mt-1">
                    <Tag className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{selectedPinStore.dailyDiscounts[0].title}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Actions & Coupon Button */}
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              {selectedPinStore.coupons[0] && (
                <button
                  onClick={(e) =>
                    handleCopyCoupon(
                      selectedPinStore.id,
                      selectedPinStore.coupons[0].id,
                      selectedPinStore.coupons[0].code,
                      e
                    )
                  }
                  className="flex-1 sm:flex-initial px-3 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-amber-400 flex items-center justify-center gap-1.5 transition-colors"
                >
                  {copiedCouponId === selectedPinStore.coupons[0].id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{selectedPinStore.coupons[0].code}</span>
                    </>
                  )}
                </button>
              )}

              <button
                onClick={() => onOpenStoreModal(selectedPinStore)}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
              >
                <span>View Store & Deals</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 pointer-events-none">
          <div className="px-3 py-1.5 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700 text-[11px] text-slate-300 shadow-lg">
            Tap any store pin on the map to preview daily discounts & coupons
          </div>
        </div>
      )}
    </div>
  );
};
