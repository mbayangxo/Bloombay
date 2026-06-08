import { PortalScrollUnlock } from "@/app/components/portal/portal-scroll-unlock";
import "@/app/styles/portal-scroll.css";

export default function MemberLoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div data-bb-member-portal>
      <PortalScrollUnlock />
      {children}
    </div>
  );
}
