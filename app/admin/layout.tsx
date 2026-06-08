export const metadata = {
  title: "BloomBay Operations",
  robots: { index: false, follow: false },
};

/** Login stays light — Mission Control CSS loads only under (founder)/ */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
