"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { dropSummary, listDropsForPartner } from "@/lib/partner-drops/store";
import type { BoomDrop } from "@/lib/partner-drops/types";
import { SESSION_PARTNER_SLUG } from "@/lib/partner-brand/store";
import { PARTNER_INSIGHTS, PARTNER_MENU_STATS } from "@/lib/partner-analytics";
import { PARTNER_PROFILE, PARTNER_REVENUE } from "@/lib/partner-portal-data";

export function PartnerDashboard() {
  const [drops, setDrops] = useState<BoomDrop[]>([]);

  useEffect(() => {
    setDrops(listDropsForPartner(SESSION_PARTNER_SLUG, true));
  }, []);

  const maxOrders = Math.max(...PARTNER_MENU_STATS.map((m) => m.orders), 1);

  return (
    <div className="pp-dash">
      <section className="pp-dash__hero">
        <h2>{PARTNER_PROFILE.name}</h2>
        <p>Venue partner · sell more with menu insights, captions, and Boom drops</p>
      </section>

      <div className="pp-stat-grid pp-dash__stats">
        <div className="pp-stat pp-stat--highlight">
          <strong>${PARTNER_REVENUE.revenueGenerated.toLocaleString()}</strong>
          <span>Revenue · {PARTNER_REVENUE.monthDelta}</span>
        </div>
        <div className="pp-stat">
          <strong>{PARTNER_REVENUE.womenHosted}</strong>
          <span>Women hosted</span>
        </div>
        <div className="pp-stat">
          <strong>{PARTNER_REVENUE.eventsHosted}</strong>
          <span>Events</span>
        </div>
        <div className="pp-stat">
          <strong>{PARTNER_PROFILE.rating}</strong>
          <span>Rating</span>
        </div>
      </div>

      <section className="pp-card pp-dash__menu">
        <div className="pp-dash__card-head">
          <h2>What&apos;s working on your menu</h2>
          <Link href="/partner/brand">Edit captions →</Link>
        </div>
        <ul className="pp-dash__menu-list">
          {PARTNER_MENU_STATS.map((item) => (
            <li key={item.name}>
              <div className="pp-dash__menu-row">
                <strong>{item.name}</strong>
                <span className="pp-dash__trend">{item.trend}</span>
              </div>
              <div className="pp-dash__bar-wrap">
                <div
                  className="pp-dash__bar"
                  style={{ width: `${(item.orders / maxOrders) * 100}%` }}
                />
              </div>
              <p className="pp-dash__menu-meta">
                {item.orders} orders · ${item.revenue.toLocaleString()} · {item.caption}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="pp-card pp-dash__drops">
        <div className="pp-dash__card-head">
          <h2>Boom drops</h2>
          <Link href="/partner/drops">Manage drops →</Link>
        </div>
        {drops.length ? (
          <ul className="pp-dash__drop-list">
            {drops.map((d) => (
              <li key={d.id}>
                <strong>{d.title}</strong>
                <span>{dropSummary(d)}</span>
                <p>{d.caption}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="pp-dash__empty">No active drops — run a special to fill quiet nights.</p>
        )}
        <Link href="/partner/drops" className="pp-btn pp-btn--primary" style={{ marginTop: "0.75rem" }}>
          + New Boom drop
        </Link>
      </section>

      <section className="pp-card">
        <h2>Insights</h2>
        <ul className="pp-dash__insights">
          {PARTNER_INSIGHTS.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </section>

      <section className="pp-card pp-dash__quick">
        <h2>Quick actions</h2>
        <div className="pp-dash__quick-grid">
          <Link href="/partner/brand">Brand & captions</Link>
          <Link href="/partner/drops">Boom drops</Link>
          <Link href="/partner/bookings">Bookings</Link>
          <Link href="/partner/availability">Availability</Link>
          <Link href="/partner/messages">Messages</Link>
          <Link href="/partner/reviews">Reviews</Link>
        </div>
      </section>
    </div>
  );
}
