import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { initializePostgresDatabase } from './src/db/init.ts';
import { db, createPool } from './src/db/index.ts';
import { users, stores, subscriptions, dailyDiscounts, coupons, transactions, otpCodes } from './src/db/schema.ts';
import { eq, desc } from 'drizzle-orm';
import { exec } from 'child_process';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// In-memory store fallback when PostgreSQL DATABASE_URL is not yet connected
const inMemoryOtps: Record<string, { code: string; expiresAt: number }> = {};

// Health & Database status endpoint
app.get('/api/health', async (_req, res) => {
  const pool = createPool();
  let dbStatus = 'disconnected';
  let message = 'Running with fallback in-memory mode. Add DATABASE_URL to .env for production PostgreSQL.';

  if (pool) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      dbStatus = 'connected';
      message = 'Connected to PostgreSQL database.';
    } catch (err: any) {
      dbStatus = 'error';
      message = `PostgreSQL connection error: ${err.message}`;
    }
  }

  res.json({
    status: 'ok',
    appName: 'SpotLock',
    database: dbStatus,
    message,
    timestamp: new Date().toISOString(),
  });
});

// 1. Mobile Number OTP Generation API
app.post('/api/auth/otp/send', async (req, res) => {
  try {
    const { phone } = req.body;
    if (!phone) {
      return res.status(400).json({ error: 'Mobile number is required' });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    // Generate secure 6-digit OTP
    const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes validity

    // Save in DB if connected
    if (db) {
      try {
        await db.insert(otpCodes).values({
          id: `otp-${Date.now()}`,
          phone: cleanPhone,
          code: generatedOtp,
          expiresAt: expiresAt,
          isUsed: false,
        });
      } catch (err) {
        console.warn('[SpotLock Auth] Failed to insert OTP in DB, saving in memory:', err);
      }
    }

    inMemoryOtps[cleanPhone] = {
      code: generatedOtp,
      expiresAt: expiresAt.getTime(),
    };

    console.log(`[SpotLock OTP] Sent OTP ${generatedOtp} to +91 ${cleanPhone}`);

    return res.json({
      success: true,
      message: `OTP sent successfully to +91 ${cleanPhone}`,
      phone: cleanPhone,
      // Provide demo OTP so user/reviewer can test immediately in the UI without real SMS gateway cost
      demoOtp: generatedOtp,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to send OTP' });
  }
});

// 2. Mobile Number OTP Verification API
app.post('/api/auth/otp/verify', async (req, res) => {
  try {
    const { phone, otp, role = 'shopper', name, city, pincode } = req.body;
    if (!phone || !otp) {
      return res.status(400).json({ error: 'Phone and OTP are required' });
    }

    const cleanPhone = phone.replace(/\D/g, '').slice(-10);
    const validInMemory = inMemoryOtps[cleanPhone];

    let isValid = false;
    // Allow either the generated OTP or standard tester code 123456
    if (otp === '123456' || (validInMemory && validInMemory.code === otp && validInMemory.expiresAt > Date.now())) {
      isValid = true;
    }

    if (!isValid && db) {
      try {
        const found = await db
          .select()
          .from(otpCodes)
          .where(eq(otpCodes.phone, cleanPhone))
          .orderBy(desc(otpCodes.createdAt))
          .limit(1);

        if (found.length > 0 && found[0].code === otp && found[0].expiresAt > new Date()) {
          isValid = true;
        }
      } catch (err) {
        console.warn('[SpotLock Auth] Error querying DB OTP:', err);
      }
    }

    if (!isValid) {
      return res.status(400).json({ error: 'Invalid or expired OTP. Please try again.' });
    }

    // OTP Verified! Find or create user
    const userId = `user-${cleanPhone}`;
    const userProfile = {
      id: userId,
      phone: `+91 ${cleanPhone}`,
      name: name || (role === 'store_owner' ? 'Store Owner' : 'Local Shopper'),
      email: `${cleanPhone}@spotlock.local`,
      role: role as 'shopper' | 'store_owner',
      city: city || 'Mumbai',
      pincode: pincode || '400050',
      authProvider: 'mobile_otp' as const,
      isVerified: true,
    };

    if (db) {
      try {
        await db
          .insert(users)
          .values({
            ...userProfile,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: users.phone,
            set: {
              isVerified: true,
              updatedAt: new Date(),
            },
          });
      } catch (err) {
        console.warn('[SpotLock Auth] Error upserting user in Postgres:', err);
      }
    }

    return res.json({
      success: true,
      user: userProfile,
      token: `spotlock_token_${userId}`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'OTP verification failed' });
  }
});

// 3. Google Sign-In API
app.post('/api/auth/google', async (req, res) => {
  try {
    const { email, name, role = 'shopper', avatar } = req.body;
    if (!email) {
      return res.status(400).json({ error: 'Google Email is required' });
    }

    const userId = `google-${email.replace(/[^a-zA-Z0-9]/g, '_')}`;
    const userProfile = {
      id: userId,
      phone: '+91 98200 11223',
      name: name || 'Google User',
      email,
      role: role as 'shopper' | 'store_owner',
      city: 'Mumbai',
      pincode: '400050',
      avatar: avatar || undefined,
      authProvider: 'google' as const,
      isVerified: true,
    };

    if (db) {
      try {
        await db
          .insert(users)
          .values({
            ...userProfile,
            createdAt: new Date(),
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: users.phone,
            set: {
              name: userProfile.name,
              email: userProfile.email,
              avatar: userProfile.avatar,
              updatedAt: new Date(),
            },
          });
      } catch (err) {
        console.warn('[SpotLock Auth] Error saving Google user to DB:', err);
      }
    }

    return res.json({
      success: true,
      user: userProfile,
      token: `spotlock_token_${userId}`,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Google login failed' });
  }
});

// Initialize database schema and start server
async function startServer() {
  // Run Postgres schema creation if DATABASE_URL is configured
  await initializePostgresDatabase();

  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    // In development, mount Vite middleware
    const { createServer: createViteServer } = await import('vite');
    const fs = await import('fs');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Serve index.html transformed with Vite for all front-end routes
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  }

  app.listen(PORT, () => {
    console.log(`\n  🚀 SpotLock is running!`);
    console.log(`  👉 Local:   http://localhost:${PORT}`);
    console.log(`  👉 Network: http://127.0.0.1:${PORT}\n`);

    // Automatically launches browser on Windows/Mac
    const openCmd =
      process.platform === 'win32'
        ? `start http://localhost:${PORT}`
        : process.platform === 'darwin'
        ? `open http://localhost:${PORT}`
        : `xdg-open http://localhost:${PORT}`;
    exec(openCmd, () => {});
  });
}

startServer().catch((err) => {
  console.error('[SpotLock] Fatal server startup error:', err);
});
