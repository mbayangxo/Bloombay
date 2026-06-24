import { FounderShell } from "@/app/components/admin/founder-shell";
import { ContentModeration } from "@/app/components/admin/portal/content-moderation";

export default function ContentModerationPage() {
  return (
    <FounderShell title="Content Review" compactHeader>
      <ContentModeration />
    </FounderShell>
  );
}
