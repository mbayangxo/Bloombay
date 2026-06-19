// Placeholder eligibility agent — swap body for Claude/OpenAI call when ready.
import type {
  EligibilityAgent,
  EligibilityAssessment,
  AgentResult,
} from "./types";
import type { Opportunity, UserProfile } from "@/lib/types";

export const eligibilityAgent: EligibilityAgent = {
  async assess({ opportunity, user }): Promise<AgentResult<EligibilityAssessment>> {
    const reasons_qualify: string[] = [];
    const reasons_disqualify: string[] = [];
    const missing_info: string[] = [];

    // Age check
    if (user.age !== null) {
      if (
        opportunity.eligibility_age_min !== null &&
        user.age < opportunity.eligibility_age_min
      ) {
        reasons_disqualify.push(
          `Minimum age is ${opportunity.eligibility_age_min}; you are ${user.age}`
        );
      } else if (
        opportunity.eligibility_age_max !== null &&
        user.age > opportunity.eligibility_age_max
      ) {
        reasons_disqualify.push(
          `Maximum age is ${opportunity.eligibility_age_max}; you are ${user.age}`
        );
      } else if (
        opportunity.eligibility_age_min !== null ||
        opportunity.eligibility_age_max !== null
      ) {
        reasons_qualify.push("Your age meets the eligibility requirement");
      }
    } else {
      missing_info.push("Your age is not set in your profile");
    }

    // Gender check
    if (opportunity.eligibility_gender === "female") {
      if (user.gender === "female" || user.gender === "woman") {
        reasons_qualify.push("This opportunity is open to women — you qualify");
      } else {
        reasons_disqualify.push("This opportunity is for women only");
      }
    }

    // Citizenship check
    if (
      opportunity.eligibility_citizenship &&
      opportunity.eligibility_citizenship.length > 0 &&
      !opportunity.eligibility_citizenship.includes("All African citizens")
    ) {
      const citizenMatch = user.citizenship_countries?.some((c) =>
        opportunity.eligibility_citizenship!.includes(c)
      );
      const parentMatch = user.parent_citizenship_countries?.some((c) =>
        opportunity.eligibility_citizenship!.includes(c)
      );

      if (citizenMatch) {
        reasons_qualify.push(
          `You hold citizenship from ${opportunity.country}, which is required`
        );
      } else if (parentMatch && opportunity.diaspora_allowed) {
        reasons_qualify.push(
          `You have parent citizenship from ${opportunity.country} and diaspora applications are accepted`
        );
      } else if (!citizenMatch && !parentMatch) {
        reasons_disqualify.push(
          `This opportunity requires citizenship in: ${opportunity.eligibility_citizenship.join(", ")}`
        );
      }
    } else if (opportunity.eligibility_citizenship?.includes("All African citizens")) {
      reasons_qualify.push("Open to all African citizens");
    }

    // Diaspora check
    if (user.diaspora_status && !opportunity.diaspora_allowed) {
      reasons_disqualify.push(
        "This opportunity is not available to diaspora applicants"
      );
    } else if (user.diaspora_status && opportunity.diaspora_allowed) {
      reasons_qualify.push("Diaspora applicants are welcome");
    }

    // Business stage check
    if (
      opportunity.business_stage_required &&
      opportunity.business_stage_required.length > 0 &&
      user.business_stage
    ) {
      if (opportunity.business_stage_required.includes(user.business_stage)) {
        reasons_qualify.push(
          `Your business stage (${user.business_stage}) matches the requirements`
        );
      } else {
        reasons_disqualify.push(
          `Required business stage: ${opportunity.business_stage_required.join(" or ")}; your stage: ${user.business_stage}`
        );
      }
    } else if (!user.business_stage) {
      missing_info.push("Your business stage is not set in your profile");
    }

    // Sector check
    const sectorMatch =
      opportunity.sectors.includes("all") ||
      user.sectors?.some((s) => opportunity.sectors.includes(s));
    if (sectorMatch) {
      reasons_qualify.push("Your sector interests align with this opportunity");
    }

    const disqualifyCount = reasons_disqualify.length;
    const qualifyCount = reasons_qualify.length;

    let qualifies: EligibilityAssessment["qualifies"];
    let confidence: number;

    if (disqualifyCount === 0 && qualifyCount >= 2) {
      qualifies = "yes";
      confidence = 90;
    } else if (disqualifyCount === 0 && qualifyCount >= 1) {
      qualifies = "likely";
      confidence = 75;
    } else if (disqualifyCount === 0 && missing_info.length > 0) {
      qualifies = "maybe";
      confidence = 50;
    } else if (disqualifyCount === 1 && qualifyCount >= 2) {
      qualifies = "maybe";
      confidence = 40;
    } else if (disqualifyCount >= 2) {
      qualifies = "no";
      confidence = 20;
    } else {
      qualifies = "unlikely";
      confidence = 30;
    }

    const recommendation =
      disqualifyCount === 0
        ? "You appear to qualify. Review the full eligibility details and prepare your documents."
        : `There are ${disqualifyCount} potential disqualifier(s). Review carefully before applying.`;

    return {
      success: true,
      data: {
        qualifies,
        confidence,
        reasons_qualify,
        reasons_disqualify,
        missing_info,
        recommendation,
      },
    };
  },
};
