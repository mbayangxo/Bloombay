#!/usr/bin/env node
/**
 * Phase 2 bug bash — automated gate before manual QA.
 * Usage: node scripts/bug-bash-gate.mjs
 */

import { execSync, spawnSync } from "child_process";

const steps = [
  { name: "typecheck", cmd: "npx tsc --noEmit" },
  { name: "smoke-blocker6", cmd: "node scripts/smoke-blocker6-legacy-events.mjs" },
  { name: "smoke-blocker7", cmd: "node scripts/smoke-blocker7-club-mama.mjs" },
  { name: "smoke-welcome-auth", cmd: "node scripts/smoke-welcome-auth.mjs" },
  { name: "role-walkthrough", cmd: "node scripts/role-walkthrough-staging.mjs" },
];

const optional = new Set(["smoke-welcome-auth"]);

console.log("\n══ BloomBay Bug Bash — automated gate ══\n");

let failed = 0;
for (const step of steps) {
  process.stdout.write(`\n▶ ${step.name}\n`);
  const r = spawnSync(step.cmd, { shell: true, stdio: "inherit", env: process.env });
  if (r.status !== 0) {
    if (optional.has(step.name)) {
      console.log(`🟡 ${step.name}: skipped/failed (optional)`);
    } else {
      console.log(`❌ ${step.name}: FAILED`);
      failed++;
    }
  } else {
    console.log(`✅ ${step.name}: passed`);
  }
}

console.log("\n▶ npm audit (production)");
try {
  execSync("npm audit --production", { stdio: "inherit" });
} catch {
  console.log("🟡 npm audit: vulnerabilities reported — review manually");
}

console.log(failed ? `\n══ Gate FAILED (${failed} required step(s)) ══\n` : "\n══ Automated gate PASSED — proceed to manual bug bash ══\n");
process.exit(failed ? 1 : 0);
