// observer.js — MutationObserver wrapper.
//
// AI replies stream in token-by-token and new message nodes are added
// continuously. We watch the document for added nodes and re-apply per-node
// dir="auto" marking via the engine.

import { markNode, markExistingMessages, getActiveConfig } from "./rtl-engine.js";

let observer = null;

export function startObserver() {
  if (observer) return;
  observer = new MutationObserver((mutations) => {
    const cfg = getActiveConfig();
    if (!cfg) return;
    const messageSel = cfg.selectors?.message;
    if (!messageSel) return; // placeholder phase

    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (!(node instanceof Element)) continue;
        if (node.matches?.(messageSel)) {
          markNode(node);
        }
        // descendants
        for (const child of node.querySelectorAll?.(messageSel) ?? []) {
          markNode(child);
        }
      }
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });

  // catch anything already on the page
  markExistingMessages();
}

export function stopObserver() {
  if (!observer) return;
  observer.disconnect();
  observer = null;
}
