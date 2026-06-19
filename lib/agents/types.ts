// Agent interface contracts — each agent implements one of these.
// Swap placeholder implementations for real AI without touching calling code.

import type { Opportunity, UserProfile, CountryProfile } from "@/lib/types";

export interface AgentResult<T> {
  success: boolean;
  data: T | null;
  error?: string;
  model?: string;
  latency_ms?: number;
}

// ── 1. OPPORTUNITY SCOUT AGENT ──────────────────────────────────────────────
// Finds new grants, loans, tenders, contracts, accelerators across Africa.
export interface OpportunityScoutAgent {
  findOpportunities(params: {
    country?: string;
    sector?: string;
    type?: string;
    query?: string;
  }): Promise<AgentResult<Partial<Opportunity>[]>>;
}

// ── 2. ELIGIBILITY AGENT ────────────────────────────────────────────────────
// Reads eligibility criteria and decides which users may qualify.
export interface EligibilityAgent {
  assess(params: {
    opportunity: Opportunity;
    user: UserProfile;
  }): Promise<AgentResult<EligibilityAssessment>>;
}

export interface EligibilityAssessment {
  qualifies: "yes" | "likely" | "maybe" | "unlikely" | "no";
  confidence: number; // 0–100
  reasons_qualify: string[];
  reasons_disqualify: string[];
  missing_info: string[];
  recommendation: string;
}

// ── 3. APPLICATION COACH AGENT ──────────────────────────────────────────────
// Explains how to apply and helps prepare answers/documents.
export interface ApplicationCoachAgent {
  generateChecklist(params: {
    opportunity: Opportunity;
    user: UserProfile;
  }): Promise<AgentResult<ApplicationPlan>>;

  draftResponse(params: {
    opportunity: Opportunity;
    question: string;
    userContext: string;
  }): Promise<AgentResult<string>>;

  simplifyLanguage(params: {
    text: string;
    targetLanguage?: string;
  }): Promise<AgentResult<string>>;
}

export interface ApplicationPlan {
  checklist: string[];
  draft_intro: string;
  business_description: string;
  tips: string[];
  warnings: string[];
}

// ── 4. VERIFICATION AGENT ───────────────────────────────────────────────────
// Checks whether an opportunity has a real official source, deadline, and eligibility.
export interface VerificationAgent {
  verify(params: {
    opportunity: Partial<Opportunity>;
  }): Promise<AgentResult<VerificationResult>>;
}

export interface VerificationResult {
  source_accessible: boolean;
  deadline_confirmed: boolean;
  eligibility_clear: boolean;
  amount_confirmed: boolean;
  recommended_status: "verified" | "needs_review" | "unverified";
  notes: string;
}

// ── 5. COUNTRY INTELLIGENCE AGENT ───────────────────────────────────────────
// Builds country profiles: languages, sectors, history, industries, opportunity landscape.
export interface CountryIntelligenceAgent {
  buildProfile(params: {
    country: string;
  }): Promise<AgentResult<Partial<CountryProfile>>>;

  findCountryOpportunities(params: {
    country: string;
    sector?: string;
  }): Promise<AgentResult<Partial<Opportunity>[]>>;
}

// ── 6. DEADLINE AGENT ───────────────────────────────────────────────────────
// Tracks deadlines and warns users when an opportunity is closing soon.
export interface DeadlineAgent {
  checkDeadlines(params: {
    opportunities: Opportunity[];
    warningDays?: number;
  }): Promise<AgentResult<DeadlineAlert[]>>;
}

export interface DeadlineAlert {
  opportunity_id: string;
  opportunity_title: string;
  deadline: string;
  days_remaining: number;
  urgency: "urgent" | "soon" | "upcoming";
}

// ── 7. FOUNDER BRIEFING AGENT ───────────────────────────────────────────────
// Creates weekly reports for admins/founders.
export interface FounderBriefingAgent {
  generateReport(params: {
    startDate: string;
    endDate: string;
  }): Promise<AgentResult<FounderReport>>;
}

export interface FounderReport {
  new_opportunities: number;
  expiring_opportunities: number;
  top_countries: { country: string; count: number }[];
  top_sectors: { sector: string; count: number }[];
  summary: string;
  recommendations: string[];
}
