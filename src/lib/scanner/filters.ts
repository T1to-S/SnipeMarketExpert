// src/lib/scanner/filters.ts
import type { CSFloatListing } from "@/types/csfloat";
import type { ScanFilter, WearName } from "@/types/scanner";

// Filter: float range
// Test: floatRange { min: 0, max: 0.07 } → keeps FN listings, rejects higher floats
function matchesFloatRange(
  listing: CSFloatListing,
  filter: ScanFilter
): boolean {
  if (!filter.floatRange) return true;
  const float = listing.item.float_value;
  if (float === null) return false;
  return float >= filter.floatRange.min && float <= filter.floatRange.max;
}

// Filter: price range (prices in cents)
// Test: priceRange { min: 500, max: 2000 } → keeps listings between $5 and $20
function matchesPriceRange(
  listing: CSFloatListing,
  filter: ScanFilter
): boolean {
  if (!filter.priceRange) return true;
  return (
    listing.price >= filter.priceRange.min &&
    listing.price <= filter.priceRange.max
  );
}

// Filter: pattern IDs (paint seeds)
// Test: patternIds [001, 670, 321] → keeps only those specific patterns
function matchesPatternIds(
  listing: CSFloatListing,
  filter: ScanFilter
): boolean {
  if (!filter.patternIds || filter.patternIds.length === 0) return true;
  const seed = listing.item.paint_seed;
  if (seed === null) return false;
  return filter.patternIds.includes(seed);
}

// Filter: phases (for Doppler, Gamma Doppler etc.)
// Test: phases ["Ruby", "Sapphire"] → keeps only Ruby and Sapphire Dopplers
function matchesPhases(listing: CSFloatListing, filter: ScanFilter): boolean {
  if (!filter.phases || filter.phases.length === 0) return true;
  const phase = listing.item.phase;
  if (!phase) return false;
  return filter.phases.includes(phase);
}

// Filter: required stickers
// Test: stickers { required: ["Katowice 2014"] } → keeps listings with that sticker
function matchesStickers(
  listing: CSFloatListing,
  filter: ScanFilter
): boolean {
  if (!filter.stickers?.required || filter.stickers.required.length === 0)
    return true;
  const listingStickers = listing.item.stickers.map((s) => s.name);
  return filter.stickers.required.every((req) => listingStickers.includes(req));
}

// Filter: wear names derived from float value thresholds
// Test: wear ["Factory New"] → float 0.0–0.07 only
function matchesWear(listing: CSFloatListing, filter: ScanFilter): boolean {
  if (!filter.wear || filter.wear.length === 0) return true;
  const wearName = listing.item.wear_name as WearName;
  return filter.wear.includes(wearName);
}

export function applyFilters(
  listings: CSFloatListing[],
  filter: ScanFilter
): CSFloatListing[] {
  return listings.filter(
    (listing) =>
      matchesFloatRange(listing, filter) &&
      matchesPriceRange(listing, filter) &&
      matchesPatternIds(listing, filter) &&
      matchesPhases(listing, filter) &&
      matchesStickers(listing, filter) &&
      matchesWear(listing, filter)
  );
}
