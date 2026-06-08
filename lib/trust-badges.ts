/** Trust layer — instant read for women */

export type TrustBadgeId =
  | "verified"
  | "attended_event"
  | "hosted_event"
  | "community_leader"
  | "curator";

export const TRUST_BADGES: { id: TrustBadgeId; label: string; description: string }[] = [
  { id: "verified", label: "Verified", description: "Identity confirmed" },
  { id: "attended_event", label: "Attended event", description: "Checked in IRL" },
  { id: "hosted_event", label: "Hosted event", description: "Hosted a gathering" },
  { id: "community_leader", label: "Community leader", description: "Trusted by members" },
  { id: "curator", label: "Curator", description: "Creates culture & gatherings" },
];
