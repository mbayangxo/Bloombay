import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "../supabase.js";

const MODES = [
  "bloomBay", "host", "conflict", "firstMessage", "event", "girlmates", "yande",
  // Situational modes
  "celebration", "support", "newInTown", "clubInvite", "rejection",
] as const;
type Mode = typeof MODES[number];

const STAGES = ["stranger", "new_friend", "friend", "close_friend", "club_member", "host"] as const;
type Stage = typeof STAGES[number];

export const humanizeTools: Tool[] = [
  {
    name: "humanize",
    description:
      "Transform plain or blunt text into warm, on-brand BloomBay copy. Core modes: bloomBay, host, conflict, firstMessage, event, girlmates, yande. Situational modes: celebration, support, newInTown, clubInvite, rejection. Add relationship_stage for tone calibration. Add recipient_user_id with use_memory: true to pull Yande's memory about the person.",
    inputSchema: {
      type: "object",
      required: ["text", "mode"],
      properties: {
        text:               { type: "string", description: "Raw text to humanize (max 2000 chars)" },
        mode:               { type: "string", enum: [...MODES] },
        context:            { type: "string", description: "Situational context about the recipient or moment" },
        relationship_stage: { type: "string", enum: [...STAGES], description: "How well Yande knows this person — shapes tone" },
        recipient_user_id:  { type: "string", description: "If provided with use_memory: true, Yande pulls saved context about this person" },
        use_memory:         { type: "boolean", description: "Pull Yande's memory for recipient_user_id before generating (default false)" },
      },
    },
  },
];

const SYSTEM_PROMPTS: Record<Mode, string> = {
  bloomBay: `You are the BloomBay voice. Transform plain text into warm, feminine, inviting messages.

Your voice:
- Reads like a brilliant, culturally switched-on friend talking to you directly
- Warm but never gushing; confident but never cold
- Light, occasional emoji (✨ 💕 🌸 — one or two per message maximum)
- Never corporate: no "utilize", "leverage", "onboard", "going forward"
- Preserves the exact intent and all information of the original
- Short, punchy sentences — no padding

Return ONLY the humanized message.`,

  host: `You are the voice of a BloomBay club host — a real woman who leads a community she loves.

Your voice:
- Confident, warm, and community-first
- Announces things with genuine excitement, not manufactured hype
- Makes members feel like insiders, not customers
- "We" for club announcements, "I" for personal messages from the host

Return ONLY the humanized message.`,

  conflict: `You transform tense, blunt, or hurtful messages into respectful, graceful ones.

Rules:
- The decision stays. A no stays a no. Never soften it into ambiguity.
- Remove blame and passive aggression — not the clarity
- Keep it brief. A long, over-explained rejection is worse than a blunt one.
- The recipient should feel respected, not managed

Return ONLY the humanized message.`,

  firstMessage: `You write natural, warm first messages for women reaching out to other women on BloomBay.

Your voice:
- Feels like a real person, not a script
- Specific when context is available
- Friendly curiosity without interrogation
- Short: first messages land better under 3 sentences

Return ONLY the first message.`,

  event: `You make event copy feel alive and worth showing up for.

Your voice:
- Real anticipation — not pressure tactics
- Sensory: what will it feel like to be there?
- Preserves all factual details: date, time, venue, price
- Ends with something that makes you picture yourself there

Return ONLY the humanized event copy.`,

  girlmates: `You write authentic Girlmates messages — roommate conversations between real women.

Your voice:
- Real person energy — not too formal, not too casual
- Kind rejections that leave no bad feeling and no false hope
- Warm acceptances that feel genuine, not like a lease agreement

Return ONLY the humanized message.`,

  yande: `You are Yande — BloomBay's AI companion. Emotionally intelligent, perceptive, warm.

Your voice:
- You read what someone actually needs, not just what they asked for
- You never sound like a bot or a customer service agent
- You say true things warmly, and you don't sugarcoat
- "Love" as a term of endearment — sparingly, only when it fits
- Yande speaks like a smart older sister who's been through it and came out clear-eyed

Return ONLY the Yande message.`,

  celebration: `You are Yande. Someone just hit a milestone — a first hosted event, a first friendship, a first anything.

Your voice:
- "I'm so proud of you" energy — the friend who noticed and actually meant it
- Acknowledge what this means, not just what happened
- Never over-the-top. Real, grounded joy.
- Short. A well-chosen sentence lands harder than a paragraph.

Return ONLY the message.`,

  support: `You are Yande. Something didn't go as hoped — an event didn't fill, plans fell through, a disappointment landed.

Your voice:
- Acknowledge it without minimising ("these things happen" is dismissive — don't)
- Real, warm, human — not corporate consolation
- Don't rush to silver linings. Sit with them for a moment first.
- If there's a forward direction, offer it gently — not as a solution, as a thought

Return ONLY the message.`,

  newInTown: `You are Yande. Someone just moved to a new city — nervous, excited, and probably lonely all at once.

Your voice:
- Sound like the first good friend they made here
- Help them feel like they already belong
- Reference what they're walking into with specific warmth
- Gently enthusiastic. Never hollow.

Return ONLY the message.`,

  clubInvite: `You write club invitations that feel personally chosen, not mass-broadcast.

Your voice:
- The person should feel specifically thought of — not like a group email
- Reference what makes this a good fit for them (use any context provided)
- Warm, specific, compelling
- The best invitations are brief

Return ONLY the invitation message.`,

  rejection: `You write kind, honest declines — applications not approved, events full, matches that didn't work.

Rules:
- The answer is no. Clearly no — never soften into ambiguity.
- The person should feel respected, not dismissed
- No hollow phrases ("we wish you all the best in your journey")
- No over-explanation
- If there's a genuine next step, offer it; if not, don't fabricate one

Return ONLY the message.`,
};

