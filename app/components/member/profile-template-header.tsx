import { EditableDossier } from "./editable-dossier";

export function ProfileTemplateHeader({
  name,
}: {
  name: string;
  location?: string;
  templateSrc?: string;
}) {
  void name;
  return (
    <header className="bb-profile-dossier" aria-label="Your Bloom dossier">
      <EditableDossier />
    </header>
  );
}
