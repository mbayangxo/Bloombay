"use client";

import { useState } from "react";
import { FloatingPetals } from "../waitlist-invitation/petals";
import { HeroFloat, SuiteAtmosphere } from "./atmosphere";
import {
  BloomMeterSupport,
  CharterSupport,
  CityCardSupport,
  ClubStackSupport,
  HeroInvitation,
  MembershipPinSupport,
  ReplyCard,
} from "./room-objects";

export function BloomRoom() {
  const [replyVisible, setReplyVisible] = useState(false);
  const [rsvpSent, setRsvpSent] = useState(false);
  const [charterOpen, setCharterOpen] = useState(false);

  return (
    <div className="invitation-suite relative h-full min-h-screen w-full overflow-hidden bg-ivory text-ink">
      <SuiteAtmosphere />
      <FloatingPetals />

      {/* Supporting objects — edges only, never compete with hero */}
      <ClubStackSupport className="support-object support-object--clubs" />
      <BloomMeterSupport className="support-object support-object--meter" />
      <CityCardSupport className="support-object support-object--city" />
      <CharterSupport
        className="support-object support-object--charter"
        open={charterOpen}
        onOpen={() => setCharterOpen(true)}
        onClose={() => setCharterOpen(false)}
      />
      <MembershipPinSupport className="support-object support-object--pin" />

      {/* Hero — always center, always first */}
      <main className="relative z-20 flex min-h-screen flex-col items-center justify-center px-4 py-16">
        <HeroFloat>
        <div className="relative w-full max-w-[600px]">
          <HeroInvitation
            onOpenReply={() => setReplyVisible(true)}
            onFoundingMother={() => setCharterOpen(true)}
          />
          <ReplyCard
            visible={replyVisible}
            submitted={rsvpSent}
            onSubmit={() => setRsvpSent(true)}
            onClose={() => setReplyVisible(false)}
          />
        </div>
        </HeroFloat>
      </main>
    </div>
  );
}
