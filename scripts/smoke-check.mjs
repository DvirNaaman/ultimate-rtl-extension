// Smoke checks for the built extension.
// Run after `npm run build`. Exits non-zero on any failure.

import { readFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const DIST = "dist";
const SRC = "src";
const fails = [];
const warns = [];
const ok = [];

function check(cond, msg) { (cond ? ok : fails).push(msg); }
function warn(cond, msg) { if (!cond) warns.push(msg); }
function readJson(p) { return JSON.parse(readFileSync(p, "utf8")); }

// --- 1. manifest.json is valid JSON
let mf;
try {
  mf = readJson(join(DIST, "manifest.json"));
  ok.push("manifest.json parses as JSON");
} catch (e) {
  fails.push(`manifest.json invalid JSON: ${e.message}`);
  process.exit(1);
}

// --- 2. version/name/description sanity
check(mf.manifest_version === 3, "manifest_version === 3");
check(typeof mf.name === "string" && mf.name.length > 0, "name present");
check(typeof mf.version === "string" && /^\d+\.\d+\.\d+$/.test(mf.version), `version matches semver (${mf.version})`);
check(typeof mf.description === "string" && mf.description.length <= 132, `description ≤ 132 chars (${mf.description?.length})`);
check(typeof mf.homepage_url === "string" && mf.homepage_url.startsWith("https://"), "homepage_url present and https");

// --- 3. Every file referenced in manifest exists in dist/
function fileExists(rel) {
  return existsSync(join(DIST, rel));
}

check(fileExists(mf.background?.service_worker), `service_worker file exists (${mf.background?.service_worker})`);
check(fileExists(mf.action?.default_popup), `default_popup file exists (${mf.action?.default_popup})`);

for (const [size, path] of Object.entries(mf.action?.default_icon || {})) {
  check(fileExists(path), `action.default_icon[${size}] exists (${path})`);
}
for (const [size, path] of Object.entries(mf.icons || {})) {
  check(fileExists(path), `icons[${size}] exists (${path})`);
}

for (const cs of mf.content_scripts || []) {
  for (const js of cs.js || []) check(fileExists(js), `content_scripts js exists (${js})`);
  for (const css of cs.css || []) check(fileExists(css), `content_scripts css exists (${css})`);
}

// web_accessible_resources patterns
for (const entry of mf.web_accessible_resources || []) {
  for (const pattern of entry.resources || []) {
    // we declared "styles/*.css" — verify at least one matches
    if (pattern.endsWith("*.css")) {
      const dir = pattern.replace(/\*\.css$/, "").replace(/\/$/, "");
      const full = join(DIST, dir);
      check(existsSync(full), `web_accessible_resources directory exists (${full})`);
    }
  }
}

// --- 4. Bundle sizes — sanity (not zero, not absurd)
for (const f of ["service-worker.js", "content-script.js", "popup.js"]) {
  const p = join(DIST, f);
  if (existsSync(p)) {
    const sz = statSync(p).size;
    check(sz > 100, `${f} size > 100 bytes (${sz})`);
    warn(sz < 200_000, `${f} size < 200KB (${sz})`);
  } else {
    fails.push(`bundle missing: ${f}`);
  }
}

// --- 5. All 7 site configs are imported in registry
const registrySrc = readFileSync(join(SRC, "sites/site-registry.js"), "utf8");
const expectedHosts = [
  "claude.ai",
  "chatgpt.com",
  "gemini.google.com",
  "perplexity.ai",
  "copilot.microsoft.com",
  "chat.deepseek.com",
  "grok.com",
];
for (const name of ["claude", "chatgpt", "gemini", "perplexity", "copilot", "deepseek", "grok"]) {
  check(
    registrySrc.includes(`from "./${name}.js"`),
    `registry imports ${name}.js`,
  );
}

// --- 6. Each site config file has a hostname matching its expected value
const hostnameByFile = {
  "claude.js": "claude.ai",
  "chatgpt.js": "chatgpt.com",
  "gemini.js": "gemini.google.com",
  "perplexity.js": "perplexity.ai",
  "copilot.js": "copilot.microsoft.com",
  "deepseek.js": "chat.deepseek.com",
  "grok.js": "grok.com",
};
for (const [f, expected] of Object.entries(hostnameByFile)) {
  const txt = readFileSync(join(SRC, "sites", f), "utf8");
  check(txt.includes(`hostname: "${expected}"`), `${f} hostname === "${expected}"`);
  // cssFile must point at a real file
  const cssMatch = txt.match(/cssFile:\s*"([^"]+)"/);
  if (cssMatch) {
    check(existsSync(join(DIST, cssMatch[1])), `${f} cssFile exists in dist (${cssMatch[1]})`);
  }
}

// --- 7. service-worker TARGET_ORIGINS covers all hosts
const swSrc = readFileSync(join(SRC, "background/service-worker.js"), "utf8");
for (const h of expectedHosts) {
  // hostname may appear with or without wildcard prefix
  const present = swSrc.includes(`/${h}/*`) || swSrc.includes(`.${h}/*`) || swSrc.includes(`//${h}/*`);
  check(present, `service-worker TARGET_ORIGINS includes ${h}`);
}

// --- 8. popup SUPPORTED_HOSTS covers all hosts
const popupSrc = readFileSync(join(SRC, "popup/popup.js"), "utf8");
for (const h of expectedHosts) {
  check(popupSrc.includes(`"${h}"`), `popup SUPPORTED_HOSTS includes ${h}`);
}

// --- 9. manifest host_permissions / content_scripts / web_accessible_resources cover all hosts
const matchesOf = (arr) => (arr || []).join("\n");
const hpStr = matchesOf(mf.host_permissions);
const csStr = matchesOf(mf.content_scripts?.[0]?.matches);
const warStr = matchesOf(mf.web_accessible_resources?.[0]?.matches);
for (const h of expectedHosts) {
  check(hpStr.includes(h), `manifest host_permissions covers ${h}`);
  check(csStr.includes(h), `manifest content_scripts.matches covers ${h}`);
  check(warStr.includes(h), `manifest web_accessible_resources.matches covers ${h}`);
}

// --- Report
const total = ok.length + fails.length;
console.log(`\nSmoke check: ${ok.length}/${total} passed`);
if (warns.length) {
  console.log(`\nWarnings:`);
  for (const w of warns) console.log(`  ! ${w}`);
}
if (fails.length) {
  console.log(`\nFailures:`);
  for (const f of fails) console.log(`  X ${f}`);
  process.exit(1);
} else {
  console.log("\nAll smoke checks passed.");
}
