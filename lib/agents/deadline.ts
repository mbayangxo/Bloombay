// Deadline Agent — scans opportunities and flags ones closing soon.
import type { DeadlineAgent, DeadlineAlert, AgentResult } from "./types";
import type { Opportunity } from "@/lib/types";

export const deadlineAgent: DeadlineAgent = {
  async checkDeadlines({ opportunities, warningDays = 30 }): Promise<AgentResult<DeadlineAlert[]>> {
    const now = new Date();
    const alerts: DeadlineAlert[] = [];

    for (const opp of opportunities) {
      if (!opp.deadline) continue;
      const deadline = new Date(opp.deadline);
      const diff = Math.ceil(
        (deadline.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      if (diff < 0) continue; // already passed

      if (diff <= warningDays) {
        alerts.push({
          opportunity_id: opp.id,
          opportunity_title: opp.title,
          deadline: opp.deadline,
          days_remaining: diff,
          urgency: diff <= 7 ? "urgent" : diff <= 14 ? "soon" : "upcoming",
        });
      }
    }

    alerts.sort((a, b) => a.days_remaining - b.days_remaining);
    return { success: true, data: alerts };
  },
};
