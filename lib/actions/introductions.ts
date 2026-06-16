"use server";

import { createClient } from "@/lib/supabase/server";

const SAMPLE_INTROS: IntroPost[] = [
  { id: "s1", user_id: "s1", name: "Amara J.", initial: "A", color: "#FF1F7D", neighborhood: "Bed-Stuy", arrival_status: "just_moved", bio: "Moved from Atlanta 3 weeks ago. Creative director, looking for my people. Obsessed with brunch spots and gallery openings. Who's doing Sunday walks?", interests: ["Art","Brunch","Fashion"], time: "2 days ago", flowers: 14, my_flower: false },
  { id: "s2", user_id: "s2", name: "Temi A.", initial: "T", color: "#A855F7", neighborhood: "Crown Heights", arrival_status: "new_6mo", bio: "Six months in from Lagos. Tech PM by day, DJ by night. Still finding the best Nigerian spots — please send recs. Also looking for a reading club!", interests: ["Tech","Music","Books"], time: "4 days ago", flowers: 22, my_flower: false },
  { id: "s3", user_id: "s3", name: "Zara F.", initial: "Z", color: "#0EA5E9", neighborhood: "Harlem", arrival_status: "fresh_start", bio: "Fresh start after 5 years in LA. Back to my first love — New York. Writer, runner, and recovering overachiever. Looking for women who actually want to slow down sometimes.", interests: ["Writing","Running","Wellness"], time: "1 week ago", flowers: 31, my_flower: false },
  { id: "s4", user_id: "s4", name: "Naomi B.", initial: "N", color: "#D4A853", neighborhood: "Fort Greene", arrival_status: "local", bio: "Born and raised BK, never leaving. Love showing newcomers around — I know every good coffee shop and block party. Architects of culture club, anyone?", interests: ["Culture","Coffee","Architecture"], time: "2 weeks ago", flowers: 45, my_flower: false },
];

const AVATAR_COLORS = ["#FF1F7D","#A855F7","#0EA5E9","#10B981","#F97316","#D4A853","#EC4899","#3B82F6"];
function colorForId(id: string) {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xffff;
  return AVATAR_COLORS[n % AVATAR_COLORS.length];
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return `${Math.floor(days / 7)}w ago`;
}

export interface IntroPost {
  id: string;
  user_id: string;
  name: string;
  initial: string;
  color: string;
  neighborhood: string | null;
  arrival_status: string;
  bio: string;
  interests: string[];
  time: string;
  flowers: number;
  my_flower: boolean;
}

export async function getIntros(filter?: string): Promise<IntroPost[]> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  let q = supabase
    .from("introductions")
    .select("*, profiles!user_id(first_name, full_name)")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(40);

  if (filter && filter !== "all") {
    q = q.eq("arrival_status", filter);
  }

  const { data: intros, error } = await q;

  // Fall back to sample data when table is empty or not yet created
  if (error || !intros?.length) {
    if (!filter || filter === "all") return SAMPLE_INTROS;
    return SAMPLE_INTROS.filter(i => i.arrival_status === filter);
  }

  // Fetch current user's flowers in one query
  let myFlowers: Set<string> = new Set();
  if (user) {
    const { data: flowers } = await supabase
      .from("introduction_flowers")
      .select("intro_id")
      .eq("user_id", user.id)
      .in("intro_id", intros.map((i: Record<string, unknown>) => i.id as string));
    myFlowers = new Set((flowers ?? []).map((f: { intro_id: string }) => f.intro_id));
  }

  return intros.map((r: Record<string, unknown>) => {
    const profile = r.profiles as { first_name?: string; full_name?: string } | null;
    const name = profile?.full_name ?? profile?.first_name ?? "Member";
    return {
      id: r.id as string,
      user_id: r.user_id as string,
      name,
      initial: (name[0] ?? "M").toUpperCase(),
      color: colorForId(r.user_id as string),
      neighborhood: r.neighborhood as string | null,
      arrival_status: (r.arrival_status as string) ?? "just_moved",
      bio: r.bio as string,
      interests: (r.interests as string[]) ?? [],
      time: timeAgo(r.created_at as string),
      flowers: (r.flower_count as number) ?? 0,
      my_flower: myFlowers.has(r.id as string),
    };
  });
}

export async function postIntro(input: {
  bio: string;
  arrival_status: string;
  neighborhood: string;
  interests: string[];
}): Promise<{ ok: boolean; error?: string }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, error: "Not signed in" };

  const { error } = await supabase.from("introductions").upsert({
    user_id: user.id,
    bio: input.bio.trim(),
    arrival_status: input.arrival_status,
    neighborhood: input.neighborhood.trim() || null,
    interests: input.interests,
    is_active: true,
  }, { onConflict: "user_id" });

  return error ? { ok: false, error: error.message } : { ok: true };
}

export async function flowerIntro(introId: string): Promise<{ ok: boolean }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false };

  // Toggle: try insert, if it fails (duplicate) then delete
  const { error } = await supabase
    .from("introduction_flowers")
    .insert({ intro_id: introId, user_id: user.id });

  if (error?.code === "23505") {
    // Already flowered — remove it
    await supabase
      .from("introduction_flowers")
      .delete()
      .eq("intro_id", introId)
      .eq("user_id", user.id);
  }

  return { ok: true };
}

export async function getMyIntro(): Promise<{ has_intro: boolean; arrival_status: string | null }> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { has_intro: false, arrival_status: null };

  const { data } = await supabase
    .from("introductions")
    .select("arrival_status")
    .eq("user_id", user.id)
    .maybeSingle();

  return { has_intro: !!data, arrival_status: (data?.arrival_status as string) ?? null };
}
