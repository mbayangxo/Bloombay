import { AdminShell } from "./admin-shell";

/** Founder portal chrome — separate login from /admin. */
export function FounderShell(
  props: Omit<React.ComponentProps<typeof AdminShell>, "staffBase" | "staffTitle">
) {
  return (
    <AdminShell staffBase="/founder" staffTitle="Founder portal" {...props} />
  );
}
