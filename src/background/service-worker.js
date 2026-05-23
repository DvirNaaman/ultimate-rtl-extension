// Ultimate RTL — background service worker
// Responsibilities:
//   1. Maintain the single global toggle state (`rtlEnabled`) in chrome.storage.sync.
//   2. Default it to ON the first time the extension runs.
//   3. Broadcast state changes to all open tabs on the three target sites so
//      the content script can apply or remove RTL without a page reload.

const STORAGE_KEY = "rtlEnabled";
const TARGET_ORIGINS = [
  "https://claude.ai/*",
  "https://chatgpt.com/*",
  "https://gemini.google.com/*",
  "https://*.perplexity.ai/*",
  "https://copilot.microsoft.com/*",
  "https://chat.deepseek.com/*",
  "https://grok.com/*",
];

async function ensureDefaultState() {
  const { [STORAGE_KEY]: current } = await chrome.storage.sync.get(STORAGE_KEY);
  if (typeof current !== "boolean") {
    await chrome.storage.sync.set({ [STORAGE_KEY]: true });
  }
}

chrome.runtime.onInstalled.addListener(ensureDefaultState);
chrome.runtime.onStartup.addListener(ensureDefaultState);

chrome.storage.onChanged.addListener(async (changes, area) => {
  if (area !== "sync" || !changes[STORAGE_KEY]) return;
  const enabled = changes[STORAGE_KEY].newValue === true;

  const tabs = await chrome.tabs.query({ url: TARGET_ORIGINS });
  for (const tab of tabs) {
    if (tab.id == null) continue;
    chrome.tabs
      .sendMessage(tab.id, { type: "ULTIMATE_RTL_STATE", enabled })
      .catch(() => {
        // content script might not be loaded yet on that tab — safe to ignore
      });
  }
});
