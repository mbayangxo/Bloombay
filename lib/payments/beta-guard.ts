import { NextResponse } from "next/server";
import {
  BETA_PAYMENTS_DISABLED_CODE,
  BETA_PAYMENTS_PILOT_MESSAGE,
} from "@/lib/payments/beta-guard-messages";

export { BETA_PAYMENTS_DISABLED_CODE, BETA_PAYMENTS_PILOT_MESSAGE };

/** Server-side guard — set BETA_PAYMENTS_DISABLED=true on preview/local. */
export function isBetaPaymentsDisabled(): boolean {
  return (
    process.env.BETA_PAYMENTS_DISABLED === "true" ||
    process.env.NEXT_PUBLIC_BETA_PAYMENTS_DISABLED === "true"
  );
}

export function betaPaymentsDisabledResponse(): NextResponse {
  return NextResponse.json(
    {
      ok: false,
      error: BETA_PAYMENTS_DISABLED_CODE,
      message: BETA_PAYMENTS_PILOT_MESSAGE,
    },
    { status: 403 },
  );
}
