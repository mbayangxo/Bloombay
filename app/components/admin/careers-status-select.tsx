"use client";

import { CAREER_STATUSES, type CareerApplicationStatus } from "@/lib/careers-admin";

export function CareersStatusSelect({
  value,
  onChange,
  disabled,
}: {
  value: CareerApplicationStatus;
  onChange: (status: CareerApplicationStatus) => void;
  disabled?: boolean;
}) {
  return (
    <select
      className="bb-admin-status-select"
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value as CareerApplicationStatus)}
      aria-label="Application status"
    >
      {CAREER_STATUSES.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
