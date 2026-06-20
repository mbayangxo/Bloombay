/** Physical artifact width on the member board — not viewport stretch. */

export type ArtifactSize = "compact" | "standard" | "feature";

/** Desktop column caps (CSS vars mirror these). */
export const ARTIFACT_WIDTH = {
  compact: 260,
  standard: 300,
  feature: 340,
} as const;

export function artifactSizeClass(size: ArtifactSize = "standard"): string {
  return `bb-artifact--${size}`;
}
