import { Pool } from 'pg';
import { env } from './env.js';

export const pool = new Pool({
  connectionString: env.DATABASE_URL,
});

pool.on('error', (err: unknown) => {
  // tipado seguro
  if (err instanceof Error) {
    console.error('Error inesperado en el pool PG:', err.message);
  } else {
    console.error('Error inesperado en el pool PG:', err);
  }
});
