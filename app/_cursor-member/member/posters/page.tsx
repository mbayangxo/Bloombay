import { MemberShell } from "../components/member-shell";
import { PosterDemoGrid } from "@/app/components/poster-templates";
import "@/app/styles/bb-poster-templates.css";

export default function PosterTemplatesDemoPage() {
  return (
    <MemberShell backHref="/member/happenings" backLabel="Happenings" wide>
      <PosterDemoGrid />
    </MemberShell>
  );
}
