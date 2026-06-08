/**
 * Founder Mission Control — assign moderators & girl curators, demo payouts.
 */

export type TeamRole = "moderator" | "girl_curator";
export type PaymentMethod = "venmo" | "zelle" | "paypal" | "direct_deposit" | "unspecified";

export type FounderTeamMember = {
  id: string;
  name: string;
  email: string;
  role: TeamRole;
  city: string;
  clubLabel: string;
  paymentMethod: PaymentMethod;
  paymentHandle: string;
  assignedAt: string;
  lastPaidAt?: string;
  notes?: string;
};

export type TeamPayout = {
  id: string;
  memberId: string;
  amount: number;
  method: PaymentMethod;
  note: string;
  paidAt: string;
};

const TEAM_KEY = "bb_founder_team";
const PAYOUTS_KEY = "bb_founder_team_payouts";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `ft-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const SEED: FounderTeamMember[] = [
  {
    id: "ft-curator-demo",
    name: "Amanda Williams",
    email: "curator@bloombay.app",
    role: "girl_curator",
    city: "Williamsburg",
    clubLabel: "Morning Run Club · Book & Wine",
    paymentMethod: "venmo",
    paymentHandle: "@amanda-curator-bb",
    assignedAt: new Date(Date.now() - 86400000 * 21).toISOString(),
  },
  {
    id: "ft-1",
    name: "Jordan T.",
    email: "jordan@example.com",
    role: "girl_curator",
    city: "NYC",
    clubLabel: "Founders Club · Williamsburg Dinner",
    paymentMethod: "venmo",
    paymentHandle: "@jordan-t-bb",
    assignedAt: new Date(Date.now() - 86400000 * 14).toISOString(),
  },
  {
    id: "ft-2",
    name: "Leila S.",
    email: "leila@example.com",
    role: "moderator",
    city: "NYC",
    clubLabel: "Book Club · all chapters",
    paymentMethod: "zelle",
    paymentHandle: "leila.s@email.com",
    assignedAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    lastPaidAt: new Date(Date.now() - 86400000 * 7).toISOString(),
  },
];

function readTeam(): FounderTeamMember[] {
  if (!canUseStorage()) return SEED;
  try {
    const raw = localStorage.getItem(TEAM_KEY);
    if (!raw) {
      localStorage.setItem(TEAM_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const list = JSON.parse(raw) as FounderTeamMember[];
    const demoCurator = SEED.find((m) => m.email === "curator@bloombay.app");
    if (demoCurator && !list.some((m) => m.email === demoCurator.email)) {
      list.unshift(demoCurator);
      writeTeam(list);
    }
    return list;
  } catch {
    return SEED;
  }
}

function writeTeam(list: FounderTeamMember[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(TEAM_KEY, JSON.stringify(list));
}

export function listFounderTeam(role?: TeamRole): FounderTeamMember[] {
  const list = readTeam();
  return role ? list.filter((m) => m.role === role) : list;
}

export function assignTeamMember(data: {
  name: string;
  email: string;
  role: TeamRole;
  city: string;
  clubLabel: string;
  paymentMethod: PaymentMethod;
  paymentHandle: string;
  notes?: string;
}): FounderTeamMember {
  const member: FounderTeamMember = {
    id: uid(),
    ...data,
    assignedAt: new Date().toISOString(),
  };
  const list = readTeam();
  list.unshift(member);
  writeTeam(list);
  return member;
}

export function updateTeamMember(
  id: string,
  patch: Partial<Pick<FounderTeamMember, "paymentMethod" | "paymentHandle" | "clubLabel" | "notes">>
) {
  const list = readTeam().map((m) => (m.id === id ? { ...m, ...patch } : m));
  writeTeam(list);
}

export function removeTeamMember(id: string) {
  writeTeam(readTeam().filter((m) => m.id !== id));
}

export function recordTeamPayout(memberId: string, amount: number, note: string): TeamPayout {
  const member = readTeam().find((m) => m.id === memberId);
  const payout: TeamPayout = {
    id: uid(),
    memberId,
    amount,
    method: member?.paymentMethod ?? "unspecified",
    note,
    paidAt: new Date().toISOString(),
  };
  if (canUseStorage()) {
    const raw = localStorage.getItem(PAYOUTS_KEY);
    const list = raw ? (JSON.parse(raw) as TeamPayout[]) : [];
    list.unshift(payout);
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(list.slice(0, 100)));
    const team = readTeam().map((m) =>
      m.id === memberId ? { ...m, lastPaidAt: payout.paidAt } : m
    );
    writeTeam(team);
    window.dispatchEvent(new CustomEvent("bb-team-payouts"));
  }
  return payout;
}

export function listTeamPayouts(): TeamPayout[] {
  if (!canUseStorage()) return [];
  try {
    const raw = localStorage.getItem(PAYOUTS_KEY);
    return raw ? (JSON.parse(raw) as TeamPayout[]) : [];
  } catch {
    return [];
  }
}

export function findTeamMemberByEmail(email: string): FounderTeamMember | undefined {
  const norm = email.trim().toLowerCase();
  return readTeam().find((m) => m.email.toLowerCase() === norm);
}

export function listPayoutsForMember(memberId: string): TeamPayout[] {
  return listTeamPayouts().filter((p) => p.memberId === memberId);
}
