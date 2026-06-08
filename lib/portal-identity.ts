import { COMPANY_LOGIN, MEMBER_LOGIN } from "@/lib/auth/roles";

/** BloomBay — separate portal apps, one company sign-in. */

export const PORTALS = {
  member: {
    name: "Member",
    login: MEMBER_LOGIN,
    home: "/member/home",
    tagline: "Women meeting women — clubs, open seats, gatherings.",
    who: "Women in the community",
    notFor: "Hosts, venues, or BloomBay staff",
  },
  clubhouse: {
    name: "Club Mama",
    login: COMPANY_LOGIN,
    home: "/club-owner/dashboard",
    tagline: "Customize your club, set house rules, run women & gatherings.",
    who: "Club Mamas & hosts",
    notFor: "Venues/partners (use /partner/login)",
  },
  partner: {
    name: "Partner",
    login: COMPANY_LOGIN,
    home: "/partner",
    tagline: "Your venue — bookings, hosted events, revenue.",
    who: "Restaurants, salons, studios, and venues",
    notFor: "Club hosts (use /club-owner/login)",
  },
  founder: {
    name: "Founder",
    login: COMPANY_LOGIN,
    home: "/founder/dashboard",
    tagline: "Own BloomBay — launch, pay curators, Yande, markets.",
    who: "Founding team only",
    notFor: "Admins, moderators, members, hosts, partners",
  },
  admin: {
    name: "Operations",
    login: COMPANY_LOGIN,
    home: "/admin/dashboard",
    tagline: "Run the platform — or curate in the field. Same login for admins, moderators, and curators.",
    who: "Admins, moderators, and curators",
    notFor: "Founders (use /founder/login), members, hosts, partners",
  },
  curator: {
    name: "Curator",
    login: COMPANY_LOGIN,
    home: "/curator/dashboard",
    tagline: "Culture in the field — gatherings, recruit women, welcome members.",
    who: "Girl curators assigned by founders",
    notFor: "Not a club host or venue partner",
  },
} as const;
