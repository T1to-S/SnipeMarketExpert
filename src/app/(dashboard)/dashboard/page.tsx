// src/app/(dashboard)/dashboard/page.tsx
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { StatsCards } from "@/components/dashboard/StatsCards";

export default async function DashboardPage() {
  const session = await auth();

  const scanCount = session?.user?.id
    ? await db.scanConfig.count({ where: { userId: session.user.id } })
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Scanner CS2 — Dashboard
        </h1>
        <p className="text-muted-foreground">
          Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}
        </p>
      </div>

      <StatsCards />

      {scanCount === 0 && (
        <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
          <p className="text-lg font-medium">Aucun scan configuré</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Créez votre premier scan pour commencer à détecter des opportunités.
          </p>
        </div>
      )}
    </div>
  );
}
