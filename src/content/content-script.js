// content-script.js — entry point injected into matched pages.
//
// Flow:
//   1. Look up the site config by hostname. If none, do nothing.
//   2. Read the toggle state from chrome.storage.sync.
//   3. Apply or remove the RTL treatment accordingly.
//   4. Listen for state-change messages from the service worker.

import { getSiteConfig } from "../sites/site-registry.js";
import { applyRtl, removeRtl } from "./rtl-engine.js";
import { startObserver, stopObserver } from "./observer.js";

const STORAGE_KEY = "rtlEnabled";

const siteConfig = getSiteConfig(location.hostname);
if (siteConfig) {
  init();
}

async function init() {
  // Register the message listener BEFORE the await, so we don't miss a
  // state change broadcast from the service worker during the storage read.
  chrome.runtime.onMessage.addListener((msg) => {
    if (msg?.type === "ULTIMATE_RTL_STATE") {
      setState(!!msg.enabled);
    }
  });

  const { [STORAGE_KEY]: enabled } = await chrome.storage.sync.get(STORAGE_KEY);
  setState(enabled !== false); // default ON when unset
}

function setState(enabled) {
  if (enabled) {
    applyRtl(siteConfig);
    startObserver();
  } else {
    stopObserver();
    removeRtl();
  }
}
