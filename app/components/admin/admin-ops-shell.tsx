import { AdminShell } from "./admin-shell";

/** Admin + moderator operations — not founders. */
export function AdminOpsShell(
  props: Omit<React.ComponentProps<typeof AdminShell>, "staffBase" | "staffTitle">
) {
  return (
    <AdminShell staffBase="/admin" staffTitle="Operations" {...props} />
  );
}
