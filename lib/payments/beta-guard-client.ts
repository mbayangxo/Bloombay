import {
  BETA_PAYMENTS_DISABLED_CODE,
  BETA_PAYMENTS_PILOT_MESSAGE,
} from "@/lib/payments/beta-guard-messages";

export { BETA_PAYMENTS_DISABLED_CODE, BETA_PAYMENTS_PILOT_MESSAGE };

/** Client UI guard — set NEXT_PUBLIC_BETA_PAYMENTS_DISABLED=true on preview. */
export function isBetaPaymentsDisabledClient(): boolean {
  return process.env.NEXT_PUBLIC_BETA_PAYMENTS_DISABLED === "true";
}
