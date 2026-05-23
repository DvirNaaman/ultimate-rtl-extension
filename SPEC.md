# Ultimate RTL — Chrome Extension SPEC

> A Chrome extension that flips the chat interface of major AI chat sites
> (Claude, ChatGPT, Gemini) to right-to-left — both the user's input and
> the AI's output — so people working in RTL languages can read and write
> naturally.
>
> The extension UI itself is in **English**: this is a tool for *anyone*
> who wants an RTL workflow, not only Hebrew/Arabic speakers.

---

## 1. The problem

On claude.ai, chatgpt.com and gemini.google.com, the chat is rendered
left-to-right. When a user writes in Hebrew, Arabic or any RTL language —
especially mixed with English words or numbers — the text is misaligned
and the bidirectional (bidi) character order breaks: letters jump,
punctuation lands on the wrong side, words look reversed.

Unlike a VS Code extension (which cannot touch another extension's
webview), a Chrome extension runs on ordinary web pages and is *designed*
to inject CSS and JavaScript into them. This makes the fix achievable.

---

## 2. Scope

### ✅ In scope (v1)
- Three target sites from the start: **claude.ai, chatgpt.com,
  gemini.google.com**.
- Flip chat layout to RTL: message list, individual messages, the
  input/composer box.
- Apply `direction: rtl` so the browser's native bidi algorithm
  correctly orders mixed Hebrew/Arabic + English/number text.
- A popup with a single **on/off toggle**. Extension stays installed
  and enabled; the toggle only controls whether the RTL transformation
  is applied. Default: ON.
- Per-site behavior: the transformation auto-applies on any of the three
  sites whenever the toggle is ON.
- State persists across browser restarts.

### ❌ Out of scope (v1)
- Sites other than the three above (easy to add later — see §9).
- Translating or modifying message *content* — only direction/layout.
- Per-site individual toggles (global toggle only in v1).
- Any account, server, or external API. Fully client-side.

---

## 3. Design principles

1. **Resilient to site changes.** Claude/ChatGPT/Gemini change their HTML
   and CSS class names frequently. All CSS selectors and DOM assumptions
   live in **one config file per site**, so a break is a one-file fix.
2. **CSS-first, JS-second.** Prefer static CSS injection. Use JavaScript
   only where CSS alone cannot reach (e.g. dynamically added messages).
3. **No layout destruction.** Flipping direction must not break code
   blocks, which must stay LTR and left-aligned. Code, `<pre>`, and
   inline `<code>` are explicitly kept LTR.
4. **English UI.** All extension-facing text in English.
5. **Minimal permissions.** Request only the three target domains.
6. **Manifest V3.** Current required standard for new Chrome extensions.

---

## 4. Architecture

```
ultimate-rtl/
├── manifest.json             # MV3 manifest: permissions, content scripts
├── src/
│   ├── background/
│   │   └── service-worker.js # stores toggle state, broadcasts changes
│   ├── content/
│   │   ├── content-script.js # entry: reads state, applies/removes RTL
│   │   ├── rtl-engine.js      # core: inject/remove CSS, observe DOM
│   │   └── observer.js        # MutationObserver for dynamic messages
│   ├── sites/
│   │   ├── claude.js          # selectors + tweaks for claude.ai
│   │   ├── chatgpt.js         # selectors + tweaks for chatgpt.com
│   │   ├── gemini.js          # selectors + tweaks for gemini.google.com
│   │   └── site-registry.js   # maps hostname → site config
│   ├── styles/
│   │   ├── base-rtl.css       # shared RTL rules
│   │   ├── claude.css         # site-specific overrides
│   │   ├── chatgpt.css
│   │   └── gemini.css
│   └── popup/
│       ├── popup.html         # the on/off toggle UI (English)
│       ├── popup.js
│       └── popup.css
├── icons/                     # 16 / 48 / 128 px
├── README.md                  # English
├── CHANGELOG.md
└── LICENSE
```

### Data flow
1. Popup toggle writes state to `chrome.storage.sync` (key: `rtlEnabled`).
2. `service-worker.js` listens for storage changes and notifies open
   tabs of the three sites.
3. `content-script.js` runs on page load on a matched site:
   - reads `rtlEnabled` from storage;
   - if ON → `rtl-engine.js` injects the site's CSS and starts the
     `MutationObserver`;
   - if OFF → ensures any injected CSS is removed.
4. `observer.js` watches for newly streamed AI messages and ensures the
   RTL treatment is applied to them as they appear.

---

## 5. The RTL engine (`rtl-engine.js`)

- **Apply:** inject a `<style>` element (or `<link>` to the bundled CSS)
  into the page `<head>`, tagged with a known id so it can be found and
  removed later. The CSS sets `direction: rtl` and `text-align: right`
  on the chat containers identified by the active site config.
