import Link from "next/link";
import { PINK } from "@/lib/happenings/constants";

export function CreateFAB() {
  return (
    <Link href="/member/host" style={{ textDecoration: "none" }}>
      <div style={{
        position: "fixed",
        bottom: "calc(env(safe-area-inset-bottom, 0px) + 155px)",
        right: 18,
        zIndex: 60,
        width: 52,
        height: 52,
        borderRadius: "50%",
        background: PINK,
        boxShadow: `0 4px 20px ${PINK}77, 0 2px 8px rgba(0,0,0,0.3)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        animation: "fabPop 3s ease-in-out infinite",
      }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </div>
    </Link>
  );
}
