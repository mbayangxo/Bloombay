import Link from "next/link";
import { CareersApplyForm } from "@/app/components/careers/careers-apply-form";
import { BloomSocialFooter } from "@/app/components/bloom-suite/social-footer";
import "@/app/styles/careers-page.css";

export const metadata = {
  title: "Careers — BloomBay",
  description: "Join the team building a women-first city social network.",
};

export default function CareersPage() {
  return (
    <main className="careers-page">
      <header className="careers-page__header">
        <Link href="/" className="careers-page__logo">
          BloomBay
        </Link>
        <p className="careers-page__kicker">Careers</p>
        <h1>Help us build the city women deserve</h1>
        <p className="careers-page__lead">
          We are hiring curators, operators, engineers, and storytellers who believe in
          real-world connection. Share your resume link and a short note — our founder team
          reviews every application in Mission Control.
        </p>
      </header>

      <CareersApplyForm />
      <BloomSocialFooter light />
    </main>
  );
}
