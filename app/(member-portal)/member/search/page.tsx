"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";

const PINK = "#FF1F7D";
const DARK = "#1C1B1C";
const PAPER = "#FEFCF7";

type Tab = "all" | "members" | "clubs" | "events";

interface Member {
  id: string;
  first_name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  neighborhood: string | null;
  bio: string | null;
}

interface Club {
  id: string;
  name: string;
  tagline: string | null;
  description: string | null;
  primary_color: string | null;
  cover_url: string | null;
  slug: string;
  neighborhood: string | null;
}

interface Event {
  id: string;
  title: string;
  starts_at: string;
  venue: string | null;
  neighborhood: string | null;
  description: string | null;
}

interface SearchResults {
  members: Member[];
  clubs: Club[];
  events: Event[];
}

function getInitials(name: string | null, firstName: string | null): string {
  if (name) {
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  }
  if (firstName) return firstName[0].toUpperCase();
  return "?";
}

function formatDate(iso: string): { month: string; day: string } {
  const d = new Date(iso);
  return {
    month: d.toLocaleString("en-US", { month: "short" }).toUpperCase(),
    day: String(d.getDate()),
  };
}

function Spinner() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingTop: 48,
      }}
    >
      <div
        style={{
          width: 28,
          height: 28,
          border: `3px solid ${PINK}33`,
          borderTopColor: PINK,
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }}
      />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "14px 16px",
        background: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        boxShadow: "0 1px 4px rgba(28,27,28,0.07)",
      }}
    >
      {member.avatar_url ? (
        <img
          src={member.avatar_url}
          alt={member.full_name ?? ""}
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
      ) : (
        <div
          style={{
            width: 44,
            height: 44,
            borderRadius: "50%",
            background: PINK,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 17,
            fontWeight: 700,
            flexShrink: 0,
          }}
        >
          {getInitials(member.full_name, member.first_name)}
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 600,
            fontSize: 15,
            color: DARK,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {member.full_name ?? member.first_name ?? "Member"}
        </div>
        {member.neighborhood && (
          <div
            style={{
              fontSize: 13,
              color: "#888",
              marginTop: 2,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {member.neighborhood}
          </div>
        )}
      </div>
      <button
        onClick={() => {}}
        style={{
          flexShrink: 0,
          background: "none",
          border: `1.5px solid ${PINK}`,
          color: PINK,
          borderRadius: 20,
          padding: "5px 14px",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          whiteSpace: "nowrap",
        }}
      >
        Message →
      </button>
    </div>
  );
}

function ClubCard({ club }: { club: Club }) {
  const accent = club.primary_color ?? PINK;
  return (
    <div
      style={{
        display: "flex",
        background: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        boxShadow: "0 1px 4px rgba(28,27,28,0.07)",
        overflow: "hidden",
      }}
    >
      <div style={{ width: 5, background: accent, flexShrink: 0 }} />
      <div style={{ padding: "14px 16px", flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: DARK,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {club.name}
        </div>
        {club.tagline && (
          <div
            style={{
              fontSize: 13,
              color: "#555",
              marginTop: 3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {club.tagline}
          </div>
        )}
        {club.neighborhood && (
          <span
            style={{
              display: "inline-block",
              marginTop: 8,
              background: `${accent}18`,
              color: accent,
              borderRadius: 20,
              padding: "2px 10px",
              fontSize: 11,
              fontWeight: 600,
            }}
          >
            {club.neighborhood}
          </span>
        )}
      </div>
    </div>
  );
}

function EventCard({ event }: { event: Event }) {
  const { month, day } = formatDate(event.starts_at);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 14,
        padding: "14px 16px",
        background: "#fff",
        borderRadius: 12,
        marginBottom: 10,
        boxShadow: "0 1px 4px rgba(28,27,28,0.07)",
      }}
    >
      <div
        style={{
          flexShrink: 0,
          width: 44,
          background: PINK,
          borderRadius: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "6px 4px",
        }}
      >
        <div style={{ color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: 0.5 }}>
          {month}
        </div>
        <div style={{ color: "#fff", fontSize: 20, fontWeight: 800, lineHeight: 1 }}>
          {day}
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div
          style={{
            fontWeight: 700,
            fontSize: 15,
            color: DARK,
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {event.title}
        </div>
        {(event.venue || event.neighborhood) && (
          <div
            style={{
              fontSize: 13,
              color: "#888",
              marginTop: 3,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {[event.venue, event.neighborhood].filter(Boolean).join(" · ")}
          </div>
        )}
      </div>
    </div>
  );
}

const TABS: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "members", label: "Members" },
  { id: "clubs", label: "Clubs" },
  { id: "events", label: "Events" },
];

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [activeTab, setActiveTab] = useState<Tab>("all");
  const [results, setResults] = useState<SearchResults>({
    members: [],
    clubs: [],
    events: [],
  });
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const doSearch = useCallback(
    async (q: string, tab: Tab) => {
      if (!q || q.length < 2) {
        setResults({ members: [], clubs: [], events: [] });
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        const params = new URLSearchParams({ q, type: tab });
        const res = await fetch(`/api/search?${params}`);
        if (res.ok) {
          const data = (await res.json()) as SearchResults;
          setResults(data);
        }
      } finally {
        setLoading(false);
      }
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      void doSearch(query, activeTab);
    }, 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, activeTab, doSearch]);

  const hasQuery = query.trim().length >= 2;
  const totalResults =
    results.members.length + results.clubs.length + results.events.length;
  const isEmpty = hasQuery && !loading && totalResults === 0;

  const showMembers =
    (activeTab === "all" || activeTab === "members") &&
    results.members.length > 0;
  const showClubs =
    (activeTab === "all" || activeTab === "clubs") && results.clubs.length > 0;
  const showEvents =
    (activeTab === "all" || activeTab === "events") &&
    results.events.length > 0;

  return (
    <div
      style={{
        background: PAPER,
        minHeight: "100dvh",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: DARK,
      }}
    >
      {/* Header */}
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 10,
          background: PAPER,
          borderBottom: "1px solid #f0ece4",
          padding: "12px 16px",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}
      >
        <button
          onClick={() => router.back()}
          aria-label="Go back"
          style={{
            background: "none",
            border: "none",
            padding: "4px 6px",
            cursor: "pointer",
            color: DARK,
            fontSize: 22,
            lineHeight: 1,
            flexShrink: 0,
          }}
        >
          ←
        </button>
        <div style={{ flex: 1, position: "relative" }}>
          <input
            ref={inputRef}
            autoFocus
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search members, clubs, events…"
            style={{
              width: "100%",
              boxSizing: "border-box",
              border: "none",
              background: "#f3efe7",
              borderRadius: 24,
              padding: "10px 40px 10px 16px",
              fontSize: 16,
              color: DARK,
              outline: "none",
            }}
          />
          {query && (
            <button
              onClick={() => {
                setQuery("");
                setResults({ members: [], clubs: [], events: [] });
                inputRef.current?.focus();
              }}
              aria-label="Clear search"
              style={{
                position: "absolute",
                right: 10,
                top: "50%",
                transform: "translateY(-50%)",
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#aaa",
                fontSize: 18,
                lineHeight: 1,
                padding: 2,
              }}
            >
              ×
            </button>
          )}
        </div>
      </div>

      {/* Tab strip */}
      <div
        style={{
          display: "flex",
          overflowX: "auto",
          padding: "12px 16px 0",
          gap: 8,
          scrollbarWidth: "none",
        }}
      >
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flexShrink: 0,
                background: active ? PINK : "#f3efe7",
                color: active ? "#fff" : DARK,
                border: "none",
                borderRadius: 20,
                padding: "7px 18px",
                fontSize: 14,
                fontWeight: active ? 700 : 500,
                cursor: "pointer",
                transition: "background 0.15s, color 0.15s",
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div style={{ padding: "16px 16px 32px" }}>
        {/* Empty query state */}
        {!hasQuery && !loading && (
          <div
            style={{
              textAlign: "center",
              paddingTop: 64,
              color: "#aaa",
              fontSize: 15,
            }}
          >
            Search for members, clubs, or events
          </div>
        )}

        {/* Loading */}
        {loading && <Spinner />}

        {/* No results */}
        {isEmpty && (
          <div
            style={{
              textAlign: "center",
              paddingTop: 64,
              color: "#aaa",
              fontSize: 15,
            }}
          >
            Nothing found for &ldquo;{query.trim()}&rdquo;
          </div>
        )}

        {/* Results */}
        {!loading && hasQuery && totalResults > 0 && (
          <>
            {showMembers && (
              <section style={{ marginBottom: 24 }}>
                {activeTab === "all" && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: "#999",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Members
                  </div>
                )}
                {results.members.map((m) => (
                  <MemberCard key={m.id} member={m} />
                ))}
              </section>
            )}

            {showClubs && (
              <section style={{ marginBottom: 24 }}>
                {activeTab === "all" && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: "#999",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Clubs
                  </div>
                )}
                {results.clubs.map((c) => (
                  <ClubCard key={c.id} club={c} />
                ))}
              </section>
            )}

            {showEvents && (
              <section style={{ marginBottom: 24 }}>
                {activeTab === "all" && (
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      letterSpacing: 1,
                      color: "#999",
                      textTransform: "uppercase",
                      marginBottom: 10,
                    }}
                  >
                    Events
                  </div>
                )}
                {results.events.map((e) => (
                  <EventCard key={e.id} event={e} />
                ))}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
}
