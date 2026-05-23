// popup.js — drives the on/off toggle.
//
// Reads/writes chrome.storage.sync.rtlEnabled. The service worker watches the
// same key and broadcasts the change to open tabs, so the popup itself does
// not have to message tabs directly.

const STORAGE_KEY = "rtlEnabled";
const SUPPORTED_HOSTS = [
  "claude.ai",
  "chatgpt.com",
  "gemini.google.com",
  "perplexity.ai",
  "copilot.microsoft.com",
  "chat.deepseek.com",
  "grok.com",
];

const toggle = document.getElementById("rtl-toggle");
const status = document.getElementById("status");

init();

async function init() {
  const { [STORAGE_KEY]: enabled } = await chrome.storage.sync.get(STORAGE_KEY);
  const isOn = enabled !== false; // default ON when unset
  toggle.checked = isOn;
  updateStatus(isOn);

  toggle.addEventListener("change", async () => {
    await chrome.storage.sync.set({ [STORAGE_KEY]: toggle.checked });
    updateStatus(toggle.checked);
  });
}

async function updateStatus(isOn) {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const host = tab?.url ? new URL(tab.url).hostname : "";
  const supported = SUPPORTED_HOSTS.some((h) => host === h || host.endsWith("." + h));

  if (!supported) {
    status.textContent = isOn
      ? "RTL is ON. Open a supported site to see it."
      : "RTL is OFF.";
    return;
  }
  status.textContent = isOn
    ? `RTL is ON for ${host}.`
    : `RTL is OFF for ${host}.`;
}
