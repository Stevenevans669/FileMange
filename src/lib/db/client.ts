import { neon, neonConfig } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';

import * as schema from './schema';

if (!process.env.DATABASE_URL) {
  throw new Error('DATABASE_URL is not set');
}

// Cache pooled connections in serverless/edge runtimes.
neonConfig.fetchConnectionCache = true;

const sql = neon(process.env.DATABASE_URL);

export const db = drizzle({ client: sql, schema });
export type Database = typeof db;
export { schema };
