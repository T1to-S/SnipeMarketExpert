// src/components/dashboard/ListingsTable.tsx
"use client";

import type { CSFloatListing } from "@/types/csfloat";
import { centsToEuros } from "@/lib/utils/price";

interface ListingsTableProps {
  listings: CSFloatListing[];
}

export function ListingsTable({ listings }: ListingsTableProps) {
  if (listings.length === 0) {
    return (
      <div className="text-center text-sm text-muted-foreground py-8">
        No listings found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b bg-muted/50">
            <th className="px-4 py-3 text-left font-medium">Item</th>
            <th className="px-4 py-3 text-left font-medium">Float</th>
            <th className="px-4 py-3 text-left font-medium">Pattern</th>
            <th className="px-4 py-3 text-left font-medium">Price</th>
          </tr>
        </thead>
        <tbody>
          {listings.map((listing) => (
            <tr key={listing.id} className="border-b last:border-0">
              <td className="px-4 py-3">{listing.item.name}</td>
              <td className="px-4 py-3 font-mono text-xs">
                {listing.item.float_value?.toFixed(8) ?? "N/A"}
              </td>
              <td className="px-4 py-3">{listing.item.paint_seed ?? "N/A"}</td>
              <td className="px-4 py-3 font-medium">
                {centsToEuros(listing.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
