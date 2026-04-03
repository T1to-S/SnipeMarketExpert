// src/components/dashboard/ScannerFilters.tsx
"use client";

import type { ScanFilter } from "@/types/scanner";

interface ScannerFiltersProps {
  filter: ScanFilter;
  onChange: (filter: ScanFilter) => void;
}

export function ScannerFilters({ filter, onChange }: ScannerFiltersProps) {
  return (
    <div className="rounded-lg border p-4">
      <h3 className="font-medium">Filters</h3>
      {/* TODO: Implement full filter UI */}
      <pre className="mt-2 text-xs text-muted-foreground">
        {JSON.stringify(filter, null, 2)}
      </pre>
    </div>
  );
}
