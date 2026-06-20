/** Intros hub — girl mates (roommate matching) & bloom requests (demo seed). */

export type GirlMateRequest = {
  id: string;
  fromName: string;
  fromInitial: string;
  city: string;
  neighborhood: string;
  budget: string;
  moveIn: string;
  note: string;
  status: "pending" | "accepted" | "declined";
  direction: "incoming" | "outgoing";
};

export type BloomRequestPreview = {
  id: string;
  fromName: string;
  fromInitial: string;
  context: string;
  note: string;
  href: string;
  status: "pending" | "accepted" | "declined";
  direction: "incoming" | "outgoing";
};

export const INCOMING_GIRL_MATE_REQUESTS: GirlMateRequest[] = [
  {
    id: "gm1",
    fromName: "Priya",
    fromInitial: "P",
    city: "New York",
    neighborhood: "Williamsburg",
    budget: "$1,400–1,600",
    moveIn: "July 1",
    note: "Looking for a clean, social roommate near the L train. Non-smoker.",
    status: "pending",
    direction: "incoming",
  },
  {
    id: "gm2",
    fromName: "Jordan",
    fromInitial: "J",
    city: "New York",
    neighborhood: "Harlem",
    budget: "$1,200",
    moveIn: "ASAP",
    note: "2BR with sunny room · quiet on weeknights",
    status: "pending",
    direction: "incoming",
  },
];

export const OUTGOING_GIRL_MATE_REQUESTS: GirlMateRequest[] = [
  {
    id: "gm-out1",
    fromName: "You → Simone",
    fromInitial: "S",
    city: "New York",
    neighborhood: "West Village",
    budget: "$1,800 split",
    moveIn: "August",
    note: "Sent after Girl mate room post",
    status: "pending",
    direction: "outgoing",
  },
];

export const BLOOM_REQUEST_PREVIEWS: BloomRequestPreview[] = [
  {
    id: "br1",
    fromName: "Amanda",
    fromInitial: "A",
    context: "Morning Run Club · Hoboken",
    note: "Would love to grab coffee after our next run!",
    href: "/member/bloom-request?id=br1",
    status: "pending",
    direction: "incoming",
  },
  {
    id: "br2",
    fromName: "Lexi",
    fromInitial: "L",
    context: "Mutual Bloomies · 2 friends",
    note: "Saw you at rooftop dinner — want to bloom?",
    href: "/member/bloom-request?id=br2",
    status: "pending",
    direction: "incoming",
  },
];
