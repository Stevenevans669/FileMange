import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

// Cache pooled connections in serverless/edge runtimes.
neonConfig.fetchConnectionCache = true;

let cachedDb: ReturnType<typeof drizzle<typeof schema>> | null = null;

export function getDb() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  if (!cachedDb) {
    const sql = neon(databaseUrl);
    cachedDb = drizzle({ client: sql, schema });
  }

  return cachedDb;
}

export type Database = ReturnType<typeof getDb>;
export { schema };
