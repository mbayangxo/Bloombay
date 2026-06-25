/** Confetti — celebration invitations for her (unique template per type). */

export type ConfettiType =
  | "birthday"
  | "anniversary"
  | "new_apartment"
  | "graduation"
  | "new_job"
  | "promotion"
  | "divorce"
  | "breakup";

export type ConfettiInvitation = {
  id: string;
  type: ConfettiType;
  honoree: string;
  host: string;
  when: string;
  place: string;
  headline: string;
  whisper: string;
  stickyNote: string;
  wishPresets: string[];
};

export const CONFETTI_TYPE_LABELS: Record<ConfettiType, string> = {
  birthday: "Birthday",
  anniversary: "Anniversary",
  new_apartment: "New apartment",
  graduation: "Graduation",
  new_job: "New job",
  promotion: "Promotion",
  divorce: "New chapter",
  breakup: "Soft reset",
};

export const CONFETTI_INVITATIONS: ConfettiInvitation[] = [];

export function getConfettiById(id: string): ConfettiInvitation | undefined {
  return CONFETTI_INVITATIONS.find((c) => c.id === id);
}
