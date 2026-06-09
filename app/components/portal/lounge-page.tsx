"use client";

import { useState } from "react";
import Link from "next/link";

const PINK  = "#FF1F7D";
const DARK  = "#1C1B1C";
const CREAM = "#F6F1EB";

const PAPER_TEX = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='4' stitchTiles='stitch' result='t'/%3E%3CfeColorMatrix type='saturate' values='0' in='t'/%3E%3C/filter%3E%3Crect width='200' height='200' fill='%23000' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E")`;

const ZONES = [
  { id: 1, name: "SoHo",          sub: "Downtown",   women: 34, grad: "linear-gradient(135deg,#FF1F7D 0%,#C51B6B 100%)",  rot: -2   },
  { id: 2, name: "Williamsburg",  sub: "Brooklyn",   women: 22, grad: "linear-gradient(135deg,#1A0514 0%,#3D0B2E 100%)",  rot: 1.5  },
  { id: 3, name: "West Village",  sub: "Manhattan",  women: 19, grad: "linear-gradient(135deg,#C084FC 0%,#7C3AED 100%)",  rot: -1   },
  { id: 4, name: "Crown Heights", sub: "Brooklyn",   women: 28, grad: "linear-gradient(135deg,#F97316 0%,#C2410C 100%)",  rot: 2    },
  { id: 5, name: "Harlem",        sub: "Upper Mhtn", women: 16, grad: "linear-gradient(135deg,#0EA5E9 0%,#0369A1 100%)",  rot: -1.5 },
  { id: 6, name: "DUMBO",         sub: "Brooklyn",   women: 11, grad: "linear-gradient(135deg,#4ADE80 0%,#16A34A 100%)",  rot: 1    },
];

const MOMENTS = [
  { id: 1, grad: "linear-gradient(135deg,#FF1F7D,#C51B6B)",  rot: -3,  caption: "Girls brunch — Sadelle's",   likes: 47, author: "Aaliyah M." },
  { id: 2, grad: "linear-gradient(135deg,#1A0514,#6B1A3A)",  rot: 2,   caption: "Sunset on the High Line",    likes: 91, author: "Sofia K."    },
  { id: 3, grad: "linear-gradient(135deg,#C084FC,#7C3AED)",  rot: -1,  caption: "Gallery opening Chelsea",    likes: 63, author: "Zara F."     },
  { id: 4, grad: "linear-gradient(135deg,#F97316,#C2410C)",  rot: 2.5, caption: "Park picnic, Crown Heights", likes: 38, author: "Kelechi O."  },
  { id: 5, grad: "linear-gradient(135deg,#0EA5E9,#0369A1)",  rot: -2,  caption: "Rooftop night, Wburg",       likes: 72, author: "Naomi B."    },
  { id: 6, grad: "linear-gradient(135deg,#4ADE80,#16A34A)",  rot: 1.5, caption: "Sunday walk, Prospect Pk",  likes: 55, author: "Priya R."    },
];

const UPCOMING = [
  { id: 1, time: "Tonight · 7PM", name: "Girls Night Out",       loc: "Bar Pisellino · SoHo",     attendees: 12, color: PINK      },
  { id: 2, time: "Fri · 6:30PM",  name: "Museum Girls Opening",  loc: "MoMA · Midtown",            attendees: 8,  color: "#C084FC" },
  { id: 3, time: "Sat · 10AM",    name: "Sunday Walk (Early)",   loc: "Prospect Park · Brooklyn",  attendees: 21, color: "#4ADE80" },
  { id: 4, time: "Sun · 12PM",    name: "Dinner Society Brunch", loc: "Balthazar · SoHo",          attendees: 6,  color: "#F97316" },
];

const LIVE_AVATARS = [
  { i: "A", c: PINK       },
  { i: "S", c: "#FF69B4"  },
  { i: "Z", c: "#C084FC"  },
  { i: "N", c: "#F97316"  },
  { i: "K", c: "#4ADE80"  },
];

