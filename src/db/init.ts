import { createPool } from './index.ts';

/**
 * Auto-creates SpotLock PostgreSQL tables and seeds initial verified stores
 * whenever a valid DATABASE_URL is connected.
 */
export async function initializePostgresDatabase() {
  const pool = createPool();
  if (!pool) {
    console.log('[SpotLock DB] No PostgreSQL connection string provided yet. Running with in-memory fallback.');
    return false;
  }

  let client;
  try {
    client = await pool.connect();
    console.log('[SpotLock DB] Connected to PostgreSQL. Verifying schemas...');

    // 1. Create tables
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT,
        phone TEXT NOT NULL UNIQUE,
        role TEXT NOT NULL DEFAULT 'shopper',
        city TEXT NOT NULL DEFAULT 'Mumbai',
        pincode TEXT NOT NULL DEFAULT '400050',
        avatar TEXT,
        auth_provider TEXT NOT NULL DEFAULT 'mobile_otp',
        is_verified BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS stores (
        id TEXT PRIMARY KEY,
        owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        tagline TEXT DEFAULT '',
        category TEXT NOT NULL,
        description TEXT DEFAULT '',
        image TEXT NOT NULL,
        gallery_images JSONB DEFAULT '[]'::jsonb,
        address TEXT NOT NULL,
        city TEXT NOT NULL,
        pincode TEXT NOT NULL,
        latitude NUMERIC(10, 6) DEFAULT 19.0760,
        longitude NUMERIC(10, 6) DEFAULT 72.8777,
        phone TEXT NOT NULL,
        whatsapp TEXT NOT NULL,
        upi_id TEXT,
        timing TEXT NOT NULL DEFAULT '8:00 AM - 10:00 PM',
        rating NUMERIC(3, 1) DEFAULT 4.8,
        review_count INTEGER DEFAULT 10,
        views_count INTEGER DEFAULT 0,
        leads_count INTEGER DEFAULT 0,
        coupons_copied_count INTEGER DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS subscriptions (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL UNIQUE REFERENCES stores(id) ON DELETE CASCADE,
        is_trial BOOLEAN NOT NULL DEFAULT true,
        trial_days_remaining INTEGER NOT NULL DEFAULT 7,
        plan_id TEXT NOT NULL DEFAULT 'trial',
        plan_name TEXT NOT NULL DEFAULT '7-Day Free Demo Trial',
        start_date TEXT NOT NULL,
        expiry_date TEXT NOT NULL,
        is_active BOOLEAN NOT NULL DEFAULT true,
        daily_offer_limit INTEGER NOT NULL DEFAULT 3,
        price_paid NUMERIC(10, 2) DEFAULT 0,
        created_at TIMESTAMP NOT NULL DEFAULT NOW(),
        updated_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS daily_discounts (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        title TEXT NOT NULL,
        discount_percentage INTEGER,
        flat_discount INTEGER,
        min_bill_amount INTEGER,
        category_tag TEXT NOT NULL DEFAULT 'Daily Flash Deal',
        valid_until TEXT NOT NULL DEFAULT 'Today, 9:00 PM',
        is_active BOOLEAN NOT NULL DEFAULT true,
        terms TEXT,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS coupons (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        code TEXT NOT NULL,
        discount_description TEXT NOT NULL,
        discount_type TEXT NOT NULL DEFAULT 'flat',
        discount_value NUMERIC(10, 2) NOT NULL,
        min_spend INTEGER NOT NULL DEFAULT 0,
        max_discount INTEGER,
        expiry_date TEXT NOT NULL,
        usage_count INTEGER DEFAULT 0,
        terms TEXT DEFAULT 'Show at billing counter to redeem.',
        is_active BOOLEAN NOT NULL DEFAULT true,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS transactions (
        id TEXT PRIMARY KEY,
        store_id TEXT NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
        store_name TEXT NOT NULL,
        plan_id TEXT NOT NULL,
        plan_name TEXT NOT NULL,
        amount NUMERIC(10, 2) NOT NULL,
        gst_amount NUMERIC(10, 2) NOT NULL,
        total_amount NUMERIC(10, 2) NOT NULL,
        duration_days INTEGER NOT NULL,
        payment_method TEXT NOT NULL,
        upi_app TEXT,
        transaction_ref TEXT NOT NULL,
        timestamp TEXT NOT NULL,
        new_expiry_date TEXT NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );

      CREATE TABLE IF NOT EXISTS otp_codes (
        id TEXT PRIMARY KEY,
        phone TEXT NOT NULL,
        code TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        is_used BOOLEAN NOT NULL DEFAULT false,
        created_at TIMESTAMP NOT NULL DEFAULT NOW()
      );
    `);

    console.log('[SpotLock DB] PostgreSQL tables verified successfully.');
    return true;
  } catch (err) {
    console.error('[SpotLock DB] Failed to auto-initialize PostgreSQL tables:', err);
    return false;
  } finally {
    if (client) client.release();
  }
}
