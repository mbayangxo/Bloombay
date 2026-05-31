import { BottomNav } from "../components/portal/bottom-nav";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative max-w-[430px] mx-auto min-h-screen">
      {children}
      <BottomNav />
    </div>
  );
}
