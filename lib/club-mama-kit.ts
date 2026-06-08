/**
 * Club Mama kit — house rules (versioned + acceptance), visual templates, BloomBay objects.
 */

import type { PosterTemplateType } from "@/lib/poster-templates/types";

export type ClubRulesDoc = {
  text: string;
  version: number;
  requireAccept: boolean;
  updatedAt: string;
};

export type CustomClubTemplate = {
  id: string;
  name: string;
  /** Data URL or hosted URL from upload */
  imageUrl: string;
  posterType?: PosterTemplateType;
  createdAt: string;
};

export type ClubMamaKit = {
  posterTemplate: PosterTemplateType;
  bloomObjectKeys: string[];
  customTemplates: CustomClubTemplate[];
  accentObjectKey?: string;
};

const RULES_PREFIX = "bb_club_rules_doc_";
const KIT_PREFIX = "bb_club_mama_kit_";
const ACCEPT_PREFIX = "bb_club_rules_accept_";

const DEFAULT_RULES_TEXT =
  "Be kind. Show up if you RSVP. Respect the women-only space. No spam in club channels.";

function canUseStorage() {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

function readJson<T>(key: string, fallback: T): T {
  if (!canUseStorage()) return fallback;
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson(key: string, value: unknown) {
  if (!canUseStorage()) return;
  localStorage.setItem(key, JSON.stringify(value));
}

/** Migrate legacy plain-text rules key */
function migrateLegacyRules(clubId: string): ClubRulesDoc | null {
  if (!canUseStorage()) return null;
  const legacy = localStorage.getItem(`bb_club_rules_${clubId}`);
  if (!legacy?.trim()) return null;
  const doc: ClubRulesDoc = {
    text: legacy,
    version: 1,
    requireAccept: true,
    updatedAt: new Date().toISOString(),
  };
  saveClubRules(clubId, doc);
  return doc;
}

export function getClubRules(clubId: string): ClubRulesDoc {
  const stored = readJson<ClubRulesDoc | null>(`${RULES_PREFIX}${clubId}`, null);
  if (stored?.text) return stored;
  const migrated = migrateLegacyRules(clubId);
  if (migrated) return migrated;
  return {
    text: DEFAULT_RULES_TEXT,
    version: 1,
    requireAccept: true,
    updatedAt: new Date().toISOString(),
  };
}

export function saveClubRules(clubId: string, patch: Partial<ClubRulesDoc> & { text: string }) {
  const prev = getClubRules(clubId);
  const textChanged = patch.text.trim() !== prev.text.trim();
  const next: ClubRulesDoc = {
    text: patch.text.trim(),
    requireAccept: patch.requireAccept ?? prev.requireAccept,
    version: textChanged ? prev.version + 1 : prev.version,
    updatedAt: new Date().toISOString(),
  };
  writeJson(`${RULES_PREFIX}${clubId}`, next);
  if (canUseStorage()) {
    localStorage.setItem(`bb_club_rules_${clubId}`, next.text);
  }
}

export function getClubMamaKit(clubId: string): ClubMamaKit {
  return readJson<ClubMamaKit>(`${KIT_PREFIX}${clubId}`, {
    posterTemplate: "club",
    bloomObjectKeys: ["door", "bouquet"],
    customTemplates: [],
  });
}

export function saveClubMamaKit(clubId: string, patch: Partial<ClubMamaKit>) {
  const current = getClubMamaKit(clubId);
  writeJson(`${KIT_PREFIX}${clubId}`, { ...current, ...patch });
}

export function addCustomTemplate(
  clubId: string,
  input: { name: string; imageUrl: string; posterType?: PosterTemplateType }
) {
  const kit = getClubMamaKit(clubId);
  const entry: CustomClubTemplate = {
    id: `tpl-${Date.now()}`,
    name: input.name,
    imageUrl: input.imageUrl,
    posterType: input.posterType,
    createdAt: new Date().toISOString(),
  };
  saveClubMamaKit(clubId, {
    customTemplates: [entry, ...kit.customTemplates].slice(0, 12),
  });
  return entry;
}

export function removeCustomTemplate(clubId: string, templateId: string) {
  const kit = getClubMamaKit(clubId);
  saveClubMamaKit(clubId, {
    customTemplates: kit.customTemplates.filter((t) => t.id !== templateId),
  });
}

type RulesAcceptance = { version: number; acceptedAt: string };

export function getRulesAcceptance(clubId: string): RulesAcceptance | null {
  return readJson<RulesAcceptance | null>(`${ACCEPT_PREFIX}${clubId}`, null);
}

export function hasAcceptedClubRules(clubId: string): boolean {
  const rules = getClubRules(clubId);
  if (!rules.requireAccept) return true;
  const acc = getRulesAcceptance(clubId);
  return acc !== null && acc.version >= rules.version;
}

export function acceptClubRules(clubId: string) {
  const rules = getClubRules(clubId);
  writeJson(`${ACCEPT_PREFIX}${clubId}`, {
    version: rules.version,
    acceptedAt: new Date().toISOString(),
  });
}

export function clearRulesAcceptance(clubId: string) {
  if (!canUseStorage()) return;
  localStorage.removeItem(`${ACCEPT_PREFIX}${clubId}`);
}
