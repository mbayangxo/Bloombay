import { FounderShell } from "@/app/components/admin/founder-shell";
import { MessagingStudio } from "@/app/components/founder/messaging-studio";

export default function FounderMessagingPage() {
  return (
    <FounderShell title="Messaging Studio" subtitle="Automated member emails, SMS, and in-app messages." compactHeader>
      <MessagingStudio />
    </FounderShell>
  );
}
