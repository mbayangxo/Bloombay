import Link from "next/link";
import {
  aggregateDashboard,
  countNewMembers,
  type WaitlistRow,
} from "@/lib/waitlist-admin";
import {
  CLUB_CATALOG,
  FUTURE_CURATORS,
  MISSION_KPI,
  REFERRAL_SOURCES,
  TAB_SHORTCUTS,
  TODAYS_BLOOM_LINES,
  TOP_CLUBS_PREVIEW,
} from "@/lib/mission-control-data";
import { MEMBERSHIP_GROWTH, NYC_LAUNCH_HERO, TOP_CITIES } from "@/lib/portal-dashboard-data";
import { PORTAL_QUEUE_FALLBACK } from "@/lib/founder-dashboard-metrics";
import { ClubCategoryGrid } from "./club-category-grid";
import { GeographyDrilldown } from "./geography-drilldown";
import { KpiRow, type KpiItem } from "./kpi-row";
import { NycLaunchHero } from "./nyc-launch-hero";
import { OverviewAttention } from "./overview-attention";
import { TabShortcuts } from "./tab-shortcuts";
import { TodaysBloomNarrative } from "./todays-bloom-narrative";
import { TodaysBloom } from "./todays-bloom";
import { Cohort14Panel } from "./cohort14-panel";
import { BloomScore } from "./bloom-score";
import { ClubHealthPanel } from "./club-health-panel";
import { HostLeaderboardPanel } from "./host-leaderboard-panel";
import { LAUNCH_READINESS } from "@/lib/founder-insights";
import { mcPath, type StaffBase } from "@/lib/mc-paths";
import type { Cohort14Row } from "@/lib/founder-cohort14";
import type { TodaysBloomLine } from "@/lib/founder-todays-bloom";

const CLUB_CATEGORIES = [
  "Book Clubs",
  "Dinner Clubs",
  "Wellness",
  "Founders",
  "Travel",
  "Faith",
  "Creative Women",
  "Muslim Women",
  "Mothers",
] as const;

const CLUBS_WAITING_COMPACT = [
  { name: "Founders Club", women: 398, status: "Need Host" },
  { name: "Faith Club", women: 127, status: "Need Venue" },
  { name: "Travel Club", women: 221, status: "Ready" },
  { name: "Book Club", women: 312, status: "Searching" },
];

const ATTENTION_PILLS = [
  { count: 127, label: "Waiting verification", href: "/admin/verification" },
  { count: 34, label: "Waiting approval", href: "/admin/applications?type=member" },
  { count: 89, label: "Waiting for club", href: "/admin/clubs" },
  { count: 412, label: "Waiting for city launch", href: "/admin/dashboard#nyc-launch" },
  { count: 18, label: "Waiting for response", href: "/admin/inbox" },
] as const;

