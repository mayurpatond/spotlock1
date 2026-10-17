import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Store } from '../../types';
import { CITIES, PINCODES } from '../../data/mockData';
import {
  Save,
  Store as StoreIcon,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  QrCode,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface StoreProfileEditorProps {
  store: Store;
}

export const StoreProfileEditor: React.FC<StoreProfileEditorProps> = ({ store }) => {
  const { updateStoreProfile } = useApp();

  const [name, setName] = useState(store.name);
  const [tagline, setTagline] = useState(store.tagline);
  const [category, setCategory] = useState(store.category);
  const [description, setDescription] = useState(store.description);
  const [address, setAddress] = useState(store.address);
  const [city, setCity] = useState(store.city);
  const [pincode, setPincode] = useState(store.pincode);
  const [phone, setPhone] = useState(store.phone);
  const [whatsapp, setWhatsapp] = useState(store.whatsapp);
  const [timing, setTiming] = useState(store.timing);
  const [upiId, setUpiId] = useState(store.upiId || '');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateStoreProfile(store.id, {
      name,
      tagline,
      category,
      description,
      address,
      city,
      pincode,
      phone,
      whatsapp: whatsapp.replace(/\D/g, ''),
      timing,
      upiId,
    });
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 text-left">
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h2 className="text-xl font-bold font-display text-white">Store Profile & Details</h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Update store name, contact numbers, city, pincode and opening hours for local shoppers
          </p>
        </div>
        {savedSuccess && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 text-xs font-semibold border border-emerald-500/30">
            <Check className="w-3.5 h-3.5" />
            <span>Changes Saved!</span>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Store / Business Name *
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Store Category *
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Store['category'])}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              <option value="Grocery">Grocery & Kirana</option>
              <option value="Electronics">Electronics & Mobile</option>
              <option value="Fashion">Fashion & Apparel</option>
              <option value="Bakery & Cafe">Bakery & Cafe</option>
              <option value="Pharmacy">Pharmacy & Chemist</option>
              <option value="Hardware">Hardware & Tools</option>
              <option value="Beauty & Salon">Beauty & Salon</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Store Headline / Tagline
          </label>
          <input
            type="text"
            value={tagline}
            onChange={(e) => setTagline(e.target.value)}
            placeholder="e.g. Fresh vegetables, dairy & wholesale dry fruits"
            className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            About the Store (Description)
          </label>
          <textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              City *
            </label>
            <select
              value={city}
              onChange={(e) => {
                setCity(e.target.value);
                const pins = PINCODES[e.target.value];
                if (pins && pins.length > 0) setPincode(pins[0]);
              }}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Pincode *
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Opening Hours & Timings *
            </label>
            <input
              type="text"
              required
              value={timing}
              onChange={(e) => setTiming(e.target.value)}
              placeholder="e.g. 8:00 AM - 10:00 PM"
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1">
            Complete Street Address *
          </label>
          <input
            type="text"
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              Customer Phone Number *
            </label>
            <input
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              WhatsApp Number (for Direct Orders) *
            </label>
            <input
              type="tel"
              required
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">
              UPI VPA ID (For Instant Direct Customer Payments)
            </label>
            <input
              type="text"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              placeholder="e.g. storename@okaxis"
              className="w-full px-3 py-2.5 text-xs sm:text-sm bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex items-center justify-end">
          <button
            type="submit"
            className="px-6 py-2.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs sm:text-sm rounded-xl flex items-center gap-2 transition-colors shadow-lg shadow-amber-500/20 active:scale-[0.99]"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
