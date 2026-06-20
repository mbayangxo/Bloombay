import type { StaffBase } from "@/lib/mc-paths";
import {
  displayType,
  type SignupType,
  type WaitlistRow,
  type WaitlistStatus,
} from "@/lib/waitlist-admin";

export const SUBMISSION_QUEUE_SLUGS = [
  "women",
  "club-hosts",
  "partners",
  "founding-mothers",
  "new",
  "in-review",
  "approved",
  "rejected",
  "all",
] as const;

export type SubmissionQueueSlug = (typeof SUBMISSION_QUEUE_SLUGS)[number];

export type SubmissionQueueDef = {
  slug: SubmissionQueueSlug;
  title: string;
  kicker: string;
  blurb: string;
  icon: string;
  accent?: "pink" | "ink" | "blush";
};

export const SUBMISSION_QUEUES: SubmissionQueueDef[] = [
  {
    slug: "women",
    kicker: "Members",
    title: "Women",
    blurb: "Member waitlist & join requests",
    icon: "♡",
    accent: "pink",
  },
  {
    slug: "club-hosts",
    kicker: "Hosts",
    title: "Club hosts",
    blurb: "Leaders bringing communities in",
    icon: "✾",
    accent: "blush",
  },
  {
    slug: "partners",
    kicker: "Venues",
    title: "Partners",
    blurb: "Venues, brands & organizers",
    icon: "◇",
    accent: "ink",
  },
  {
    slug: "founding-mothers",
    kicker: "Invite",
    title: "Founding Mothers",
    blurb: "Founding invite interest",
    icon: "👑",
    accent: "pink",
  },
  {
    slug: "new",
    kicker: "Inbox",
    title: "New",
    blurb: "Fresh submissions — every type",
    icon: "◎",
  },
  {
    slug: "in-review",
    kicker: "Pipeline",
    title: "In review",
    blurb: "Reviewed or contacted — follow up",
    icon: "✎",
  },
  {
    slug: "approved",
    kicker: "Done",
    title: "Approved",
    blurb: "Cleared to move forward",
    icon: "✓",
  },
  {
    slug: "rejected",
    kicker: "Closed",
    title: "Rejected",
    blurb: "Not moving forward now",
    icon: "×",
  },
  {
    slug: "all",
    kicker: "Full list",
    title: "All rows",
    blurb: "Searchable table — every field",
    icon: "▤",
  },
];

export function isSubmissionQueueSlug(value: string): value is SubmissionQueueSlug {
  return (SUBMISSION_QUEUE_SLUGS as readonly string[]).includes(value);
}

export function submissionQueueHref(base: StaffBase, slug: SubmissionQueueSlug): string {
  return `${base}/submissions/${slug}`;
}

export function filterRowsByQueue(rows: WaitlistRow[], slug: SubmissionQueueSlug): WaitlistRow[] {
  switch (slug) {
    case "women":
      return rows.filter((r) => r.signup_type === "member");
    case "club-hosts":
      return rows.filter((r) => r.signup_type === "club_host");
    case "partners":
      return rows.filter((r) => r.signup_type === "partner");
    case "founding-mothers":
      return rows.filter((r) => r.founding_mother === true);
    case "new":
      return rows.filter((r) => r.status === "new");
    case "in-review":
      return rows.filter((r) => r.status === "reviewed" || r.status === "contacted");
    case "approved":
      return rows.filter((r) => r.status === "approved");
    case "rejected":
      return rows.filter((r) => r.status === "rejected");
    case "all":
      return rows;
    default:
      return rows;
  }
}

export function queuePendingCount(rows: WaitlistRow[], slug: SubmissionQueueSlug): number {
  const filtered = filterRowsByQueue(rows, slug);
  if (slug === "approved" || slug === "rejected" || slug === "all") {
    return filtered.length;
  }
  return filtered.filter((r) =>
    ["new", "reviewed", "contacted"].includes(r.status)
  ).length;
}

export function queueTotalCount(rows: WaitlistRow[], slug: SubmissionQueueSlug): number {
  return filterRowsByQueue(rows, slug).length;
}

export function getSubmissionQueue(slug: string): SubmissionQueueDef | null {
  return SUBMISSION_QUEUES.find((q) => q.slug === slug) ?? null;
}

export function queueSignupType(slug: SubmissionQueueSlug): SignupType | null {
  if (slug === "women") return "member";
  if (slug === "club-hosts") return "club_host";
  if (slug === "partners") return "partner";
  return null;
}

export function rowDetailLine(row: WaitlistRow): string {
  if (row.signup_type === "club_host") return row.club_name ?? "Club host";
  if (row.signup_type === "partner") return row.business_name ?? "Partner";
  return row.neighborhood ?? "Member";
}

export function rowSecondaryLine(row: WaitlistRow): string {
  if (row.signup_type === "club_host") {
    return [row.club_platform, row.club_member_count].filter(Boolean).join(" · ") || "—";
  }
  if (row.signup_type === "partner") {
    return [row.business_type, row.offering].filter(Boolean).join(" · ") || "—";
  }
  return displayType(row.signup_type);
}

export function statusLabel(status: WaitlistStatus): string {
  const labels: Record<WaitlistStatus, string> = {
    new: "New",
    reviewed: "Reviewed",
    contacted: "Contacted",
    approved: "Approved",
    rejected: "Rejected",
  };
  return labels[status];
}
