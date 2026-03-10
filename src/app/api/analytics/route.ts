import { NextRequest, NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export const dynamic = "force-dynamic";

/**
 * POST /api/analytics
 * Receives client-side analytics events and logs them as structured data.
 * Lightweight — no database writes, just structured logs for Vercel.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { event, properties } = body;

    if (!event || typeof event !== "string") {
      return NextResponse.json({ ok: true }, { status: 200 });
    }

    logger.info(`ANALYTICS_${event.toUpperCase()}`, properties || {});

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch {
    // Always return 200 — analytics should never error for the client
    return NextResponse.json({ ok: true }, { status: 200 });
  }
}
