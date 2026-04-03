// src/lib/redis.ts
import IORedis from "ioredis";
import { env } from "@/lib/env";
import { logger } from "@/lib/logger";

const globalForRedis = globalThis as unknown as {
  redis: IORedis | undefined;
};

function createRedisClient(): IORedis {
  const client = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
  });

  client.on("connect", () => {
    logger.info("Redis connected");
  });

  client.on("error", (err: Error) => {
    logger.error({ err }, "Redis connection error");
  });

  client.on("close", () => {
    logger.warn("Redis connection closed");
  });

  return client;
}

export const redis = globalForRedis.redis ?? createRedisClient();

if (process.env.NODE_ENV !== "production") globalForRedis.redis = redis;
