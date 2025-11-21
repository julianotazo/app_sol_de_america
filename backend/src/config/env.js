import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z.string().default('3000'),
  DATABASE_URL: z.string().url(),
  JWT_SECRET: z.string().min(10, 'JWT_SECRET muy corto'),
  NODE_ENV: z.string().default('development'),
});

export const env = schema.parse(process.env);
