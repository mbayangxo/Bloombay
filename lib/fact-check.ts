import Anthropic from "@anthropic-ai/sdk";

export type ContentType =
  | "wall_post"
  | "magazine_article"
  | "avenue_content"
  | "drop"
  | "city_spot";

export interface FactCheckFlag {
  claim: string;
  risk: "high" | "medium" | "low";
  issue: string;
  suggestion: string;
}

export interface FactCheckResult {
  flags: FactCheckFlag[];
  verdict: "pass" | "needs_review";
  summary: string;
  risk_score: number;
}

const SYSTEM_PROMPT = `You are a fact-checker for a women's lifestyle app. Review the content and return ONLY a JSON object:
{
  "flags": [
    {
      "claim": "exact text of the claim",
      "risk": "high" | "medium" | "low",
      "issue": "what is uncertain or wrong",
      "suggestion": "safer rewrite of just that phrase"
    }
  ],
  "verdict": "pass" | "needs_review",
  "summary": "one sentence overall assessment"
}

Flag only:
- Named real people paired with specific events, dates, or actions they may not have done
- Specific statistics without a stated source
- Medical or scientific claims that overreach the evidence
- Legal or financial advice presented as established fact

Do NOT flag:
- Opinion and cultural observation
- Metaphorical or clearly evocative language
- Hedged language ("broadly", "often", "many women", "some research suggests")
- Personal anecdotes presented as personal experience
- Composite or fictional illustrative examples`;

export async function factCheck(
  content: string,
  options?: { headline?: string; contentType?: ContentType }
): Promise<FactCheckResult | null> {
  if (!process.env.ANTHROPIC_API_KEY) return null;

  try {
    const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const input = options?.headline
      ? `Headline: ${options.headline}\n\n${content}`
      : content;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: input }],
    });

    const text =
      message.content[0].type === "text" ? message.content[0].text : "{}";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;

    const result = JSON.parse(jsonMatch[0]) as Omit<FactCheckResult, "risk_score">;
    const highCount = (result.flags ?? []).filter((f) => f.risk === "high").length;
    const medCount = (result.flags ?? []).filter((f) => f.risk === "medium").length;
    const risk_score = Math.min(100, highCount * 35 + medCount * 15);

    return { ...result, risk_score };
  } catch {
    return null;
  }
}

export async function logModeration(
  supabase: ReturnType<typeof import("@supabase/supabase-js").createClient>,
  params: {
    sourceTable: string;
    sourceId: string;
    contentType: ContentType;
    contentText: string;
    result: FactCheckResult | null;
  }
) {
  if (!params.result) return;
  if (params.result.verdict === "pass" && params.result.risk_score === 0) return;

  await supabase.from("content_moderation").insert({
    source_table: params.sourceTable,
    source_id: params.sourceId,
    content_type: params.contentType,
    content_text: params.contentText.slice(0, 2000),
    verdict: params.result.verdict,
    risk_score: params.result.risk_score,
    flags: params.result.flags,
    summary: params.result.summary,
    auto_flagged: true,
  });
}
