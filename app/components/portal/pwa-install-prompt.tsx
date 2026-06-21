"use client";
import { useEffect, useState } from "react";

const PINK = "#FF1F7D";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Don't show if already installed
    if (window.matchMedia("(display-mode: standalone)").matches) return;
    if (localStorage.getItem("bb-pwa-dismissed")) return;

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShow(true);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  async function install() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") setShow(false);
    setDeferredPrompt(null);
  }

  function dismiss() {
    setShow(false);
    localStorage.setItem("bb-pwa-dismissed", "1");
  }

  if (!show) return null;

  return (
    <div style={{
      position: "fixed",
      bottom: 88,
      left: 16,
      right: 16,
      zIndex: 100,
      background: "var(--bb-card)",
      borderRadius: 20,
      padding: "16px 18px",
      boxShadow: "0 8px 32px rgba(0,0,0,0.15)",
      border: `1px solid rgba(255,31,125,0.2)`,
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 12, background: PINK, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        <span style={{ fontSize: 22 }}>🌸</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 13, color: "var(--bb-text)", margin: 0 }}>Add BloomBay to your home screen</p>
        <p style={{ fontFamily: "var(--font-jost)", fontSize: 11, color: "var(--bb-text-2)", margin: "2px 0 0" }}>Always one tap away.</p>
      </div>
      <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
        <button onClick={dismiss} style={{ background: "none", border: "none", cursor: "pointer", padding: 6, color: "var(--bb-text-3)", fontSize: 18, lineHeight: 1 }}>×</button>
        <button onClick={install} style={{ background: PINK, border: "none", borderRadius: 10, padding: "8px 14px", fontFamily: "var(--font-jost)", fontWeight: 700, fontSize: 12, color: "white", cursor: "pointer" }}>
          Add
        </button>
      </div>
    </div>
  );
}
