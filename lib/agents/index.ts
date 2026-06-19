// Central export — import agents from here so callers never need to know the implementation.
export { eligibilityAgent } from "./eligibility";
export { deadlineAgent } from "./deadline";
export { applicationCoachAgent } from "./application-coach";
export type {
  AgentResult,
  EligibilityAssessment,
  ApplicationPlan,
  DeadlineAlert,
  FounderReport,
  VerificationResult,
  OpportunityScoutAgent,
  EligibilityAgent,
  ApplicationCoachAgent,
  VerificationAgent,
  CountryIntelligenceAgent,
  DeadlineAgent,
  FounderBriefingAgent,
} from "./types";
