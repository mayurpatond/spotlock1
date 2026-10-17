# SpotLock - Production PostgreSQL Database Integration Guide

SpotLock is fully configured with a production **PostgreSQL + Drizzle ORM** backend architecture. Everything is already coded and wired into the folders and Express server.

You **do NOT need to write any SQL or backend code**. You only need to provide your PostgreSQL connection string in `.env`.

---

## 1. Quick Setup: Just 1 Step

Open your `.env` file (or copy from `.env.example`) and add your PostgreSQL connection string:

```bash
DATABASE_URL="postgres://USERNAME:PASSWORD@HOST:PORT/DATABASE_NAME?sslmode=require"
```

### Supported Providers:
- **Supabase**: `postgres://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?sslmode=require`
- **Neon Serverless Postgres**: `postgres://[user]:[password]@[endpoint].neon.tech/neondb?sslmode=require`
- **Render PostgreSQL**: `postgres://[user]:[password]@[host]/[dbname]?sslmode=require`
- **AWS RDS / Google Cloud SQL**: Standard postgres connection URI
- **Local Postgres**: `postgres://postgres:password@localhost:5432/spotlock`

---

## 2. Automatic Table Creation & Zero-Migration Architecture

When the server starts with a valid `DATABASE_URL`, `src/db/init.ts` automatically runs DDL migrations:
1. `users` (id, name, email, phone, role, city, pincode, auth_provider, is_verified)
2. `stores` (id, owner_id, name, tagline, category, description, image, gallery_images, address, city, pincode, lat/lng, phone, whatsapp, upi_id, timing, rating, reviews, views, leads, coupon_copies)
3. `subscriptions` (Tata Play prepaid validity, plan_id, is_trial, trial_days_remaining, is_active, daily_offer_limit, expiry_date)
4. `daily_discounts` (id, store_id, title, % off / flat ₹, min_bill_amount, valid_until, is_active)
5. `coupons` (id, store_id, code, discount_description, min_spend, expiry_date, usage_count, is_active)
6. `transactions` (prepaid recharge receipts, GST invoices, reference IDs, payment method, validity extension)
7. `otp_codes` (phone, 6-digit OTP code, expiration, verification status)

### Optional Manual Drizzle Kit Commands
If you ever want to generate migrations or push schema changes using Drizzle CLI:
```bash
# Push schema directly to your Postgres database:
npx drizzle-kit push

# Open visual Drizzle Studio database viewer:
npx drizzle-kit studio
```

---

## 3. Authentication Features Included

1. **Mobile Number OTP Login & Verification**:
   - Supports 10-digit Indian mobile numbers (`+91`).
   - Dispatches a 6-digit OTP code (with live on-screen test autofill).
   - Validates code, registers/logs in the user as **Shopper** or **Store Owner**.
2. **Login with Google**:
   - 1-click Google authentication with user profile synchronization.
3. **Prepaid Recharge Listing Control (Tata Play Model)**:
   - Only active stores are displayed to shoppers on the map and listings.
   - If a subscription expires, the store is automatically unlisted in the database until recharged.
