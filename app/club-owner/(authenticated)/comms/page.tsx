"use client";

import { useState } from "react";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { getHostClubId } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { listAnnouncements, sendAnnouncement } from "@/lib/club-operations-store";

export default function ClubOwnerCommsPage() {
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);
  const [items, setItems] = useState(() => listAnnouncements(clubId));
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [push, setPush] = useState(true);
  const [email, setEmail] = useState(true);
  const [sms, setSms] = useState(false);

  return (
    <ClubOwnerShell title="Comms" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Communication center"
        sub="One hub for club announcements, event reminders, and optional push, email, and SMS."
      />
      <ul className="co-app-list">
        {items.map((a) => (
          <li key={a.id} className="co-app-card">
            <strong>{a.title}</strong>
            <p>{a.body}</p>
            <p className="co-hint">
              {new Date(a.sentAt).toLocaleString()} ·
              {[a.channels.push && "push", a.channels.email && "email", a.channels.sms && "SMS"].filter(Boolean).join(" · ")}
            </p>
          </li>
        ))}
      </ul>
      <form
        className="co-form"
        onSubmit={(e) => {
          e.preventDefault();
          sendAnnouncement(clubId, { title, body, channels: { push, email, sms } });
          setItems(listAnnouncements(clubId));
          setTitle("");
          setBody("");
        }}
      >
        <label>
          Announcement title
          <input className="co-input" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </label>
        <label>
          Message
          <textarea className="co-input co-input--area" rows={4} value={body} onChange={(e) => setBody(e.target.value)} required />
        </label>
        <label className="co-toggle">
          <input type="checkbox" checked={push} onChange={(e) => setPush(e.target.checked)} /> Push notification
        </label>
        <label className="co-toggle">
          <input type="checkbox" checked={email} onChange={(e) => setEmail(e.target.checked)} /> Email
        </label>
        <label className="co-toggle">
          <input type="checkbox" checked={sms} onChange={(e) => setSms(e.target.checked)} /> SMS (optional)
        </label>
        <button type="submit" className="co-btn co-btn--primary">
          Send announcement
        </button>
      </form>
    </ClubOwnerShell>
  );
}