const AV_COLORS = [PINK, "#FF69B4", "#C084FC", "#F97316", "#0EA5E9", "#4ADE80"];

export interface LoungeUser {
  name: string;
  initial: string;
  neighborhood: string;
  bio?: string;
}

function Tape({ style }: { style?: React.CSSProperties }) {
  return (
    <div style={{
      position: "absolute", top: -10, left: "50%",
      transform: "translateX(-50%)",
      width: 48, height: 20,
      background: "rgba(255,240,150,0.52)",
      borderRadius: 2, zIndex: 2,
      border: "1px solid rgba(255,220,50,0.28)",
      ...style,
    }}>
      <div style={{
        position: "absolute", top: "40%", left: "50%",
        transform: "translate(-50%,-50%)",
        width: "40%", height: "28%",
        background: "rgba(255,255,255,0.35)", borderRadius: 1,
      }} />
    </div>
  );
}

function ZoneCard({ zone }: { zone: typeof ZONES[0] }) {
  const [joined, setJoined] = useState(false);
  return (
    <div style={{
      flexShrink: 0, width: 150, paddingTop: 12,
      transform: `rotate(${zone.rot}deg)`,
      transformOrigin: "center top",
    }}>
      <Tape />
      <div style={{ background: "#FFF", borderRadius: 4, padding: "8px 8px 28px", boxShadow: "0 8px 24px rgba(0,0,0,0.22)" }}>
        <div style={{
          width: "100%", height: 120, borderRadius: 2, background: zone.grad,
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2,
        }}>
          <span style={{ fontFamily: "var(--font-playfair)", fontStyle: "italic", fontWeight: 700, fontSize: 15, color: "rgba(255,255,255,0.94)", textAlign: "center", lineHeight: 1.2, padding: "0 8px" }}>
            {zone.name}
          </span>
          <span style={{ fontSize: 9, color: "rgba(255,255,255,0.55)", fontFamily: "var(--font-jost)", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            {zone.sub}
          </span>
        </div>
        <div style={{ marginTop: 6, padding: "0 2px" }}>
          <div style={{ fontSize: 9, color: "#aaa", fontFamily: "var(--font-jost)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 4 }}>
            {zone.women} women
          </div>
          <button
            onClick={() => setJoined(j => !j)}
            style={{
              width: "100%", padding: "4px 0", borderRadius: 3,
              border: `1px solid ${joined ? PINK : "rgba(0,0,0,0.15)"}`,
              background: joined ? PINK : "transparent",
              color: joined ? "white" : "#888",
              fontSize: 8, fontWeight: 700, fontFamily: "var(--font-jost)",
              letterSpacing: "0.1em", textTransform: "uppercase", cursor: "pointer",
            }}
          >
            {joined ? "JOINED ✓" : "JOIN ZONE"}
          </button>
        </div>
      </div>
    </div>
  );
}

function MomentCard({ moment }: { moment: typeof MOMENTS[0] }) {
  const [liked, setLiked] = useState(false);
  return (
    <div style={{
      background: "#FFF", borderRadius: 4, padding: "8px 8px 24px",
      boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
      transform: `rotate(${moment.rot}deg)`,
      transformOrigin: "center center",
      position: "relative", breakInside: "avoid", marginBottom: 16,
    }}>
      <div style={{ width: "100%", paddingTop: "100%", borderRadius: 2, background: moment.grad }} />
      <div style={{ marginTop: 6, padding: "0 2px" }}>
        <p style={{ fontFamily: "var(--font-caveat)", fontSize: 13, color: "#333", lineHeight: 1.35, marginBottom: 4 }}>
          {moment.caption}
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 9, color: "#bbb", fontFamily: "var(--font-jost)" }}>{moment.author}</span>
          <button onClick={() => setLiked(l => !l)} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 2, padding: 0 }}>
            <span style={{ fontSize: 12, color: liked ? PINK : "#ccc" }}>{liked ? "♥" : "♡"}</span>
            <span style={{ fontSize: 9, color: liked ? PINK : "#ccc", fontWeight: 700 }}>{moment.likes + (liked ? 1 : 0)}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export function LoungePage({ user }: { user?: LoungeUser }) {
  const displayInitial = (user?.name?.[0] ?? "M").toUpperCase();
  const totalWomen = 87;

  return (
    <div style={{ minHeight: "100vh", background: DARK, paddingBottom: 100 }}>
      <style>{`
        @keyframes heartbeat {
          0%,100% { transform: scale(1); }
          14% { transform: scale(1.08); }
          28% { transform: scale(0.97); }
          42% { transform: scale(1.04); }
        }
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(12px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .z-section { animation: fadeSlideUp 0.26s ease-out; }
      `}</style>

      {/* ── Dark cover ── */}
      <div style={{
        background: "linear-gradient(180deg,#0D0811 0%,#1C0914 100%)",
        paddingTop: "env(safe-area-inset-top,48px)",
        paddingBottom: 24, position: "relative", overflow: "hidden",
      }}>
        {/* Ambient glows */}
        <div style={{ position:"absolute", top:-60, right:-60, width:300, height:300, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,31,125,0.18) 0%,transparent 70%)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:200, height:200, borderRadius:"50%", background:"radial-gradient(circle,rgba(192,132,252,0.12) 0%,transparent 70%)", pointerEvents:"none" }} />

        {/* Top bar */}
        <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"12px 20px 0" }}>
          <Link href="/member/home" style={{ textDecoration:"none" }}>
            <span style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:900, fontSize:16, color:PINK }}>BB*</span>
          </Link>
          <div style={{
            width:36, height:36, borderRadius:"50%",
            background:`linear-gradient(135deg,${PINK} 0%,#FF69B4 100%)`,
            boxShadow:`0 0 0 2px rgba(255,31,125,0.3),0 4px 12px rgba(255,31,125,0.35)`,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:13, fontWeight:700, color:"white",
            fontFamily:"var(--font-playfair)", fontStyle:"italic",
          }}>
            {displayInitial}
          </div>
        </div>

        {/* Hero */}
        <div style={{ padding:"20px 20px 0" }}>
          <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.28em", textTransform:"uppercase", color:"rgba(255,31,125,0.7)", fontFamily:"var(--font-jost)", marginBottom:6 }}>
            ✦ NYC GIRLS ZONE
          </p>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:"clamp(38px,10vw,52px)", color:"rgba(255,240,220,0.94)", lineHeight:0.92, letterSpacing:"-0.02em", marginBottom:0 }}>
            The city
          </h1>
          <h1 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:"clamp(38px,10vw,52px)", color:PINK, lineHeight:0.92, letterSpacing:"-0.02em", marginBottom:14 }}>
            is yours.
          </h1>
        </div>

        {/* Stats bar */}
        <div style={{
          margin:"16px 20px 0", padding:"14px 16px", borderRadius:12,
          background:"rgba(255,255,255,0.06)", border:"1px solid rgba(255,255,255,0.1)",
          display:"flex", alignItems:"center", justifyContent:"space-between",
        }}>
          {[
            { val: totalWomen, label: "Out tonight",   pink: true  },
            { val: 6,          label: "Zones active",  pink: false },
            { val: 4,          label: "Events now",    pink: false },
          ].map((stat, i) => (
            <div key={i} style={{ textAlign:"center", flex:1 }}>
              {i > 0 && <div style={{ position:"absolute", width:0 }} />}
              <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:26, color: stat.pink ? PINK : "rgba(255,255,255,0.85)", lineHeight:1 }}>
                {stat.val}
              </p>
              <p style={{ fontSize:8, color:"rgba(255,255,255,0.35)", fontFamily:"var(--font-jost)", letterSpacing:"0.12em", textTransform:"uppercase", marginTop:2 }}>
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        {/* Heartbeat avatars */}
        <div style={{ padding:"14px 20px 0", display:"flex", alignItems:"center", gap:8 }}>
          <div style={{ display:"flex" }}>
            {LIVE_AVATARS.map((a, i) => (
              <div key={i} style={{
                width:28, height:28, borderRadius:"50%",
                background:`linear-gradient(135deg,${a.c} 0%,${a.c}99 100%)`,
                border:"2px solid rgba(255,255,255,0.15)",
                marginLeft: i > 0 ? -8 : 0,
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:10, fontWeight:900, color:"white", flexShrink:0,
                animation:`heartbeat ${1.2 + i * 0.15}s ease-in-out infinite`,
              }}>
                {a.i}
              </div>
            ))}
          </div>
          <span style={{ fontSize:10, fontWeight:700, color:"rgba(255,255,255,0.5)", fontFamily:"var(--font-jost)", letterSpacing:"0.04em" }}>
            +{totalWomen - LIVE_AVATARS.length} active
          </span>
          <span style={{ width:6, height:6, borderRadius:"50%", background:PINK, boxShadow:`0 0 6px ${PINK}`, display:"inline-block", animation:"heartbeat 1s ease-in-out infinite" }} />
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ background:CREAM, backgroundImage:PAPER_TEX, minHeight:"100vh", padding:"24px 0 40px" }}>

        {/* Our Zones */}
        <div className="z-section" style={{ marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"0 20px", marginBottom:14 }}>
            <div>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(0,0,0,0.3)", fontFamily:"var(--font-jost)", marginBottom:2 }}>✦ OUR ZONES</p>
              <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:20, color:DARK, lineHeight:1.1 }}>Where girls are tonight.</p>
            </div>
            <button style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:PINK, background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-jost)" }}>
              MAP VIEW →
            </button>
          </div>
          <div style={{ display:"flex", gap:16, overflowX:"auto", paddingLeft:20, paddingRight:20, paddingBottom:12, scrollbarWidth:"none" }}>
            {ZONES.map(zone => <ZoneCard key={zone.id} zone={zone} />)}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="z-section" style={{ padding:"0 20px", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(0,0,0,0.3)", fontFamily:"var(--font-jost)", marginBottom:2 }}>✦ UPCOMING</p>
              <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:20, color:DARK, lineHeight:1.1 }}>{"Don't miss these."}</p>
            </div>
            <Link href="/member/happenings" style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:PINK, textDecoration:"none", fontFamily:"var(--font-jost)" }}>
              SEE ALL →
            </Link>
          </div>
          <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
            {UPCOMING.map((ev, i) => (
              <div key={ev.id} style={{
                background: i === 0 ? DARK : "white",
                borderRadius:14, padding:"14px 16px",
                display:"flex", alignItems:"center", gap:12,
                boxShadow: i === 0 ? "0 8px 24px rgba(0,0,0,0.2)" : "0 2px 10px rgba(0,0,0,0.06)",
                border: i === 0 ? "1px solid rgba(255,31,125,0.2)" : "1px solid rgba(0,0,0,0.05)",
              }}>
                <div style={{ width:42, height:42, borderRadius:10, background:`${ev.color}22`, border:`1.5px solid ${ev.color}44`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                  <div style={{ width:10, height:10, borderRadius:"50%", background:ev.color, boxShadow: i === 0 ? `0 0 8px ${ev.color}` : "none" }} />
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <p style={{ fontWeight:700, fontSize:13, color: i === 0 ? "rgba(255,255,255,0.9)" : DARK, fontFamily:"var(--font-jost)", lineHeight:1.2, marginBottom:2, whiteSpace:"nowrap", overflow:"hidden", textOverflow:"ellipsis" }}>
                    {ev.name}
                  </p>
                  <p style={{ fontSize:10, color: i === 0 ? "rgba(255,255,255,0.4)" : "#aaa", fontFamily:"var(--font-jost)" }}>
                    {ev.loc}
                  </p>
                </div>
                <div style={{ textAlign:"right", flexShrink:0 }}>
                  <p style={{ fontSize:9, fontWeight:700, color: i === 0 ? PINK : "#888", fontFamily:"var(--font-jost)", letterSpacing:"0.05em", textTransform:"uppercase", marginBottom:2 }}>
                    {ev.time.split("·")[0].trim()}
                  </p>
                  <div style={{ display:"flex", alignItems:"center", justifyContent:"flex-end", gap:2 }}>
                    <div style={{ display:"flex" }}>
                      {Array.from({ length: Math.min(3, ev.attendees) }).map((_, j) => (
                        <div key={j} style={{ width:14, height:14, borderRadius:"50%", background:AV_COLORS[j % AV_COLORS.length], border:`1.5px solid ${i === 0 ? DARK : "white"}`, marginLeft: j > 0 ? -5 : 0 }} />
                      ))}
                    </div>
                    <span style={{ fontSize:8, color: i === 0 ? "rgba(255,255,255,0.3)" : "#ccc", fontFamily:"var(--font-jost)" }}>+{ev.attendees}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Moments Grid */}
        <div className="z-section" style={{ padding:"0 20px", marginBottom:32 }}>
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:14 }}>
            <div>
              <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(0,0,0,0.3)", fontFamily:"var(--font-jost)", marginBottom:2 }}>✦ MOMENTS</p>
              <p style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:20, color:DARK, lineHeight:1.1 }}>From the community.</p>
            </div>
            <button style={{ fontSize:9, fontWeight:700, letterSpacing:"0.12em", textTransform:"uppercase", color:PINK, background:"none", border:"none", cursor:"pointer", fontFamily:"var(--font-jost)" }}>
              ADD YOURS →
            </button>
          </div>
          <div style={{ columns:2, gap:12 }}>
            {MOMENTS.map(moment => <MomentCard key={moment.id} moment={moment} />)}
          </div>
        </div>

        {/* CTA */}
        <div className="z-section" style={{ padding:"0 20px" }}>
          <div style={{ borderRadius:16, background:"linear-gradient(135deg,#0D0811 0%,#1C0914 100%)", padding:"24px 20px", position:"relative", overflow:"hidden" }}>
            <div style={{ position:"absolute", top:-30, right:-30, width:160, height:160, borderRadius:"50%", background:"radial-gradient(circle,rgba(255,31,125,0.2) 0%,transparent 70%)", pointerEvents:"none" }} />
            <p style={{ fontSize:9, fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:"rgba(255,31,125,0.6)", fontFamily:"var(--font-jost)", marginBottom:6 }}>
              ✦ THIS IS YOUR CITY
            </p>
            <h2 style={{ fontFamily:"var(--font-playfair)", fontStyle:"italic", fontWeight:700, fontSize:26, color:"rgba(255,240,220,0.9)", lineHeight:1.15, marginBottom:6 }}>
              {totalWomen} women are<br />out in NYC right now.
            </h2>
            <p style={{ fontSize:12, color:"rgba(255,255,255,0.35)", fontFamily:"var(--font-jost)", lineHeight:1.55, marginBottom:16 }}>
              Join a zone. Show up to something. Make the city yours.
            </p>
            <Link href="/member/happenings" style={{
              display:"inline-flex", alignItems:"center", gap:8,
              padding:"12px 20px", borderRadius:8, background:PINK,
              color:"white", fontSize:11, fontWeight:700,
              letterSpacing:"0.1em", textTransform:"uppercase", textDecoration:"none",
              fontFamily:"var(--font-jost)", boxShadow:`0 8px 24px rgba(255,31,125,0.4)`,
            }}>
              {"SEE WHAT'S HAPPENING →"}
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}