- **Remove:** delete that `<style>`/`<link>` element by id. Toggling OFF
  must fully restore the original LTR layout with no leftover styles.
- **Dynamic content:** AI responses stream in token by token and new
  message nodes are added continuously. A `MutationObserver` on the
  message-list container re-applies any per-node treatment (e.g. setting
  `dir="auto"` on message elements) as nodes appear.
- **Code stays LTR:** the CSS explicitly forces `direction: ltr;
  text-align: left;` on `pre`, `code`, and the sites' code-block
  wrappers, so code is never flipped.

### Why `dir="auto"` matters
Setting `dir="auto"` on each message element lets the browser pick
direction per message based on its first strong character — a Hebrew
message becomes RTL, an English one stays LTR. Combined with the RTL
container, this is what makes mixed-language chats read correctly.

---

## 6. Per-site config (`sites/*.js`)

Each site file exports a small config object — no logic, just data —
so updating a broken selector is trivial:

```js
// example shape — verify actual selectors during development
export const claudeConfig = {
  hostname: "claude.ai",
  selectors: {
    chatContainer: "<selector for the scrolling message list>",
    message:       "<selector for a single message bubble>",
    composer:      "<selector for the input textarea/box>",
    codeBlock:     "<selector for code block wrappers>",
  },
};
```

`site-registry.js` maps the current `window.location.hostname` to the
right config. If the hostname matches none, the extension does nothing.

> NOTE FOR IMPLEMENTATION: the real selectors must be discovered by
> inspecting each site's live DOM. Do not hardcode guesses. Build a
> short manual procedure to re-capture selectors when a site changes.

---

## 7. Popup UI (`popup/`)

- A single, clearly labeled **toggle switch**: "Enable RTL".
- Reflects current state from `chrome.storage.sync`.
- Optional: a short line showing which site the current tab is, and
  whether RTL is currently active there.
- All text in English. Clean, minimal, one-purpose UI.

---

## 8. manifest.json (MV3 essentials)

- `manifest_version: 3`
- `permissions`: `storage` (for the toggle state).
- `host_permissions`: exactly the three domains —
  `https://claude.ai/*`, `https://chatgpt.com/*`,
  `https://gemini.google.com/*`. Nothing broader.
- `content_scripts`: matched to the three domains, loading the content
  scripts and (optionally) the CSS.
- `background.service_worker`: points to `service-worker.js`.
- `action`: defines the popup.
- `icons`: 16/48/128.

> Requesting only the three needed domains (not `<all_urls>`) keeps the
> Chrome Web Store review smooth and reassures users.

---

## 9. Roadmap

### v1 — MVP
- Three sites, global on/off toggle, RTL layout + `dir="auto"`,
  code blocks kept LTR, state persistence.

### v1.x
- More sites (Perplexity, Copilot, Mistral, etc.) — each is just a new
  `sites/*.js` + `styles/*.css` pair, no core changes.
- Per-site individual toggles.
- Optional: keyboard shortcut to toggle.

### v2 — research only
- Smarter bidi handling for stubborn mixed segments (wrapping isolates)
  if `dir="auto"` alone proves insufficient on some site.

---

## 10. Testing (Definition of Done for v1)

For **each** of the three sites:
- With toggle ON: open the site, send a Hebrew message with an English
  word inside → the message reads correctly, right-aligned, no jumping.
- The AI's streamed response is also right-aligned and correctly ordered.
- A response containing a code block → the code block stays LTR and
  left-aligned, not flipped.
- Toggle OFF → layout fully reverts to the site's original LTR, no
  leftover styling.
- Toggle state survives a browser restart.
- New messages sent after toggling stay consistent with current state.
- Extension requests only the three declared domains; no console errors.

---

## 11. GitHub & publishing

- License: the project owner has not yet chosen one — leave a `LICENSE`
  placeholder and let the owner decide (MIT, Apache-2.0 and GPL-3.0 are
  the common options; this is the owner's call, not a default).
- `README.md` in English: what it does, supported sites, how to install
  unpacked for development, how to use the toggle.
- `CHANGELOG.md` in Keep a Changelog format.
- Local development needs no payment: load the unpacked extension via
  `chrome://extensions` → Developer mode → "Load unpacked".
- Publishing to the Chrome Web Store requires a one-time $5 developer
  registration fee; that step is the owner's decision and comes later.

---

## 12. Points to verify during development

1. The real, current DOM selectors for the chat container, message
   element, composer, and code blocks on each of the three sites.
2. Whether each site already sets any `dir` attribute that must be
   overridden.
3. That `direction: rtl` on the container does not break the sites'
   own UI controls (buttons, menus, scrollbars) — scope the CSS as
   tightly as possible to the chat content, not the whole app shell.
4. Behavior with streaming responses — confirm the MutationObserver
   keeps up without performance issues on long conversations.
5. That toggling OFF leaves zero residual styles.
