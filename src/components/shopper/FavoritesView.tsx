import React from 'react';
import { useApp } from '../../context/AppContext';
import { Store } from '../../types';
import { Heart, MapPin, Tag, ChevronRight, ShoppingBag } from 'lucide-react';

interface FavoritesViewProps {
  onOpenStoreModal: (store: Store) => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({ onOpenStoreModal }) => {
  const { stores, favorites, toggleFavorite, setShopperTab } = useApp();

  const savedStores = stores.filter((s) => favorites.includes(s.id));

  return (
    <div className="space-y-5 text-left">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Saved Local Stores</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Quickly monitor daily discounts and coupons from your favorite neighborhood shops
          </p>
        </div>
        <span className="text-xs font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20">
          {savedStores.length} Saved
        </span>
      </div>

      {savedStores.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-400 space-y-3">
          <Heart className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-white font-display">No saved stores yet</h3>
          <p className="text-xs max-w-sm mx-auto text-slate-400">
            Tap the heart icon on any store card while browsing to save it to your neighborhood bookmarks.
          </p>
          <button
            onClick={() => setShopperTab('explore')}
            className="px-4 py-2 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold rounded-lg text-xs transition-colors"
          >
            Explore Nearby Stores
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {savedStores.map((store) => (
            <div
              key={store.id}
              onClick={() => onOpenStoreModal(store)}
              className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden p-4 shadow-lg flex items-center justify-between gap-3 cursor-pointer group"
            >
              <div className="flex items-center gap-3 min-w-0">
                <img
                  src={store.image}
                  alt={store.name}
                  className="w-16 h-16 rounded-xl object-cover border border-slate-800 shrink-0"
                  referrerPolicy="no-referrer"
                />
                <div className="min-w-0">
                  <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wide">
                    {store.category}
                  </span>
                  <h4 className="text-sm font-bold text-white truncate font-display group-hover:text-amber-400 transition-colors">
                    {store.name}
                  </h4>
                  <p className="text-xs text-slate-400 truncate flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                    <span>{store.city} · {store.distanceKm} km</span>
                  </p>
                  {store.dailyDiscounts[0] && (
                    <div className="text-[11px] text-emerald-400 truncate mt-1 flex items-center gap-1">
                      <Tag className="w-3 h-3 shrink-0" />
                      <span>{store.dailyDiscounts[0].title}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex flex-col items-end gap-2 shrink-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(store.id);
                  }}
                  className="p-1.5 rounded-full bg-rose-500 text-white"
                >
                  <Heart className="w-3.5 h-3.5 fill-white" />
                </button>
                <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-amber-400 group-hover:translate-x-0.5 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
