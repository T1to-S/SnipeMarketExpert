// src/hooks/useListings.ts
"use client";

import { useState, useEffect } from "react";
import type { CSFloatListing } from "@/types/csfloat";

interface UseListingsReturn {
  listings: CSFloatListing[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

// TODO(perf): Replace polling with WebSocket or Server-Sent Events for real-time updates
export function useListings(scanConfigId?: string): UseListingsReturn {
  const [listings, setListings] = useState<CSFloatListing[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!scanConfigId) return;

    setIsLoading(true);
    fetch(`/api/scanner?configId=${scanConfigId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch listings");
        return res.json() as Promise<CSFloatListing[]>;
      })
      .then((data) => {
        setListings(data);
        setError(null);
      })
      .catch((err: Error) => {
        setError(err.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [scanConfigId, tick]);

  const refetch = () => setTick((t) => t + 1);

  return { listings, isLoading, error, refetch };
}
