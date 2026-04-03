// src/lib/jobs/workers/scanner.worker.ts
import { Worker, type Job } from "bullmq";
import { redis } from "@/lib/redis";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";
import { decrypt } from "@/lib/utils/crypto";
import { fetchListings } from "@/lib/scanner/csfloat";
import { applyFilters } from "@/lib/scanner/filters";
import { alertsQueue, addScanJob } from "@/lib/jobs/queue";
import type { ScanFilter } from "@/types/scanner";
import { Prisma } from "@prisma/client";

interface ScanJobData {
  scanConfigId: string;
}

// TODO(perf): Batch DB inserts for large result sets
async function processScanJob(job: Job<ScanJobData>): Promise<void> {
  const { scanConfigId } = job.data;
  const jobLogger = logger.child({ scanConfigId, jobId: job.id });

  jobLogger.info("Starting scan job");

  const scanConfig = await db.scanConfig.findUnique({
    where: { id: scanConfigId },
    include: {
      user: {
        include: {
          apiKeys: {
            where: { marketplace: "CSFLOAT" },
            take: 1,
          },
        },
      },
    },
  });

  if (!scanConfig) {
    jobLogger.warn("ScanConfig not found, skipping");
    return;
  }

  if (!scanConfig.isActive) {
    jobLogger.info("ScanConfig is inactive, skipping");
    return;
  }

  const apiKeyRecord = scanConfig.user.apiKeys[0];
  if (!apiKeyRecord) {
    jobLogger.warn("No CSFloat API key found for user");
    return;
  }

  // TODO(security): Wrap in try/catch to avoid leaking decrypt errors
  const apiKey = decrypt(apiKeyRecord.encryptedKey, apiKeyRecord.iv);

  const filter = scanConfig.filters as ScanFilter;
  let cursor: string | undefined;
  let allListings: Awaited<
    ReturnType<typeof fetchListings>
  >["data"] = [];

  try {
    const response = await fetchListings(apiKey, filter, cursor);
    allListings = response.data;
    if (response.cursor) {
      cursor = response.cursor;
    }
  } catch (err) {
    jobLogger.error({ err }, "Failed to fetch CSFloat listings");
    throw err;
  }

  const matchedListings = applyFilters(allListings, filter);

  jobLogger.info(
    { total: allListings.length, matched: matchedListings.length },
    "Listings filtered"
  );

  // Deduplicate by listingUrl
  const existingUrls = await db.scanResult.findMany({
    where: {
      scanConfigId,
      listingUrl: { in: matchedListings.map((l) => l.id) },
    },
    select: { listingUrl: true },
  });
  const existingUrlSet = new Set(existingUrls.map((r) => r.listingUrl));

  const newListings = matchedListings.filter(
    (l) => !existingUrlSet.has(l.id)
  );

  jobLogger.info({ newCount: newListings.length }, "New listings detected");

  for (const listing of newListings) {
    const result = await db.scanResult.create({
      data: {
        scanConfigId,
        marketplace: "CSFLOAT",
        itemName: listing.item.name,
        price: listing.price,
        floatValue: listing.item.float_value ?? undefined,
        patternId: listing.item.paint_seed ?? undefined,
        phase: listing.item.phase ?? undefined,
        stickers: listing.item.stickers as unknown as Prisma.InputJsonValue,
        listingUrl: listing.id,
        imageUrl: listing.item.icon_url,
        isStatTrak: listing.item.is_stattrak,
        isSouvenir: listing.item.is_souvenir,
      },
    });

    await alertsQueue.add("alert", { scanResultId: result.id });
    jobLogger.debug({ scanResultId: result.id }, "Alert queued");
  }

  // Re-schedule the next scan
  await addScanJob(scanConfigId, scanConfig.interval * 1000);
  jobLogger.info({ intervalSeconds: scanConfig.interval }, "Next scan scheduled");
}

export const scannerWorker = new Worker<ScanJobData>(
  "scanner-queue",
  processScanJob,
  {
    connection: redis,
    concurrency: 5,
  }
);

scannerWorker.on("completed", (job) => {
  logger.info({ jobId: job.id }, "Scan job completed");
});

scannerWorker.on("failed", (job, err) => {
  logger.error({ jobId: job?.id, err }, "Scan job failed");
});
