// src/lib/env.ts
import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    DATABASE_URL: z.string().url(),
    REDIS_URL: z.string().url(),
    NEXTAUTH_SECRET: z.string().min(1),
    NEXTAUTH_URL: z.string().url(),
    CSFLOAT_API_KEY: z.string().optional(),
    ENCRYPTION_KEY: z.string().length(32),
    NODE_ENV: z.enum(["development", "staging", "production"]).default("development"),
  },
  client: {},
  runtimeEnv: {
    DATABASE_URL: process.env.DATABASE_URL,
    REDIS_URL: process.env.REDIS_URL,
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    CSFLOAT_API_KEY: process.env.CSFLOAT_API_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    NODE_ENV: process.env.NODE_ENV,
  },
});
