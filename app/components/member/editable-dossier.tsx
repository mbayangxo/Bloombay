"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  readDossierPhotoFile,
  readMemberDossier,
  saveMemberDossier,
  validateDossierPhoto,
  type MemberDossier,
} from "@/lib/member-dossier-store";
import { hydrateMemberFirstName, readMemberFirstName } from "@/lib/member-display-name";
import { ORCHIDEIA_DOSSIER_TEMPLATE } from "@/lib/member-ui-templates";

type FieldKey = keyof Pick<
  MemberDossier,
  "name" | "archetype" | "sheIs" | "signatureTraits" | "luckyCharm"
>;

const FIELDS: { key: FieldKey; label: string; top: number; placeholder: string }[] = [
  { key: "name", label: "Name", top: 47.5, placeholder: "Your name" },
  { key: "archetype", label: "Archetype", top: 53.5, placeholder: "The Trendsetter" },
  { key: "sheIs", label: "She is…", top: 59.5, placeholder: "the girl everyone copies without realizing" },
  { key: "signatureTraits", label: "Signature traits", top: 65.5, placeholder: "Minimalist, polished, cool" },
  { key: "luckyCharm", label: "Lucky charm", top: 71.5, placeholder: "Rose lip tint" },
];

export function EditableDossier({ className = "" }: { className?: string }) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [dossier, setDossier] = useState<MemberDossier>(() => readMemberDossier());
  const [photoError, setPhotoError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(() => {
    const stored = readMemberDossier();
    const first = readMemberFirstName();
    setDossier({
      ...stored,
      name: stored.name || first || "",
    });
  }, []);

  useEffect(() => {
    refresh();
    void hydrateMemberFirstName().then((first) => {
      if (first && !readMemberDossier().name) {
        saveMemberDossier({ name: first });
        refresh();
      }
    });
    window.addEventListener("bb-member-dossier-updated", refresh);
    return () => window.removeEventListener("bb-member-dossier-updated", refresh);
  }, [refresh]);

  function updateField(key: FieldKey, value: string) {
    const next = { ...dossier, [key]: value };
    setDossier(next);
    saveMemberDossier({ [key]: value });
  }

  async function onPhotoPick(file: File | undefined) {
    if (!file) return;
    const err = validateDossierPhoto(file);
    if (err) {
      setPhotoError(err);
      return;
    }
    setBusy(true);
    setPhotoError(null);
    try {
      const dataUrl = await readDossierPhotoFile(file);
      saveMemberDossier({ photoUrl: dataUrl });
      setDossier((d) => ({ ...d, photoUrl: dataUrl }));
    } catch (e) {
      setPhotoError(e instanceof Error ? e.message : "Could not save photo.");
    } finally {
      setBusy(false);
    }
  }

  const displayName = dossier.name.trim() || "Your";
  const title = `${displayName.toUpperCase()} DOSSIER`;

  return (
    <div className={`bb-editable-dossier${className ? ` ${className}` : ""}`}>
      <div className="bb-editable-dossier__frame">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={ORCHIDEIA_DOSSIER_TEMPLATE}
          alt=""
          className="bb-editable-dossier__badge"
          width={592}
          height={855}
          draggable={false}
        />

        <div className="bb-editable-dossier__overlays" aria-label="Your Bloom dossier">
          <p className="bb-editable-dossier__title" aria-hidden>
            {title}
          </p>

          <button
            type="button"
            className="bb-editable-dossier__photo"
            aria-label={dossier.photoUrl ? "Change your dossier photo" : "Add your dossier photo"}
            disabled={busy}
            onClick={() => fileRef.current?.click()}
          >
            {dossier.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={dossier.photoUrl} alt="" className="bb-editable-dossier__photo-img" draggable={false} />
            ) : (
              <span className="bb-editable-dossier__photo-empty">+ photo</span>
            )}
          </button>

          {FIELDS.map((field) => (
            <label
              key={field.key}
              className="bb-editable-dossier__field"
              style={{ top: `${field.top}%` }}
            >
              <span className="bb-editable-dossier__field-label">{field.label}</span>
              <input
                className="bb-editable-dossier__input"
                value={dossier[field.key]}
                placeholder={field.placeholder}
                onChange={(e) => updateField(field.key, e.target.value)}
                aria-label={field.label}
              />
            </label>
          ))}
        </div>

        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="bb-editable-dossier__file"
          tabIndex={-1}
          aria-hidden
          onChange={(e) => {
            void onPhotoPick(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
      </div>
      {photoError ? (
        <p className="bb-editable-dossier__error" role="alert">
          {photoError}
        </p>
      ) : null}
    </div>
  );
}
