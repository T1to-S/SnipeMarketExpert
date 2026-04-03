// src/app/api/webhooks/route.ts
import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

// TODO(security): Validate webhook signature before processing
export async function POST(req: NextRequest): Promise<NextResponse> {
  const body = (await req.json()) as unknown;
  logger.info({ body }, "Webhook received");
  return NextResponse.json({ received: true });
}
