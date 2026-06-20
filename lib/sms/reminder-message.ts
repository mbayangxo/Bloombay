export type ReminderKind = "calendar" | "seat" | "opt_in";

export function buildSmsReminderBody(input: {
  firstName?: string;
  title?: string;
  when?: string;
  place?: string;
  kind: ReminderKind;
}) {
  const name = input.firstName?.trim() || "there";

  if (input.kind === "opt_in") {
    return `BloomBay: SMS reminders are on, ${name}. We'll text you about saved seats and calendar plans. Reply STOP to opt out.`;
  }

  if (input.kind === "seat" && input.title) {
    const where = input.place ? ` at ${input.place}` : "";
    const when = input.when ? ` — ${input.when}` : "";
    return `BloomBay: Your seat is saved for ${input.title}${where}${when}. See you there, ${name}.`;
  }

  if (input.title && input.when) {
    const where = input.place ? ` · ${input.place}` : "";
    return `BloomBay reminder: ${input.title} on ${input.when}${where}. Open BloomBay when you're ready.`;
  }

  return `BloomBay: You're all set, ${name}. We'll text you reminders for plans you save.`;
}
