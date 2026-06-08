"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { addResource, listResources, type ClubResource } from "@/lib/club-operations-store";

export default function ClubOwnerResourcesPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [items, setItems] = useState(() => listResources(clubId));
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<ClubResource["kind"]>("document");

  return (
    <ClubOwnerShell title="Resources" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Resource library"
        sub="Past flyers, event covers, templates, documents, photos, and sponsor info — reuse every year."
      />
      <div className="co-resource-grid">
        {items.map((r) => (
          <div key={r.id} className="co-resource-card">
            <span className="co-resource-card__kind">{r.kind}</span>
            <strong>{r.title}</strong>
            {r.notes ? <p className="co-hint">{r.notes}</p> : null}
          </div>
        ))}
      </div>
      <form
        className="co-form"
        style={{ marginTop: "1rem" }}
        onSubmit={(e) => {
          e.preventDefault();
          if (!title.trim()) return;
          addResource(clubId, { title: title.trim(), kind });
          setItems(listResources(clubId));
          setTitle("");
        }}
      >
        <label>
          Add resource
          <input className="co-input" value={title} onChange={(e) => setTitle(e.target.value)} />
        </label>
        <select className="co-input" value={kind} onChange={(e) => setKind(e.target.value as ClubResource["kind"])}>
          <option value="flyer">Flyer</option>
          <option value="cover">Cover</option>
          <option value="template">Template</option>
          <option value="document">Document</option>
          <option value="photo">Photo</option>
          <option value="sponsor">Sponsor</option>
        </select>
        <button type="submit" className="co-btn co-btn--primary">
          Save to library
        </button>
      </form>
    </ClubOwnerShell>
  );
}
