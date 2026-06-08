"use client";

import { useState } from "react";
import { logout } from "@/lib/auth/actions";
import { AvatarUpload } from "@/app/components/shared/avatar-upload";
import type { AuthUser } from "@/lib/auth/get-user";

const PINK = "#FF1F7D";

export function ProfilePage({ user }: { user: AuthUser }) {
  const initials = (user.first_name?.[0] ?? user.email?.[0] ?? "?").toUpperCase();
  const displayName = user.first_name ?? user.email?.split("@")[0] ?? "there";
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user.avatar_url ?? null);

  return (
    <div style={{ background: "#F6F1EB", minHeight: "100vh", paddingBottom: 104 }}>

      {/* Header strip */}
      <div style={{ background: "#111111", padding: "44px 20px 28px" }}>
        <p style={{ fontSize: "7px", fontWeight: 800, letterSpacing: "0.22em", color: PINK, marginBottom: 16 }}>YOUR PROFILE</p>

        <div style={{ display: "flex", alignItems: "flex-end", gap: 16 }}>
          <AvatarUpload
            userId={user.id}
            currentUrl={avatarUrl}
            initials={initials}
            size={84}
            onUpdate={setAvatarUrl}
          />
          <div style={{ flex: 1, minWidth: 0, paddingBottom: 4 }}>
            <p style={{ fontFamily: "var(--font-playfair)", fontSize: 24, fontWeight: 900, fontStyle: "italic", color: "white", lineHeight: 1 }}>
              {displayName}
            </p>
            {user.neighborhood && (
              <p style={{ fontSize: "11px", color: "rgba(255,255,255,0.45)", marginTop: 4 }}>
                {user.neighborhood}{user.borough ? ` · ${user.borough}` : ""}
              </p>
            )}
            <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em", color: PINK, marginTop: 6 }}>
              {user.bloom_points ?? 0} BLOOM POINTS
            </p>
          </div>
        </div>
      </div>

      <div style={{ padding: "20px 20px 0" }}>

        {/* Bio */}
        {user.bio && (
          <div style={{ marginBottom: 16, padding: "16px", background: "white", borderRadius: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 6 }}>BIO</p>
            <p style={{ fontSize: 13, color: "#444", lineHeight: 1.55, fontStyle: "italic", fontFamily: "var(--font-instrument)" }}>
              {user.bio}
            </p>
          </div>
        )}

        {/* Interests */}
        {user.interests && user.interests.length > 0 && (
          <div style={{ marginBottom: 16, padding: "16px", background: "white", borderRadius: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
            <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 10 }}>INTERESTS</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {user.interests.map((tag) => (
                <span key={tag} style={{ fontSize: "10px", fontWeight: 700, padding: "4px 10px", borderRadius: 999, background: "rgba(255,31,125,0.08)", color: PINK }}>
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Account info */}
        <div style={{ marginBottom: 16, padding: "16px", background: "white", borderRadius: 18, boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}>
          <p style={{ fontSize: "8px", fontWeight: 800, letterSpacing: "0.2em", color: PINK, marginBottom: 12 }}>ACCOUNT</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Row label="Email" value={user.email} />
            <Row label="Role" value={user.role} />
            <Row label="Verification" value={user.verification_status ?? "unverified"} highlight={user.verification_status === "verified"} />
            {user.age && <Row label="Age" value={String(user.age)} />}
          </div>
        </div>

        {/* Photo tip */}
        <div style={{ marginBottom: 16, padding: "14px 16px", background: "rgba(255,31,125,0.06)", borderRadius: 16, border: "1px solid rgba(255,31,125,0.1)" }}>
          <p style={{ fontSize: "11px", color: "#888", lineHeight: 1.5 }}>
            <span style={{ fontWeight: 700, color: PINK }}>Tap your photo above</span> to change it.
            Your photo appears on club member lists and at gatherings.
          </p>
        </div>

        {/* Sign out */}
        <form action={logout}>
          <button
            type="submit"
            style={{ width: "100%", padding: "14px", borderRadius: 14, border: "none", background: "white", fontSize: "12px", fontWeight: 700, letterSpacing: "0.08em", color: "#888", cursor: "pointer", boxShadow: "0 1px 8px rgba(0,0,0,0.05)" }}
          >
            Sign out
          </button>
        </form>
      </div>
    </div>
  );
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
      <p style={{ fontSize: "11px", color: "#bbb", fontWeight: 600 }}>{label}</p>
      <p style={{ fontSize: "11px", fontWeight: 700, color: highlight ? PINK : "#444" }}>{value}</p>
    </div>
  );
}
