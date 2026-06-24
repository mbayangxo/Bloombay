import type { Tool } from "@modelcontextprotocol/sdk/types.js";
import Anthropic from "@anthropic-ai/sdk";
import { db } from "../supabase.js";

// ── Phase 2: Drafting Tools ───────────────────────────────────────────────────
// All tools SAVE content to yande_drafts. Nothing is sent here.
// Sending happens in Phase 3 (actions.ts) after human confirmation.

export const draftTools: Tool[] = [
  {
    name: "draft_email",
    description:
      "Draft a warm, humanized email for a specific member. Saves to the draft queue — does NOT send. Set use_memory: true to make Yande pull her saved context about this person for a more personal message.",
    inputSchema: {
      type: "object",
      required: ["user_id", "subject", "raw_message"],
      properties: {
        user_id:            { type: "string", description: "Recipient user UUID" },
        subject:            { type: "string", description: "Email subject line" },
        raw_message:        { type: "string", description: "Plain text of what you want to say" },
        mode:               { type: "string", enum: ["bloomBay","host","yande","event","girlmates","celebration","support","newInTown","clubInvite","rejection"], description: "Voice mode (default: yande)" },
        context:            { type: "string", description: "Optional context to help the voice feel specific" },
        relationship_stage: { type: "string", enum: ["stranger","new_friend","friend","close_friend","club_member","host"] },
        use_memory:         { type: "boolean", description: "Pull Yande's saved context about this member (default: true)" },
      },
    },
  },
  {
    name: "draft_sms",
    description:
      "Draft a short, warm SMS for a specific member. Saves to the draft queue — does NOT send. Set use_memory: true to personalize with Yande's memory.",
    inputSchema: {
      type: "object",
      required: ["user_id", "raw_message"],
      properties: {
        user_id:            { type: "string", description: "Recipient user UUID" },
        raw_message:        { type: "string", description: "What you want to say (keep short — will be humanized to SMS length)" },
        mode:               { type: "string", enum: ["bloomBay","host","yande","event","girlmates","celebration","support","newInTown","clubInvite","rejection"], description: "Voice mode (default: yande)" },
        context:            { type: "string", description: "Optional situation context" },
        relationship_stage: { type: "string", enum: ["stranger","new_friend","friend","close_friend","club_member","host"] },
        use_memory:         { type: "boolean", description: "Pull Yande's saved context about this member (default: true)" },
      },
    },
  },
  {
    name: "draft_bulk_reminder",
    description:
      "Draft reminder messages for all attendees/reservees of an upcoming event or gathering. Returns draft IDs for review.",
    inputSchema: {
      type: "object",
      required: ["event_id", "event_type"],
      properties: {
        event_id:    { type: "string", description: "Event or gathering UUID" },
        event_type:  { type: "string", enum: ["event", "gathering"] },
        channel:     { type: "string", enum: ["sms", "email"], description: "Channel to draft for (default: sms)" },
        raw_message: { type: "string", description: "Optional custom message — omit to generate automatically" },
      },
    },
  },
  {
    name: "draft_event_copy",
    description:
      "Generate polished event description copy from basic details. Returns the copy directly (no draft saved — use this for preview/iteration).",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title:       { type: "string", description: "Event title" },
        details:     { type: "string", description: "Raw details: venue, date, vibe, who it's for, price" },
        category:    { type: "string", description: "e.g. dinner, brunch, wellness, culture" },
        save_draft:  { type: "boolean", description: "Save result to yande_drafts (default false)" },
      },
    },
  },
  {
    name: "draft_host_note",
    description:
      "Write a warm, honest coaching note for a club host based on their club's real data. Good for host check-ins.",
    inputSchema: {
      type: "object",
      required: ["club_slug"],
      properties: {
        club_slug:    { type: "string" },
        tone:         { type: "string", enum: ["encouraging","direct","concerned"], description: "Tone based on club health (default: auto-detect from data)" },
        save_draft:   { type: "boolean", description: "Save to yande_drafts as host_note type (default true)" },
      },
    },
  },
  {
    name: "draft_announcement",
    description:
      "Humanize a raw club announcement. Returns the polished copy and optionally saves as a draft.",
    inputSchema: {
      type: "object",
      required: ["club_slug", "raw_message"],
      properties: {
        club_slug:   { type: "string" },
        raw_message: { type: "string" },
        save_draft:  { type: "boolean", description: "Save to yande_drafts (default true)" },
      },
    },
  },
];

