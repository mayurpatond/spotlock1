import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config();

// Connect via DATABASE_URL or specific parameters
const databaseUrl = process.env.DATABASE_URL;

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  schemaFilter: ['public'],
  dbCredentials: databaseUrl
    ? {
        url: databaseUrl,
      }
    : {
        host: process.env.SQL_HOST || 'localhost',
        user: process.env.SQL_ADMIN_USER || process.env.SQL_USER || 'postgres',
        password: process.env.SQL_ADMIN_PASSWORD || process.env.SQL_PASSWORD || '',
        database: process.env.SQL_DB_NAME || 'spotlock',
        ssl: false,
      },
  verbose: true,
});
