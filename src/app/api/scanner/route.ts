// src/app/api/scanner/route.ts
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { logger } from "@/lib/logger";

export async function GET(): Promise<NextResponse> {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const configs = await db.scanConfig.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  logger.info({ userId: session.user.id, count: configs.length }, "Scan configs fetched");
  return NextResponse.json(configs);
}
