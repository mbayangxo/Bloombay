"use client";

import { WAITLIST_STATUSES, type WaitlistStatus } from "@/lib/waitlist-admin";

export function StatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: WaitlistStatus;
  onChange: (status: WaitlistStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      className="bb-admin-status-select"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as WaitlistStatus)}
      aria-label="Submission status"
    >
      {WAITLIST_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
