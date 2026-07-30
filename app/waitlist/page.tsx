import type { Metadata } from "next";
import { WaitlistFlow } from "../components/portal/waitlist-flow";

export const metadata: Metadata = {
  title: "Join the Waitlist — BloomBay",
  description:
    "Join the BloomBay waitlist — a social world for women in New York City. Friends, clubs, gatherings, and real-life connection.",
};

export default function WaitlistPage() {
  return <WaitlistFlow />;
}
