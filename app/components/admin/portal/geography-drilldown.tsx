"use client";

import { useMemo, useState } from "react";
import type { GeoNode } from "@/lib/portal-dashboard-data";
import { GEOGRAPHY_TREE } from "@/lib/portal-dashboard-data";

type Level = "country" | "region" | "city" | "neighborhood";

const LEVEL_LABELS: Record<Level, string> = {
  country: "Countries",
  region: "States / Regions",
  city: "Cities",
  neighborhood: "Neighborhoods",
};

function readinessPercent(node: GeoNode, maxCount: number): number {
  if (node.percent != null) return node.percent;
  return Math.round((node.count / maxCount) * 100);
}

export function GeographyDrilldown({ tree = GEOGRAPHY_TREE }: { tree?: GeoNode[] }) {
  const [path, setPath] = useState<GeoNode[]>([]);

  const level: Level = useMemo(() => {
    if (path.length === 0) return "country";
    if (path.length === 1) return "region";
    if (path.length === 2) return "city";
    return "neighborhood";
  }, [path]);

  const items = useMemo(() => {
    if (path.length === 0) return tree;
    return path[path.length - 1].children ?? [];
  }, [path, tree]);

  const breadcrumb = useMemo(() => {
    const crumbs = [{ id: "root", name: "Countries" }];
    for (const node of path) crumbs.push({ id: node.id, name: node.name });
    return crumbs;
  }, [path]);

  const maxCount = useMemo(
    () => Math.max(...items.map((n) => n.count), 1),
    [items]
  );

  function select(node: GeoNode) {
    if (node.children?.length) setPath((p) => [...p, node]);
  }

  function goBack() {
    setPath((p) => p.slice(0, -1));
  }

  function goToIndex(index: number) {
    if (index < 0) setPath([]);
    else setPath((p) => p.slice(0, index + 1));
  }

  return (
    <section className="fp-overview-card fp-overview-geo fp-surface-barbie" aria-labelledby="fp-geo-heading">
      <div className="fp-overview-card__head">
        <h3 id="fp-geo-heading" className="fp-overview-card__title">
          Geography
        </h3>
        <span className="fp-overview-card__tag">{LEVEL_LABELS[level]}</span>
      </div>

      <div className="fp-overview-geo__nav">
        {path.length > 0 ? (
          <button type="button" className="fp-overview-geo__back" onClick={goBack}>
            ← Back
          </button>
        ) : null}
        <nav className="fp-overview-geo__crumbs" aria-label="Geography breadcrumb">
          {breadcrumb.map((crumb, i) => (
            <span key={crumb.id} className="fp-overview-geo__crumb-wrap">
              {i > 0 ? <span className="fp-overview-geo__sep">›</span> : null}
              <button
                type="button"
                className="fp-overview-geo__crumb"
                onClick={() => goToIndex(i - 1)}
              >
                {crumb.name}
              </button>
            </span>
          ))}
        </nav>
      </div>

      <ul className="fp-overview-geo__list">
        {items.map((node) => {
          const pct = readinessPercent(node, maxCount);
          return (
            <li key={node.id}>
              <button
                type="button"
                className="fp-overview-geo__row"
                onClick={() => select(node)}
                disabled={!node.children?.length}
              >
                <span className="fp-overview-geo__name">{node.name}</span>
                <span className="fp-overview-geo__count">
                  {node.count.toLocaleString()} women
                </span>
                <span className="fp-overview-geo__bar-wrap">
                  <span className="fp-overview-bar fp-overview-bar--geo">
                    <span
                      className="fp-overview-bar__fill"
                      style={{ width: `${pct}%` }}
                    />
                  </span>
                </span>
                <span className="fp-overview-geo__pct">{pct}% ready</span>
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
