// rtl-engine.js — apply/remove the RTL transformation for the active site.
//
// Two responsibilities:
//   1. Inject a <link rel="stylesheet"> (or fallback <style>) pointing at the
//      site's bundled CSS file, tagged with a known id so it can be removed
//      cleanly.
//   2. Walk visible message nodes and set dir="auto" on each so the browser
//      picks per-message direction by first strong character.
//
// Toggling off must leave the page in its original state — no leftover styles,
// no leftover dir attributes added by us.

const STYLE_EL_ID = "ultimate-rtl-style";
const DIR_MARK_ATTR = "data-ultimate-rtl-dir";

let activeConfig = null;

export function applyRtl(siteConfig) {
  activeConfig = siteConfig;

  if (!document.getElementById(STYLE_EL_ID)) {
    const link = document.createElement("link");
    link.id = STYLE_EL_ID;
    link.rel = "stylesheet";
    link.href = chrome.runtime.getURL("styles/base-rtl.css");
    (document.head || document.documentElement).appendChild(link);

    if (siteConfig.cssFile) {
      const siteLink = document.createElement("link");
      siteLink.id = STYLE_EL_ID + "-site";
      siteLink.rel = "stylesheet";
      siteLink.href = chrome.runtime.getURL(siteConfig.cssFile);
      (document.head || document.documentElement).appendChild(siteLink);
    }
  }

  markExistingMessages(siteConfig);
}

export function removeRtl() {
  for (const id of [STYLE_EL_ID, STYLE_EL_ID + "-site"]) {
    const el = document.getElementById(id);
    if (el) el.remove();
  }
  // remove dir="auto" we added (tracked by our marker attribute)
  for (const el of document.querySelectorAll(`[${DIR_MARK_ATTR}]`)) {
    el.removeAttribute("dir");
    el.removeAttribute(DIR_MARK_ATTR);
  }
  activeConfig = null;
}

export function markExistingMessages(siteConfig = activeConfig) {
  if (!siteConfig) return;
  const sel = siteConfig.selectors?.message;
  if (!sel) return; // placeholder phase — selector not yet known
  for (const el of document.querySelectorAll(sel)) {
    markNode(el);
  }
}

export function markNode(el) {
  if (!(el instanceof Element)) return;
  if (el.hasAttribute(DIR_MARK_ATTR)) return;
  el.setAttribute("dir", "auto");
  el.setAttribute(DIR_MARK_ATTR, "1");
}

export function getActiveConfig() {
  return activeConfig;
}
