// src/hooks/useScanner.ts
"use client";

import { useState, useCallback } from "react";
import type { ScanFilter } from "@/types/scanner";

interface UseScannerReturn {
  filter: ScanFilter;
  setFilter: (filter: ScanFilter) => void;
  isScanning: boolean;
  startScan: () => Promise<void>;
  stopScan: () => void;
}

export function useScanner(): UseScannerReturn {
  const [filter, setFilter] = useState<ScanFilter>({});
  const [isScanning, setIsScanning] = useState(false);

  const startScan = useCallback(async () => {
    setIsScanning(true);
    try {
      const res = await fetch("/api/scanner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filter }),
      });
      if (!res.ok) throw new Error("Failed to start scan");
    } finally {
      setIsScanning(false);
    }
  }, [filter]);

  const stopScan = useCallback(() => {
    setIsScanning(false);
  }, []);

  return { filter, setFilter, isScanning, startScan, stopScan };
}
