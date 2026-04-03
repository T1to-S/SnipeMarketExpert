// src/types/scanner.ts

export type WearName =
  | "Factory New"
  | "Minimal Wear"
  | "Field-Tested"
  | "Well-Worn"
  | "Battle-Scarred";

export type WearRange = { min: number; max: number };
export type PriceRange = { min: number; max: number };

export type ScanFilter = {
  weapon?: string;
  skin?: string;
  wear?: WearName[];
  floatRange?: WearRange;
  priceRange?: PriceRange;
  patternIds?: number[];
  phases?: string[];
  isStatTrak?: boolean;
  isSouvenir?: boolean;
  minFadePercentage?: number;
  stickers?: {
    required?: string[];
    minValue?: number;
  };
};
