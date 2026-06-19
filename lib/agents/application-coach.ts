// Application Coach Agent — placeholder, ready for Claude API integration.
// To upgrade: replace the return values with actual Anthropic API calls.
import type {
  ApplicationCoachAgent,
  ApplicationPlan,
  AgentResult,
} from "./types";
import type { Opportunity, UserProfile } from "@/lib/types";

export const applicationCoachAgent: ApplicationCoachAgent = {
  async generateChecklist({ opportunity, user }): Promise<AgentResult<ApplicationPlan>> {
    const docs = opportunity.documents_required ?? [
      "Valid government-issued ID",
      "Business plan",
      "Bank account details",
    ];

    const checklist = [
      ...docs.map((d) => `Prepare: ${d}`),
      "Review the official source link for any updates",
      "Note the deadline and set a calendar reminder",
      "Gather proof of your business sector and stage",
      "Prepare a 2-paragraph personal and business introduction",
    ];

    const draft_intro = `My name is ${user.name || "[Your Name]"} and I am a ${user.business_stage || "founder"} in the ${user.sectors?.[0] || "business"} sector based in ${user.residence_country || "[Country]"}. I am applying for ${opportunity.title} to [describe your specific goal].`;

    const business_description = `[Your business name] is a ${user.business_stage || "business"} operating in the ${user.sectors?.join(", ") || "business"} sector in ${user.residence_country || "[Country]"}. We [describe what you do, your market, and your impact].`;

    const tips = [
      "Be specific about your business impact and the people you serve",
      "Use numbers and facts wherever possible (revenue, customers, jobs created)",
      "Connect your business directly to the programme's stated goals",
      "Show you have done your research on the programme's priorities",
      "Be concise — reviewers read hundreds of applications",
    ];

    const warnings: string[] = [];
    if (!opportunity.deadline) {
      warnings.push("Deadline is not confirmed — verify on the official source before applying");
    }
    if (opportunity.verified_status !== "verified") {
      warnings.push("This opportunity is marked as 'Needs Review' — double-check the source URL");
    }

    return {
      success: true,
      data: { checklist, draft_intro, business_description, tips, warnings },
      model: "placeholder — connect Anthropic API for AI-powered coaching",
    };
  },

  async draftResponse({ question, userContext }): Promise<AgentResult<string>> {
    // Placeholder response — replace with Claude API call
    return {
      success: true,
      data: `[AI response to: "${question}" will appear here once the Anthropic API is connected. Context: ${userContext}]`,
      model: "placeholder",
    };
  },

  async simplifyLanguage({ text }): Promise<AgentResult<string>> {
    // Placeholder — replace with Claude API call
    return {
      success: true,
      data: `[Simplified version of the eligibility text will appear here once the AI is connected. Original: "${text.substring(0, 100)}..."]`,
      model: "placeholder",
    };
  },
};
