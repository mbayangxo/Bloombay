import type { Metadata } from "next";
import { MemberPortalProviders } from "./components/member-portal-providers";
import "@/app/styles/member-bundle.css";

export const metadata: Metadata = {
  title: "BloomBay — Member",
  description: "Member portal for women — clubs, open seats, and gatherings.",
};

export default function MemberLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MemberPortalProviders>
      <div style={{ fontFamily: "var(--font-ui), system-ui, sans-serif" }}>{children}</div>
    </MemberPortalProviders>
  );
}
