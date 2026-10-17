import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store } from '../../types';
import { CITIES, PINCODES } from '../../data/mockData';
import { InteractiveMap } from './InteractiveMap';
import {
  Search,
  MapPin,
  Tag,
  Sparkles,
  Map as MapIcon,
  List,
  Filter,
  Check,
  Copy,
  ChevronRight,
  ShieldCheck,
  Heart,
  Clock,
  Compass,
} from 'lucide-react';

interface ShopperHomeProps {
  onOpenStoreModal: (store: Store) => void;
}

export const ShopperHome: React.FC<ShopperHomeProps> = ({ onOpenStoreModal }) => {
  const {
    stores,
    selectedCity,
    setSelectedCity,
    selectedPincode,
    setSelectedPincode,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    distanceRadius,
    setDistanceRadius,
    favorites,
    toggleFavorite,
    incrementCouponCopy,
    shopperTab,
    setShopperTab,
  } = useApp();

  const [copiedCouponId, setCopiedCouponId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Categories list
  const categories = [
    'All',
    'Grocery',
    'Electronics',
    'Fashion',
    'Bakery & Cafe',
    'Pharmacy',
    'Hardware',
    'Beauty & Salon',
  ];

  // Filter active stores (Tata Play model: expired stores are unlisted from shopper view)
  const activeStores = stores.filter((store) => {
    // 1. Must be active (recharged or within free trial)
    if (!store.subscription.isActive) return false;

    // 2. City filter
    if (selectedCity && store.city.toLowerCase() !== selectedCity.toLowerCase()) {
      return false;
    }

    // 3. Pincode filter
    if (selectedPincode && selectedPincode !== 'all' && store.pincode !== selectedPincode) {
      return false;
    }

    // 4. Category filter
    if (selectedCategory && selectedCategory !== 'All' && store.category !== selectedCategory) {
      return false;
    }

    // 5. Distance radius filter
    if (distanceRadius && store.distanceKm && store.distanceKm > distanceRadius) {
      return false;
    }

    // 6. Search query
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      const matchName = store.name.toLowerCase().includes(q);
      const matchTag = store.tagline.toLowerCase().includes(q);
      const matchCat = store.category.toLowerCase().includes(q);
      const matchAddress = store.address.toLowerCase().includes(q);
      const matchOffers = store.dailyDiscounts.some((d) => d.title.toLowerCase().includes(q));
      const matchCoupons = store.coupons.some((c) => c.code.toLowerCase().includes(q));
      if (!matchName && !matchTag && !matchCat && !matchAddress && !matchOffers && !matchCoupons) {
        return false;
      }
    }

    return true;
  });

  const availablePincodes = PINCODES[selectedCity] || [];

  const handleCopyCoupon = (storeId: string, couponId: string, code: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard?.writeText(code);
    incrementCouponCopy(storeId, couponId);
    setCopiedCouponId(couponId);
    setTimeout(() => setCopiedCouponId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Search & Location Bar */}
      <section className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          {/* Search Input */}
          <div className="md:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search store name, daily discount or coupon..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white placeholder-slate-400 focus:outline-none focus:border-amber-400 transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* City Selector */}
          <div className="md:col-span-3 relative">
            <MapPin className="w-4 h-4 text-rose-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-colors appearance-none"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c} (City)
                </option>
              ))}
            </select>
          </div>

          {/* 6-Digit Pincode Selector */}
          <div className="md:col-span-2 relative">
            <select
              value={selectedPincode}
              onChange={(e) => setSelectedPincode(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value="all">All Pincodes</option>
              {availablePincodes.map((pin) => (
                <option key={pin} value={pin}>
                  Pin: {pin}
                </option>
              ))}
            </select>
          </div>

          {/* Radius Filter */}
          <div className="md:col-span-2 relative">
            <select
              value={distanceRadius}
              onChange={(e) => setDistanceRadius(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 transition-colors"
            >
              <option value={2}>Within 2 km</option>
              <option value={5}>Within 5 km</option>
              <option value={10}>Within 10 km</option>
              <option value={999}>Entire City</option>
            </select>
          </div>
        </div>

        {/* Categories Bar & View Mode Toggle */}
        <div className="mt-4 pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full sm:w-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 shadow-sm'
                    : 'bg-slate-800/80 hover:bg-slate-700 text-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* View Mode Toggle (List vs Map) */}
          <div className="flex items-center gap-1 bg-slate-800 p-1 rounded-xl shrink-0 self-end sm:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'list'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List View</span>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'map'
                  ? 'bg-amber-400 text-slate-950 shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Map View</span>
            </button>
          </div>
        </div>
      </section>

      {/* Results Header: Clean unboxed typography */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-400">
          <span className="font-bold text-white">
            {activeStores.length} Verified Stores
          </span>
          <span aria-hidden="true">·</span>
          <span>{selectedCity}</span>
          {selectedPincode !== 'all' && (
            <>
              <span aria-hidden="true">·</span>
              <span>Pin {selectedPincode}</span>
            </>
          )}
          <span aria-hidden="true">·</span>
          <span className="text-emerald-400">
            {activeStores.reduce((acc, s) => acc + s.dailyDiscounts.filter((d) => d.isActive).length, 0)} Active Daily Deals
          </span>
        </div>

        <span className="text-xs text-slate-500 hidden sm:inline">
          Showing active verified listings
        </span>
      </div>

      {/* Main View Area: Either Interactive Map or Store Cards List */}
      {viewMode === 'map' ? (
        <InteractiveMap onOpenStoreModal={onOpenStoreModal} />
      ) : activeStores.length === 0 ? (
        /* Empty State */
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Compass className="w-12 h-12 text-amber-400 mx-auto opacity-70" />
          <h3 className="text-base font-bold text-white font-display">
            No active stores found in this area
          </h3>
          <p className="text-xs max-w-sm mx-auto text-slate-400">
            Try switching the pincode to "All Pincodes", broadening the radius, or clearing your search filters.
          </p>
          <button
            onClick={() => {
              setSelectedPincode('all');
              setSelectedCategory('All');
              setSearchQuery('');
              setDistanceRadius(999);
            }}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold transition-colors mt-2"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        /* Stores Grid */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeStores.map((store) => {
            const isFav = favorites.includes(store.id);
            const topDailyDeal = store.dailyDiscounts.find((d) => d.isActive);
            const topCoupon = store.coupons.find((c) => c.isActive);

            return (
              <div
                key={store.id}
                onClick={() => onOpenStoreModal(store)}
                className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-200 cursor-pointer flex flex-col group"
              >
                {/* Store Photo & Overlay Badges */}
                <div className="relative h-48 w-full bg-slate-800 overflow-hidden">
                  <img
                    src={store.image}
                    alt={store.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />

                  {/* Category & Verified Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span className="px-2.5 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[11px] font-bold text-amber-400 border border-slate-700/60">
                      {store.category}
                    </span>
                    {store.subscription.planId === 'annual' && (
                      <span className="px-2 py-0.5 rounded-md bg-amber-500 text-slate-950 text-[10px] font-extrabold shadow-sm">
                        GOLD
                      </span>
                    )}
                  </div>

                  {/* Favorite Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(store.id);
                    }}
                    className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
                      isFav
                        ? 'bg-rose-500 text-white'
                        : 'bg-slate-950/70 text-slate-300 hover:text-white'
                    }`}
                  >
                    <Heart className={`w-3.5 h-3.5 ${isFav ? 'fill-white' : ''}`} />
                  </button>

                  {/* Distance & Rating in lower photo scrim */}
                  <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-xs text-white">
                    <span className="flex items-center gap-1 font-semibold text-amber-300">
                      ★ {store.rating} ({store.reviewCount})
                    </span>
                    <span className="flex items-center gap-1 text-slate-300 text-[11px]">
                      <MapPin className="w-3 h-3 text-rose-400" />
                      <span>{store.distanceKm} km away</span>
                    </span>
                  </div>
                </div>

                {/* Card Content Body */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-bold text-base text-white font-display group-hover:text-amber-400 transition-colors line-clamp-1">
                        {store.name}
                      </h3>
                      <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    </div>

                    <p className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                      {store.address}, {store.city} - {store.pincode}
                    </p>
                  </div>

                  {/* Daily Discount Highlight Box */}
                  {topDailyDeal ? (
                    <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs">
                      <div className="flex items-center gap-1.5 text-amber-400 font-bold mb-0.5">
                        <Sparkles className="w-3.5 h-3.5 shrink-0" />
                        <span className="text-[11px] uppercase tracking-wider">
                          {topDailyDeal.categoryTag}
                        </span>
                        <span className="text-[10px] text-slate-400 ml-auto font-normal">
                          {topDailyDeal.validUntil}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-200 line-clamp-1">
                        {topDailyDeal.title}
                      </p>
                    </div>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-800 text-xs text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Open today: {store.timing}</span>
                      </span>
                    </div>
                  )}

                  {/* Coupon & CTA Footer */}
                  <div className="pt-2 border-t border-slate-800 flex items-center justify-between gap-2">
                    {topCoupon ? (
                      <button
                        onClick={(e) =>
                          handleCopyCoupon(store.id, topCoupon.id, topCoupon.code, e)
                        }
                        className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-mono font-bold text-amber-400 flex items-center gap-1.5 transition-colors"
                      >
                        {copiedCouponId === topCoupon.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span className="text-emerald-400">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>{topCoupon.code}</span>
                          </>
                        )}
                      </button>
                    ) : (
                      <span className="text-[11px] text-slate-500">In-store deals available</span>
                    )}

                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-400 group-hover:translate-x-0.5 transition-transform">
                      <span>View Store</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