type Args = Record<string, unknown>;

export async function handleDraftTool(
  name: string,
  args: Args
): Promise<{ content: { type: "text"; text: string }[] }> {
  const text = await dispatch(name, args);
  return { content: [{ type: "text", text }] };
}

async function dispatch(name: string, args: Args): Promise<string> {
  switch (name) {
    case "draft_email":         return draftEmail(args);
    case "draft_sms":           return draftSms(args);
    case "draft_bulk_reminder": return draftBulkReminder(args);
    case "draft_event_copy":    return draftEventCopy(args);
    case "draft_host_note":     return draftHostNote(args);
    case "draft_announcement":  return draftAnnouncement(args);
    default: return `Unknown draft tool: ${name}`;
  }
}

// ── Humanizer (inline for MCP package isolation) ──────────────────────────────

const MODE_PROMPTS: Record<string, string> = {
  bloomBay:    `You are the BloomBay voice. Transform text into warm, feminine, inviting messages — like a brilliant friend talking to you. Light emoji (one or two max). Short, punchy sentences. Never corporate. Preserve all information. Return ONLY the message.`,
  host:        `You are a BloomBay club host. Warm, community-first, genuine excitement — not hype. "We" for club news. Return ONLY the message.`,
  yande:       `You are Yande — BloomBay's AI companion. Emotionally intelligent, perceptive, warm. You read what someone actually needs. Never robotic. Smart older sister energy. Return ONLY the message.`,
  event:       `You write event copy that feels alive. Sensory, anticipatory, not urgent. Preserve all factual details. Return ONLY the copy.`,
  girlmates:   `You write roommate messages between real women. Kind rejections, warm acceptances, real-person energy. Return ONLY the message.`,
  celebration: `You are Yande. Someone hit a milestone. Meet the moment with real, grounded joy — not hype. "I'm so proud of you" friend energy. Short. Return ONLY the message.`,
  support:     `You are Yande. Something didn't go as hoped. Acknowledge it without minimising. Real, warm, human — not corporate consolation. Don't rush to silver linings. Return ONLY the message.`,
  newInTown:   `You are Yande. Someone just moved to a new city. Sound like the first good friend they made here. Help them feel like they already belong. Return ONLY the message.`,
  clubInvite:  `You write club invitations that feel personally chosen, not mass-broadcast. The person should feel specifically thought of. Warm, specific, brief. Return ONLY the invitation message.`,
  rejection:   `You write kind, honest declines. The answer is no — clearly no, never ambiguous. The person should feel respected. No hollow phrases. No over-explanation. Return ONLY the message.`,
};

const STAGE_LINES: Record<string, string> = {
  stranger:     "This is a first interaction — welcoming but not overly familiar.",
  new_friend:   "This person just started — warm and encouraging.",
  friend:       "A regular member — skip formalities, be more direct.",
  close_friend: "Deeply embedded in the community — be genuinely personal.",
  club_member:  "Same club community — insider conversation energy.",
  host:         "Club leader — speak peer-to-peer.",
};

interface HumanizeOpts {
  mode: string;
  context?: string;
  stage?: string;
  memory?: Record<string, unknown>;
}

