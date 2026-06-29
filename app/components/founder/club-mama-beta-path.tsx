export function ClubMamaBetaPath() {
  return (
    <aside className="fp-portal-beta-note" style={{ marginBottom: "1.25rem" }}>
      <p className="fp-portal-beta-note__title">Beta: Club Mama live path</p>
      <p className="fp-portal-muted" style={{ margin: "0.35rem 0 0", fontSize: "0.88rem", lineHeight: 1.5 }}>
        Approve hosts here or in Applications, then send a <strong>club_owner</strong> portal invite.
        Club Mamas should run their club at{" "}
        <code>/member/clubs/&#123;slug&#125;/manage</code> (roster, applications, gatherings).
        The <code>/club-owner/*</code> shell is still demo/localStorage — not supported for beta yet.
      </p>
    </aside>
  );
}
