import { AdminShell } from "./admin-shell";

export function AdminPlaceholder({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children?: React.ReactNode;
}) {
  return (
    <AdminShell title={title} subtitle={subtitle}>
      <article className="bb-admin-card">
        {children ?? (
          <p className="bb-admin-empty" style={{ textAlign: "left" }}>
            This section is part of the Bloom Verification Pipeline — coming next.
          </p>
        )}
      </article>
    </AdminShell>
  );
}
