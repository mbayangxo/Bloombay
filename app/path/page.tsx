"use client";
import { useState } from "react";
import Link from "next/link";

const GOLD = "#C9A84C";
const FOREST = "#0D3B2E";
const IVORY = "#F7F2E8";
const OBSIDIAN = "#0B0B0B";
const EARTH = "#8B3A2A";
const ROYAL = "#1B3A6B";
const SAND = "#D4A97A";

interface PathStep {
  step: number;
  title: string;
  description: string;
  why: string;
  time_required: string;
  cost_estimate: string | null;
  opportunity_title: string | null;
  opportunity_url: string | null;
  category: "registration" | "funding" | "training" | "compliance" | "market" | "export";
  phase: "Foundation" | "Funding" | "Growth";
}

function detectSector(goal: string): string {
  const g = goal.toLowerCase();
  if (/beauty|cosmetic/.test(g)) return "beauty";
  if (/fashion|textile/.test(g)) return "fashion";
  if (/tech|software|app|startup/.test(g)) return "tech";
  if (/farm|agriculture|food|crop/.test(g)) return "agriculture";
  if (/export/.test(g)) return "export";
  if (/contract|tender|government|procurement/.test(g)) return "procurement";
  if (/health|clinic|medical/.test(g)) return "health";
  if (/logistics|transport|delivery/.test(g)) return "logistics";
  if (/education|school|training/.test(g)) return "education";
  return "general";
}

