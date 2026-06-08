"use client";

import { Suspense, useEffect, useState } from "react";
import { PortalAccessNotice } from "@/app/components/auth/portal-access-notice";
import { MemberShell } from "../components/member-shell";
import { HomeScrapbookCanvas } from "@/app/components/member/home-scrapbook-canvas";
import { SpaceMood } from "@/app/components/member/space-mood";
import { getTimeOfDayGreeting } from "@/lib/time-of-day";
import { hydrateMemberFirstName, readMemberFirstName } from "@/lib/member-display-name";
import { getCityAtmosphere } from "@/lib/city-atmosphere";

export default function MemberHomePage() {
  const [name, setName] = useState("");
  const [greeting, setGreeting] = useState(() => getTimeOfDayGreeting());
  const [atmosphere, setAtmosphere] = useState(() => getCityAtmosphere());

  useEffect(() => {
    setGreeting(getTimeOfDayGreeting());
    setAtmosphere(getCityAtmosphere());
    setName(readMemberFirstName());
    void hydrateMemberFirstName().then((first) => {
      if (first) setName(first);
    });
    const t = setInterval(() => {
      setGreeting(getTimeOfDayGreeting());
      setAtmosphere(getCityAtmosphere());
    }, 60_000);
    return () => clearInterval(t);
  }, []);

  return (
    <MemberShell hideHeader flush fullWidth>
      <SpaceMood mood="home" showIntro={false}>
        <Suspense fallback={null}>
          <PortalAccessNotice />
        </Suspense>
        <div className="mp-home-scroll">
          <HomeScrapbookCanvas greeting={greeting} name={name} atmosphere={atmosphere} />
        </div>
      </SpaceMood>
    </MemberShell>
  );
}
