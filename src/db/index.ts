import { drizzle, NodePgDatabase } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import * as schema from './schema.ts';

declare global {
  var _spotlockPostgresPool: Pool | undefined;
}

let isDbConfigured = false;

// Create connection pool supporting both DATABASE_URL connection string and Cloud SQL/individual params
export const createPool = (): Pool | null => {
  const dbUrl = process.env.DATABASE_URL;
  const host = process.env.SQL_HOST;
  const user = process.env.SQL_USER;
  const database = process.env.SQL_DB_NAME;

  if (!dbUrl && !host && !user) {
    // Database credentials not yet provided in .env
    return null;
  }

  if (!global._spotlockPostgresPool) {
    try {
      if (dbUrl) {
        global._spotlockPostgresPool = new Pool({
          connectionString: dbUrl,
          max: 10,
          connectionTimeoutMillis: 10000,
          ssl: dbUrl.includes('sslmode=require') || dbUrl.includes('neon.tech') || dbUrl.includes('supabase')
            ? { rejectUnauthorized: false }
            : false,
        });
      } else {
        global._spotlockPostgresPool = new Pool({
          host: host || 'localhost',
          user: user || 'postgres',
          password: process.env.SQL_PASSWORD || '',
          database: database || 'spotlock',
          max: 10,
          connectionTimeoutMillis: 10000,
        });
      }

      global._spotlockPostgresPool.on('error', (err) => {
        console.error('Unexpected error on idle PostgreSQL pool client:', err);
      });

      isDbConfigured = true;
    } catch (err) {
      console.warn('Failed to initialize PostgreSQL pool:', err);
      return null;
    }
  }

  return global._spotlockPostgresPool;
};

const pool = createPool();

// Export Drizzle ORM instance if pool is active
export const db: NodePgDatabase<typeof schema> | null = pool
  ? drizzle(pool, { schema })
  : null;

export const isDatabaseConnected = async (): Promise<boolean> => {
  if (!pool) return false;
  try {
    const client = await pool.connect();
    await client.query('SELECT 1');
    client.release();
    return true;
  } catch (err) {
    return false;
  }
};
