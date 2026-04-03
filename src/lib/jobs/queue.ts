// src/lib/jobs/queue.ts
import { Queue } from "bullmq";
import { redis } from "@/lib/redis";
import { logger } from "@/lib/logger";

export const scannerQueue = new Queue("scanner-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 5000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});

export const alertsQueue = new Queue("alerts-queue", {
  connection: redis,
  defaultJobOptions: {
    attempts: 3,
    backoff: {
      type: "exponential",
      delay: 2000,
    },
    removeOnComplete: { count: 100 },
    removeOnFail: { count: 500 },
  },
});

export async function addScanJob(
  scanConfigId: string,
  delay?: number
): Promise<void> {
  await scannerQueue.add(
    "scan",
    { scanConfigId },
    { delay }
  );
  logger.info({ scanConfigId, delay }, "Scan job added to queue");
}
