// src/components/dashboard/StatsCards.tsx
export function StatsCards() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {[
        { label: "Active Scans", value: "0" },
        { label: "Items Detected", value: "0" },
        { label: "Alerts Sent", value: "0" },
        { label: "Potential Profit", value: "0.00 €" },
      ].map((stat) => (
        <div key={stat.label} className="rounded-lg border bg-card p-6">
          <p className="text-sm font-medium text-muted-foreground">
            {stat.label}
          </p>
          <p className="mt-2 text-3xl font-bold">{stat.value}</p>
        </div>
      ))}
    </div>
  );
}
