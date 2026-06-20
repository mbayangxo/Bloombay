"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { label: "Home", href: "/member/home" },
  { label: "Clubs", href: "/member/clubs" },
  { label: "Moments", href: "/member/moments" },
  { label: "Profile", href: "/member/profile" },
];

export function CollapsibleNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Expanded horizontal header */}
      <AnimatePresence>
        {open && (
          <motion.div
            style={s.drawer}
            initial={{ opacity: 0, y: -64 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -64 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div style={s.drawerLogo}>
              <span style={s.logoBlack}>bloom</span><span style={s.logoPink}>bay</span>
              <span style={s.logoMark}>✦</span>
            </div>
            <nav style={s.drawerNav}>
              {NAV_ITEMS.map((item) => {
                const active = pathname.startsWith(item.href);
                return (
                  <a key={item.href} href={item.href} style={active ? s.drawerLinkActive : s.drawerLink}>
                    {item.label}
                    {active && <div style={s.activePip} />}
                  </a>
                );
              })}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button — upper right, always visible */}
      <button
        style={{ ...s.toggleBtn, ...(open ? s.toggleBtnOpen : {}) }}
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="close" style={s.toggleIcon}
              initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
              ✕
            </motion.span>
          ) : (
            <motion.span key="open" style={s.toggleIcon}
              initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
              ✦
            </motion.span>
          )}
        </AnimatePresence>
      </button>
    </>
  );
}

const s: Record<string, React.CSSProperties> = {
  drawer: {
    position: "fixed",
    top: 0, left: 0, right: 0,
    zIndex: 90,
    background: "#ffffff",
    borderBottom: "2px solid #ff0055",
    padding: "20px 28px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "32px",
    boxShadow: "0 8px 40px rgba(255,0,85,0.1)",
  },
  drawerLogo: {
    display: "flex", alignItems: "center", gap: "2px",
    flexShrink: 0,
  },
  logoBlack: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "18px", fontWeight: 700,
    color: "#0a0a0a", letterSpacing: "-0.03em",
  },
  logoPink: {
    fontFamily: "var(--font-unbounded), sans-serif",
    fontSize: "18px", fontWeight: 700,
    color: "#ff0055", letterSpacing: "-0.03em",
  },
  logoMark: {
    color: "#FF69B4", fontSize: "14px", marginLeft: "4px",
  },
  drawerNav: {
    display: "flex", alignItems: "center", gap: "8px",
    flex: 1, justifyContent: "center",
    overflowX: "auto" as const,
  },
  drawerLink: {
    position: "relative",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "15px", fontWeight: 500,
    color: "rgba(10,10,10,0.45)",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "100px",
    whiteSpace: "nowrap" as const,
    transition: "color 0.18s, background 0.18s",
    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
  },
  drawerLinkActive: {
    position: "relative",
    fontFamily: "var(--font-outfit), sans-serif",
    fontSize: "15px", fontWeight: 700,
    color: "#ff0055",
    textDecoration: "none",
    padding: "10px 18px",
    borderRadius: "100px",
    background: "rgba(255,0,85,0.06)",
    whiteSpace: "nowrap" as const,
    display: "flex", flexDirection: "column", alignItems: "center", gap: "4px",
  },
  activePip: {
    width: "4px", height: "4px",
    borderRadius: "50%", background: "#ff0055",
  },
  toggleBtn: {
    position: "fixed",
    top: "16px", right: "20px",
    zIndex: 100,
    width: "48px", height: "48px",
    borderRadius: "50%",
    background: "#ffffff",
    border: "2px solid #FF69B4",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 20px rgba(255,0,85,0.15)",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  toggleBtnOpen: {
    borderColor: "#ff0055",
    boxShadow: "0 4px 20px rgba(255,0,85,0.25)",
  },
  toggleIcon: {
    display: "flex",
    fontSize: "18px",
    color: "#ff0055",
    fontWeight: 700,
    lineHeight: 1,
  },
};
