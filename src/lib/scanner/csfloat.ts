// src/lib/scanner/csfloat.ts
import { logger } from "@/lib/logger";
import type { CSFloatListingsResponse } from "@/types/csfloat";
import type { ScanFilter } from "@/types/scanner";

const CSFLOAT_API_BASE = "https://csfloat.com/api/v1";
// TODO(perf): Implement a token bucket for more precise rate limiting
const REQUEST_INTERVAL_MS = 1000;

function buildQueryParams(filter: ScanFilter): URLSearchParams {
  const params = new URLSearchParams();

  if (filter.weapon && filter.skin) {
    params.set("market_hash_name", `${filter.weapon} | ${filter.skin}`);
  } else if (filter.weapon) {
    params.set("market_hash_name", filter.weapon);
  }

  if (filter.floatRange) {
    params.set("min_float", filter.floatRange.min.toString());
    params.set("max_float", filter.floatRange.max.toString());
  }

  if (filter.priceRange) {
    params.set("min_price", filter.priceRange.min.toString());
    params.set("max_price", filter.priceRange.max.toString());
  }

  if (filter.isStatTrak !== undefined) {
    params.set("stattrak", filter.isStatTrak.toString());
  }

  if (filter.isSouvenir !== undefined) {
    params.set("souvenir", filter.isSouvenir.toString());
  }

  return params;
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// TODO(security): Never log the apiKey, even partially
export async function fetchListings(
  apiKey: string,
  filter: ScanFilter,
  cursor?: string
): Promise<CSFloatListingsResponse> {
  const params = buildQueryParams(filter);
  if (cursor) {
    params.set("cursor", cursor);
  }

  const url = `${CSFLOAT_API_BASE}/listings?${params.toString()}`;
  const startTime = Date.now();

  logger.debug({ filter, cursor }, "Fetching CSFloat listings");

  // Simple rate limiting: ensure at least 1 second between requests
  await sleep(REQUEST_INTERVAL_MS);

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  });

  const durationMs = Date.now() - startTime;

  if (!response.ok) {
    const status = response.status;
    logger.error({ status, durationMs }, "CSFloat API error");

    if (status === 401) {
      throw new Error("CSFloat API: Invalid or expired API key");
    }
    if (status === 429) {
      throw new Error("CSFloat API: Rate limit exceeded, please slow down");
    }
    if (status >= 500) {
      throw new Error(`CSFloat API: Server error (${status}), try again later`);
    }
    throw new Error(`CSFloat API: Unexpected error (${status})`);
  }

  const data = (await response.json()) as CSFloatListingsResponse;

  logger.info(
    { count: data.data.length, durationMs },
    "CSFloat listings fetched"
  );

  return data;
}
