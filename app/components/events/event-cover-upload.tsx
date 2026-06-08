"use client";

import Image from "next/image";

export function EventCoverUpload({
  coverUrl,
  onCoverChange,
  label = "Event cover",
}: {
  coverUrl: string;
  onCoverChange: (url: string) => void;
  label?: string;
}) {
  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 2_500_000) {
      alert("Cover image should be under 2.5MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") onCoverChange(reader.result);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="bb-event-cover">
      <p className="bb-event-cover__label">{label}</p>
      <div
        className="bb-event-cover__preview"
        style={
          coverUrl
            ? { backgroundImage: `url(${coverUrl})` }
            : { background: "linear-gradient(135deg, #ffb7ce, #ff2d8a)" }
        }
      >
        {!coverUrl ? <span className="bb-event-cover__placeholder">Upload cover</span> : null}
        {coverUrl && coverUrl.startsWith("data:") ? (
          <Image src={coverUrl} alt="" fill unoptimized className="bb-event-cover__img" />
        ) : coverUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coverUrl} alt="" className="bb-event-cover__img-el" />
        ) : null}
      </div>
      <div className="bb-event-cover__actions">
        <label className="fp-portal-btn">
          Choose image
          <input type="file" accept="image/*" hidden onChange={onFile} />
        </label>
        {coverUrl ? (
          <button type="button" className="fp-portal-btn" onClick={() => onCoverChange("")}>
            Remove
          </button>
        ) : null}
      </div>
    </div>
  );
}
