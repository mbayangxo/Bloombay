/** When true, member actions must persist to Supabase (no silent localStorage fallback). */

export function isTruthfulMode(): boolean {
  return process.env.NEXT_PUBLIC_BLOOMBAY_TRUTHFUL !== "0";
}

export function allowDemoFallback(): boolean {
  return process.env.NEXT_PUBLIC_BLOOMBAY_DEMO_FALLBACK === "1";
}
