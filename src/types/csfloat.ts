// src/types/csfloat.ts

export interface CSFloatSticker {
  name: string;
  wear: number | null;
  slot: number;
  icon_url: string;
}

export interface CSFloatItem {
  name: string;
  float_value: number | null;
  paint_seed: number | null;
  phase: string | null;
  stickers: CSFloatSticker[];
  is_stattrak: boolean;
  is_souvenir: boolean;
  wear_name: string;
  icon_url: string;
}

export interface CSFloatListing {
  id: string;
  price: number; // in cents
  item: CSFloatItem;
}

export interface CSFloatListingsResponse {
  data: CSFloatListing[];
  cursor: string | null;
}

export interface CSFloatError {
  message: string;
  code: number;
}
