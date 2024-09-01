// src/app/api/health/route.ts
import { NextResponse } from "next/server";

const START_TIME = Date.now();

/**
 * Lightweight healthcheck endpoint.
 *
 * Can be used by uptime monitors, load balancers, or your own
 * deployment dashboards. Returns status, uptime, and a timestamp.
 */
export async function GET() {
  const now = Date.now();
  const uptimeMs = now - START_TIME;

  return NextResponse.json({
    status: "ok",
    service: "code-playground-visualizer",
    uptimeMs,
    uptimeSeconds: Math.round(uptimeMs / 1000),
    timestamp: new Date(now).toISOString(),
    checks: {
      // These are static for now but can be extended:
      appRouter: true,
      executionEngine: true,
      algorithmCatalog: true,
    },
  });
}
