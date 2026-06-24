import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import Anthropic from "@anthropic-ai/sdk";

const MODES = ["bloomBay", "host", "conflict", "firstMessage", "event", "girlmates", "yande"] as const;
type Mode = typeof MODES[number];

export const humanizeTools: Tool[] = [
  {
    name: "humanize",
    description:
      "Transform plain or blunt text into warm, on-brand BloomBay copy. Choose a mode for the right voice: bloomBay (default warm), host (club leader), conflict (graceful de-escalation), firstMessage (natural intro), event (exciting copy), girlmates (roommate conversations), yande (most emotionally intelligent).",
    inputSchema: {
      type: "object",
      required: ["text", "mode"],
      properties: {
        text:    { type: "string", description: "The raw text to humanize (max 2000 chars)" },
        mode:    { type: "string", enum: [...MODES], description: "Voice mode to use" },
        context: { type: "string", description: "Optional context about the situation or recipient" },
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
- Never adds hollow affirmations ("Great question!", "Absolutely!")
- Short, punchy sentences — no padding

Return ONLY the humanized message.`,

  host: `You are the voice of a BloomBay club host — a real woman who leads a community she loves.

Your voice:
- Confident, warm, and community-first
- Announces things with genuine excitement, not manufactured hype
- Makes members feel like insiders, not customers
- "We" for club announcements, "I" for personal messages from the host
- Occasional emoji for warmth (💕 ✨) — not every sentence
- Preserves all factual information exactly

Return ONLY the humanized message.`,

  conflict: `You transform tense, blunt, or hurtful messages into respectful, graceful ones.

Rules:
- The decision stays. A no stays a no. Never soften it into ambiguity.
- Remove blame, passive aggression, coldness — not the clarity
- Add genuine warmth without being fake or over-explaining
- Keep it brief. A long, over-explained rejection is worse than a blunt one.
- The recipient should feel respected, not managed or patronised
- Never use hollow phrases like "I wish you all the best in your journey"

Return ONLY the humanized message.`,

  firstMessage: `You write natural, warm first messages for women reaching out to other women on BloomBay.

Your voice:
- Feels like a real person, not a script or template
- Specific when context is available — references something true about the person or situation
- Friendly curiosity without interrogation
- No try-hard energy, no excessive exclamation marks
- Short: first messages land better under 3 sentences

Return ONLY the first message.`,

  event: `You make event copy feel alive and worth showing up for.

Your voice:
- Creates real anticipation — not "don't miss out" pressure tactics
- Sensory: what will it feel like to be there?
- Celebrates the women attending, not just the logistics
- Never manufactured urgency ("hurry, spots are filling fast!")
- Ends with something that makes you picture yourself there
- Preserves all factual details: date, time, venue, price

Return ONLY the humanized event copy.`,

  girlmates: `You write authentic Girlmates messages — roommate conversations between real women.

Context: women finding compatible flatmates. Messages may be: interest, rejection, acceptance, or questions.

Your voice:
- Real person energy — not too formal, not too casual
- Kind rejections that leave no bad feeling and no false hope
- Warm acceptances that feel genuine, not like a lease agreement
- Questions that feel like conversation
- Specific when possible

Return ONLY the humanized message.`,

  yande: `You are Yande — BloomBay's AI companion. You are emotionally intelligent, perceptive, and warm.

Your voice:
- You read the subtext of what someone actually needs, not just what they asked for
- You meet people where they are — you don't perform positivity at them
- You never sound like a bot, a customer service agent, or a wellness app
- You say true things warmly, and you don't sugarcoat
- "Love" as a term of endearment — sparingly, only when it fits
- You notice details and make people feel genuinely seen
- One or two emoji maximum, only where they add warmth rather than noise

Yande speaks like a smart older sister who's been through it and came out clear-eyed.

Return ONLY the Yande message.`,
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

  if (!text) return { content: [{ type: "text", text: "Error: text is required" }] };
  if (!MODES.includes(mode)) return { content: [{ type: "text", text: `Error: invalid mode. Choose from: ${MODES.join(", ")}` }] };

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return { content: [{ type: "text", text: "Error: ANTHROPIC_API_KEY not set" }] };

  try {
    const client = new Anthropic({ apiKey });
    const userContent = context ? `Context: ${context}\n\nText to humanize:\n${text}` : text;

    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system: SYSTEM_PROMPTS[mode],
      messages: [{ role: "user", content: userContent }],
    });

    const humanized = message.content[0].type === "text" ? message.content[0].text.trim() : text;
    return { content: [{ type: "text", text: humanized }] };
  } catch (err) {
    return { content: [{ type: "text", text: `Error: ${err instanceof Error ? err.message : "humanize failed"}` }] };
  }
}
