import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us — BloomBay",
  description: "Get in touch with the BloomBay team.",
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
