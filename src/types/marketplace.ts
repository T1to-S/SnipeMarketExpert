// src/types/marketplace.ts

export type MarketplaceId =
  | "CSFLOAT"
  | "STEAM"
  | "SKINPORT"
  | "DMARKET"
  | "BUFF163"
  | "WAXPEER";

export interface MarketplaceConfig {
  id: MarketplaceId;
  name: string;
  baseUrl: string;
  rateLimit: number; // requests per second
  supportedFeatures: MarketplaceFeature[];
}

export type MarketplaceFeature =
  | "float"
  | "pattern"
  | "phase"
  | "stickers"
  | "stattrak"
  | "souvenir";

export const MARKETPLACE_CONFIGS: Record<MarketplaceId, MarketplaceConfig> = {
  CSFLOAT: {
    id: "CSFLOAT",
    name: "CSFloat",
    baseUrl: "https://csfloat.com/api/v1",
    rateLimit: 1,
    supportedFeatures: ["float", "pattern", "phase", "stickers", "stattrak", "souvenir"],
  },
  STEAM: {
    id: "STEAM",
    name: "Steam Market",
    baseUrl: "https://steamcommunity.com/market",
    rateLimit: 0.2,
    supportedFeatures: ["stattrak", "souvenir"],
  },
  SKINPORT: {
    id: "SKINPORT",
    name: "Skinport",
    baseUrl: "https://api.skinport.com/v1",
    rateLimit: 0.5,
    supportedFeatures: ["float", "pattern", "stickers", "stattrak", "souvenir"],
  },
  DMARKET: {
    id: "DMARKET",
    name: "DMarket",
    baseUrl: "https://api.dmarket.com",
    rateLimit: 1,
    supportedFeatures: ["float", "pattern", "stickers", "stattrak", "souvenir"],
  },
  BUFF163: {
    id: "BUFF163",
    name: "Buff163",
    baseUrl: "https://buff.163.com/api",
    rateLimit: 0.5,
    supportedFeatures: ["float", "pattern", "phase", "stickers", "stattrak", "souvenir"],
  },
  WAXPEER: {
    id: "WAXPEER",
    name: "Waxpeer",
    baseUrl: "https://api.waxpeer.com/v1",
    rateLimit: 1,
    supportedFeatures: ["float", "stickers", "stattrak", "souvenir"],
  },
};
