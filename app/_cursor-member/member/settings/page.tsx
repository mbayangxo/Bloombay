"use client";

import Link from "next/link";
import { MemberShell } from "../components/member-shell";
import { MemberSignOutButton } from "../components/member-sign-out-button";
import { SettingsAppearance } from "../components/settings-appearance";
import { SettingsNotifications } from "../components/settings-notifications";
import { SettingsProfile } from "../components/settings-profile";
import { SettingsVerificationRow } from "../components/settings-verification-row";

export default function SettingsPage() {
  return (
    <MemberShell backHref="/member/profile" backLabel="You">
      <div className="mp-hero">
        <h1 className="mp-hero__title">Settings</h1>
      </div>

      <div className="mp-settings-group">
        <SettingsProfile />
        <SettingsAppearance />
        <SettingsNotifications />
        <SettingsVerificationRow />
      </div>

      <div className="mp-settings-group">
        <Link href="/member/settings/safety" className="mp-settings-row">
          Blocked members
          <span>→</span>
        </Link>
        <Link href="/member/settings/contact" className="mp-settings-row">
          Contact BloomBay
          <span>→</span>
        </Link>
      </div>

      <div className="mp-settings-group">
        <MemberSignOutButton />
        <Link href="/member/settings/account" className="mp-settings-row">
          Account &amp; delete
          <span>→</span>
        </Link>
      </div>
    </MemberShell>
  );
}
