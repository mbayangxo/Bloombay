"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ClubOwnerShell } from "../components/club-owner-shell";
import { ClubOwnerPageTitle } from "../components/club-owner-page";
import { attendanceRateForClub } from "@/lib/club-owner-attendance";
import { getClubAnalytics, type ClubAnalyticsSnapshot } from "@/lib/club-owner-data";
import { getHostClubId, listApplications } from "@/lib/club-host-store";
import { getClubProfile } from "@/lib/club-world-data";
import { getClubGrowthMetrics, getEventAnalytics } from "@/lib/club-operations-store";

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
  accent?: boolean;
}) {
  return (
    <div className="co-stat-card">
      <span className="co-stat-card__label">{label}</span>
      <strong className="co-stat-card__value">{value}</strong>
      {hint ? <span className="co-stat-card__hint">{hint}</span> : null}
    </div>
  );
}

export default function ClubOwnerAnalyticsPage() {
  const [data, setData] = useState<ClubAnalyticsSnapshot | null>(null);
  const clubId = getHostClubId();
  const club = getClubProfile(clubId);

  useEffect(() => {
    const pending = listApplications(clubId, "pending").length;
    setData(getClubAnalytics(clubId, pending));
  }, [clubId]);

  const growth = getClubGrowthMetrics(clubId);
  const eventStats = getEventAnalytics(clubId);

  if (!data) return null;

  return (
    <ClubOwnerShell title="Analytics" backHref="/club-owner/dashboard">
      <ClubOwnerPageTitle
        eyebrow={club?.name}
        title="Analytics"
        sub="Revenue, health, activity, and what to watch this week."
      />

      <div className="co-health-strip">
        <div className="co-health-strip__score">
          <span>Club health</span>
          <strong>{data.healthScore}%</strong>
          <em>{data.healthLabel}</em>
        </div>
        <div className="co-health-strip__meta">
          <span>
            <strong>{data.applicationsPending}</strong> apps pending
          </span>
          <span>
            <strong>{data.zonesPending}</strong> zones pending
          </span>
          <span>
            <strong>{data.membersBlocked}</strong> blocked
          </span>
        </div>
      </div>

      <h2 className="co-section__title">Club growth</h2>
      <div className="co-ops-grid">
        <div className="co-ops-metric">
          <strong>{growth.newMembersThisMonth}</strong>
          <span>New this month</span>
        </div>
        <div className="co-ops-metric">
          <strong>{growth.activeMembers}</strong>
          <span>Active members</span>
        </div>
        <div className="co-ops-metric">
          <strong>{growth.attendanceRate}%</strong>
          <span>Attendance rate</span>
        </div>
        <div className="co-ops-metric">
          <strong>{growth.retentionRate}%</strong>
          <span>Retention</span>
        </div>
        <div className="co-ops-metric">
          <strong>{growth.eventParticipation}</strong>
          <span>Event participation</span>
        </div>
      </div>

      <h2 className="co-section__title" style={{ marginTop: "1.25rem" }}>
        Event analytics
      </h2>
      <ul className="co-app-list">
        {eventStats.map((e) => (
          <li key={e.eventId} className="co-hint">
            <strong>{e.title}</strong> — {e.checkedIn}/{e.rsvps} checked in · {e.rating}★
          </li>
        ))}
      </ul>

      <h2 className="co-section__title">Active members</h2>
      <div className="co-stat-grid">
        <StatCard label="Today" value={data.activeDaily} hint="here now / active" />
        <StatCard label="This week" value={data.activeWeekly} />
        <StatCard label="This month" value={data.activeMonthly} />
        <StatCard label="Total members" value={data.membersTotal.toLocaleString()} />
        <StatCard label="New this week" value={data.membersNewWeek} />
        <StatCard label="7-day return" value={`${data.retention.returnRate7d}%`} />
        <StatCard label="Attendance rate" value={`${attendanceRateForClub(clubId)}%`} hint="RSVP → QR check-in" />
        <StatCard label="Retention (30d)" value={`${data.retention.returnRate7d + 8}%`} hint="demo metric" />
      </div>

      <h2 className="co-section__title">Most active members (demo)</h2>
      <ul className="co-app-list">
        <li className="co-app-card">
          <strong>Maya K.</strong>
          <p className="co-app-card__meta">12 check-ins · 8 moments</p>
        </li>
        <li className="co-app-card">
          <strong>Priya S.</strong>
          <p className="co-app-card__meta">9 check-ins · hosts micro-gathering</p>
        </li>
      </ul>

      <h2 className="co-section__title">Revenue (month to date)</h2>
      <div className="co-stat-grid">
        <StatCard label="Subscriptions" value={`$${data.revenue.subscriptionsMtd.toLocaleString()}`} />
        <StatCard label="Join fees (one-time)" value={`$${data.revenue.joinOneTimeMtd.toLocaleString()}`} />
        <StatCard label="Paid gatherings" value={`$${data.revenue.paidGatheringsMtd.toLocaleString()}`} />
        <StatCard label="Total MTD" value={`$${data.revenue.totalMtd.toLocaleString()}`} />
      </div>

      <h2 className="co-section__title">Engagement</h2>
      <div className="co-stat-grid">
        <StatCard label="Moments today" value={data.engagement.momentsToday} />
        <StatCard label="Messages (7d)" value={data.engagement.messagesWeek} />
        <StatCard label="Gatherings hosted" value={data.engagement.gatheringsHosted} />
        <StatCard label="Check-ins (7d)" value={data.engagement.checkInsWeek} />
        <StatCard label="Avg sessions / member" value={data.retention.avgSessionsPerMember} />
      </div>

      <section className="co-insight-card">
        <h3>Host tips — what else to track</h3>
        <ul>
          <li>Conversion: landing views → join started → paid → active member</li>
          <li>Churn risk: members inactive 14+ days</li>
          <li>Top zones by activity and revenue per zone</li>
          <li>Moderator actions log (approvals, denials, pings)</li>
          <li>Refund / dispute rate for paid gatherings</li>
          <li>Peak hours for chat and check-ins (staff your door)</li>
        </ul>
        <p style={{ marginTop: "0.75rem" }}>
          <Link href="/club-owner/applications" className="co-link">
            Review applications →
          </Link>
          {" · "}
          <Link href="/club-owner/zones" className="co-link">
            Zone requests →
          </Link>
        </p>
      </section>
    </ClubOwnerShell>
  );
}