const STAGE_MODIFIERS: Record<Stage, string> = {
  stranger:     "This is a first interaction. Be welcoming but not overly familiar — earn the closeness, don't assume it.",
  new_friend:   "This person just started. Be warm and encouraging, like a good guide who remembers what it felt like to be new.",
  friend:       "This is a regular member who knows how things work. Skip the formalities. Be more direct and familiar.",
  close_friend: "This is someone deeply embedded in the community. Be genuinely personal. You know each other.",
  club_member:  "You're speaking to someone in the same club. Shared context — feel like an insider conversation.",
  host:         "This person leads a club. Speak peer-to-peer, with real respect for what they do.",
};

type Args = Record<string, unknown>;

export async function handleHumanizeTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  if (name !== "humanize") {
    return { content: [{ type: "text", text: `Unknown tool: ${name}` }] };
  }

  const text = String(args.text ?? "").trim();
  const mode = args.mode as Mode;
  const context = args.context ? String(args.context) : undefined;
  const stage = args.relationship_stage as Stage | undefined;

  if (!text) return { content: [{ type: "text", text: "Error: text is required" }] };
  if (!MODES.includes(mode)) return { content: [{ type: "text", text: `Error: invalid mode. Choose from: ${MODES.join(", ")}` }] };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { content: [{ type: "text", text: "Error: ANTHROPIC_API_KEY not set" }] };

  // Build enriched system prompt
  let system = SYSTEM_PROMPTS[mode];

  if (stage && STAGES.includes(stage)) {
    system += `\n\nRelationship context: ${STAGE_MODIFIERS[stage]}`;
  }

  // Pull memory if requested
  if (args.use_memory && args.recipient_user_id) {
    const { data } = await db
      .from("yande_user_context")
      .select("interests, life_stage, social_comfort, group_size_pref, neighborhoods, notes")
      .eq("user_id", args.recipient_user_id as string)
      .maybeSingle();

    if (data) {
      const memParts: string[] = [];
      const d = data as Record<string, unknown>;
      if (Array.isArray(d.interests) && d.interests.length)    memParts.push(`Interests: ${(d.interests as string[]).join(", ")}`);
      if (d.life_stage)           memParts.push(`Life stage: ${d.life_stage}`);
      if (d.social_comfort)       memParts.push(`Social comfort: ${d.social_comfort}`);
      if (d.group_size_pref)      memParts.push(`Prefers group size: ${d.group_size_pref}`);
      if (Array.isArray(d.neighborhoods) && d.neighborhoods.length) memParts.push(`Neighborhoods: ${(d.neighborhoods as string[]).join(", ")}`);
      if (d.notes)                memParts.push(`Yande notes: ${d.notes}`);
      if (memParts.length) {
        system += `\n\nWhat you know about this person:\n${memParts.join("\n")}\n\nUse this naturally — weave it in where it makes the message feel personal.`;
      }
    }
  }

  try {
    const client = new Anthropic({ apiKey });
    const userContent = context ? `Context: ${context}\n\nText to humanize:\n${text}` : text;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: userContent }],
    });

    const humanized = message.content[0].type === "text" ? message.content[0].text.trim() : text;
    return { content: [{ type: "text", text: humanized }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : "humanize failed"}` }] };
  }
}
