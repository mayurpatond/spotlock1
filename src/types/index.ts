export type UserRole = 'shopper' | 'store_owner';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  city: string;
  pincode: string;
  storeId?: string; // if role === 'store_owner'
}

export interface DailyDiscount {
  id: string;
  title: string;
  discountPercentage?: number;
  flatDiscount?: number;
  minBillAmount?: number;
  categoryTag: string;
  validUntil: string; // ISO date or time string like "Today, 9:00 PM"
  isActive: boolean;
  terms?: string;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountDescription: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minSpend: number;
  maxDiscount?: number;
  expiryDate: string;
  usageCount: number;
  terms: string;
  isActive: boolean;
}

export interface SubscriptionStatus {
  isTrial: boolean;
  trialDaysRemaining: number;
  planId: 'trial' | 'monthly' | 'quarterly' | 'annual' | 'custom';
  planName: string;
  startDate: string;
  expiryDate: string;
  isActive: boolean; // if false, store is unlisted (Tata Play recharge model)
  dailyOfferLimit: number;
  pricePaid: number;
}

export interface Store {
  id: string;
  ownerId: string;
  name: string;
  tagline: string;
  category: 'Grocery' | 'Electronics' | 'Fashion' | 'Bakery & Cafe' | 'Pharmacy' | 'Hardware' | 'Beauty & Salon';
  description: string;
  image: string;
  galleryImages: string[];
  address: string;
  city: string;
  pincode: string;
  latitude: number;
  longitude: number;
  distanceKm?: number;
  phone: string;
  whatsapp: string;
  upiId?: string;
  timing: string;
  rating: number;
  reviewCount: number;
  subscription: SubscriptionStatus;
  dailyDiscounts: DailyDiscount[];
  coupons: Coupon[];
  viewsCount: number;
  leadsCount: number;
  couponsCopiedCount: number;
  createdAt: string;
}

export interface RechargePlan {
  id: 'monthly' | 'quarterly' | 'annual' | 'custom';
  name: string;
  tagline: string;
  durationDays: number;
  price: number;
  monthlyEquivalent: number;
  dailyOfferLimit: number;
  featuredBadge: boolean;
  prioritySearch: boolean;
  whatsappDirectLeads: boolean;
  isPopular?: boolean;
}

export interface PaymentTransaction {
  id: string;
  storeId: string;
  storeName: string;
  planId: string;
  planName: string;
  amount: number;
  gstAmount: number;
  totalAmount: number;
  durationDays: number;
  paymentMethod: 'upi' | 'card' | 'netbanking';
  upiApp?: string;
  transactionRef: string;
  timestamp: string;
  newExpiryDate: string;
}
