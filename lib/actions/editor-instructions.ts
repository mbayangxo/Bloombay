"use server";

import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  );
}

export type InstructionType = "voice" | "reference" | "correction" | "feedback";

export interface EditorInstruction {
  id: string;
  editor_name: string;
  instruction_type: InstructionType;
  instruction: string;
  reference_title?: string | null;
  original_content?: string | null;
  edited_content?: string | null;
  active: boolean;
  created_at: string;
}

// ── Fetch all instructions for one editor ─────────────────────────────────────
export async function getEditorInstructions(editorName: string): Promise<EditorInstruction[]> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("editor_instructions")
    .select("*")
    .eq("editor_name", editorName)
    .order("created_at", { ascending: false });

  if (error) throw error;
  return (data ?? []) as EditorInstruction[];
}

// ── Fetch only active instructions (used by cron to build prompts) ────────────
export async function getActiveInstructions(editorName: string): Promise<EditorInstruction[]> {
  const sb = adminClient();
  const { data, error } = await sb
    .from("editor_instructions")
    .select("*")
    .eq("editor_name", editorName)
    .eq("active", true)
    .order("created_at", { ascending: true });

  if (error) throw error;
  return (data ?? []) as EditorInstruction[];
}

// ── Add a voice instruction ───────────────────────────────────────────────────
export async function addVoiceInstruction(editorName: string, instruction: string) {
  const sb = adminClient();
  const { error } = await sb.from("editor_instructions").insert({
    editor_name: editorName,
    instruction_type: "voice",
    instruction,
  });
  if (error) throw error;
}

// ── Add a reference article ───────────────────────────────────────────────────
export async function addReferenceArticle(
  editorName: string,
  title: string,
  articleText: string,
) {
  const sb = adminClient();
  const { error } = await sb.from("editor_instructions").insert({
    editor_name: editorName,
    instruction_type: "reference",
    reference_title: title,
    instruction: articleText,
  });
  if (error) throw error;
}

// ── Add a correction (original + edited version) ──────────────────────────────
export async function addCorrection(
  editorName: string,
  original: string,
  edited: string,
  note: string,
) {
  const sb = adminClient();
  const { error } = await sb.from("editor_instructions").insert({
    editor_name: editorName,
    instruction_type: "correction",
    instruction: note,
    original_content: original,
    edited_content: edited,
  });
  if (error) throw error;
}

// ── Add general feedback ──────────────────────────────────────────────────────
export async function addFeedback(editorName: string, feedback: string) {
  const sb = adminClient();
  const { error } = await sb.from("editor_instructions").insert({
    editor_name: editorName,
    instruction_type: "feedback",
    instruction: feedback,
  });
  if (error) throw error;
}

// ── Toggle instruction active/inactive ───────────────────────────────────────
export async function toggleInstruction(id: string, active: boolean) {
  const sb = adminClient();
  const { error } = await sb
    .from("editor_instructions")
    .update({ active })
    .eq("id", id);
  if (error) throw error;
}

// ── Delete instruction ────────────────────────────────────────────────────────
export async function deleteInstruction(id: string) {
  const sb = adminClient();
  const { error } = await sb.from("editor_instructions").delete().eq("id", id);
  if (error) throw error;
}

// ── Build the system prompt prefix for an editor (used in cron) ──────────────
// Returns a formatted string to prepend to any editor's system prompt.
export async function buildEditorContext(editorName: string): Promise<string> {
  const instructions = await getActiveInstructions(editorName);
  if (instructions.length === 0) return "";

  const sections: string[] = ["=== FOUNDER'S INSTRUCTIONS FOR YOU ===\n"];

  const voice = instructions.filter(i => i.instruction_type === "voice");
  const references = instructions.filter(i => i.instruction_type === "reference");
  const corrections = instructions.filter(i => i.instruction_type === "correction");
  const feedback = instructions.filter(i => i.instruction_type === "feedback");

  if (voice.length > 0) {
    sections.push("VOICE RULES (always follow these):");
    voice.forEach(v => sections.push(`- ${v.instruction}`));
    sections.push("");
  }

  if (feedback.length > 0) {
    sections.push("RECENT FEEDBACK (the founder told you this about your recent work):");
    feedback.slice(0, 5).forEach(f => sections.push(`- ${f.instruction}`));
    sections.push("");
  }

  if (corrections.length > 0) {
    sections.push("CORRECTIONS (study the difference between what you wrote and what the founder changed it to):");
    corrections.slice(0, 3).forEach(c => {
      sections.push(`ORIGINAL: ${(c.original_content ?? "").slice(0, 300)}`);
      sections.push(`CORRECTED: ${(c.edited_content ?? "").slice(0, 300)}`);
      if (c.instruction) sections.push(`WHY: ${c.instruction}`);
      sections.push("");
    });
  }

  if (references.length > 0) {
    sections.push("REFERENCE ARTICLES (write in this style and tone):");
    references.slice(0, 2).forEach(r => {
      if (r.reference_title) sections.push(`[${r.reference_title}]`);
      sections.push(r.instruction.slice(0, 600) + (r.instruction.length > 600 ? "..." : ""));
      sections.push("");
    });
  }

  sections.push("=== END FOUNDER INSTRUCTIONS ===\n");
  return sections.join("\n");
}
