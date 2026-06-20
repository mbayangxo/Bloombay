export type SignupType = "member" | "club_host" | "partner";

export type WaitlistStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "approved"
  | "rejected";

export const WAITLIST_STATUSES: WaitlistStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "approved",
  "rejected",
];

export interface WaitlistRow {
  id: string;
  created_at: string;
  signup_type: SignupType;
  status: WaitlistStatus;
  first_name: string | null;
  email: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  neighborhood: string | null;
  age_range: string | null;
  reasons: string[] | null;
  interests: string[] | null;
  founding_mother: boolean | null;
  extra_notes: string | null;
  club_name: string | null;
  club_platform: string | null;
  club_member_count: string | null;
  club_women_only: boolean | null;
  business_name: string | null;
  business_type: string | null;
  business_socials: string | null;
  offering: string | null;
}

export type WaitlistFilters = {
  type?: SignupType | "all";
  status?: WaitlistStatus | "all";
  city?: string;
  interest?: string;
};

function parseArray(value: unknown): string[] | null {
  if (value == null) return null;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed.map(String) : [value];
    } catch {
      return value ? [value] : null;
    }
  }
  return null;
}

export function normalizeWaitlistRow(raw: Record<string, unknown>): WaitlistRow {
  const status = String(raw.status ?? "new") as WaitlistStatus;
  return {
    id: String(raw.id),
    created_at: String(raw.created_at ?? new Date().toISOString()),
    signup_type: String(raw.signup_type ?? "member") as SignupType,
    status: WAITLIST_STATUSES.includes(status) ? status : "new",
    first_name: raw.first_name != null ? String(raw.first_name) : null,
    email: raw.email != null ? String(raw.email) : null,
    phone: raw.phone != null ? String(raw.phone) : null,
    city: raw.city != null ? String(raw.city) : null,
    state: raw.state != null ? String(raw.state) : null,
    country: raw.country != null ? String(raw.country) : null,
    neighborhood: raw.neighborhood != null ? String(raw.neighborhood) : null,
    age_range: raw.age_range != null ? String(raw.age_range) : null,
    reasons: parseArray(raw.reasons),
    interests: parseArray(raw.interests),
    founding_mother: raw.founding_mother === true,
    extra_notes: raw.extra_notes != null ? String(raw.extra_notes) : null,
    club_name: raw.club_name != null ? String(raw.club_name) : null,
    club_platform: raw.club_platform != null ? String(raw.club_platform) : null,
    club_member_count:
      raw.club_member_count != null ? String(raw.club_member_count) : null,
    club_women_only: raw.club_women_only === true,
    business_name: raw.business_name != null ? String(raw.business_name) : null,
    business_type: raw.business_type != null ? String(raw.business_type) : null,
    business_socials:
      raw.business_socials != null ? String(raw.business_socials) : null,
    offering: raw.offering != null ? String(raw.offering) : null,
  };
}

export function displayType(type: SignupType): string {
  if (type === "club_host") return "Club";
  if (type === "partner") return "Partner";
  return "Member";
}

export function locationLabel(row: WaitlistRow): string {
  const parts = [row.city, row.state, row.country].filter(Boolean);
  return parts.length ? parts.join(", ") : "—";
}

export function filterRows(rows: WaitlistRow[], filters: WaitlistFilters): WaitlistRow[] {
  return rows.filter((row) => {
    if (filters.type && filters.type !== "all" && row.signup_type !== filters.type) {
      return false;
    }
    if (filters.status && filters.status !== "all" && row.status !== filters.status) {
      return false;
    }
    if (filters.city && filters.city !== "all") {
      const hay = `${row.city ?? ""} ${row.country ?? ""}`.toLowerCase();
      if (!hay.includes(filters.city.toLowerCase())) return false;
    }
    if (filters.interest && filters.interest !== "all") {
      const interests = row.interests ?? [];
      if (!interests.includes(filters.interest)) return false;
    }
    return true;
  });
}

export function countNewMembers(
  rows: WaitlistRow[],
  window: "today" | "week" | "month" | "last30"
): number {
  const now = new Date();
  const start = new Date(now);
  if (window === "today") {
    start.setHours(0, 0, 0, 0);
  } else if (window === "week") {
    start.setDate(start.getDate() - 7);
    start.setHours(0, 0, 0, 0);
  } else if (window === "month") {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  } else {
    start.setDate(start.getDate() - 30);
    start.setHours(0, 0, 0, 0);
  }

  return rows.filter((row) => {
    if (row.signup_type !== "member") return false;
    const created = new Date(row.created_at);
    return created >= start && created <= now;
  }).length;
}

export function aggregateDashboard(rows: WaitlistRow[]) {
  const members = rows.filter((r) => r.signup_type === "member").length;
  const clubs = rows.filter((r) => r.signup_type === "club_host").length;
  const partners = rows.filter((r) => r.signup_type === "partner").length;

  const cityCounts = new Map<string, number>();
  const countryCounts = new Map<string, number>();
  const interestCounts = new Map<string, number>();
  const interestByCity = new Map<string, Map<string, number>>();

  for (const row of rows) {
    const city = row.city?.trim() || "Unknown";
    const country = row.country?.trim() || "Unknown";
    cityCounts.set(city, (cityCounts.get(city) ?? 0) + 1);
    countryCounts.set(country, (countryCounts.get(country) ?? 0) + 1);

    if (row.signup_type === "member" && row.interests) {
      for (const id of row.interests) {
        interestCounts.set(id, (interestCounts.get(id) ?? 0) + 1);
        if (!interestByCity.has(city)) interestByCity.set(city, new Map());
        const m = interestByCity.get(city)!;
        m.set(id, (m.get(id) ?? 0) + 1);
      }
    }
  }

  const topCities = [...cityCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const topCountries = [...countryCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([name, count]) => ({ name, count }));

  const topInterests = [...interestCounts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([id, count]) => ({ id, count }));

  const bloomingMarkets = topCities.slice(0, 5).map((c, i) => ({
    ...c,
    momentum: Math.max(42, 94 - i * 11),
  }));

  const mapPins = topCities.slice(0, 12).map((c, i) => ({
    city: c.name,
    count: c.count,
    x: 12 + ((i * 17) % 76),
    y: 18 + ((i * 23) % 58),
  }));

  const actionQueue = rows
    .filter((r) => r.status === "new")
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 8);

  const recent = [...rows]
    .sort((a, b) => b.created_at.localeCompare(a.created_at))
    .slice(0, 10);

  return {
    total: rows.length,
    members,
    clubs,
    partners,
    verificationQueue: rows.filter(
      (r) =>
        r.signup_type === "member" &&
        (r.status === "new" || r.status === "reviewed")
    ).length,
    clubHostsPending: rows.filter(
      (r) => r.signup_type === "club_host" && r.status === "new"
    ).length,
    partnersPending: rows.filter(
      (r) => r.signup_type === "partner" && r.status === "new"
    ).length,
    topCities,
    topCountries,
    topInterests,
    bloomingMarkets,
    mapPins,
    actionQueue,
    recent,
    interestByCity,
  };
}
