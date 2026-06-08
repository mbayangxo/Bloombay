#!/usr/bin/env node
/**
 * Quick internal link audit — member / founder / club-owner / partner / admin pages.
 * Run: node scripts/audit-portal-links.mjs
 */
import fs from "fs";
import path from "path";

const ROOT = path.resolve(import.meta.dirname, "..");
const APP = path.join(ROOT, "app");

function collectPages(dir, base = "") {
  const pages = new Set();
  if (!fs.existsSync(dir)) return pages;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const rel = path.join(base, ent.name);
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      for (const p of collectPages(full, rel)) pages.add(p);
    } else if (ent.name === "page.tsx") {
      const route = rel
        .replace(/\\/g, "/")
        .replace(/\/page\.tsx$/, "")
        .replace(/\[\.\.\.[^\]]+\]/g, "*")
        .replace(/\[[^\]]+\]/g, "[id]");
      pages.add("/" + route.replace(/^\//, ""));
    }
  }
  return pages;
}

function extractHrefs(file) {
  const text = fs.readFileSync(file, "utf8");
  const hrefs = [];
  const re = /href=["'{]([^"'{}]+)["'}]/g;
  let m;
  while ((m = re.exec(text))) {
    const h = m[1];
    if (h.startsWith("/") && !h.startsWith("//")) hrefs.push(h.split("?")[0].split("#")[0]);
  }
  return hrefs;
}

function walkTsx(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const ent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walkTsx(full, out);
    else if (ent.name.endsWith(".tsx")) out.push(full);
  }
  return out;
}

const portals = ["member", "founder", "club-owner", "partner", "admin", "curator", "(site)"];
const allPages = new Set();
for (const p of portals) {
  const dir = p === "(site)" ? path.join(APP, "(site)") : path.join(APP, p);
  for (const page of collectPages(dir, p === "(site)" ? "(site)" : p)) allPages.add(page);
}

const missing = new Map();
for (const portal of portals) {
  const dir = portal === "(site)" ? path.join(APP, "(site)") : path.join(APP, portal);
  for (const file of walkTsx(dir)) {
    for (const href of extractHrefs(file)) {
      if (!href.startsWith(`/${portal === "(site)" ? "" : portal}`) && !href.startsWith("/member") && portal === "member") {
        /* cross-portal links ok */
      }
      const normalized = href.replace(/\/$/, "") || "/";
      const candidates = [normalized];
      if (normalized.includes("[id]")) continue;
      const ok = [...allPages].some((page) => {
        if (page === normalized) return true;
        if (normalized.endsWith("/") && page === normalized.slice(0, -1)) return true;
        return false;
      }) || [...allPages].some((page) => {
        if (!page.includes("[id]")) return false;
        const pattern = new RegExp("^" + page.replace(/\[id\]/g, "[^/]+") + "$");
        return pattern.test(normalized);
      });
      if (!ok && normalized.startsWith("/member")) {
        const key = normalized;
        if (!missing.has(key)) missing.set(key, []);
        missing.get(key).push(path.relative(ROOT, file));
      }
    }
  }
}

if (missing.size === 0) {
  console.log("✓ No broken /member hrefs detected against page.tsx routes.");
  process.exit(0);
}

console.log("Broken /member hrefs:");
for (const [href, files] of missing) {
  console.log(`  ${href}`);
  for (const f of files.slice(0, 3)) console.log(`    - ${f}`);
}
process.exit(1);
