import { NextResponse } from "next/server";

import { getProviderConfiguration } from "@/server/providers";

export function GET() {
  return NextResponse.json({
    status: "ok",
    service: "apgb-portal",
    providers: getProviderConfiguration(),
    timestamp: new Date().toISOString(),
  });
}