async function humanize(raw: string, opts: HumanizeOpts): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return raw;

  try {
    const client = new Anthropic({ apiKey });
    let system = MODE_PROMPTS[opts.mode] ?? MODE_PROMPTS.yande;

    if (opts.stage && STAGE_LINES[opts.stage]) {
      system += `\n\nRelationship context: ${STAGE_LINES[opts.stage]}`;
    }

    if (opts.memory) {
      const m = opts.memory;
      const parts: string[] = [];
      if (Array.isArray(m.interests) && m.interests.length)     parts.push(`Interests: ${(m.interests as string[]).join(", ")}`);
      if (m.life_stage)           parts.push(`Life stage: ${m.life_stage}`);
      if (m.social_comfort)       parts.push(`Social comfort: ${m.social_comfort}`);
      if (m.group_size_pref)      parts.push(`Prefers group size: ${m.group_size_pref}`);
      if (Array.isArray(m.neighborhoods) && m.neighborhoods.length) parts.push(`Neighborhoods: ${(m.neighborhoods as string[]).join(", ")}`);
      if (m.notes)                parts.push(`Notes: ${m.notes}`);
      if (parts.length) system += `\n\nWhat you know about this person:\n${parts.join("\n")}\nWeave it in naturally — make it feel personal.`;
    }

    const userContent = opts.context ? `Context: ${opts.context}\n\n${raw}` : raw;

    const msg = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 400,
      system,
      messages: [{ role: "user", content: userContent }],
    });

    return msg.content[0].type === "text" ? msg.content[0].text.trim() : raw;
  } catch {
    return raw;
  }
}

async function fetchMemory(userId: string): Promise<Record<string, unknown> | undefined> {
  const { data } = await db
    .from("yande_user_context")
    .select("interests, life_stage, social_comfort, group_size_pref, neighborhoods, notes, relationship_stage")
    .eq("user_id", userId)
    .maybeSingle();
  return data ?? undefined;
}

// ── Tool implementations ──────────────────────────────────────────────────────

async function draftEmail(args: Args): Promise<string> {
  const userId = args.user_id as string;
  const { data: user } = await db
    .from("profiles")
    .select("full_name, first_name, email")
    .eq("id", userId)
    .maybeSingle();

  if (!user?.email) return "Error: user not found or has no email.";

  const mode = (args.mode as string) ?? "yande";
  const useMemory = args.use_memory !== false; // default true
  const memory = useMemory ? await fetchMemory(userId) : undefined;
  const stage = (args.relationship_stage as string | undefined) ?? (memory?.relationship_stage as string | undefined);

  const context = args.context
    ? `Recipient: ${user.first_name ?? user.full_name}. ${args.context}`
    : `Recipient: ${user.first_name ?? user.full_name}`;

  const body = await humanize(args.raw_message as string, { mode, context, stage, memory });
  const subject = args.subject as string;

  const { data, error } = await db.from("yande_drafts").insert({
    type: "email",
    mode,
    recipient_user_id: userId,
    recipient_email: user.email,
    subject,
    body,
    raw_body: args.raw_message as string,
    context: { user_id: userId, context: args.context, stage, used_memory: useMemory && !!memory },
  }).select("id").single();

  if (error) return `Error saving draft: ${error.message}`;

  const memoryNote = memory ? " (personalized with Yande memory ✦)" : "";
  return `Email draft created ✦${memoryNote}\n\nDraft ID: ${data.id}\nTo: ${user.full_name} <${user.email}>\nSubject: ${subject}\nStage: ${stage ?? "not set"}\n\n---\n${body}\n---\n\nCall send_draft with this ID (and confirmed: true) to send.`;
}

async function draftSms(args: Args): Promise<string> {
  const userId = args.user_id as string;
  const { data: user } = await db
    .from("profiles")
    .select("full_name, first_name, phone")
    .eq("id", userId)
    .maybeSingle();

  if (!user?.phone) return "Error: user not found or has no phone number.";

  const mode = (args.mode as string) ?? "yande";
  const useMemory = args.use_memory !== false; // default true
  const memory = useMemory ? await fetchMemory(userId) : undefined;
  const stage = (args.relationship_stage as string | undefined) ?? (memory?.relationship_stage as string | undefined);

  const context = args.context
    ? `Recipient: ${user.first_name ?? user.full_name}. Keep to SMS length (under 160 chars if possible). ${args.context}`
    : `Recipient: ${user.first_name ?? user.full_name}. Keep to SMS length.`;

  const body = await humanize(args.raw_message as string, { mode, context, stage, memory });

  const { data, error } = await db.from("yande_drafts").insert({
    type: "sms",
    mode,
    recipient_user_id: userId,
    recipient_phone: user.phone,
    body,
    raw_body: args.raw_message as string,
    context: { user_id: userId, stage, used_memory: useMemory && !!memory },
  }).select("id").single();

  if (error) return `Error saving draft: ${error.message}`;

  const memoryNote = memory ? " (personalized with Yande memory ✦)" : "";
  return `SMS draft created ✦${memoryNote}\n\nDraft ID: ${data.id}\nTo: ${user.full_name} (${user.phone})\nStage: ${stage ?? "not set"}\n\n---\n${body}\n---\n\nCall send_draft with this ID (and confirmed: true) to send.`;
}

