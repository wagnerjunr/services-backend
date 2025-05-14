import "dotenv/config";

import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(1912),
  NODE_ENV: z.string().default("development"),
  BACKEND_URL: z.string(),
  FRONTEND_URL: z.string(),
  DATABASE_URL: z.string(),
  AWS_ACCESS_KEY: z.string(),
  AWS_SECRET_ACCESS_KEY: z.string(),
  AWS_REGION: z.string(),
  AWS_S3_BUCKET_NAME: z.string(),
});

const _env = envSchema.safeParse(process.env);

if (!_env.success) {
  console.error("Invalid environment variables!");
  throw new Error(_env.error.message);
}

export const env = _env.data;
