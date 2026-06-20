import type { GirlsWorkingJobType } from "./types";

export const GIRLS_WORKING_FILTERS: { id: "all" | GirlsWorkingJobType; label: string }[] = [
  { id: "all", label: "All" },
  { id: "fashion", label: "Fashion" },
  { id: "cafe", label: "Café & Food" },
  { id: "library", label: "Library & Books" },
  { id: "social_media", label: "Social Media" },
  { id: "content", label: "Content & Creative" },
  { id: "influencer", label: "Influencer & Brand" },
  { id: "retail", label: "Retail & Beauty" },
  { id: "wellness", label: "Wellness & Fitness" },
];

export const JOB_TYPE_LABELS: Record<GirlsWorkingJobType, string> = {
  fashion: "Fashion",
  cafe: "Café & Food",
  library: "Library & Books",
  social_media: "Social Media",
  content: "Content & Creative",
  influencer: "Influencer & Brand",
  retail: "Retail & Beauty",
  wellness: "Wellness & Fitness",
};