async function draftBulkReminder(args: Args): Promise<string> {
  const eventId = args.event_id as string;
  const eventType = (args.event_type as string) ?? "event";
  const channel = (args.channel as string) ?? "sms";

  // Fetch event details
  let eventTitle = "";
  let eventDate = "";
  let eventVenue = "";
  let recipientIds: string[] = [];

  if (eventType === "gathering") {
    const { data: g } = await db.from("gatherings")
      .select("title, starts_at, venue, area").eq("id", eventId).maybeSingle();
    if (!g) return "Error: gathering not found.";
    eventTitle = g.title;
    eventDate = new Date(g.starts_at).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    eventVenue = g.venue ?? g.area ?? "";

    const { data: reservations } = await db.from("seat_reservations")
      .select("user_id").eq("gathering_id", eventId).eq("status", "reserved");
    recipientIds = (reservations ?? []).map(r => r.user_id);
  } else {
    const { data: e } = await db.from("events")
      .select("title, date_time, venue, city").eq("id", eventId).maybeSingle();
    if (!e) return "Error: event not found.";
    eventTitle = e.title;
    eventDate = new Date(e.date_time).toLocaleString("en-US", { weekday: "long", month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
    eventVenue = e.venue ?? e.city ?? "";

    const { data: attendees } = await db.from("event_attendees")
      .select("user_id").eq("event_id", eventId);
    recipientIds = (attendees ?? []).map(a => a.user_id);
  }

  if (!recipientIds.length) return "No attendees/reservees found for this event.";

  // Fetch recipient profiles
  const { data: profiles } = await db.from("profiles")
    .select("id, first_name, full_name, email, phone")
    .in("id", recipientIds);

  if (!profiles?.length) return "Could not load recipient profiles.";

  const rawMsg = (args.raw_message as string) ??
    `Reminder: ${eventTitle} is coming up on ${eventDate} at ${eventVenue}. Can't wait to see you there!`;

  const humanized = await humanize(
    rawMsg,
    { mode: "event", context: `Event: ${eventTitle}, ${eventDate}, ${eventVenue}. Keep warm and brief.` }
  );

  // Create drafts in batch
  const rows = profiles
    .filter(p => channel === "email" ? !!p.email : !!p.phone)
    .map(p => ({
      type: "reminder" as const,
      mode: "event",
      recipient_user_id: p.id,
      recipient_email: channel === "email" ? p.email : null,
      recipient_phone: channel === "sms" ? p.phone : null,
      subject: channel === "email" ? `Reminder: ${eventTitle}` : null,
      body: humanized.replace(/\bname\b/gi, p.first_name ?? p.full_name?.split(" ")[0] ?? "love"),
      raw_body: rawMsg,
      context: { event_id: eventId, event_type: eventType, event_title: eventTitle },
    }));

  const { data: saved, error } = await db.from("yande_drafts").insert(rows).select("id");
  if (error) return `Error saving drafts: ${error.message}`;

  const ids = (saved ?? []).map(d => d.id);
  return `${ids.length} reminder drafts created for "${eventTitle}"\n\nChannel: ${channel.toUpperCase()}\nRecipients: ${ids.length} / ${recipientIds.length} (filtered to those with ${channel})\n\nMessage preview:\n---\n${humanized}\n---\n\nDraft IDs saved. Call send_bulk_reminders("${eventId}", "${eventType}", confirmed: true) to send all.`;
}

async function draftEventCopy(args: Args): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return "Error: ANTHROPIC_API_KEY not set.";

  const client = new Anthropic({ apiKey });
  const prompt = `Write polished, exciting event copy for BloomBay.

Title: ${args.title}
Category: ${args.category ?? "social"}
Details: ${args.details ?? "No additional details provided."}

Write 2-3 paragraphs that make women genuinely want to attend. Sensory, warm, specific. Preserve all factual info. End with something that makes you picture yourself there.`;

  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const copy = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";

  if (args.save_draft) {
    await db.from("yande_drafts").insert({
      type: "event_copy", mode: "event",
      body: copy, raw_body: args.details as string ?? "",
      context: { title: args.title, category: args.category },
    });
  }

  return `Event copy for "${args.title}":\n\n${copy}`;
}

async function draftHostNote(args: Args): Promise<string> {
  const slug = args.club_slug as string;
  const saveDraft = args.save_draft !== false;

  // Collect club data
  const { data: club } = await db.from("clubs")
    .select("name, city, category, owner_id, created_at").eq("slug", slug).maybeSingle();
  if (!club) return `Club '${slug}' not found.`;

  const [members, allGatherings, pendingApps] = await Promise.all([
    db.from("club_memberships").select("id", { count: "exact" }).eq("club_slug", slug),
    db.from("gatherings").select("id, starts_at, capacity, spots_left").eq("club_slug", slug).order("starts_at", { ascending: false }),
    db.from("club_applications").select("id", { count: "exact" }).eq("club_slug", slug).eq("status", "pending"),
  ]);

  const now = new Date();
  const gList = allGatherings.data ?? [];
  const past = gList.filter(g => new Date(g.starts_at) < now);
  const upcoming = gList.filter(g => new Date(g.starts_at) >= now);
  const avgFill = past.length
    ? (past.reduce((sum, g) => sum + (1 - (g.spots_left / (g.capacity || 1))), 0) / past.length * 100).toFixed(0)
    : "N/A";

  const data = {
    club: club.name, city: club.city, category: club.category,
    members: members.count ?? 0,
    past_events: past.length, upcoming_events: upcoming.length,
    avg_fill_rate: avgFill + "%",
    pending_applications: pendingApps.count ?? 0,
  };

  // Auto-detect tone
  let tone = (args.tone as string) ?? "auto";
  if (tone === "auto") {
    const fill = parseInt(avgFill) || 0;
    tone = fill >= 70 ? "encouraging" : fill >= 40 ? "direct" : "concerned";
  }

  const toneInstructions = {
    encouraging: "The club is doing well. Be warm and celebratory. Acknowledge wins and nudge toward growth.",
    direct:      "The club has room to improve. Be honest but kind. Give specific, actionable suggestions.",
    concerned:   "The club needs attention. Be caring but direct about what's at risk. Offer clear next steps.",
  }[tone] ?? "";

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return `Host data:\n${JSON.stringify(data, null, 2)}`;

  const client = new Anthropic({ apiKey });
  const msg = await client.messages.create({
    model: "claude-haiku-4-5-20251001",
    max_tokens: 500,
    system: `You write host coaching notes for BloomBay club leaders. You are a supportive but honest community manager. ${toneInstructions} Write personally, not like a performance review. Return only the note.`,
    messages: [{ role: "user", content: `Write a host check-in note for ${club.name}:\n${JSON.stringify(data, null, 2)}` }],
  });

  const note = msg.content[0].type === "text" ? msg.content[0].text.trim() : "";

  if (saveDraft && club.owner_id) {
    await db.from("yande_drafts").insert({
      type: "host_note", mode: "host",
      recipient_user_id: club.owner_id,
      body: note,
      context: { club_slug: slug, data },
    });
  }

  return `Host note for ${club.name} (tone: ${tone}):\n\n${note}`;
}

async function draftAnnouncement(args: Args): Promise<string> {
  const slug = args.club_slug as string;
  const saveDraft = args.save_draft !== false;

  const { data: club } = await db.from("clubs")
    .select("name, owner_id").eq("slug", slug).maybeSingle();
  if (!club) return `Club '${slug}' not found.`;

  const body = await humanize(
    args.raw_message as string,
    { mode: "host", context: `Club: ${club.name}. This is an announcement to club members.` }
  );

  if (saveDraft) {
    await db.from("yande_drafts").insert({
      type: "announcement", mode: "host",
      recipient_user_id: club.owner_id ?? undefined,
      body,
      raw_body: args.raw_message as string,
      context: { club_slug: slug },
    });
  }

  return `Announcement for ${club.name}:\n\n${body}`;
}
