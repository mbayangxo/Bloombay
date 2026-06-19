export type OpportunityType =
  | "grant"
  | "loan"
  | "tender"
  | "contract"
  | "accelerator"
  | "fellowship"
  | "procurement"
  | "training"
  | "investment"
  | "fund";

export type VerifiedStatus = "verified" | "needs_review" | "unverified";

export type BusinessStage =
  | "idea"
  | "registered"
  | "operating"
  | "scaling";

export type Sector =
  | "agriculture"
  | "beauty"
  | "fashion"
  | "tech"
  | "media"
  | "music"
  | "tourism"
  | "manufacturing"
  | "food"
  | "education"
  | "health"
  | "housing"
  | "logistics"
  | "retail"
  | "creative"
  | "climate"
  | "finance"
  | "all";

export interface Opportunity {
  id: string;
  title: string;
  country: string;
  region: string | null;
  type: OpportunityType;
  sectors: Sector[];
  eligibility_age_min: number | null;
  eligibility_age_max: number | null;
  eligibility_gender: string | null;
  eligibility_citizenship: string[] | null;
  eligibility_residence: string[] | null;
  diaspora_allowed: boolean;
  business_stage_required: BusinessStage[] | null;
  amount: number | null;
  currency: string | null;
  deadline: string | null;
  source_url: string;
  source_name: string;
  verified_status: VerifiedStatus;
  summary: string;
  documents_required: string[] | null;
  application_steps: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  residence_country: string | null;
  citizenship_countries: string[];
  parent_citizenship_countries: string[];
  diaspora_status: boolean;
  business_stage: BusinessStage | null;
  sectors: Sector[];
  target_countries: string[];
  funding_types: OpportunityType[];
  onboarding_complete: boolean;
  created_at: string;
}

export interface CountryProfile {
  id: string;
  country: string;
  country_code: string;
  languages: string[];
  major_industries: string[];
  cultural_notes: string | null;
  historical_notes: string | null;
  procurement_links: string[] | null;
  youth_programs: string | null;
  women_programs: string | null;
  sme_agencies: string | null;
  startup_notes: string | null;
  diaspora_notes: string | null;
  business_etiquette: string | null;
  flag_emoji: string;
}

export interface SavedOpportunity {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: "saved" | "applying" | "submitted" | "won" | "rejected";
  created_at: string;
  opportunity?: Opportunity;
}
