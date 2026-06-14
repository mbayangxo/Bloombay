import { getAuthUser } from "@/lib/auth/get-user";
import Link from "next/link";

export const metadata = { title: "Welcome — BloomBay" };

export default async function LobbyPage({
  searchParams,
}: {
  searchParams: Promise<{ membership?: string }>;
}) {
  const authUser = await getAuthUser();
  const firstName =
    authUser?.first_name ?? authUser?.full_name?.split(" ")[0] ?? "Bloomie";
  const { membership } = await searchParams;
  const isSuccess = membership === "success";

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(160deg, #FFF5F8 0%, #F8F0FF 60%, #FFF0F5 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      {/* Success banner */}
      {isSuccess && (
        <div
          style={{
            width: "100%",
            background:
              "linear-gradient(90deg, #FF1F7D 0%, #c4136a 50%, #FF1F7D 100%)",
            boxShadow: "0 0 32px 0 rgba(255,31,125,0.35)",
            padding: "13px 24px",
            textAlign: "center",
            color: "#fff",
            fontFamily: "var(--font-jost), sans-serif",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "0.08em",
          }}
        >
          ✦ Membership confirmed — welcome home ✦
        </div>
      )}

      {/* Page content */}
      <div
        style={{
          width: "100%",
          maxWidth: "480px",
          padding: "48px 24px 100px",
          display: "flex",
          flexDirection: "column",
          gap: "40px",
        }}
      >
        {/* Hero */}
        <section style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <h1
            style={{
              fontFamily: "var(--font-fraunces), serif",
              fontStyle: "italic",
              fontWeight: 700,
              fontSize: "clamp(32px, 8vw, 44px)",
              lineHeight: 1.15,
              color: "#1A0A2E",
              margin: 0,
            }}
          >
            {firstName}, your table is here.
          </h1>
          <p
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: "16px",
              color: "#5a4870",
              margin: 0,
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            The Avenue is open. Women are gathering.
          </p>
        </section>

        {/* 2×2 Feature grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "14px",
          }}
        >
          {/* The Avenue */}
          <Link
            href="/member/avenue"
            style={{
              textDecoration: "none",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #FF1F7D 0%, #c4136a 100%)",
              padding: "24px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              boxShadow: "0 4px 20px rgba(255,31,125,0.22)",
              transition: "transform 0.15s ease, box-shadow 0.15s ease",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "20px",
                color: "#fff",
              }}
            >
              The Avenue
            </span>
            <span
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.8)",
                fontWeight: 500,
              }}
            >
              Your social feed
            </span>
          </Link>

          {/* Happenings */}
          <Link
            href="/member/happenings"
            style={{
              textDecoration: "none",
              borderRadius: "18px",
              background: "#1A0A2E",
              padding: "24px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              boxShadow: "0 4px 20px rgba(26,10,46,0.18)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "20px",
                color: "#fff",
              }}
            >
              Happenings
            </span>
            <span
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: "12px",
                color: "rgba(255,255,255,0.65)",
                fontWeight: 500,
              }}
            >
              Events in your city
            </span>
          </Link>

          {/* The Hanger */}
          <Link
            href="/member/hanger"
            style={{
              textDecoration: "none",
              borderRadius: "18px",
              background: "#FDF6EE",
              border: "1.5px solid #e8ddd3",
              padding: "24px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              boxShadow: "0 2px 12px rgba(180,140,100,0.08)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "20px",
                color: "#1A0A2E",
              }}
            >
              The Hanger
            </span>
            <span
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: "12px",
                color: "#7a6a5a",
                fontWeight: 500,
              }}
            >
              Women&apos;s fashion market
            </span>
          </Link>

          {/* Your Clubs */}
          <Link
            href="/member/clubs"
            style={{
              textDecoration: "none",
              borderRadius: "18px",
              background: "linear-gradient(135deg, #F3EAFF 0%, #EAD9FF 100%)",
              border: "1.5px solid #d9c4f5",
              padding: "24px 18px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              boxShadow: "0 2px 14px rgba(148,80,220,0.10)",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-fraunces), serif",
                fontStyle: "italic",
                fontWeight: 700,
                fontSize: "20px",
                color: "#1A0A2E",
              }}
            >
              Your Clubs
            </span>
            <span
              style={{
                fontFamily: "var(--font-jost), sans-serif",
                fontSize: "12px",
                color: "#6b4fa0",
                fontWeight: 500,
              }}
            >
              Find your circle
            </span>
          </Link>
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center" }}>
          <Link
            href="/member/profile"
            style={{
              fontFamily: "var(--font-jost), sans-serif",
              fontSize: "15px",
              fontWeight: 600,
              color: "#FF1F7D",
              textDecoration: "none",
              letterSpacing: "0.01em",
              borderBottom: "1.5px solid rgba(255,31,125,0.3)",
              paddingBottom: "2px",
            }}
          >
            Set up your profile →
          </Link>
        </div>
      </div>
    </div>
  );
}
