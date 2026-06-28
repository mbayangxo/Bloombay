import { NextResponse } from "next/server";

/** Temporary Preview-only probe — delete after beta payments env is confirmed. */
export async function GET() {
  if (process.env.VERCEL_ENV === "production") {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  return NextResponse.json({
    BETA_PAYMENTS_DISABLED_exists: process.env.BETA_PAYMENTS_DISABLED !== undefined,
    BETA_PAYMENTS_DISABLED_valueEqualsTrue:
      process.env.BETA_PAYMENTS_DISABLED === "true",
    NEXT_PUBLIC_BETA_PAYMENTS_DISABLED_exists:
      process.env.NEXT_PUBLIC_BETA_PAYMENTS_DISABLED !== undefined,
    NEXT_PUBLIC_BETA_PAYMENTS_DISABLED_valueEqualsTrue:
      process.env.NEXT_PUBLIC_BETA_PAYMENTS_DISABLED === "true",
    VERCEL_ENV: process.env.VERCEL_ENV ?? null,
  });
}