function generatePath(
  goal: string,
  country: string,
  isRegistered: boolean,
  hasPlan: boolean,
  hasRevenue: boolean,
  hasFunding: boolean
): PathStep[] {
  const sector = detectSector(goal);
  const goalLower = goal.toLowerCase();
  const steps: PathStep[] = [];
  let stepNum = 1;

  if (country === "Nigeria") {
    if (!isRegistered) {
      steps.push({
        step: stepNum++,
        title: "Register with CAC",
        description: "Register your business with the Corporate Affairs Commission (CAC) to obtain a legal business identity.",
        why: "All funding programs require a registered business entity",
        time_required: "2–3 days",
        cost_estimate: "₦10,000–₦20,000",
        opportunity_title: null,
        opportunity_url: null,
        category: "registration",
        phase: "Foundation",
      });
    }

    if (!hasPlan) {
      steps.push({
        step: stepNum++,
        title: "Create a Business Plan",
        description: "Develop a comprehensive business plan outlining your model, market, financials, and growth strategy.",
        why: "Funders and accelerators require a solid business plan before considering your application",
        time_required: "1–2 weeks",
        cost_estimate: null,
        opportunity_title: null,
        opportunity_url: null,
        category: "training",
        phase: "Foundation",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Apply to TEF Entrepreneurship Programme",
      description: "Tony Elumelu Foundation gives $5,000 non-refundable to 1,000 African entrepreneurs annually, plus mentorship and business training.",
      why: "One of the most accessible seed funding programmes for African entrepreneurs — non-refundable and open to all sectors",
      time_required: "6 weeks",
      cost_estimate: null,
      opportunity_title: "TEF Entrepreneurship Programme",
      opportunity_url: "https://tefconnect.com",
      category: "funding",
      phase: "Funding",
    });

    if (sector === "beauty" || sector === "fashion") {
      steps.push({
        step: stepNum++,
        title: "Apply to CBN Creative Industry Finance Initiative",
        description: "The Central Bank of Nigeria's Creative Industry Finance Initiative provides affordable loans for creative and fashion businesses.",
        why: "Specifically designed to fill the funding gap in Nigeria's fast-growing creative industries",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "CBN Creative Industry Finance Initiative",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    } else if (sector === "tech") {
      steps.push({
        step: stepNum++,
        title: "Apply to NITDA Startup Programme",
        description: "Get technical support and funding for Nigerian tech startups through the National Information Technology Development Agency.",
        why: "NITDA offers technical resources, co-working space, and funding pathways tailored specifically for Nigerian tech founders",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "NITDA Startup Programme",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    } else if (sector === "agriculture") {
      steps.push({
        step: stepNum++,
        title: "Apply to CBN AGSMEIS",
        description: "The Agri-Business/Small and Medium Enterprise Investment Scheme provides loans up to ₦10M at 5% interest for agricultural businesses.",
        why: "One of Nigeria's most competitive agribusiness financing windows, specifically targeting food security and rural employment",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "CBN AGSMEIS",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    } else {
      steps.push({
        step: stepNum++,
        title: "Apply to Nigeria Youth Investment Fund (NYIF)",
        description: "Access up to ₦25M in funding from the Federal Government's Nigeria Youth Investment Fund, targeted at youth-led enterprises.",
        why: "One of the largest youth-focused funding pools in Nigeria, with relatively accessible application criteria",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "Nigeria Youth Investment Fund (NYIF)",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    }

    if (sector === "beauty") {
      steps.push({
        step: stepNum++,
        title: "NAFDAC Product Registration",
        description: "Register your cosmetics products with the National Agency for Food and Drug Administration and Control (NAFDAC).",
        why: "Required by law to legally manufacture, import, export, advertise, distribute, sell or use cosmetics in Nigeria",
        time_required: "4–6 months",
        cost_estimate: "₦50,000",
        opportunity_title: null,
        opportunity_url: null,
        category: "compliance",
        phase: "Growth",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Join a Sector Accelerator or Business Support Program",
      description: "Enroll in a structured accelerator such as Co-Creation Hub (CcHUB), She Leads Africa, or your sector's leading incubator to gain mentorship and investor access.",
      why: "Accelerators dramatically increase your chances of raising follow-on investment and connecting with key markets",
      time_required: "3–6 months",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "training",
      phase: "Growth",
    });

    if (sector === "export" || goalLower.includes("export")) {
      steps.push({
        step: stepNum++,
        title: "Apply for NEPC Export Incentives",
        description: "The Nigerian Export Promotion Council supports exporters with market development funds, capacity building, and export facilitation.",
        why: "NEPC can reimburse up to 50% of export promotion costs and open doors to international trade fairs and buyer networks",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "NEPC Export Incentive Programme",
        opportunity_url: null,
        category: "export",
        phase: "Growth",
      });
    }

  } else if (country === "Ghana") {
    if (!isRegistered) {
      steps.push({
        step: stepNum++,
        title: "Register with RGD",
        description: "Register your business at the Registrar General's Department to establish a formal legal entity in Ghana.",
        why: "All Ghanaian funding programmes and government contracts require a registered business entity",
        time_required: "1–3 days",
        cost_estimate: "GHS 150",
        opportunity_title: null,
        opportunity_url: null,
        category: "registration",
        phase: "Foundation",
      });
    }

    steps.push({
      step: stepNum++,
      title: "GIPC Investor Support",
      description: "Register with the Ghana Investment Promotion Centre to access tax holidays, investment guarantees, and business facilitation support.",
      why: "GIPC registration unlocks preferential treatment, protections against nationalisation, and access to free repatriation of profits",
      time_required: "2–4 weeks",
      cost_estimate: null,
      opportunity_title: "GIPC Investor Support",
      opportunity_url: null,
      category: "registration",
      phase: "Foundation",
    });

    steps.push({
      step: stepNum++,
      title: "Apply to Ghana Enterprises Agency (GEA)",
      description: "Access SME grants, capacity building workshops, and business development support through the Ghana Enterprises Agency.",
      why: "GEA provides subsidised business development services and direct grant funding specifically for Ghanaian SMEs",
      time_required: "4–8 weeks",
      cost_estimate: null,
      opportunity_title: "GEA SME Support Programme",
      opportunity_url: null,
      category: "funding",
      phase: "Funding",
    });

    if (sector === "fashion") {
      steps.push({
        step: stepNum++,
        title: "Apply for Ghana Free Zones Board Status",
        description: "Export-focused textile and fashion businesses can get tax exemptions and preferential treatment under the Ghana Free Zones Board.",
        why: "Free Zones status gives you 10-year corporate tax holidays and exemption from import duties on raw materials",
        time_required: "6–12 weeks",
        cost_estimate: null,
        opportunity_title: "Ghana Free Zones Board",
        opportunity_url: null,
        category: "compliance",
        phase: "Growth",
      });
    } else if (sector === "agriculture") {
      steps.push({
        step: stepNum++,
        title: "Apply to AGROBank",
        description: "Access agricultural financing through the Agricultural Development Bank (AGROBank), Ghana's dedicated development bank for the agri-sector.",
        why: "AGROBank offers lower rates and longer tenors than commercial banks for agriculture, with products tailored to crop cycles",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "AGROBank Agricultural Finance",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    }

    if (sector === "education") {
      steps.push({
        step: stepNum++,
        title: "Apply to MasterCard Foundation Scholars Program",
        description: "Access the MasterCard Foundation Scholars Program for education-sector entrepreneurs and social impact businesses in Ghana.",
        why: "Provides funding, mentorship, and a powerful alumni network for transformative education ventures",
        time_required: "8–12 weeks",
        cost_estimate: null,
        opportunity_title: "MasterCard Foundation Scholars Program",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    } else {
      steps.push({
        step: stepNum++,
        title: "Apply to TEF Entrepreneurship Programme",
        description: "$5,000 non-refundable seed capital, open to all African entrepreneurs regardless of sector.",
        why: "TEF is one of Africa's most prestigious entrepreneurship programmes — acceptance builds investor credibility even beyond the grant",
        time_required: "6 weeks",
        cost_estimate: null,
        opportunity_title: "TEF Entrepreneurship Programme",
        opportunity_url: "https://tefconnect.com",
        category: "funding",
        phase: "Funding",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Join a Sector Accelerator or Business Support Program",
      description: "Connect with programmes like MEST Africa, Kosmos Innovation Centre, or your sector's leading accelerator to access mentorship and investor networks.",
      why: "Structured acceleration dramatically increases your speed to market and reduces costly mistakes",
      time_required: "3–6 months",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "training",
      phase: "Growth",
    });

  } else if (country === "Rwanda") {
    if (!isRegistered) {
      steps.push({
        step: stepNum++,
        title: "Register via RDB",
        description: "Register your business through the Rwanda Development Board's one-stop shop — one of Africa's fastest registration processes, completable in 6 hours.",
        why: "Rwanda's RDB registration is free, fast, and immediately gives you access to Rwanda's business-friendly regulatory environment",
        time_required: "Same day",
        cost_estimate: "Free",
        opportunity_title: null,
        opportunity_url: null,
        category: "registration",
        phase: "Foundation",
      });
    }

    if (!hasPlan) {
      steps.push({
        step: stepNum++,
        title: "Create a Business Plan",
        description: "Develop a comprehensive business plan outlining your model, market, financials, and growth strategy.",
        why: "Funders and accelerators require a solid business plan before considering your application",
        time_required: "1–2 weeks",
        cost_estimate: null,
        opportunity_title: null,
        opportunity_url: null,
        category: "training",
        phase: "Foundation",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Rwanda BDF Loan Guarantee",
      description: "Apply to the Business Development Fund (BDF) for loan guarantees when commercial banks decline — BDF covers up to 75% of the loan risk.",
      why: "BDF dramatically improves your chances of getting a bank loan by de-risking the lender's exposure",
      time_required: "4–8 weeks",
      cost_estimate: null,
      opportunity_title: "Rwanda BDF Loan Guarantee",
      opportunity_url: null,
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "Apply to TEF Entrepreneurship Programme",
      description: "$5,000 non-refundable seed capital, open to all African entrepreneurs regardless of sector.",
      why: "TEF is open to all African entrepreneurs and provides both capital and an invaluable business training curriculum",
      time_required: "6 weeks",
      cost_estimate: null,
      opportunity_title: "TEF Entrepreneurship Programme",
      opportunity_url: "https://tefconnect.com",
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "RDB Investment Incentives",
      description: "Apply for RDB's priority sector investment incentives, including up to a 7-year corporate tax holiday for qualifying businesses.",
      why: "Rwanda's investment incentives are among the most competitive in Africa, reducing your tax burden during the critical growth phase",
      time_required: "4–8 weeks",
      cost_estimate: null,
      opportunity_title: "RDB Investment Incentives",
      opportunity_url: null,
      category: "compliance",
      phase: "Growth",
    });

    steps.push({
      step: stepNum++,
      title: "Join a Sector Accelerator",
      description: "Connect with programmes like kLab, Impact Hub Kigali, or your sector's leading incubator for mentorship and investor access.",
      why: "Rwanda's accelerator ecosystem is world-class — the right programme can connect you with regional and global investors",
      time_required: "3–6 months",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "training",
      phase: "Growth",
    });

  } else if (country === "Kenya") {
    if (!isRegistered) {
      steps.push({
        step: stepNum++,
        title: "Register with Registrar of Companies",
        description: "Register your business with Kenya's Registrar of Companies (RoC) via the eCitizen portal to get your Certificate of Incorporation.",
        why: "All Kenyan funding programmes, bank loans, and government tenders require a formally registered business",
        time_required: "1–3 days",
        cost_estimate: "KES 3,000",
        opportunity_title: null,
        opportunity_url: null,
        category: "registration",
        phase: "Foundation",
      });
    }

    if (!hasPlan) {
      steps.push({
        step: stepNum++,
        title: "Create a Business Plan",
        description: "Develop a comprehensive business plan outlining your model, market, financials, and growth strategy.",
        why: "Funders and accelerators require a solid business plan before considering your application",
        time_required: "1–2 weeks",
        cost_estimate: null,
        opportunity_title: null,
        opportunity_url: null,
        category: "training",
        phase: "Foundation",
      });
    }

    if (goalLower.includes("women") || goalLower.includes("female") || goalLower.includes("woman")) {
      steps.push({
        step: stepNum++,
        title: "Apply to Kenya Women Enterprise Fund",
        description: "Access low-interest loans and business development support through the Kenya Women Enterprise Fund (WEF), targeting women-led businesses.",
        why: "WEF provides collateral-free loans and capacity building specifically designed to reduce barriers for women entrepreneurs",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "Kenya Women Enterprise Fund",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    }

    if (goalLower.includes("youth") || goalLower.includes("young")) {
      steps.push({
        step: stepNum++,
        title: "Apply to Uwezo Fund",
        description: "Access the Uwezo Fund, Kenya's government-backed revolving fund targeting youth, women, and persons with disabilities.",
        why: "Uwezo Fund provides interest-free or low-interest capital to youth entrepreneurs who may not qualify for commercial finance",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: "Uwezo Fund",
        opportunity_url: null,
        category: "funding",
        phase: "Funding",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Apply to TEF Entrepreneurship Programme",
      description: "$5,000 non-refundable seed capital, open to all African entrepreneurs regardless of sector.",
      why: "TEF is one of Africa's most prestigious programmes — both for the capital and the mentorship curriculum",
      time_required: "6 weeks",
      cost_estimate: null,
      opportunity_title: "TEF Entrepreneurship Programme",
      opportunity_url: "https://tefconnect.com",
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "KCB/Equity Bank SME Loan",
      description: "Apply for commercial SME loan products from KCB Group or Equity Bank, both of which offer competitive rates for growing businesses.",
      why: "Kenya's commercial banks have some of the most accessible SME lending products in Africa, with digital application options",
      time_required: "2–4 weeks",
      cost_estimate: null,
      opportunity_title: "KCB/Equity Bank SME Loan",
      opportunity_url: null,
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "Join a Sector Accelerator",
      description: "Connect with programmes like iHub, Nailab, Villgro Africa, or your sector's leading incubator for mentorship and scale support.",
      why: "Kenya's startup ecosystem is among Africa's most mature — the right accelerator opens doors to East African and global markets",
      time_required: "3–6 months",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "training",
      phase: "Growth",
    });

  } else if (country === "Senegal") {
    if (!isRegistered) {
      steps.push({
        step: stepNum++,
        title: "Register via APIX",
        description: "Register your business through the Agence pour la Promotion des Investissements et des Grands Travaux (APIX), Senegal's investment promotion one-stop shop.",
        why: "APIX registration gives you legal standing in Senegal and access to the OHADA legal framework covering 17 West African nations",
        time_required: "24–48 hours",
        cost_estimate: "XOF 5,000",
        opportunity_title: null,
        opportunity_url: null,
        category: "registration",
        phase: "Foundation",
      });
    }

    if (!hasPlan) {
      steps.push({
        step: stepNum++,
        title: "Create a Business Plan",
        description: "Develop a comprehensive business plan outlining your model, market, financials, and growth strategy.",
        why: "DER/FJ and other Senegalese funders require a detailed business plan as the cornerstone of any application",
        time_required: "1–2 weeks",
        cost_estimate: null,
        opportunity_title: null,
        opportunity_url: null,
        category: "training",
        phase: "Foundation",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Apply to DER/FJ",
      description: "Apply to the Délégation à l'Entrepreneuriat Rapide des Femmes et des Jeunes — grants up to XOF 500M for qualifying entrepreneurs in priority sectors.",
      why: "DER/FJ is Senegal's flagship entrepreneurship fund, offering non-refundable grants and equity-free financing to youth and women entrepreneurs",
      time_required: "4–8 weeks",
      cost_estimate: null,
      opportunity_title: "DER/FJ Entrepreneurship Fund",
      opportunity_url: "https://der.sn",
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "ADEPME Business Formalization",
      description: "Work with the Agence de Développement et d'Encadrement des Petites et Moyennes Entreprises (ADEPME) for free business support and SME formalization services.",
      why: "ADEPME provides free technical assistance, diagnostic reviews, and access to Senegal's SME support ecosystem",
      time_required: "2–4 weeks",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "training",
      phase: "Foundation",
    });

    steps.push({
      step: stepNum++,
      title: "Apply to TEF Entrepreneurship Programme",
      description: "$5,000 non-refundable seed capital, open to all African entrepreneurs regardless of sector.",
      why: "TEF's training curriculum and funding are available to Senegalese entrepreneurs and the alumni network is extremely valuable",
      time_required: "6 weeks",
      cost_estimate: null,
      opportunity_title: "TEF Entrepreneurship Programme",
      opportunity_url: "https://tefconnect.com",
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "Leverage the OHADA Business Law Framework",
      description: "Structure your business under the OHADA Uniform Acts framework to legally operate and enforce contracts across all 17 OHADA member states.",
      why: "OHADA compliance means your business can seamlessly expand into Côte d'Ivoire, Mali, Cameroon, and 14 other markets without restructuring",
      time_required: "2–4 weeks",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "compliance",
      phase: "Growth",
    });

  } else {
    // Default path for other countries
    if (!isRegistered) {
      steps.push({
        step: stepNum++,
        title: "Register Your Business",
        description: "Register your business with your country's official business registration authority to obtain a legal business identity.",
        why: "All funding programmes, bank loans, and government contracts require a formally registered business entity",
        time_required: "1–5 days",
        cost_estimate: "Varies",
        opportunity_title: null,
        opportunity_url: null,
        category: "registration",
        phase: "Foundation",
      });
    }

    if (!hasPlan) {
      steps.push({
        step: stepNum++,
        title: "Create a Business Plan",
        description: "Develop a comprehensive business plan covering your market opportunity, business model, financial projections, and growth strategy.",
        why: "Funders and accelerators require a solid business plan before considering your application",
        time_required: "1–2 weeks",
        cost_estimate: null,
        opportunity_title: null,
        opportunity_url: null,
        category: "training",
        phase: "Foundation",
      });
    }

    steps.push({
      step: stepNum++,
      title: "Apply to TEF Entrepreneurship Programme",
      description: "$5,000 non-refundable seed capital, open to all African entrepreneurs across the continent regardless of sector or country.",
      why: "TEF is the largest entrepreneurship programme on the continent — 1,000 entrepreneurs selected annually with mentorship and capital",
      time_required: "6 weeks",
      cost_estimate: null,
      opportunity_title: "TEF Entrepreneurship Programme",
      opportunity_url: "https://tefconnect.com",
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "Explore Country-Specific Government SME Fund",
      description: "Research and apply to your national government's SME development fund or entrepreneurship programme for sector-specific or general business support.",
      why: "Most African governments run dedicated SME funds that are far less competitive than international programmes",
      time_required: "4–8 weeks",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "Apply to a Regional Development Finance Institution",
      description: "Apply to the African Development Bank (AfDB), ECOWAS Bank for Investment and Development (EBID), or your regional DFI for SME financing.",
      why: "DFIs provide longer tenors and lower rates than commercial banks, specifically designed for businesses with high developmental impact",
      time_required: "8–16 weeks",
      cost_estimate: null,
      opportunity_title: "African Development Bank SME Facility",
      opportunity_url: null,
      category: "funding",
      phase: "Funding",
    });

    steps.push({
      step: stepNum++,
      title: "Join a Sector-Relevant Accelerator",
      description: "Enroll in a structured accelerator programme — whether local, regional like MEST Africa or Seedstars, or global — to access mentorship and investors.",
      why: "Accelerators provide structured support, investor access, and peer networks that dramatically accelerate your growth",
      time_required: "3–6 months",
      cost_estimate: null,
      opportunity_title: null,
      opportunity_url: null,
      category: "training",
      phase: "Growth",
    });

    if (sector === "export" || goalLower.includes("export")) {
      steps.push({
        step: stepNum++,
        title: "Contact Your National Export Promotion Council",
        description: "Register with your country's export promotion agency to access export incentives, trade fair support, and buyer-matching services.",
        why: "Export promotion agencies can subsidise up to 50% of your international marketing costs and connect you with verified foreign buyers",
        time_required: "4–8 weeks",
        cost_estimate: null,
        opportunity_title: null,
        opportunity_url: null,
        category: "export",
        phase: "Growth",
      });
    }
  }

  // Renumber steps sequentially after generation
  return steps.map((s, i) => ({ ...s, step: i + 1 }));
}

const PHASE_ORDER: Array<"Foundation" | "Funding" | "Growth"> = ["Foundation", "Funding", "Growth"];

const CATEGORY_COLORS: Record<string, string> = {
  registration: ROYAL,
  funding: FOREST,
  training: "#5A6E3A",
  compliance: EARTH,
  market: SAND,
  export: "#6B4E1B",
};

export default function PathPage() {
  const [goal, setGoal] = useState("");
  const [country, setCountry] = useState("Nigeria");
  const [isRegistered, setIsRegistered] = useState(false);
  const [hasBusinessPlan, setHasBusinessPlan] = useState(false);
  const [hasRevenue, setHasRevenue] = useState(false);
  const [hasFunding, setHasFunding] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [stepStatuses, setStepStatuses] = useState<Record<number, "not_started" | "in_progress" | "done">>({});
  const [generatedPath, setGeneratedPath] = useState<PathStep[]>([]);

  const handleBuildPath = () => {
    const path = generatePath(goal, country, isRegistered, hasBusinessPlan, hasRevenue, hasFunding);
    setGeneratedPath(path);
    const initialStatuses: Record<number, "not_started" | "in_progress" | "done"> = {};
    path.forEach((s) => {
      initialStatuses[s.step] = "not_started";
    });
    setStepStatuses(initialStatuses);
    setShowPath(true);
  };

  const handleReset = () => {
    setShowPath(false);
    setGeneratedPath([]);
    setStepStatuses({});
  };

  const setStatus = (step: number, status: "not_started" | "in_progress" | "done") => {
    setStepStatuses((prev) => ({ ...prev, [step]: status }));
  };

  const phaseSteps = (phase: "Foundation" | "Funding" | "Growth") =>
    generatedPath.filter((s) => s.phase === phase);

  const phaseNumber = (phase: "Foundation" | "Funding" | "Growth") =>
    PHASE_ORDER.indexOf(phase) + 1;

  return (
    <div style={{ minHeight: "100vh", background: IVORY, fontFamily: "var(--font-ui)" }}>
      {/* NAV */}
      <nav className="nav">
        <div className="nav-inner">
          <Link href="/" className="nav-logo">
            Alkebulan <span>United</span>
          </Link>
          <ul className="nav-links">
            <li><Link href="/feed">Feed</Link></li>
            <li><Link href="/countries">Explore Africa</Link></li>
            <li><Link href="/b2b">For Organizations</Link></li>
            <li><Link href="/login">Sign In</Link></li>
            <li>
              <Link href="/login?mode=signup" className="btn-primary" style={{ padding: "10px 20px", fontSize: "12px" }}>
                Get Started
              </Link>
            </li>
          </ul>
        </div>
      </nav>

      {/* HERO */}
      <section
        style={{
          background: FOREST,
          position: "relative",
          overflow: "hidden",
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div className="grain-overlay" />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 720, margin: "0 auto" }}>
          <p className="section-label" style={{ marginBottom: 20 }}>BUILD YOUR PATH</p>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5vw, 52px)",
              color: IVORY,
              marginBottom: 20,
              lineHeight: 1.15,
            }}
          >
            Your personalized roadmap to African opportunity.
          </h1>
          <p
            style={{
              fontSize: 17,
              color: "rgba(247,242,232,0.75)",
              lineHeight: 1.7,
              maxWidth: 580,
              margin: "0 auto",
            }}
          >
            Tell us your goal. We'll show you the exact steps — programs, registrations, funding, compliance — in the right order.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px" }}>
        {!showPath ? (
          /* INPUT FORM */
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 380px",
              gap: 48,
              alignItems: "start",
            }}
          >
            {/* FORM */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  color: FOREST,
                  marginBottom: 32,
                }}
              >
                Tell us about your goal
              </h2>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                {/* Goal input */}
                <div className="form-field">
                  <label className="form-label">What do you want to build or achieve?</label>
                  <input
                    className="form-input"
                    type="text"
                    value={goal}
                    onChange={(e) => setGoal(e.target.value)}
                    placeholder="Launch a beauty brand in Nigeria / Win a government contract / Get my startup funded"
                  />
                </div>

                {/* Country dropdown */}
                <div className="form-field">
                  <label className="form-label">Your country of operation</label>
                  <select
                    className="form-select"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                  >
                    <option>Nigeria</option>
                    <option>Ghana</option>
                    <option>Kenya</option>
                    <option>Senegal</option>
                    <option>Rwanda</option>
                    <option>South Africa</option>
                    <option>Morocco</option>
                    <option>Ethiopia</option>
                    <option>Côte d'Ivoire</option>
                    <option>Other</option>
                  </select>
                </div>

                {/* Where are you now */}
                <div className="form-field">
                  <label className="form-label">Where are you now?</label>
                  <div className="check-grid" style={{ marginTop: 4 }}>
                    <label className={`check-item${isRegistered ? " selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={isRegistered}
                        onChange={(e) => setIsRegistered(e.target.checked)}
                      />
                      Business is registered
                    </label>
                    <label className={`check-item${hasBusinessPlan ? " selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={hasBusinessPlan}
                        onChange={(e) => setHasBusinessPlan(e.target.checked)}
                      />
                      I have a business plan
                    </label>
                    <label className={`check-item${hasRevenue ? " selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={hasRevenue}
                        onChange={(e) => setHasRevenue(e.target.checked)}
                      />
                      I have some revenue
                    </label>
                    <label className={`check-item${hasFunding ? " selected" : ""}`}>
                      <input
                        type="checkbox"
                        checked={hasFunding}
                        onChange={(e) => setHasFunding(e.target.checked)}
                      />
                      I've received funding before
                    </label>
                  </div>
                </div>

                <div style={{ paddingTop: 8 }}>
                  <button
                    className="btn-primary"
                    onClick={handleBuildPath}
                    disabled={!goal.trim()}
                    style={{
                      opacity: goal.trim() ? 1 : 0.5,
                      cursor: goal.trim() ? "pointer" : "not-allowed",
                      fontSize: 14,
                      padding: "16px 36px",
                    }}
                  >
                    Build My Path →
                  </button>
                </div>
              </div>
            </div>

            {/* RIGHT INFO PANEL */}
            <div
              style={{
                background: FOREST,
                borderRadius: 4,
                padding: 36,
                color: IVORY,
                position: "sticky",
                top: 88,
              }}
            >
              <h3
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 20,
                  color: IVORY,
                  marginBottom: 24,
                  lineHeight: 1.3,
                }}
              >
                What your path includes
              </h3>
              <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  {
                    icon: "✦",
                    text: "Business registration steps — with exact costs and time required",
                  },
                  {
                    icon: "✦",
                    text: "Funding programs you qualify for based on your sector and country",
                  },
                  {
                    icon: "✦",
                    text: "Compliance requirements for your specific industry",
                  },
                  {
                    icon: "✦",
                    text: "A step-by-step timeline from Foundation through Growth",
                  },
                ].map((item, i) => (
                  <li key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                    <span style={{ color: GOLD, fontSize: 12, marginTop: 3, flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span style={{ fontSize: 14, color: "rgba(247,242,232,0.82)", lineHeight: 1.6 }}>
                      {item.text}
                    </span>
                  </li>
                ))}
              </ul>
              <div
                style={{
                  marginTop: 28,
                  paddingTop: 24,
                  borderTop: `1px solid rgba(201,168,76,0.2)`,
                }}
              >
                <p style={{ fontSize: 12, color: "rgba(247,242,232,0.5)", lineHeight: 1.6 }}>
                  Paths are generated from real programs and registration requirements. Always verify deadlines and eligibility directly with each body.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* PATH DISPLAY */
          <div>
            {/* Header row */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 40,
                gap: 24,
                flexWrap: "wrap",
              }}
            >
              <div>
                <p className="section-label" style={{ marginBottom: 8 }}>YOUR OPPORTUNITY PATH</p>
                <h2
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: "clamp(20px, 3vw, 28px)",
                    color: FOREST,
                    marginBottom: 6,
                  }}
                >
                  Your path for:{" "}
                  <span style={{ color: GOLD, fontStyle: "italic" }}>{goal}</span>
                </h2>
                <p style={{ fontSize: 14, color: "#666" }}>
                  Country:{" "}
                  <strong style={{ color: FOREST }}>{country}</strong>
                  {" "}·{" "}
                  <span style={{ color: "#999" }}>{generatedPath.length} steps</span>
                </p>
              </div>
              <button
                onClick={handleReset}
                className="btn-secondary"
                style={{ flexShrink: 0 }}
              >
                ← Reset
              </button>
            </div>

            {/* Phases */}
            {PHASE_ORDER.map((phase) => {
              const steps = phaseSteps(phase);
              if (steps.length === 0) return null;
              return (
                <div key={phase} style={{ marginBottom: 56 }}>
                  {/* Phase header */}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      marginBottom: 32,
                    }}
                  >
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: GOLD,
                        color: OBSIDIAN,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: 700,
                        fontSize: 15,
                        flexShrink: 0,
                      }}
                    >
                      {phaseNumber(phase)}
                    </div>
                    <div>
                      <h3
                        style={{
                          fontFamily: "var(--font-display)",
                          fontSize: 22,
                          color: FOREST,
                        }}
                      >
                        Phase {phaseNumber(phase)}: {phase}
                      </h3>
                    </div>
                    <div
                      style={{
                        flex: 1,
                        height: 1,
                        background: `rgba(201,168,76,0.25)`,
                        marginLeft: 8,
                      }}
                    />
                  </div>

                  {/* Steps */}
                  <div style={{ display: "flex", flexDirection: "column" }}>
                    {steps.map((step, idx) => {
                      const status = stepStatuses[step.step] || "not_started";
                      const isLast = idx === steps.length - 1;
                      return (
                        <div key={step.step} style={{ display: "flex", gap: 20 }}>
                          {/* Left: number + connector */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              flexShrink: 0,
                            }}
                          >
                            <div
                              style={{
                                width: 36,
                                height: 36,
                                borderRadius: "50%",
                                background: status === "done" ? GOLD : status === "in_progress" ? "rgba(201,168,76,0.3)" : "white",
                                border: `2px solid ${status === "done" ? GOLD : status === "in_progress" ? GOLD : "rgba(0,0,0,0.15)"}`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontWeight: 700,
                                fontSize: 14,
                                color: status === "done" ? OBSIDIAN : FOREST,
                                flexShrink: 0,
                                transition: "all 0.2s",
                              }}
                            >
                              {status === "done" ? "✓" : step.step}
                            </div>
                            {!isLast && (
                              <div
                                style={{
                                  width: 2,
                                  flex: 1,
                                  minHeight: 32,
                                  background: `linear-gradient(to bottom, ${GOLD}60, ${GOLD}20)`,
                                  margin: "4px 0",
                                }}
                              />
                            )}
                          </div>

                          {/* Right: card */}
                          <div
                            style={{
                              flex: 1,
                              background: "white",
                              border: `1px solid ${status === "done" ? `${GOLD}60` : "rgba(0,0,0,0.08)"}`,
                              borderRadius: 4,
                              padding: 24,
                              marginBottom: isLast ? 0 : 16,
                              transition: "all 0.2s",
                              boxShadow: status === "done" ? `0 0 0 1px ${GOLD}30` : "none",
                            }}
                          >
                            {/* Category pill */}
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "3px 10px",
                                  borderRadius: 2,
                                  fontSize: 10,
                                  fontWeight: 700,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  background: `${CATEGORY_COLORS[step.category] || FOREST}18`,
                                  color: CATEGORY_COLORS[step.category] || FOREST,
                                }}
                              >
                                {step.category}
                              </span>
                              <span
                                style={{
                                  display: "inline-block",
                                  padding: "3px 10px",
                                  borderRadius: 2,
                                  fontSize: 10,
                                  fontWeight: 600,
                                  letterSpacing: "0.1em",
                                  textTransform: "uppercase",
                                  background: "rgba(13,59,46,0.06)",
                                  color: FOREST,
                                }}
                              >
                                {step.phase}
                              </span>
                            </div>

                            {/* Title */}
                            <h4
                              style={{
                                fontFamily: "var(--font-display)",
                                fontSize: 18,
                                color: FOREST,
                                marginBottom: 8,
                                lineHeight: 1.3,
                              }}
                            >
                              {step.title}
                            </h4>

                            {/* Description */}
                            <p style={{ fontSize: 14, color: "#444", lineHeight: 1.65, marginBottom: 12 }}>
                              {step.description}
                            </p>

                            {/* Why */}
                            <p
                              style={{
                                fontSize: 13,
                                color: "var(--gold-dim)",
                                fontStyle: "italic",
                                lineHeight: 1.6,
                                marginBottom: 14,
                              }}
                            >
                              Why this step: {step.why}
                            </p>

                            {/* Badges */}
                            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 14 }}>
                              <span
                                style={{
                                  display: "inline-flex",
                                  alignItems: "center",
                                  gap: 5,
                                  padding: "5px 12px",
                                  background: "rgba(13,59,46,0.06)",
                                  borderRadius: 2,
                                  fontSize: 12,
                                  color: FOREST,
                                  fontWeight: 500,
                                }}
                              >
                                <span style={{ opacity: 0.6 }}>⏱</span> {step.time_required}
                              </span>
                              {step.cost_estimate && (
                                <span
                                  style={{
                                    display: "inline-flex",
                                    alignItems: "center",
                                    gap: 5,
                                    padding: "5px 12px",
                                    background: "rgba(139,58,42,0.06)",
                                    borderRadius: 2,
                                    fontSize: 12,
                                    color: EARTH,
                                    fontWeight: 500,
                                  }}
                                >
                                  <span style={{ opacity: 0.6 }}>₦</span> {step.cost_estimate}
                                </span>
                              )}
                            </div>

                            {/* Opportunity link */}
                            {step.opportunity_title && (
                              <div style={{ marginBottom: 16 }}>
                                {step.opportunity_url ? (
                                  <a
                                    href={step.opportunity_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 6,
                                      color: GOLD,
                                      fontWeight: 600,
                                      fontSize: 13,
                                      letterSpacing: "0.02em",
                                      textDecoration: "none",
                                      borderBottom: `1px solid ${GOLD}50`,
                                      paddingBottom: 1,
                                      transition: "color 0.15s",
                                    }}
                                  >
                                    → {step.opportunity_title}
                                  </a>
                                ) : (
                                  <span
                                    style={{
                                      display: "inline-flex",
                                      alignItems: "center",
                                      gap: 6,
                                      color: GOLD,
                                      fontWeight: 600,
                                      fontSize: 13,
                                    }}
                                  >
                                    → {step.opportunity_title}
                                  </span>
                                )}
                              </div>
                            )}

                            {/* Status toggle */}
                            <div style={{ display: "flex", gap: 6 }}>
                              {(["not_started", "in_progress", "done"] as const).map((s) => (
                                <button
                                  key={s}
                                  onClick={() => setStatus(step.step, s)}
                                  style={{
                                    padding: "6px 12px",
                                    borderRadius: 2,
                                    fontSize: 11,
                                    fontWeight: 600,
                                    letterSpacing: "0.06em",
                                    textTransform: "uppercase",
                                    cursor: "pointer",
                                    border: `1px solid ${status === s ? GOLD : "rgba(0,0,0,0.12)"}`,
                                    background: status === s ? GOLD : "transparent",
                                    color: status === s ? OBSIDIAN : "#888",
                                    transition: "all 0.15s",
                                  }}
                                >
                                  {s === "not_started" ? "Not Started" : s === "in_progress" ? "In Progress" : "Done"}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* CTA Section */}
            <div
              style={{
                background: FOREST,
                borderRadius: 4,
                padding: "48px 40px",
                marginTop: 16,
                textAlign: "center",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div className="grain-overlay" />
              <div style={{ position: "relative", zIndex: 1 }}>
                <p className="section-label" style={{ marginBottom: 14 }}>NEXT STEPS</p>
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 28,
                    color: IVORY,
                    marginBottom: 12,
                  }}
                >
                  Ready to apply?
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    color: "rgba(247,242,232,0.7)",
                    marginBottom: 32,
                    maxWidth: 480,
                    margin: "0 auto 32px",
                    lineHeight: 1.7,
                  }}
                >
                  Build a full profile to unlock personalized opportunity matches and get notified when funding deadlines approach.
                </p>
                <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
                  <Link href="/onboarding" className="btn-primary">
                    Build My Full Profile →
                  </Link>
                  <Link href="/feed" className="btn-secondary">
                    Browse All Opportunities →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer
        style={{
          background: OBSIDIAN,
          padding: "40px 24px",
          marginTop: 80,
        }}
      >
        <div
          style={{
            maxWidth: 1200,
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          <Link
            href="/"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 20,
              fontWeight: 700,
              color: IVORY,
              letterSpacing: "-0.02em",
              textDecoration: "none",
            }}
          >
            Alkebulan <span style={{ color: GOLD }}>United</span>
          </Link>
          <p style={{ fontSize: 13, color: "rgba(247,242,232,0.35)" }}>
            © {new Date().getFullYear()} Alkebulan United. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
