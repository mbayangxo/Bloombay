import type { AgentResult } from "./types";
import type { UserProfile } from "@/lib/types";

export interface PathStep {
  step: number;
  title: string;
  description: string;
  why: string;
  time_required: string;
  cost_estimate: string | null;
  opportunity_id: string | null;
  opportunity_title: string | null;
  opportunity_url: string | null;
  status: "not_started" | "in_progress" | "done";
  category: "registration" | "funding" | "training" | "compliance" | "market" | "export";
}

export interface OpportunityPath {
  goal: string;
  country: string;
  phases: {
    phase: string;
    label: string;
    steps: PathStep[];
  }[];
  total_time: string;
  summary: string;
}

export interface PathBuilderAgent {
  buildPath(params: {
    goal: string;
    user: Partial<UserProfile>;
    availableOpportunities?: { id: string; title: string; country: string; type: string; source_url: string }[];
  }): Promise<AgentResult<OpportunityPath>>;
}

// ── helpers ──────────────────────────────────────────────────────────────────

function matchOpp(
  title: string,
  availableOpps: { id: string; title: string; country: string; type: string; source_url: string }[]
): { id: string; title: string; url: string } | null {
  const needle = title.toLowerCase();
  const found = availableOpps.find((o) => o.title.toLowerCase().includes(needle) || needle.includes(o.title.toLowerCase()));
  if (!found) return null;
  return { id: found.id, title: found.title, url: found.source_url };
}

function withOpp(
  step: PathStep,
  availableOpps: { id: string; title: string; country: string; type: string; source_url: string }[]
): PathStep {
  if (step.opportunity_id) return step; // already has a linked opp
  const found = matchOpp(step.title, availableOpps);
  if (!found) return step;
  return {
    ...step,
    opportunity_id: found.id,
    opportunity_title: found.title,
    opportunity_url: found.url,
  };
}

// ── Nigeria ───────────────────────────────────────────────────────────────────

