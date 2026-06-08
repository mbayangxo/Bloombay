"use client";

import { useEffect, useState } from "react";
import { MemberShell } from "../components/member-shell";
import { getClubProfile } from "@/lib/club-world-data";
import { markMailboxRead } from "@/lib/member-notifications";
import { listMemberFounderMessages } from "@/lib/founder-inbox-store";
import { BbEmptyState } from "@/app/components/member/bb-empty-state";
import { bloomEmptyProps } from "@/lib/bloom-authored";
import { INVITATIONS } from "@/lib/member-portal-data";
import { MailLetterObject } from "@/app/components/member/mail-letter-object";
import { HAPPENING_POSTER_TEMPLATES, templateAt } from "@/lib/member-ui-templates";
import {
  markAllMailboxRead,
  syncMailboxFromServer,
  type MailboxItem,
} from "@/lib/member-mailbox";

const STATIC_MAIL: MailboxItem[] = [
  { id: "inv1", from: "Amanda R.", subject: "Invitation · Rooftop Dinner", type: "invitation", unread: true, href: "/member/happenings" },
  { id: "msg1", from: "Lexi", subject: "Personal note — see you Friday?", type: "message", unread: false, href: "/member/bloomies" },
];

export default function MailboxPage() {
  const [mail, setMail] = useState<MailboxItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      markMailboxRead();
      const { messages } = await syncMailboxFromServer();
      await markAllMailboxRead();

      const pingRows: MailboxItem[] = [];
      try {
        const raw = localStorage.getItem("bb_member_pings");
        if (raw) {
          const pings = JSON.parse(raw) as { clubId: string; message: string }[];
          pings.forEach((p, i) => {
            const club = getClubProfile(p.clubId);
            pingRows.push({
              id: `ping-${p.clubId}-${i}`,
              from: club?.name ?? "Your club",
              subject: `Bloom ping · ${p.message.slice(0, 48)}${p.message.length > 48 ? "…" : ""}`,
              type: "ping",
              unread: true,
              href: `/member/clubs/${p.clubId}`,
            });
          });
        }
      } catch {
        /* ignore */
      }

      const founderRows: MailboxItem[] = listMemberFounderMessages().map((m, i) => ({
        id: `founder-${i}`,
        from: m.from,
        subject: m.subject,
        type: "message" as const,
        unread: true,
        href: "/member/bloomies",
      }));

      const serverWelcome = messages.filter((m) => m.type === "welcome");
      const demoRest = messages.length > 0 ? [] : STATIC_MAIL.filter((m) => m.type !== "welcome");

      setMail([...serverWelcome, ...founderRows, ...pingRows, ...messages.filter((m) => m.type !== "welcome"), ...demoRest]);
      setLoading(false);
      window.dispatchEvent(new Event("bb-member-mail-updated"));
    })();
  }, []);

  return (
    <MemberShell backHref="/member/profile" backLabel="You" compactHeader flush fullWidth>
      <div className="bb-physical-surface bb-mail-desk">
        <p className="bb-mail-desk__whisper">Letters on your desk — invitations, notes, pings.</p>

        {loading ? (
          <p style={{ margin: "0 1rem", fontSize: "0.85rem", color: "var(--mp-muted)" }}>Opening mail…</p>
        ) : null}

        {!loading && mail.length === 0 ? (
          <BbEmptyState
            {...bloomEmptyProps("mailbox", {
              label: "Open Happenings",
              href: "/member/happenings?tab=invitations",
            })}
          />
        ) : null}

        <div className="bb-mail-letters">
          {mail.map((item, i) => (
            <MailLetterObject
              key={item.id}
              src={templateAt(HAPPENING_POSTER_TEMPLATES, i)}
              from={item.from}
              subject={item.subject}
              body={item.body}
              unread={item.unread}
              index={i}
              href={
                item.type === "ping" && item.href
                  ? item.href
                  : item.type === "invitation"
                    ? `/member/happenings/gatherings/${INVITATIONS.find((inv) => inv.id === item.id)?.gatheringId ?? INVITATIONS[0].gatheringId}`
                    : item.href || "/member/home"
              }
            />
          ))}
        </div>
      </div>
    </MemberShell>
  );
}
