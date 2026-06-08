import { INTERESTS } from "@/app/components/bloom-suite/constants";

const interestMap = new Map<string, string>(
  INTERESTS.map((i) => [i.id, i.label])
);

export function interestLabel(id: string): string {
  return interestMap.get(id) ?? id.replace(/-/g, " ");
}

export function formatInterestList(ids: string[] | null): string {
  if (!ids?.length) return "—";
  return ids.map(interestLabel).join(", ");
}

export function formatDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}
