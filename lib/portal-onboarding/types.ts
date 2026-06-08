export type PortalOnboardingId =
  | "partner"
  | "club_owner"
  | "founder"
  | "admin"
  | "curator";

export type PortalOnboardingStep = {
  id: string;
  title: string;
  body: string;
  illustration: "dashboard" | "brand" | "drops" | "calendar" | "club" | "mission" | "create" | "field" | "revenue";
  tip?: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export type PortalOnboardingFlow = {
  portalId: PortalOnboardingId;
  portalLabel: string;
  welcome: string;
  accentClass: string;
  steps: PortalOnboardingStep[];
};