export function OverviewDashboard({
  rows,
  cohort14,
  todaysBloom,
  staffBase = "/admin",
}: {
  rows: WaitlistRow[];
  cohort14?: Cohort14Row[];
  todaysBloom?: TodaysBloomLine[];
  staffBase?: StaffBase;
}) {
  const stats = aggregateDashboard(rows);
  const live = stats.total > 0;

  const today = live ? countNewMembers(rows, "today") : MEMBERSHIP_GROWTH.today.value;
  const week = live ? countNewMembers(rows, "week") : MEMBERSHIP_GROWTH.week.value;
  const month = live ? countNewMembers(rows, "month") : MEMBERSHIP_GROWTH.month.value;

  const verificationCount =
    stats.verificationQueue || PORTAL_QUEUE_FALLBACK.verification;

  const attentionPills = ATTENTION_PILLS.map((p) => ({
    ...p,
    href: mcPath(p.href, staffBase),
  })).map((p) =>
    p.label === "Waiting verification" ? { ...p, count: verificationCount } : { ...p }
  );

  const tabShortcuts = TAB_SHORTCUTS.map((t) => {
    const item =
      t.label === "Verification waiting" ? { ...t, count: verificationCount } : { ...t };
    return { ...item, href: mcPath(item.href, staffBase) };
  });

  const bloomLines: string[] = [...TODAYS_BLOOM_LINES];
  if (live && today > 0) {
    bloomLines[0] = `${today} women joined today.`;
  }

  const kpis: KpiItem[] = [
    {
      label: "Total Women",
      total: live ? stats.members : MISSION_KPI.totalWomen.total,
      today: live ? today : MISSION_KPI.totalWomen.today,
      week: live ? week : MISSION_KPI.totalWomen.week,
      month: live ? month : MISSION_KPI.totalWomen.month,
    },
    {
      label: "Club Hosts",
      total: live ? stats.clubs : MISSION_KPI.clubHosts.total,
      today: MISSION_KPI.clubHosts.today,
      week: MISSION_KPI.clubHosts.week,
      month: MISSION_KPI.clubHosts.month,
    },
    {
      label: "Partners",
      total: live ? stats.partners : MISSION_KPI.partners.total,
      today: MISSION_KPI.partners.today,
      week: MISSION_KPI.partners.week,
      month: MISSION_KPI.partners.month,
    },
    {
      label: "Pending Verification",
      total: live ? stats.verificationQueue : MISSION_KPI.pendingVerification.total,
      today: MISSION_KPI.pendingVerification.today,
      week: MISSION_KPI.pendingVerification.week,
      month: MISSION_KPI.pendingVerification.month,
    },
    {
      label: "Active This Week",
      total: MISSION_KPI.activeThisWeek.total,
      today: MISSION_KPI.activeThisWeek.today,
      week: MISSION_KPI.activeThisWeek.week,
      month: MISSION_KPI.activeThisWeek.month,
    },
  ];

  const hero = NYC_LAUNCH_HERO;

  const clubCategories = CLUB_CATEGORIES.map((name) => {
    const match = CLUB_CATALOG.find((c) => c.name === name);
    return (
      match ?? {
        name,
        interested: 400,
        weekGrowth: 10,
        readiness: 70,
        trend: "up" as const,
      }
    );
  });

  return (
    <div className="fp-overview">
      <TodaysBloomNarrative lines={todaysBloom} />

      <Cohort14Panel rows={cohort14} />

      <TodaysBloom lines={bloomLines} />

      <NycLaunchHero hero={hero} />

      <section className="fp-overview-card fp-overview-curators fp-surface-barbie">
        <h3 className="fp-overview-card__title">Future curators</h3>
        <p className="fp-overview-card__hint">
          Women who may become hosts, ambassadors & community leaders
        </p>
        <ul className="fp-overview-curators__list">
          {FUTURE_CURATORS.map((c) => (
            <li key={c.name} className="fp-overview-curator">
              <div className="fp-overview-curator__avatar" aria-hidden>
                {c.name
                  .split(" ")
                  .map((w) => w.charAt(0))
                  .join("")
                  .slice(0, 2)}
              </div>
              <div className="fp-overview-curator__body">
                <p className="fp-overview-curator__name">{c.name}</p>
                <p className="fp-overview-curator__loc">{c.location}</p>
                <p className="fp-overview-curator__line">
                  <BloomScore score={c.bloomScore} size="sm" />
                  <span>Potential {c.role}</span>
                </p>
                <p className="fp-overview-curator__reason">{c.factors}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <div className="fp-overview__priority-row">
        <section className="fp-overview-card fp-overview-cities fp-surface-white">
          <h3 className="fp-overview-card__title">Top cities</h3>
          <ul className="fp-overview-cities__list">
            {TOP_CITIES.map((c) => (
              <li key={c.name}>
                <div className="fp-overview-cities__row">
                  <span className="fp-overview-cities__name">{c.name}</span>
                  <span className="fp-overview-cities__num">
                    {c.signups.toLocaleString()}
                  </span>
                </div>
                <span className="fp-overview-bar fp-overview-bar--city">
                  <span
                    className="fp-overview-bar__fill"
                    style={{ width: `${c.readiness}%` }}
                  />
                </span>
                <span className="fp-overview-cities__meta">
                  {c.readiness}% ready · +{c.growthRate}% growth
                </span>
              </li>
            ))}
          </ul>
        </section>

        <div className="fp-overview__clubs-block">
          <section className="fp-overview-card fp-overview-top-clubs fp-surface-barbie">
            <div className="fp-overview-card__head">
              <h3 className="fp-overview-card__title">Top clubs</h3>
              <Link href={mcPath("/admin/clubs", staffBase)} className="fp-overview-link">
                All clubs →
              </Link>
            </div>
            <ul className="fp-overview-top-clubs__list">
              {TOP_CLUBS_PREVIEW.map((c) => (
                <li key={c.name}>
                  <span>{c.name}</span>
                  <BloomScore score={c.score} size="sm" />
                </li>
              ))}
            </ul>
          </section>
          <div className="fp-surface-barbie">
            <ClubCategoryGrid categories={clubCategories} />
          </div>
        </div>

        <section className="fp-overview-card fp-overview-referrals fp-surface-white">
          <h3 className="fp-overview-card__title">Referral sources</h3>
          <ul className="fp-overview-referrals__list">
            {REFERRAL_SOURCES.map((r) => (
              <li key={r.source}>
                <div className="fp-overview-referrals__row">
                  <span className="fp-overview-referrals__name">{r.source}</span>
                  <span className="fp-overview-referrals__chip">{r.percent}%</span>
                </div>
                <span className="fp-overview-bar fp-overview-bar--ref">
                  <span
                    className="fp-overview-bar__fill"
                    style={{ width: `${r.percent}%` }}
                  />
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <KpiRow items={kpis} />

      <section className="fp-card">
        <h3 className="fp-card__title">Launch control</h3>
        <p className="fp-sub">Should you open a city or wait?</p>
        <ul className="fp-rank-list">
          {LAUNCH_READINESS.map((c) => (
            <li key={c.city}>
              <span>
                <strong>{c.city}</strong> · {c.women.toLocaleString()} women · {c.clubs} clubs
              </span>
              <span className={c.verdict === "Launch" ? "fp-tag-launch" : "fp-tag-wait"}>
                {c.readiness}% · {c.verdict}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <ClubHealthPanel staffBase={staffBase} />
      <HostLeaderboardPanel />

      <OverviewAttention pills={attentionPills} />

      <TabShortcuts items={[...tabShortcuts]} />

      <div className="fp-overview__secondary">
        <div className="fp-surface-barbie">
          <GeographyDrilldown />
        </div>
        <section className="fp-overview-card fp-overview-waiting-tiny fp-surface-white">
          <h3 className="fp-overview-card__title">Clubs waiting to bloom</h3>
          <ul className="fp-overview-waiting-tiny__list">
            {CLUBS_WAITING_COMPACT.map((c) => (
              <li key={c.name}>
                <strong>{c.name}</strong>
                <span>
                  {c.women} women · {c.status}
                </span>
              </li>
            ))}
          </ul>
          <Link href={mcPath("/admin/clubs", staffBase)} className="fp-overview-link">
            View all clubs →
          </Link>
        </section>
      </div>

      {live ? (
        <p className="fp-overview-live">
          Live waitlist: <strong>{stats.total.toLocaleString()}</strong> records
        </p>
      ) : null}
    </div>
  );
}
