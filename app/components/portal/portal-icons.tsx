"use client";

import { PortalUtilityIcons } from "./portal-utility-icons";

/** Upper-right utility rail: pin drops · mailbox · chats · apartment */
export function PortalIcons({ initial = "M" }: { initial?: string }) {
  return (
    <PortalUtilityIcons
      showApartmentInitial={initial}
      iconClassName="bb-portal-fixed-icons__btn"
    />
  );
}