function getNigeriaSteps(
  sector: string,
  isRegistered: boolean,
  availableOpps: { id: string; title: string; country: string; type: string; source_url: string }[]
): PathStep[] {
  const steps: PathStep[] = [];

  // Foundation
  if (!isRegistered) {
    steps.push({
      step: 1,
      title: "Register with CAC",
      description:
        "Register your business with the Corporate Affairs Commission. You can do this online at cac.gov.ng or through a registered agent.",
      why: "All Nigerian funding programs require a CAC registration number",
      time_required: "2-5 business days",
      cost_estimate: "₦10,000-₦25,000",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://pre.cac.gov.ng",
      status: "not_started",
      category: "registration",
    });
  }

  steps.push({
    step: 2,
    title: "Open a dedicated business bank account",
    description:
      "Open a corporate bank account with any CBN-licensed bank using your CAC certificate and TIN. This is required for all grant disbursements.",
    why: "Funders disburse to a corporate account, not a personal one",
    time_required: "1-2 days",
    cost_estimate: "₦0-₦5,000 minimum deposit",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: null,
    status: "not_started",
    category: "registration",
  });

  steps.push({
    step: 3,
    title: "Obtain your Tax Identification Number (TIN)",
    description:
      "Register with the Federal Inland Revenue Service (FIRS) to obtain a TIN. This is mandatory for all government and most private funding programmes.",
    why: "TIN is required for all formal funding and government contract bids",
    time_required: "1-3 business days",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.firs.gov.ng",
    status: "not_started",
    category: "compliance",
  });

  // Sector-specific compliance
  if (sector === "beauty") {
    steps.push({
      step: 4,
      title: "Register products with NAFDAC",
      description:
        "Submit your beauty/cosmetic products for National Agency for Food and Drug Administration and Control (NAFDAC) registration. Required before sale or export.",
      why: "Selling unregistered cosmetics is illegal in Nigeria and blocks export deals",
      time_required: "4-12 weeks",
      cost_estimate: "₦50,000-₦200,000 depending on product range",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.nafdac.gov.ng",
      status: "not_started",
      category: "compliance",
    });
  }

  if (sector === "agriculture" || sector === "food") {
    steps.push({
      step: 4,
      title: "Register with NAFDAC (food products)",
      description:
        "Any processed food or agro-processed product must be registered with NAFDAC before sale or export.",
      why: "Buyers and supermarkets require NAFDAC numbers; export to EU/US requires it",
      time_required: "6-16 weeks",
      cost_estimate: "₦50,000-₦150,000",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.nafdac.gov.ng",
      status: "not_started",
      category: "compliance",
    });
  }

  if (sector === "tech") {
    steps.push({
      step: 4,
      title: "Register with NITDA",
      description:
        "Register your tech business with the National Information Technology Development Agency (NITDA) to access the Nigerian startup ecosystem and government digital contracts.",
      why: "NITDA registration is required for public sector tech contracts and the NITDA Startup Programme",
      time_required: "5-10 business days",
      cost_estimate: "₦15,000-₦50,000",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.nitda.gov.ng",
      status: "not_started",
      category: "compliance",
    });
  }

  if (sector === "health") {
    steps.push({
      step: 4,
      title: "Register with NAFDAC and relevant medical council",
      description:
        "Health businesses require NAFDAC registration for products, plus registration with the appropriate medical/pharmaceutical council (MDCN, PCN, or MLSCN) depending on your services.",
      why: "Operating a health facility or distributing medical products without regulatory clearance is a criminal offence",
      time_required: "8-24 weeks",
      cost_estimate: "₦100,000-₦500,000 depending on business type",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.nafdac.gov.ng",
      status: "not_started",
      category: "compliance",
    });
  }

  // Funding steps
  // TEF is always present
  const tefOppMatch = matchOpp("Tony Elumelu", availableOpps) || matchOpp("TEF", availableOpps);
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Tony Elumelu Foundation (TEF) Entrepreneurship Programme",
    description:
      "Apply to the TEF programme for $5,000 non-repayable seed capital + 12 weeks of business training + mentoring. Applications open annually, typically in January.",
    why: "TEF is Africa's largest SME grant programme and is open to all sectors across 54 African countries",
    time_required: "12-week programme after acceptance",
    cost_estimate: null,
    opportunity_id: tefOppMatch?.id ?? null,
    opportunity_title: tefOppMatch?.title ?? "Tony Elumelu Foundation Entrepreneurship Programme",
    opportunity_url: tefOppMatch?.url ?? "https://tefconnect.com",
    status: "not_started",
    category: "funding",
  });

  // NYIF is always present for Nigeria
  const nyifOppMatch = matchOpp("NYIF", availableOpps) || matchOpp("Nigeria Youth Investment", availableOpps);
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Nigeria Youth Investment Fund (NYIF)",
    description:
      "Apply to NYIF through NMFB for interest-free/low-interest loans of up to ₦25 million for Nigerian youth entrepreneurs aged 18-35.",
    why: "Government-backed low-cost capital specifically for Nigerian youth businesses",
    time_required: "4-8 weeks assessment",
    cost_estimate: null,
    opportunity_id: nyifOppMatch?.id ?? null,
    opportunity_title: nyifOppMatch?.title ?? "Nigeria Youth Investment Fund (NYIF)",
    opportunity_url: nyifOppMatch?.url ?? "https://nyif.nmfb.com.ng",
    status: "not_started",
    category: "funding",
  });

  // Sector-specific funding
  if (sector === "beauty" || sector === "fashion" || sector === "creative") {
    const cbnOppMatch = matchOpp("CBN Creative", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Apply for CBN Creative Industry Finance Initiative (CIFI)",
      description:
        "The CBN CIFI scheme provides single-digit interest rate loans to businesses in the creative sector including fashion, music, film, and beauty.",
      why: "One of the few government schemes with below-market interest rates specifically for creative businesses",
      time_required: "6-12 weeks",
      cost_estimate: null,
      opportunity_id: cbnOppMatch?.id ?? null,
      opportunity_title: cbnOppMatch?.title ?? "CBN Creative Industry Finance Initiative",
      opportunity_url: cbnOppMatch?.url ?? "https://www.cbn.gov.ng/devfin/cifi.asp",
      status: "not_started",
      category: "funding",
    });
  }

  if (sector === "tech") {
    const nitdaOppMatch = matchOpp("NITDA Startup", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Apply to the NITDA Startup Accelerator Programme",
      description:
        "NITDA runs structured accelerator cohorts for Nigerian tech startups with funding, mentorship, and market access to government digital projects.",
      why: "Access to government contracts and grant funding specifically for digital/tech SMEs",
      time_required: "3-6 month programme",
      cost_estimate: null,
      opportunity_id: nitdaOppMatch?.id ?? null,
      opportunity_title: nitdaOppMatch?.title ?? "NITDA Startup Accelerator Programme",
      opportunity_url: nitdaOppMatch?.url ?? "https://nitda.gov.ng/nss/startups",
      status: "not_started",
      category: "funding",
    });

    const googleOppMatch = matchOpp("Google for Startups", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Apply to Google for Startups Africa",
      description:
        "Google for Startups Africa provides up to $100,000 in Google Cloud credits, expert mentorship, and network access for African tech startups.",
      why: "Non-dilutive cloud infrastructure support that significantly reduces operational costs",
      time_required: "Rolling applications, 3-month programme",
      cost_estimate: null,
      opportunity_id: googleOppMatch?.id ?? null,
      opportunity_title: googleOppMatch?.title ?? "Google for Startups Africa",
      opportunity_url: googleOppMatch?.url ?? "https://startup.google.com/intl/en_ng/",
      status: "not_started",
      category: "funding",
    });
  }

  if (sector === "agriculture") {
    const agsmiesOppMatch = matchOpp("AGSMEIS", availableOpps) || matchOpp("CBN AGSMEIS", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Apply for CBN AGSMEIS Loan",
      description:
        "The CBN Agri-Business/Small and Medium Enterprise Investment Scheme (AGSMEIS) provides loans at 5% p.a. for agri-businesses and SMEs through NIRSAL Microfinance Bank.",
      why: "Single-digit interest rate agricultural financing — far cheaper than commercial bank rates",
      time_required: "6-10 weeks",
      cost_estimate: null,
      opportunity_id: agsmiesOppMatch?.id ?? null,
      opportunity_title: agsmiesOppMatch?.title ?? "CBN AGSMEIS Loan",
      opportunity_url: agsmiesOppMatch?.url ?? "https://www.cbn.gov.ng/devfin/AGSMEIS.asp",
      status: "not_started",
      category: "funding",
    });

    const nirsalOppMatch = matchOpp("NIRSAL", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Apply for NIRSAL Microfinance Bank SME loan",
      description:
        "NIRSAL Microfinance Bank offers working capital and asset acquisition loans for agriculture and food SMEs with flexible collateral requirements.",
      why: "More accessible collateral requirements than commercial banks, with CBN backing",
      time_required: "4-8 weeks",
      cost_estimate: null,
      opportunity_id: nirsalOppMatch?.id ?? null,
      opportunity_title: nirsalOppMatch?.title ?? "NIRSAL Microfinance Bank SME Loan",
      opportunity_url: nirsalOppMatch?.url ?? "https://www.nirsalmfb.com",
      status: "not_started",
      category: "funding",
    });
  }

  if (sector === "procurement") {
    const nexim = matchOpp("NEXIM", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Register on the Bureau of Public Procurement (BPP) supplier portal",
      description:
        "All federal government suppliers must register on the BPP portal to bid on government tenders and contracts.",
      why: "Without BPP registration you cannot legally receive federal government contracts",
      time_required: "5-10 business days",
      cost_estimate: "₦20,000-₦50,000 for agent fees",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.bpp.gov.ng",
      status: "not_started",
      category: "registration",
    });

    if (nexim) {
      steps.push({
        step: steps.length + 1,
        title: "Apply for NEXIM Bank Export Financing",
        description:
          "If your procurement work includes export contracts, NEXIM Bank provides pre and post-shipment financing, bonds, and guarantees.",
        why: "NEXIM financing gives you the working capital to fulfil large export contracts without tying up your own cash",
        time_required: "4-8 weeks",
        cost_estimate: null,
        opportunity_id: nexim.id,
        opportunity_title: nexim.title,
        opportunity_url: nexim.url,
        status: "not_started",
        category: "funding",
      });
    } else {
      steps.push({
        step: steps.length + 1,
        title: "Apply for NEXIM Bank Export Financing",
        description:
          "If your procurement work includes export contracts, NEXIM Bank provides pre and post-shipment financing, bonds, and guarantees.",
        why: "NEXIM financing gives you the working capital to fulfil large export contracts without tying up your own cash",
        time_required: "4-8 weeks",
        cost_estimate: null,
        opportunity_id: null,
        opportunity_title: null,
        opportunity_url: "https://www.neximbank.com.ng",
        status: "not_started",
        category: "funding",
      });
    }
  }

  // Growth / Market steps
  steps.push({
    step: steps.length + 1,
    title: "Join a sector-specific trade association in Nigeria",
    description:
      "Connect with the relevant industry association for your sector (e.g., MAN for manufacturers, LCCI or NACCIMA for commerce, NAFDAC-accredited associations for food/beauty). Associations provide advocacy, networking, and preferential access to government programmes.",
    why: "Industry associations give you peer mentoring, early access to tenders, and collective bargaining power",
    time_required: "1-4 weeks to join",
    cost_estimate: "₦10,000-₦50,000 annual membership",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: null,
    status: "not_started",
    category: "market",
  });

  if (sector === "export" || sector === "agriculture" || sector === "beauty" || sector === "fashion" || sector === "procurement") {
    const nepcopp = matchOpp("NEPC", availableOpps);
    steps.push({
      step: steps.length + 1,
      title: "Apply for NEPC Export Expansion Grant and incentives",
      description:
        "Register with the Nigerian Export Promotion Council (NEPC) to access the Export Expansion Grant (EEG), export development fund, and market development incentives.",
      why: "NEPC grants effectively subsidise your export operations and open doors to international buyer networks",
      time_required: "4-8 weeks registration + ongoing",
      cost_estimate: null,
      opportunity_id: nepcopp?.id ?? null,
      opportunity_title: nepcopp?.title ?? "NEPC Export Expansion Grant",
      opportunity_url: nepcopp?.url ?? "https://www.nepc.gov.ng",
      status: "not_started",
      category: "export",
    });
  }

  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

