/** Intros — who should I meet? */

export type ConnectIntent = {
  id: string;
  label: string;
  question: string;
  href: string;
  icon: string;
};

export const CONNECT_INTENTS: ConnectIntent[] = [
  {
    id: "brunch",
    label: "Brunch friend",
    question: "Looking for brunch this weekend",
    href: "/member/intros/bloom-requests",
    icon: "🥂",
  },
  {
    id: "travel",
    label: "Travel friend",
    question: "Trip buddy or travel tips",
    href: "/member/intros/bloom-requests",
    icon: "✈️",
  },
  {
    id: "roommate",
    label: "Roommate",
    question: "Girl mate · apartment & subleases",
    href: "/member/intros/girl-mates",
    icon: "🔑",
  },
  {
    id: "founder",
    label: "Founder friends",
    question: "Build & network with women founders",
    href: "/member/clubs/founders-in-the-making",
    icon: "💡",
  },
  {
    id: "moms",
    label: "Moms nearby",
    question: "Mothers in your neighborhood",
    href: "/member/intros/bloom-requests",
    icon: "🌸",
  },
];
