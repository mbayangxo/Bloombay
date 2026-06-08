export type GirlsWorkingJobType =
  | "fashion"
  | "cafe"
  | "library"
  | "social_media"
  | "content"
  | "influencer"
  | "retail"
  | "wellness";

export type GirlsWorkingJob = {
  id: string;
  title: string;
  company: string;
  neighborhood: string;
  city: string;
  jobType: GirlsWorkingJobType;
  description: string;
  payLabel?: string;
  schedule?: string;
  applyUrl?: string;
  applyEmail?: string;
  published: boolean;
  featured?: boolean;
  updatedAt: string;
};
