import Link from "next/link";
import { COMPANY_LOGIN, MEMBER_LOGIN } from "@/lib/auth/roles";
import { PORTALS } from "@/lib/portal-identity";
import "@/app/styles/portals-index.css";

const PORTAL_CARDS = [
  { key: "member" as const, skin: "member", cta: "Sign in as member" },
  { key: "founder" as const, skin: "founder", cta: "Founder sign-in" },
  { key: "admin" as const, skin: "admin", cta: "Operations sign-in" },
  { key: "clubhouse" as const, skin: "clubhouse", cta: "Club Mama sign-in" },
  { key: "partner" as const, skin: "partner", cta: "Partner sign-in" },
] as const;

export default async function PortalsIndexPage({
  searchParams,
}: {
  searchParams: Promise<{ notice?: string }>;
}) {
  const { notice } = await searchParams;
  const missingEnv = notice === "missing_env";

  return (
    <main className="bb-portals">
      {missingEnv ? (
        <p className="bb-portals__env-warn" role="alert">
          Supabase is not configured. Copy <code>.env.example</code> to <code>.env.local</code> and
          add your project URL and anon key, then restart <code>npm run dev</code>.
        </p>
      ) : null}
      <header className="bb-portals__head">
        <h1>BloomBay portals</h1>
        <p>
          Two front doors: <strong>members</strong> (women in the community) and{" "}
          <strong>company</strong> (founders, Club Mamas, partners, operations). Pick the world that
          matches you — BloomBay routes you after sign-in.
        </p>
        <div className="bb-portals__signin-row">
          <Link href={MEMBER_LOGIN} className="bb-portals__signin-btn bb-portals__signin-btn--member">
            Member sign-in →
          </Link>
          <Link href={COMPANY_LOGIN} className="bb-portals__signin-btn">
            Company sign-in →
          </Link>
        </div>
      </header>

      <ul className="bb-portals__grid">
        {PORTAL_CARDS.map(({ key, skin, cta }) => {
          const p = PORTALS[key];
          const href = key === "member" ? p.login : COMPANY_LOGIN;
          return (
            <li key={key}>
              <Link href={href} className={`bb-portals__card bb-portals__card--${skin}`}>
                <span className="bb-portals__card-kicker">{key === "member" ? "Women" : "Company"}</span>
                <strong className="bb-portals__card-title">{p.name}</strong>
                <span className="bb-portals__card-tagline">{p.tagline}</span>
                <span className="bb-portals__card-who">{p.who}</span>
                <span className="bb-portals__card-cta">{cta} →</span>
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="bb-portals__curator">
        Company staff use one login at <Link href={COMPANY_LOGIN}>/company</Link> — then BloomBay sends
        you to Founder, Operations, Club Mama, or Partner based on your role.
      </p>

      <p className="bb-portals__back">
        <Link href="/">← BloomBay home</Link>
      </p>
    </main>
  );
}
