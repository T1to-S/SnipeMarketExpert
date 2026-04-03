// src/lib/utils/price.ts

/**
 * Converts a price in cents to a formatted Euro string.
 * Example: centsToEuros(1250) → "12.50 €"
 */
export function centsToEuros(cents: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
}

/**
 * Calculates the net profit after platform fees.
 * @param buyPrice - Purchase price in cents
 * @param sellPrice - Sale price in cents
 * @param platformFee - Fee as a decimal (e.g., 0.05 for 5%)
 * @returns Net profit in cents
 */
export function calculateProfit(
  buyPrice: number,
  sellPrice: number,
  platformFee: number
): number {
  const netSell = sellPrice * (1 - platformFee);
  return Math.round(netSell - buyPrice);
}

/**
 * Calculates the return on investment as a percentage.
 * @param buyPrice - Purchase price in cents
 * @param sellPrice - Sale price in cents
 * @returns ROI percentage (e.g., 25.5 for 25.5%)
 */
export function calculateROI(buyPrice: number, sellPrice: number): number {
  if (buyPrice === 0) return 0;
  return ((sellPrice - buyPrice) / buyPrice) * 100;
}
