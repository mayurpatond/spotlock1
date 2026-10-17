import { pgTable, text, timestamp, boolean, integer, numeric, jsonb } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// 1. Users table (Shoppers and Store Owners)
export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email'),
  phone: text('phone').notNull().unique(),
  role: text('role').notNull().default('shopper'), // 'shopper' | 'store_owner'
  city: text('city').notNull().default('Mumbai'),
  pincode: text('pincode').notNull().default('400050'),
  avatar: text('avatar'),
  authProvider: text('auth_provider').notNull().default('mobile_otp'), // 'mobile_otp' | 'google'
  isVerified: boolean('is_verified').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 2. Stores table (Store profiles, location, contact, analytics)
export const stores = pgTable('stores', {
  id: text('id').primaryKey(),
  ownerId: text('owner_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  tagline: text('tagline').default(''),
  category: text('category').notNull(), // 'Grocery' | 'Electronics' | 'Fashion' | 'Bakery & Cafe' | 'Pharmacy' | 'Hardware' | 'Beauty & Salon'
  description: text('description').default(''),
  image: text('image').notNull(),
  galleryImages: jsonb('gallery_images').$type<string[]>().default([]),
  address: text('address').notNull(),
  city: text('city').notNull(),
  pincode: text('pincode').notNull(),
  latitude: numeric('latitude', { precision: 10, scale: 6 }).default('19.0760'),
  longitude: numeric('longitude', { precision: 10, scale: 6 }).default('72.8777'),
  phone: text('phone').notNull(),
  whatsapp: text('whatsapp').notNull(),
  upiId: text('upi_id'),
  timing: text('timing').notNull().default('8:00 AM - 10:00 PM'),
  rating: numeric('rating', { precision: 3, scale: 1 }).default('4.8'),
  reviewCount: integer('review_count').default(10),
  viewsCount: integer('views_count').default(0),
  leadsCount: integer('leads_count').default(0),
  couponsCopiedCount: integer('coupons_copied_count').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 3. Subscriptions table (Tata Play prepaid recharge model)
export const subscriptions = pgTable('subscriptions', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }).unique(),
  isTrial: boolean('is_trial').notNull().default(true),
  trialDaysRemaining: integer('trial_days_remaining').notNull().default(7),
  planId: text('plan_id').notNull().default('trial'), // 'trial' | 'monthly' | 'quarterly' | 'annual' | 'custom'
  planName: text('plan_name').notNull().default('7-Day Free Demo Trial'),
  startDate: text('start_date').notNull(),
  expiryDate: text('expiry_date').notNull(),
  isActive: boolean('is_active').notNull().default(true), // If false, store is unlisted (Tata Play model)
  dailyOfferLimit: integer('daily_offer_limit').notNull().default(3),
  pricePaid: numeric('price_paid', { precision: 10, scale: 2 }).default('0'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// 4. Daily Discounts table (Flash deals updated daily)
export const dailyDiscounts = pgTable('daily_discounts', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  title: text('title').notNull(),
  discountPercentage: integer('discount_percentage'),
  flatDiscount: integer('flat_discount'),
  minBillAmount: integer('min_bill_amount'),
  categoryTag: text('category_tag').notNull().default('Daily Flash Deal'),
  validUntil: text('valid_until').notNull().default('Today, 9:00 PM'),
  isActive: boolean('is_active').notNull().default(true),
  terms: text('terms'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 5. Coupons table (Digital vouchers with 1-tap copy)
export const coupons = pgTable('coupons', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  code: text('code').notNull(),
  discountDescription: text('discount_description').notNull(),
  discountType: text('discount_type').notNull().default('flat'), // 'percentage' | 'flat'
  discountValue: numeric('discount_value', { precision: 10, scale: 2 }).notNull(),
  minSpend: integer('min_spend').notNull().default(0),
  maxDiscount: integer('max_discount'),
  expiryDate: text('expiry_date').notNull(),
  usageCount: integer('usage_count').default(0),
  terms: text('terms').default('Show at billing counter to redeem.'),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 6. Transactions table (Prepaid recharge invoices)
export const transactions = pgTable('transactions', {
  id: text('id').primaryKey(),
  storeId: text('store_id').notNull().references(() => stores.id, { onDelete: 'cascade' }),
  storeName: text('store_name').notNull(),
  planId: text('plan_id').notNull(),
  planName: text('plan_name').notNull(),
  amount: numeric('amount', { precision: 10, scale: 2 }).notNull(),
  gstAmount: numeric('gst_amount', { precision: 10, scale: 2 }).notNull(),
  totalAmount: numeric('total_amount', { precision: 10, scale: 2 }).notNull(),
  durationDays: integer('duration_days').notNull(),
  paymentMethod: text('payment_method').notNull(), // 'upi' | 'card' | 'netbanking'
  upiApp: text('upi_app'),
  transactionRef: text('transaction_ref').notNull(),
  timestamp: text('timestamp').notNull(),
  newExpiryDate: text('new_expiry_date').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// 7. OTP Codes table (For mobile OTP login verification)
export const otpCodes = pgTable('otp_codes', {
  id: text('id').primaryKey(),
  phone: text('phone').notNull(),
  code: text('code').notNull(),
  expiresAt: timestamp('expires_at').notNull(),
  isUsed: boolean('is_used').notNull().default(false),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Relationships
export const usersRelations = relations(users, ({ one }) => ({
  store: one(stores, {
    fields: [users.id],
    references: [stores.ownerId],
  }),
}));

export const storesRelations = relations(stores, ({ one, many }) => ({
  owner: one(users, {
    fields: [stores.ownerId],
    references: [users.id],
  }),
  subscription: one(subscriptions, {
    fields: [stores.id],
    references: [subscriptions.storeId],
  }),
  dailyDiscounts: many(dailyDiscounts),
  coupons: many(coupons),
  transactions: many(transactions),
}));