// ── Ghana ─────────────────────────────────────────────────────────────────────

function getGhanaSteps(sector: string, isRegistered: boolean): PathStep[] {
  const steps: PathStep[] = [];

  if (!isRegistered) {
    steps.push({
      step: 1,
      title: "Register your business with the Registrar General's Department (RGD)",
      description:
        "Register your business at the RGD — Ghana's sole business registration authority. You can complete this online via rgd.gov.gh or in person at any RGD office.",
      why: "RGD registration is the prerequisite for all Ghanaian grants, loans, and formal contracts",
      time_required: "1-3 business days",
      cost_estimate: "GHS 150-500 depending on business type",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://rgd.gov.gh",
      status: "not_started",
      category: "registration",
    });
  }

  steps.push({
    step: 2,
    title: "Obtain Ghana Revenue Authority Tax Identification Number",
    description:
      "Register with the Ghana Revenue Authority (GRA) to obtain your TIN. Required for bank accounts, grant applications, and public contracts.",
    why: "TIN is mandatory for all formal financial transactions in Ghana",
    time_required: "1-2 days",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.gra.gov.gh",
    status: "not_started",
    category: "compliance",
  });

  steps.push({
    step: 3,
    title: "Register with Ghana Investment Promotion Centre (GIPC)",
    description:
      "GIPC registration unlocks investment incentives including import duty exemptions, tax holidays, and repatriation rights for qualifying businesses.",
    why: "GIPC registration gives you access to Ghana's investment incentive framework and signals credibility to investors",
    time_required: "5-10 business days",
    cost_estimate: "USD 500-2,000 registration fee depending on investment class",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.gipcghana.com",
    status: "not_started",
    category: "compliance",
  });

  if (sector === "fashion") {
    steps.push({
      step: 4,
      title: "Register with the Ghana Free Zones Board (GFZB)",
      description:
        "Export-oriented fashion and textile businesses can register under the Free Zones scheme for zero corporate income tax for 10 years, duty-free imports, and streamlined export procedures.",
      why: "Free Zone status gives a massive cost advantage for export-focused fashion manufacturing",
      time_required: "2-4 weeks",
      cost_estimate: "USD 1,000-2,500",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.gfzb.com.gh",
      status: "not_started",
      category: "compliance",
    });
  }

  // GEA grants
  steps.push({
    step: steps.length + 1,
    title: "Apply for Ghana Enterprises Agency (GEA) Business Development Grant",
    description:
      "GEA (formerly NBSSI) provides matching grants, capacity building, and business advisory services to Ghanaian SMEs. Apply through any GEA district office or online.",
    why: "GEA grants are non-repayable and cover up to 50% of your business development costs",
    time_required: "4-8 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://gea.gov.gh",
    status: "not_started",
    category: "funding",
  });

  if (sector === "agriculture") {
    steps.push({
      step: steps.length + 1,
      title: "Access ADB Ghana (Agricultural Development Bank) agricultural loan",
      description:
        "ADB Ghana offers specialised agricultural value chain financing for farmers, agri-processors, and agribusinesses with competitive rates and longer repayment terms.",
      why: "ADB understands agricultural cycles and offers grace periods that commercial banks don't",
      time_required: "4-8 weeks",
      cost_estimate: null,
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.adbghana.com",
      status: "not_started",
      category: "funding",
    });
  }

  // TEF always included
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Tony Elumelu Foundation (TEF) Entrepreneurship Programme",
    description:
      "Apply to the TEF programme for $5,000 non-repayable seed capital + 12 weeks of training + mentoring. Open to all 54 African countries including Ghana.",
    why: "TEF is the largest pan-African entrepreneurship grant — high impact, no repayment required",
    time_required: "12-week programme after acceptance",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://tefconnect.com",
    status: "not_started",
    category: "funding",
  });

  steps.push({
    step: steps.length + 1,
    title: "Connect with Ghana's sector trade associations",
    description:
      "Join the Ghana Chamber of Commerce and Industry (GCCI) or a sector-specific body (e.g., Ghana Agri-Food and Beverage Manufacturers Association, Ghana Fashion Industry Association) to access networks, tenders, and market intelligence.",
    why: "Trade associations provide buyer introductions, early tender alerts, and collective advocacy",
    time_required: "1-2 weeks",
    cost_estimate: "GHS 500-2,000 annual membership",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.gcci.org.gh",
    status: "not_started",
    category: "market",
  });

  steps.push({
    step: steps.length + 1,
    title: "Register with Ghana Export Promotion Authority (GEPA) for export support",
    description:
      "GEPA provides export market development grants, trade fair participation support, and buyer matchmaking for Ghanaian exporters.",
    why: "GEPA subsidises your international market entry costs and connects you to verified foreign buyers",
    time_required: "2-4 weeks registration",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.gepaghana.org",
    status: "not_started",
    category: "export",
  });

  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

