import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type SignupType = "member" | "club_host" | "partner";

// ── Member entry ──────────────────────────────────────────────
export interface MemberEntry {
  signup_type: "member";
  first_name: string;
  email: string;
  phone: string;
  neighborhood: string;
  city: string;
  country: string;
  age_range: string;
  reasons: string[];
  interests: string[];
  founding_mother: boolean;
  extra_notes: string;
}

// ── Club host entry ───────────────────────────────────────────
export interface ClubHostEntry {
  signup_type: "club_host";
  first_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  club_name: string;
  club_platform: string;      // 'fb_group' | 'tiktok' | 'instagram' | 'youtube' | 'other'
  club_member_count: string;  // '< 100' | '100-500' | '500-1K' | '1K-5K' | '5K+'
  club_women_only: boolean;
  extra_notes: string;
}

// ── Partner entry ─────────────────────────────────────────────
export interface PartnerEntry {
  signup_type: "partner";
  first_name: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  business_name: string;
  business_type: string;  // 'venue' | 'brand' | 'organizer' | 'creator' | 'other'
  business_socials: string;
  offering: string;
  extra_notes: string;
}

export type WaitlistEntry = MemberEntry | ClubHostEntry | PartnerEntry;

export async function submitToWaitlist(entry: WaitlistEntry) {
  const { data, error } = await supabase
    .from("waitlist")
    .insert([entry])
    .select();
  if (error) throw error;
  return data;
}
