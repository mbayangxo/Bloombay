import { createClient } from "@supabase/supabase-js";
import {
  normalizeCareerRow,
  SEED_CAREER_APPLICATIONS,
  type CareerApplicationInput,
  type CareerApplicationRow,
  type CareerApplicationStatus,
} from "./careers-admin";
import {
  normalizeWaitlistRow,
  type WaitlistRow,
  type WaitlistStatus,
} from "./waitlist-admin";

export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    throw new Error(
      "Supabase is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local."
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.warn(
      "[admin] SUPABASE_SERVICE_ROLE_KEY missing — using anon key; RLS may block dashboard reads."
    );
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

export async function fetchAllWaitlistRows(): Promise<WaitlistRow[]> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("waitlist")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    const msg = error.message ?? "Unknown error";
    if (msg.includes("waitlist") && (msg.includes("schema cache") || msg.includes("does not exist"))) {
      throw new Error(
        "Table public.waitlist not found. Run supabase/migrations/000_waitlist_table.sql in the Supabase SQL Editor, then add SUPABASE_SERVICE_ROLE_KEY."
      );
    }
    if (msg.includes("permission") || msg.includes("policy") || error.code === "42501") {
      throw new Error(
        "Cannot read waitlist (RLS). Add SUPABASE_SERVICE_ROLE_KEY to .env.local and restart the dev server."
      );
    }
    throw new Error(msg);
  }
  return (data ?? []).map((row) =>
    normalizeWaitlistRow(row as Record<string, unknown>)
  );
}

export async function updateWaitlistStatus(
  id: string,
  status: WaitlistStatus
): Promise<WaitlistRow> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("waitlist")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeWaitlistRow(data as Record<string, unknown>);
}

export async function fetchAllCareerApplications(): Promise<CareerApplicationRow[]> {
  try {
    const supabase = getAdminClient();
    const { data, error } = await supabase
      .from("careers_applications")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      const msg = error.message ?? "Unknown error";
      if (msg.includes("careers_applications") && (msg.includes("schema cache") || msg.includes("does not exist"))) {
        return [...SEED_CAREER_APPLICATIONS];
      }
      throw new Error(msg);
    }
    const rows = (data ?? []).map((row) =>
      normalizeCareerRow(row as Record<string, unknown>)
    );
    return rows.length ? rows : [...SEED_CAREER_APPLICATIONS];
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    if (
      message.includes("not configured") ||
      message.includes("careers_applications") ||
      message.includes("schema cache")
    ) {
      return [...SEED_CAREER_APPLICATIONS];
    }
    throw err instanceof Error ? err : new Error(message);
  }
}

export async function insertCareerApplication(
  input: CareerApplicationInput
): Promise<CareerApplicationRow> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("careers_applications")
    .insert([
      {
        first_name: input.first_name.trim(),
        email: input.email.trim().toLowerCase(),
        phone: input.phone?.trim() || null,
        role_title: input.role_title.trim(),
        role_category: input.role_category,
        city: input.city?.trim() || null,
        resume_url: input.resume_url?.trim() || null,
        linkedin_url: input.linkedin_url?.trim() || null,
        portfolio_url: input.portfolio_url?.trim() || null,
        cover_letter: input.cover_letter?.trim() || null,
        status: "new",
      },
    ])
    .select("*")
    .single();

  if (error) throw error;
  return normalizeCareerRow(data as Record<string, unknown>);
}

export async function updateCareerApplicationStatus(
  id: string,
  status: CareerApplicationStatus
): Promise<CareerApplicationRow> {
  const supabase = getAdminClient();
  const { data, error } = await supabase
    .from("careers_applications")
    .update({ status })
    .eq("id", id)
    .select("*")
    .single();

  if (error) throw error;
  return normalizeCareerRow(data as Record<string, unknown>);
}
