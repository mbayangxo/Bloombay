import { SEED_GIRLS_WORKING_JOBS } from "./defaults";
import type { GirlsWorkingJob, GirlsWorkingJobType } from "./types";

const STORAGE_KEY = "bb_girls_working_jobs";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function uid() {
  return `gw-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function readAll(): GirlsWorkingJob[] {
  if (!canUseStorage()) return [...SEED_GIRLS_WORKING_JOBS];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      writeAll(SEED_GIRLS_WORKING_JOBS);
      return [...SEED_GIRLS_WORKING_JOBS];
    }
    return JSON.parse(raw) as GirlsWorkingJob[];
  } catch {
    return [...SEED_GIRLS_WORKING_JOBS];
  }
}

function writeAll(jobs: GirlsWorkingJob[]) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  window.dispatchEvent(new CustomEvent("bb-girls-working-updated"));
}

export function listGirlsWorkingJobs(publishedOnly = false): GirlsWorkingJob[] {
  const all = readAll();
  const list = publishedOnly ? all.filter((j) => j.published) : all;
  return list.sort((a, b) => {
    if (a.featured && !b.featured) return -1;
    if (!a.featured && b.featured) return 1;
    return b.updatedAt.localeCompare(a.updatedAt);
  });
}

export function listGirlsWorkingByType(
  jobType: GirlsWorkingJobType | "all",
  publishedOnly = true
): GirlsWorkingJob[] {
  const jobs = listGirlsWorkingJobs(publishedOnly);
  if (jobType === "all") return jobs;
  return jobs.filter((j) => j.jobType === jobType);
}

export function saveGirlsWorkingJob(job: GirlsWorkingJob): GirlsWorkingJob {
  const entry: GirlsWorkingJob = {
    ...job,
    updatedAt: new Date().toISOString(),
  };
  const all = readAll();
  const idx = all.findIndex((j) => j.id === entry.id);
  const next = idx >= 0 ? all.map((j, i) => (i === idx ? entry : j)) : [entry, ...all];
  writeAll(next);
  return entry;
}

export function createGirlsWorkingJob(
  patch: Omit<GirlsWorkingJob, "id" | "updatedAt">
): GirlsWorkingJob {
  return saveGirlsWorkingJob({
    ...patch,
    id: uid(),
    updatedAt: new Date().toISOString(),
  });
}

export function deleteGirlsWorkingJob(id: string) {
  writeAll(readAll().filter((j) => j.id !== id));
}

export function resetGirlsWorkingToSeed() {
  writeAll([...SEED_GIRLS_WORKING_JOBS]);
}
