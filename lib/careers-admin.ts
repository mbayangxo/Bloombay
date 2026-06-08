export type CareerRoleCategory =
  | "curator"
  | "operations"
  | "engineering"
  | "marketing"
  | "other";

export const CAREER_ROLE_CATEGORIES: CareerRoleCategory[] = [
  "curator",
  "operations",
  "engineering",
  "marketing",
  "other",
];

export type CareerApplicationStatus =
  | "new"
  | "reviewed"
  | "contacted"
  | "approved"
  | "rejected";

export const CAREER_STATUSES: CareerApplicationStatus[] = [
  "new",
  "reviewed",
  "contacted",
  "approved",
  "rejected",
];

export interface CareerApplicationRow {
  id: string;
  created_at: string;
  status: CareerApplicationStatus;
  first_name: string;
  email: string;
  phone: string | null;
  role_title: string;
  role_category: CareerRoleCategory;
  city: string | null;
  resume_url: string | null;
  linkedin_url: string | null;
  portfolio_url: string | null;
  cover_letter: string | null;
}

export type CareerApplicationInput = {
  first_name: string;
  email: string;
  phone?: string;
  role_title: string;
  role_category: CareerRoleCategory;
  city?: string;
  resume_url?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  cover_letter?: string;
};

export function normalizeCareerRow(raw: Record<string, unknown>): CareerApplicationRow {
  const status = String(raw.status ?? "new") as CareerApplicationStatus;
  const category = String(raw.role_category ?? "other") as CareerRoleCategory;
  return {
    id: String(raw.id),
    created_at: String(raw.created_at ?? new Date().toISOString()),
    status: CAREER_STATUSES.includes(status) ? status : "new",
    first_name: String(raw.first_name ?? ""),
    email: String(raw.email ?? ""),
    phone: raw.phone != null ? String(raw.phone) : null,
    role_title: String(raw.role_title ?? ""),
    role_category: CAREER_ROLE_CATEGORIES.includes(category) ? category : "other",
    city: raw.city != null ? String(raw.city) : null,
    resume_url: raw.resume_url != null ? String(raw.resume_url) : null,
    linkedin_url: raw.linkedin_url != null ? String(raw.linkedin_url) : null,
    portfolio_url: raw.portfolio_url != null ? String(raw.portfolio_url) : null,
    cover_letter: raw.cover_letter != null ? String(raw.cover_letter) : null,
  };
}

export function displayRoleCategory(cat: CareerRoleCategory): string {
  const labels: Record<CareerRoleCategory, string> = {
    curator: "Curator",
    operations: "Operations",
    engineering: "Engineering",
    marketing: "Marketing",
    other: "Other",
  };
  return labels[cat];
}

export function filterCareerRows(
  rows: CareerApplicationRow[],
  filters: { status?: CareerApplicationStatus | "all"; category?: CareerRoleCategory | "all" }
): CareerApplicationRow[] {
  return rows.filter((r) => {
    if (filters.status && filters.status !== "all" && r.status !== filters.status) return false;
    if (filters.category && filters.category !== "all" && r.role_category !== filters.category) {
      return false;
    }
    return true;
  });
}

/** Demo rows when Supabase is empty or unavailable. */
export const SEED_CAREER_APPLICATIONS: CareerApplicationRow[] = [
  {
    id: "seed-career-1",
    created_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: "new",
    first_name: "Amara",
    email: "amara.j@example.com",
    phone: "+1 415 555 0142",
    role_title: "City curator — Oakland",
    role_category: "curator",
    city: "Oakland, CA",
    resume_url: "https://linkedin.com/in/example",
    linkedin_url: "https://linkedin.com/in/example",
    portfolio_url: null,
    cover_letter:
      "I have hosted women's circles for 4 years and would love to bring BloomBay to the East Bay.",
  },
  {
    id: "seed-career-2",
    created_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: "reviewed",
    first_name: "Priya",
    email: "priya.m@example.com",
    phone: null,
    role_title: "Full-stack engineer",
    role_category: "engineering",
    city: "Remote",
    resume_url: "https://drive.google.com/file/d/example",
    linkedin_url: "https://linkedin.com/in/priya-example",
    portfolio_url: "https://github.com/example",
    cover_letter: "Excited about women-first social products and Next.js.",
  },
];