// ── Rwanda ────────────────────────────────────────────────────────────────────

function getRwandaSteps(sector: string, isRegistered: boolean): PathStep[] {
  const steps: PathStep[] = [];

  if (!isRegistered) {
    steps.push({
      step: 1,
      title: "Register your business at the RDB One-Stop Shop",
      description:
        "Rwanda Development Board (RDB) offers one of Africa's fastest business registration processes — complete online or in-person in as little as 6 hours. Registration is free.",
      why: "Rwanda's business registration is the gateway to all government and development finance support",
      time_required: "Same day to 1 business day",
      cost_estimate: null,
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://org.rdb.rw",
      status: "not_started",
      category: "registration",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Register with Rwanda Revenue Authority (RRA) for Tax ID",
    description:
      "Obtain your Taxpayer Identification Number from RRA. This is a prerequisite for bank account opening, supplier registration, and grant applications.",
    why: "All formal financial and procurement processes in Rwanda require a valid TIN",
    time_required: "1 day",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.rra.gov.rw",
    status: "not_started",
    category: "compliance",
  });

  steps.push({
    step: steps.length + 1,
    title: "Apply for BDF Loan Guarantee through Business Development Fund (BDF)",
    description:
      "BDF provides loan guarantees of up to 75% of your loan value to SMEs that lack sufficient collateral, making it easier to access commercial bank financing.",
    why: "Collateral is the biggest barrier to SME finance in Rwanda — BDF removes this barrier",
    time_required: "3-6 weeks",
    cost_estimate: "1-2% guarantee fee on guaranteed amount",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.bdf.rw",
    status: "not_started",
    category: "funding",
  });

  steps.push({
    step: steps.length + 1,
    title: "Apply for RDB Investment Incentives (7-year tax holiday)",
    description:
      "Qualifying businesses investing in priority sectors can access Rwanda's preferential investment regime: up to 7 years of corporate income tax exemption, custom duty waivers on capital goods, and VAT zero-rating on exports.",
    why: "A 7-year tax holiday dramatically improves your unit economics and signals Rwanda's commitment to your business",
    time_required: "4-8 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://rdb.rw/investment-incentives/",
    status: "not_started",
    category: "funding",
  });

  // TEF always included
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Tony Elumelu Foundation (TEF) Entrepreneurship Programme",
    description:
      "Apply to the TEF programme for $5,000 non-repayable seed capital + 12 weeks of business training + mentoring. Open to all 54 African countries including Rwanda.",
    why: "TEF is the largest pan-African entrepreneurship grant and accepts Rwandan entrepreneurs",
    time_required: "12-week programme after acceptance",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://tefconnect.com",
    status: "not_started",
    category: "funding",
  });

  if (sector === "tech") {
    steps.push({
      step: steps.length + 1,
      title: "Apply to the Rwanda Innovation Fund or kLab",
      description:
        "kLab is Rwanda's leading tech hub offering co-working, mentorship, investor access, and government contract connections for digital startups. The Rwanda Innovation Fund provides equity investment.",
      why: "Rwanda's tech ecosystem is one of Africa's fastest-growing — being inside the network accelerates everything",
      time_required: "2-4 weeks application",
      cost_estimate: null,
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://klab.rw",
      status: "not_started",
      category: "funding",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Connect with Rwanda's private sector federation (PSF)",
    description:
      "The Private Sector Federation (PSF) is Rwanda's apex business body. Membership gives access to government dialogue platforms, trade fairs, and B2B matchmaking with international buyers.",
    why: "PSF membership signals your commitment to doing business properly in Rwanda and unlocks procurement networks",
    time_required: "1-2 weeks",
    cost_estimate: "RWF 50,000-200,000 annual membership",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.psf.org.rw",
    status: "not_started",
    category: "market",
  });

  steps.push({
    step: steps.length + 1,
    title: "Register with Rwanda Trade and Industry (MINICOM) for export facilitation",
    description:
      "Register with the Ministry of Trade and Industry and the Rwanda Export Promotion Board (REPB) to access export incentives, trade fair subsidies, and international buyer directories.",
    why: "Rwanda's export support programmes subsidise your market entry costs significantly",
    time_required: "2-3 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.minicom.gov.rw",
    status: "not_started",
    category: "export",
  });

  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

// ── Kenya ─────────────────────────────────────────────────────────────────────

function getKenyaSteps(sector: string, isRegistered: boolean): PathStep[] {
  const steps: PathStep[] = [];

  if (!isRegistered) {
    steps.push({
      step: 1,
      title: "Register your business with the Registrar of Companies (RoC)",
      description:
        "Register your business at the RoC through the eCitizen portal. You can register a sole proprietorship, partnership, or limited company depending on your needs.",
      why: "Business registration is the foundation of all formal funding, tendering, and banking in Kenya",
      time_required: "2-3 business days",
      cost_estimate: "KES 3,000-10,000 depending on business type",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://ecitizen.go.ke",
      status: "not_started",
      category: "registration",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Obtain a PIN Certificate from Kenya Revenue Authority (KRA)",
    description:
      "Register with KRA to get your Personal Identification Number (PIN). Required for corporate banking, tender registration, and all government disbursements.",
    why: "KRA PIN is legally mandatory for all business financial transactions in Kenya",
    time_required: "1 day online",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://itax.kra.go.ke",
    status: "not_started",
    category: "compliance",
  });

  steps.push({
    step: steps.length + 1,
    title: "Apply for the Uwezo Fund",
    description:
      "Uwezo Fund provides interest-free loans of up to KES 500,000 to youth, women, and persons with disability group enterprises through constituency offices.",
    why: "Interest-free government capital is the cheapest financing available to early-stage Kenyan businesses",
    time_required: "4-8 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://uwezofund.go.ke",
    status: "not_started",
    category: "funding",
  });

  steps.push({
    step: steps.length + 1,
    title: "Apply for the Women Enterprise Fund (WEF) — if applicable",
    description:
      "Women-owned businesses can access WEF loans of KES 50,000-500,000 through registered women's groups, with a 0% interest rate for group loans.",
    why: "WEF is the single cheapest source of formal capital for women entrepreneurs in Kenya",
    time_required: "3-6 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.wef.co.ke",
    status: "not_started",
    category: "funding",
  });

  // TEF always included
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Tony Elumelu Foundation (TEF) Entrepreneurship Programme",
    description:
      "Apply to the TEF programme for $5,000 non-repayable seed capital + 12 weeks of training + mentoring. Open to all 54 African countries including Kenya.",
    why: "TEF is the largest pan-African entrepreneurship grant — free money, no equity given away",
    time_required: "12-week programme after acceptance",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://tefconnect.com",
    status: "not_started",
    category: "funding",
  });

  if (sector === "tech") {
    steps.push({
      step: steps.length + 1,
      title: "Apply to Nairobi Garage or iHub for co-working and investor access",
      description:
        "Nairobi Garage and iHub are Kenya's leading tech hubs offering co-working, mentorship, investor pitch days, and introductions to international tech companies.",
      why: "Being inside the Nairobi tech ecosystem dramatically accelerates your startup's growth and fundraising",
      time_required: "Ongoing membership",
      cost_estimate: "KES 5,000-15,000/month",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.ihub.co.ke",
      status: "not_started",
      category: "funding",
    });
  }

  if (sector === "agriculture") {
    steps.push({
      step: steps.length + 1,
      title: "Access KCB or Equity Bank SME Agri loan products",
      description:
        "KCB's KCB M-Pesa Loan and Equity Bank's Kilimo Biashara product offer agricultural SME financing linked to mobile money, with lower collateral requirements than traditional loans.",
      why: "Mobile-linked agricultural loans are faster to access and have flexible repayment tied to harvest cycles",
      time_required: "1-4 weeks",
      cost_estimate: null,
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://ke.equitybank.co.ke/business/sme",
      status: "not_started",
      category: "funding",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Register on Kenya's Government eProcurement portal (IFMIS)",
    description:
      "Register on the IFMIS supplier portal to bid on government tenders and contracts. Also register with the relevant county government procurement system.",
    why: "Kenya's public sector spends billions annually — registered suppliers have immediate access to hundreds of open tenders",
    time_required: "3-5 business days",
    cost_estimate: "KES 1,000-3,000",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://supplier.treasury.go.ke",
    status: "not_started",
    category: "market",
  });

  steps.push({
    step: steps.length + 1,
    title: "Register with Export Promotion Council (EPC) Kenya",
    description:
      "EPC Kenya provides export market research, trade fair support, buyer-seller matchmaking, and export incentives for Kenyan businesses.",
    why: "EPC subsidises your export market entry and provides verified buyer contacts",
    time_required: "2-4 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.epckenya.org",
    status: "not_started",
    category: "export",
  });

  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

// ── Senegal ───────────────────────────────────────────────────────────────────

function getSenegalSteps(sector: string, isRegistered: boolean): PathStep[] {
  const steps: PathStep[] = [];

  if (!isRegistered) {
    steps.push({
      step: 1,
      title: "Register your business via APIX (Agence de Promotion des Investissements)",
      description:
        "APIX is Senegal's one-stop shop for business registration and investment promotion. Register online or in person in Dakar. APIX integrates registration across tax, labor, and social security.",
      why: "APIX makes Senegal's business registration one of the fastest and most integrated in West Africa — all formalities in one place",
      time_required: "24-48 hours",
      cost_estimate: "XOF 5,000-30,000 depending on business type",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.investinsenegal.com",
      status: "not_started",
      category: "registration",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Register with ADEPME for business formalisation support",
    description:
      "ADEPME (Agence de Développement et d'Encadrement des PME) provides formalisation support, business advisory services, and access to financing for Senegalese SMEs.",
    why: "ADEPME is the gateway to most Senegalese government SME support programmes and can match you to the right funding schemes",
    time_required: "1-2 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.adepme.sn",
    status: "not_started",
    category: "compliance",
  });

  steps.push({
    step: steps.length + 1,
    title: "Note your OHADA legal framework obligations",
    description:
      "Senegal operates under the OHADA (Organisation pour l'Harmonisation en Afrique du Droit des Affaires) legal framework shared by 17 African countries. Ensure your corporate structure, contracts, and accounting comply with OHADA standards.",
    why: "OHADA compliance protects you in cross-border disputes and is required for operating across the West African market",
    time_required: "Consult a local lawyer — 1 week",
    cost_estimate: "XOF 50,000-200,000 legal consultation",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.ohada.com",
    status: "not_started",
    category: "compliance",
  });

  // DER/FJ always a flagship Senegal grant
  steps.push({
    step: steps.length + 1,
    title: "Apply for DER/FJ (Délégation Générale à l'Entrepreneuriat Rapide) grant",
    description:
      "DER/FJ provides non-repayable grants and concessional loans of up to XOF 500 million to Senegalese youth and women entrepreneurs. Apply online or through any DER regional office.",
    why: "DER/FJ is Senegal's flagship entrepreneurship fund — the largest single source of startup capital available to young Senegalese entrepreneurs",
    time_required: "4-12 weeks assessment",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://der.sn",
    status: "not_started",
    category: "funding",
  });

  // TEF always included
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Tony Elumelu Foundation (TEF) Entrepreneurship Programme",
    description:
      "Apply to the TEF programme for $5,000 non-repayable seed capital + 12 weeks of training + mentoring. Open to all 54 African countries including Senegal.",
    why: "TEF is the largest pan-African entrepreneurship grant and accepts Francophone African entrepreneurs",
    time_required: "12-week programme after acceptance",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://tefconnect.com",
    status: "not_started",
    category: "funding",
  });

  if (sector === "agriculture") {
    steps.push({
      step: steps.length + 1,
      title: "Apply for FONGIP (Fonds de Garantie des Investissements Prioritaires) guarantee",
      description:
        "FONGIP provides loan guarantees for SMEs in priority sectors including agriculture, reducing the collateral requirement for commercial bank loans.",
      why: "FONGIP guarantees make it possible to access bank loans when you lack land or property as collateral",
      time_required: "3-6 weeks",
      cost_estimate: "1% guarantee fee",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: "https://www.fongip.sn",
      status: "not_started",
      category: "funding",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Connect with CNES (Conseil National du Patronat du Sénégal) and sector federations",
    description:
      "Join the relevant Senegalese business federation to access procurement networks, trade missions, and government dialogue platforms.",
    why: "Senegal's business federations are closely connected to government procurement — membership opens contract doors",
    time_required: "2-4 weeks",
    cost_estimate: "XOF 50,000-300,000 annual membership",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.cnes.sn",
    status: "not_started",
    category: "market",
  });

  steps.push({
    step: steps.length + 1,
    title: "Register with ASEPEX for export market access",
    description:
      "ASEPEX (Agence Sénégalaise de Promotion des Exportations) provides market research, trade fair participation grants, and buyer matchmaking for Senegalese exporters.",
    why: "ASEPEX subsidises participation in major international trade fairs and connects you to verified foreign buyers",
    time_required: "2-4 weeks registration",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.asepex.sn",
    status: "not_started",
    category: "export",
  });

  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

// ── Default (pan-African) ──────────────────────────────────────────────────────

function getDefaultSteps(sector: string, isRegistered: boolean): PathStep[] {
  const steps: PathStep[] = [];

  if (!isRegistered) {
    steps.push({
      step: 1,
      title: "Register your business with the national business registration authority",
      description:
        "Complete formal business registration in your country of operation. Requirements vary by country but typically include a business name search, registration certificate, and tax identification.",
      why: "Business registration is a prerequisite for every grant, loan, and formal contract in Africa",
      time_required: "1-10 business days depending on country",
      cost_estimate: "Varies by country — typically USD 20-200",
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: null,
      status: "not_started",
      category: "registration",
    });
  }

  steps.push({
    step: steps.length + 1,
    title: "Obtain a Tax Identification Number (TIN)",
    description:
      "Register with your national tax authority to obtain a TIN. This is required for bank account opening, grant applications, and supplier registration.",
    why: "TIN is universally required for all formal financial transactions across Africa",
    time_required: "1-3 days",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: null,
    status: "not_started",
    category: "compliance",
  });

  steps.push({
    step: steps.length + 1,
    title: "Attend a free business training programme",
    description:
      "Complete a foundational business management course through your national SME agency or an NGO partner. This builds the business plan and financial management skills required by most funders.",
    why: "Most grant programmes require applicants to demonstrate basic business management competence",
    time_required: "1-4 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: null,
    status: "not_started",
    category: "training",
  });

  // TEF always included
  steps.push({
    step: steps.length + 1,
    title: "Apply for the Tony Elumelu Foundation (TEF) Entrepreneurship Programme",
    description:
      "Apply to the TEF programme for $5,000 non-repayable seed capital + 12 weeks of business training + mentoring. Open to entrepreneurs from all 54 African countries.",
    why: "TEF is Africa's largest SME grant and accepts founders from all 54 African countries — no country restriction",
    time_required: "12-week programme after acceptance",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://tefconnect.com",
    status: "not_started",
    category: "funding",
  });

  steps.push({
    step: steps.length + 1,
    title: "Apply for your country's national SME development fund",
    description:
      "Every African country has at least one government-backed SME financing facility. Identify yours through your national SME agency or central bank and submit an application.",
    why: "National SME funds are often the cheapest and most accessible form of early-stage capital",
    time_required: "4-12 weeks",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: null,
    status: "not_started",
    category: "funding",
  });

  steps.push({
    step: steps.length + 1,
    title: "Apply to a regional accelerator programme",
    description:
      "Research accelerator programmes active in your country (Seedstars, Villgro Africa, Liquid Telecom Ignite, etc.) and apply to the most relevant. Accelerators provide capital, mentorship, and investor introductions.",
    why: "Accelerators give you access to networks and follow-on funding that grant programmes alone cannot provide",
    time_required: "3-6 month programme",
    cost_estimate: null,
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: "https://www.seedstars.com",
    status: "not_started",
    category: "funding",
  });

  steps.push({
    step: steps.length + 1,
    title: "Join a local chamber of commerce or sector association",
    description:
      "Become a member of your national or regional chamber of commerce and the most relevant sector-specific trade association. Attend networking events and connect with potential partners and customers.",
    why: "Business associations are the fastest route to B2B sales, procurement opportunities, and sector intelligence",
    time_required: "1-4 weeks to join",
    cost_estimate: "Varies — typically USD 50-500 annual membership",
    opportunity_id: null,
    opportunity_title: null,
    opportunity_url: null,
    status: "not_started",
    category: "market",
  });

  if (sector === "export" || sector === "agriculture" || sector === "fashion" || sector === "beauty") {
    steps.push({
      step: steps.length + 1,
      title: "Register with your national export promotion council",
      description:
        "Contact your country's export promotion council or agency and register as a potential exporter. They can provide market research, trade fair funding, and buyer matchmaking.",
      why: "National export agencies subsidise your market entry costs and connect you to pre-vetted foreign buyers",
      time_required: "2-4 weeks",
      cost_estimate: null,
      opportunity_id: null,
      opportunity_title: null,
      opportunity_url: null,
      status: "not_started",
      category: "export",
    });
  }

  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

// ── buildPath ─────────────────────────────────────────────────────────────────

async function buildPath({
  goal,
  user,
  availableOpportunities = [],
}: {
  goal: string;
  user: Partial<UserProfile>;
  availableOpportunities?: { id: string; title: string; country: string; type: string; source_url: string }[];
}): Promise<AgentResult<OpportunityPath>> {
  const start = Date.now();
  try {
    const goalLower = goal.toLowerCase();
    const country =
      user.residence_country ||
      (user.target_countries && user.target_countries[0]) ||
      "Nigeria";
    const isRegistered =
      user.business_stage !== undefined && user.business_stage !== "idea";

    // detect sector
    let sector = "general";
    if (/beauty|cosmetic|skincare/.test(goalLower)) sector = "beauty";
    else if (/fashion|textile|fabric|cloth/.test(goalLower)) sector = "fashion";
    else if (/tech|software|app|startup|digital/.test(goalLower)) sector = "tech";
    else if (/farm|agri|food|crop|harvest|cocoa|cassava/.test(goalLower)) sector = "agriculture";
    else if (/export|trade/.test(goalLower)) sector = "export";
    else if (/contract|tender|government|procurement|supply/.test(goalLower)) sector = "procurement";
    else if (/health|clinic|hospital|medical|pharmacy/.test(goalLower)) sector = "health";
    else if (/logistic|transport|delivery|shipping/.test(goalLower)) sector = "logistics";
    else if (/educat|school|training|tutor/.test(goalLower)) sector = "education";
    else if (/music|art|creative|film|media/.test(goalLower)) sector = "creative";

    // get country steps
    let allSteps: PathStep[];
    const countryLower = country.toLowerCase();
    if (countryLower.includes("nigeria")) {
      allSteps = getNigeriaSteps(sector, isRegistered, availableOpportunities);
    } else if (countryLower.includes("ghana")) {
      allSteps = getGhanaSteps(sector, isRegistered);
    } else if (countryLower.includes("rwanda")) {
      allSteps = getRwandaSteps(sector, isRegistered);
    } else if (countryLower.includes("kenya")) {
      allSteps = getKenyaSteps(sector, isRegistered);
    } else if (countryLower.includes("senegal")) {
      allSteps = getSenegalSteps(sector, isRegistered);
    } else {
      allSteps = getDefaultSteps(sector, isRegistered);
    }

    // Try to match any remaining steps to available opportunities
    allSteps = allSteps.map((s) => withOpp(s, availableOpportunities));

    // re-number steps sequentially
    allSteps = allSteps.map((s, i) => ({ ...s, step: i + 1 }));

    // group into phases
    const foundation = allSteps.filter(
      (s) => s.category === "registration" || s.category === "compliance" || s.category === "training"
    );
    const funding = allSteps.filter((s) => s.category === "funding");
    const growth = allSteps.filter((s) => s.category === "market" || s.category === "export");

    const phases = [
      { phase: "1", label: "Foundation", steps: foundation },
      { phase: "2", label: "Funding", steps: funding },
      { phase: "3", label: "Growth", steps: growth },
    ].filter((p) => p.steps.length > 0);

    const path: OpportunityPath = {
      goal,
      country,
      phases,
      total_time: "3–8 months",
      summary: `A ${allSteps.length}-step path to help you ${goal} in ${country}. Starting with the legal foundation, moving through funding access, and into market growth.`,
    };

    return {
      success: true,
      data: path,
      model: "rule-based-v1",
      latency_ms: Date.now() - start,
    };
  } catch (e) {
    return {
      success: false,
      data: null,
      error: String(e),
      latency_ms: Date.now() - start,
    };
  }
}

// ── export ────────────────────────────────────────────────────────────────────

export const pathBuilderAgent: PathBuilderAgent = { buildPath };
