import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Store,
  DailyDiscount,
  Coupon,
  RechargePlan,
  PaymentTransaction,
  UserRole,
} from '../types';
import { INITIAL_STORES, RECHARGE_PLANS } from '../data/mockData';

interface AppContextType {
  currentUser: User | null;
  stores: Store[];
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  selectedPincode: string;
  setSelectedPincode: (pincode: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  distanceRadius: number; // in km, 999 = all
  setDistanceRadius: (radius: number) => void;
  favorites: string[];
  toggleFavorite: (storeId: string) => void;
  
  // Modals & Navigation
  showSplashScreen: boolean;
  setShowSplashScreen: (show: boolean) => void;
  activeStoreModal: Store | null;
  setActiveStoreModal: (store: Store | null) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authInitialTab: 'login' | 'register';
  setAuthInitialTab: (tab: 'login' | 'register') => void;
  authTargetRole: UserRole;
  setAuthTargetRole: (role: UserRole) => void;
  isPaymentModalOpen: boolean;
  setIsPaymentModalOpen: (open: boolean) => void;
  selectedRechargePlan: RechargePlan | null;
  setSelectedRechargePlan: (plan: RechargePlan | null) => void;

  // View state (mobile simulator vs responsive desktop)
  viewDeviceFrame: boolean;
  setViewDeviceFrame: (frame: boolean) => void;
  shopperTab: 'explore' | 'map' | 'saved' | 'profile';
  setShopperTab: (tab: 'explore' | 'map' | 'saved' | 'profile') => void;
  merchantTab: 'overview' | 'profile' | 'offers' | 'coupons' | 'recharge' | 'analytics';
  setMerchantTab: (tab: 'overview' | 'profile' | 'offers' | 'coupons' | 'recharge' | 'analytics') => void;

  // Transactions
  transactions: PaymentTransaction[];

  // Actions
  loginAs: (user: User) => void;
  logout: () => void;
  quickSwitchUser: (presetKey: 'shopper' | 'merchant_active' | 'merchant_trial' | 'merchant_expired') => void;
  updateStoreProfile: (storeId: string, updates: Partial<Store>) => void;
  addDailyDiscount: (storeId: string, discount: Omit<DailyDiscount, 'id' | 'createdAt'>) => void;
  toggleDailyDiscount: (storeId: string, discountId: string) => void;
  deleteDailyDiscount: (storeId: string, discountId: string) => void;
  addCoupon: (storeId: string, coupon: Omit<Coupon, 'id' | 'usageCount'>) => void;
  toggleCoupon: (storeId: string, couponId: string) => void;
  deleteCoupon: (storeId: string, couponId: string) => void;
  incrementCouponCopy: (storeId: string, couponId: string) => void;
  recordLeadClick: (storeId: string, type: 'call' | 'whatsapp' | 'directions') => void;
  processRecharge: (
    storeId: string,
    plan: RechargePlan,
    paymentMethod: 'upi' | 'card' | 'netbanking',
    customDays?: number,
    customPrice?: number,
    upiApp?: string
  ) => PaymentTransaction;
  registerStoreOwner: (
    storeData: {
      name: string;
      category: Store['category'];
      city: string;
      pincode: string;
      address: string;
      phone: string;
      whatsapp: string;
      timing: string;
      description: string;
    },
    ownerData: {
      name: string;
      email: string;
      phone: string;
    }
  ) => void;
  registerShopper: (userData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    pincode: string;
  }) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    // Default initial user is a shopper so visitors can browse instantly
    return {
      id: 'user-shopper-1',
      name: 'Priya Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98200 11223',
      role: 'shopper',
      city: 'Mumbai',
      pincode: '400050',
    };
  });

  const [stores, setStores] = useState<Store[]>(INITIAL_STORES);
  const [selectedCity, setSelectedCity] = useState<string>('Mumbai');
  const [selectedPincode, setSelectedPincode] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [distanceRadius, setDistanceRadius] = useState<number>(5);
  const [favorites, setFavorites] = useState<string[]>(['store-1', 'store-4']);

  // Modals & Navigation
  const [showSplashScreen, setShowSplashScreen] = useState<boolean>(true);
  const [activeStoreModal, setActiveStoreModal] = useState<Store | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authInitialTab, setAuthInitialTab] = useState<'login' | 'register'>('login');
  const [authTargetRole, setAuthTargetRole] = useState<UserRole>('shopper');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState<boolean>(false);
  const [selectedRechargePlan, setSelectedRechargePlan] = useState<RechargePlan | null>(
    RECHARGE_PLANS[1]
  );

  const [viewDeviceFrame, setViewDeviceFrame] = useState<boolean>(false);
  const [shopperTab, setShopperTab] = useState<'explore' | 'map' | 'saved' | 'profile'>('explore');
  const [merchantTab, setMerchantTab] = useState<
    'overview' | 'profile' | 'offers' | 'coupons' | 'recharge' | 'analytics'
  >('overview');

  const [transactions, setTransactions] = useState<PaymentTransaction[]>([
    {
      id: 'tx-initial-1',
      storeId: 'store-1',
      storeName: 'Mahalaxmi Supermarket & Kirana',
      planId: 'quarterly',
      planName: '3 Months Growth Pack',
      amount: 799,
      gstAmount: 143.82,
      totalAmount: 942.82,
      durationDays: 90,
      paymentMethod: 'upi',
      upiApp: 'Google Pay',
      transactionRef: 'UPI/20260915/782194012',
      timestamp: '2026-09-15 11:20 AM',
      newExpiryDate: '2026-12-15',
    },
  ]);

  // When selected city changes, reset pincode to 'all'
  useEffect(() => {
    setSelectedPincode('all');
  }, [selectedCity]);

  const loginAs = (user: User) => {
    setCurrentUser(user);
    setIsAuthModalOpen(false);
    if (user.role === 'store_owner') {
      setMerchantTab('overview');
    } else {
      setShopperTab('explore');
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setShopperTab('explore');
  };

  const quickSwitchUser = (
    presetKey: 'shopper' | 'merchant_active' | 'merchant_trial' | 'merchant_expired'
  ) => {
    switch (presetKey) {
      case 'shopper':
        setCurrentUser({
          id: 'user-shopper-1',
          name: 'Priya Sharma',
          email: 'priya.sharma@example.com',
          phone: '+91 98200 11223',
          role: 'shopper',
          city: 'Mumbai',
          pincode: '400050',
        });
        setShopperTab('explore');
        break;
      case 'merchant_active':
        setCurrentUser({
          id: 'owner-1',
          name: 'Rajesh Sharma',
          email: 'rajesh.sharma@mahalaxmi.com',
          phone: '+91 98201 44521',
          role: 'store_owner',
          city: 'Mumbai',
          pincode: '400050',
          storeId: 'store-1',
        });
        setMerchantTab('overview');
        break;
      case 'merchant_trial':
        setCurrentUser({
          id: 'owner-3',
          name: 'Anita Desai',
          email: 'anita@ethnicelegance.in',
          phone: '+91 97654 32190',
          role: 'store_owner',
          city: 'Pune',
          pincode: '411004',
          storeId: 'store-3',
        });
        setMerchantTab('overview');
        break;
      case 'merchant_expired':
        setCurrentUser({
          id: 'owner-5',
          name: 'Sunil Verma',
          email: 'sunil@apexdigital.com',
          phone: '+91 98110 99881',
          role: 'store_owner',
          city: 'Delhi NCR',
          pincode: '110001',
          storeId: 'store-5',
        });
        setMerchantTab('recharge');
        break;
    }
  };

  const toggleFavorite = (storeId: string) => {
    setFavorites((prev) =>
      prev.includes(storeId) ? prev.filter((id) => id !== storeId) : [...prev, storeId]
    );
  };

  const updateStoreProfile = (storeId: string, updates: Partial<Store>) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, ...updates } : s))
    );
  };

  const addDailyDiscount = (
    storeId: string,
    discount: Omit<DailyDiscount, 'id' | 'createdAt'>
  ) => {
    const newOffer: DailyDiscount = {
      ...discount,
      id: `off-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              dailyDiscounts: [newOffer, ...s.dailyDiscounts],
            }
          : s
      )
    );
  };

  const toggleDailyDiscount = (storeId: string, discountId: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              dailyDiscounts: s.dailyDiscounts.map((d) =>
                d.id === discountId ? { ...d, isActive: !d.isActive } : d
              ),
            }
          : s
      )
    );
  };

  const deleteDailyDiscount = (storeId: string, discountId: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              dailyDiscounts: s.dailyDiscounts.filter((d) => d.id !== discountId),
            }
          : s
      )
    );
  };

  const addCoupon = (storeId: string, coupon: Omit<Coupon, 'id' | 'usageCount'>) => {
    const newCoupon: Coupon = {
      ...coupon,
      id: `cp-${Date.now()}`,
      usageCount: 0,
    };
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              coupons: [newCoupon, ...s.coupons],
            }
          : s
      )
    );
  };

  const toggleCoupon = (storeId: string, couponId: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              coupons: s.coupons.map((c) =>
                c.id === couponId ? { ...c, isActive: !c.isActive } : c
              ),
            }
          : s
      )
    );
  };

  const deleteCoupon = (storeId: string, couponId: string) => {
    setStores((prev) =>
      prev.map((s) =>
        s.id === storeId
          ? {
              ...s,
              coupons: s.coupons.filter((c) => c.id !== couponId),
            }
          : s
      )
    );
  };

  const incrementCouponCopy = (storeId: string, couponId: string) => {
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          return {
            ...s,
            couponsCopiedCount: s.couponsCopiedCount + 1,
            coupons: s.coupons.map((c) =>
              c.id === couponId ? { ...c, usageCount: c.usageCount + 1 } : c
            ),
          };
        }
        return s;
      })
    );
  };

  const recordLeadClick = (storeId: string) => {
    setStores((prev) =>
      prev.map((s) => (s.id === storeId ? { ...s, leadsCount: s.leadsCount + 1 } : s))
    );
  };

  const processRecharge = (
    storeId: string,
    plan: RechargePlan,
    paymentMethod: 'upi' | 'card' | 'netbanking',
    customDays?: number,
    customPrice?: number,
    upiApp?: string
  ): PaymentTransaction => {
    const days = customDays || plan.durationDays;
    const basePrice = customPrice !== undefined ? customPrice : plan.price;
    const gst = Math.round(basePrice * 0.18 * 100) / 100;
    const total = Math.round((basePrice + gst) * 100) / 100;

    const today = new Date();
    const expiry = new Date(today);
    expiry.setDate(today.getDate() + days);
    const newExpiryString = expiry.toISOString().split('T')[0];

    const targetStore = stores.find((s) => s.id === storeId);
    const storeName = targetStore?.name || 'Local Store';

    const tx: PaymentTransaction = {
      id: `TXN-${Date.now().toString().slice(-8)}`,
      storeId,
      storeName,
      planId: plan.id,
      planName: customDays ? `Custom Flexi Pack (${customDays} Days)` : plan.name,
      amount: basePrice,
      gstAmount: gst,
      totalAmount: total,
      durationDays: days,
      paymentMethod,
      upiApp: upiApp || (paymentMethod === 'upi' ? 'Google Pay' : undefined),
      transactionRef: `REF/${new Date().getFullYear()}/${Math.floor(100000000 + Math.random() * 900000000)}`,
      timestamp: new Date().toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      newExpiryDate: newExpiryString,
    };

    setTransactions((prev) => [tx, ...prev]);

    // Update the store's subscription status immediately (recharge model)
    setStores((prev) =>
      prev.map((s) => {
        if (s.id === storeId) {
          return {
            ...s,
            subscription: {
              isTrial: false,
              trialDaysRemaining: 0,
              planId: plan.id,
              planName: customDays ? `Custom Flexi Pack (${customDays} Days)` : plan.name,
              startDate: new Date().toISOString().split('T')[0],
              expiryDate: newExpiryString,
              isActive: true, // Activated! Now live on marketplace
              dailyOfferLimit: plan.dailyOfferLimit,
              pricePaid: basePrice,
            },
          };
        }
        return s;
      })
    );

    return tx;
  };

  const registerStoreOwner = (
    storeData: {
      name: string;
      category: Store['category'];
      city: string;
      pincode: string;
      address: string;
      phone: string;
      whatsapp: string;
      timing: string;
      description: string;
    },
    ownerData: {
      name: string;
      email: string;
      phone: string;
    }
  ) => {
    const newOwnerId = `owner-${Date.now()}`;
    const newStoreId = `store-${Date.now()}`;

    const newOwnerUser: User = {
      id: newOwnerId,
      name: ownerData.name,
      email: ownerData.email,
      phone: ownerData.phone,
      role: 'store_owner',
      city: storeData.city,
      pincode: storeData.pincode,
      storeId: newStoreId,
    };

    const trialExpiry = new Date();
    trialExpiry.setDate(trialExpiry.getDate() + 7);

    const newStore: Store = {
      id: newStoreId,
      ownerId: newOwnerId,
      name: storeData.name,
      tagline: 'Best deals & customer discounts in ' + storeData.city,
      category: storeData.category,
      description: storeData.description || 'Welcome to our local store! Visit us for great deals.',
      image: INITIAL_STORES[0].image,
      galleryImages: [INITIAL_STORES[0].image],
      address: storeData.address,
      city: storeData.city,
      pincode: storeData.pincode,
      latitude: 19.076,
      longitude: 72.8777,
      distanceKm: 1.0,
      phone: storeData.phone,
      whatsapp: storeData.whatsapp.replace(/\D/g, ''),
      upiId: `${ownerData.name.toLowerCase().replace(/\s+/g, '')}@okaxis`,
      timing: storeData.timing || '9:00 AM - 9:00 PM',
      rating: 5.0,
      reviewCount: 1,
      subscription: {
        isTrial: true,
        trialDaysRemaining: 7,
        planId: 'trial',
        planName: '7-Day Free Demo Trial',
        startDate: new Date().toISOString().split('T')[0],
        expiryDate: trialExpiry.toISOString().split('T')[0],
        isActive: true, // free trial is initially active!
        dailyOfferLimit: 3,
        pricePaid: 0,
      },
      dailyDiscounts: [
        {
          id: `off-demo-${Date.now()}`,
          title: 'Grand Opening Special: Flat 10% OFF on all purchases',
          discountPercentage: 10,
          minBillAmount: 100,
          categoryTag: 'Welcome Offer',
          validUntil: 'Today, 9:00 PM',
          isActive: true,
          terms: 'Welcome offer for neighborhood customers.',
          createdAt: new Date().toISOString().split('T')[0],
        },
      ],
      coupons: [
        {
          id: `cp-demo-${Date.now()}`,
          code: 'WELCOME50',
          discountDescription: 'Flat ₹50 OFF on first purchase above ₹300',
          discountType: 'flat',
          discountValue: 50,
          minSpend: 300,
          expiryDate: trialExpiry.toISOString().split('T')[0],
          usageCount: 0,
          terms: 'Show at checkout counter.',
          isActive: true,
        },
      ],
      viewsCount: 12,
      leadsCount: 2,
      couponsCopiedCount: 3,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setStores((prev) => [newStore, ...prev]);
    setCurrentUser(newOwnerUser);
    setIsAuthModalOpen(false);
    setMerchantTab('overview');
  };

  const registerShopper = (userData: {
    name: string;
    email: string;
    phone: string;
    city: string;
    pincode: string;
  }) => {
    const newShopper: User = {
      id: `shopper-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: 'shopper',
      city: userData.city,
      pincode: userData.pincode,
    };
    setCurrentUser(newShopper);
    setSelectedCity(userData.city);
    setSelectedPincode(userData.pincode);
    setIsAuthModalOpen(false);
    setShopperTab('explore');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
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
        showSplashScreen,
        setShowSplashScreen,
        activeStoreModal,
        setActiveStoreModal,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authInitialTab,
        setAuthInitialTab,
        authTargetRole,
        setAuthTargetRole,
        isPaymentModalOpen,
        setIsPaymentModalOpen,
        selectedRechargePlan,
        setSelectedRechargePlan,
        viewDeviceFrame,
        setViewDeviceFrame,
        shopperTab,
        setShopperTab,
        merchantTab,
        setMerchantTab,
        transactions,
        loginAs,
        logout,
        quickSwitchUser,
        updateStoreProfile,
        addDailyDiscount,
        toggleDailyDiscount,
        deleteDailyDiscount,
        addCoupon,
        toggleCoupon,
        deleteCoupon,
        incrementCouponCopy,
        recordLeadClick,
        processRecharge,
        registerStoreOwner,
        registerShopper,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
