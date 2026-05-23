# Changelog

All notable changes to Ultimate RTL are documented in this file. Format
follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) and the
project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] — 2026-05-23

### First public release
Initial Chrome Web Store release. Right-to-left layout for the seven
major AI chat assistants:

- **Claude** (claude.ai)
- **ChatGPT** (chatgpt.com)
- **Gemini** (gemini.google.com)
- **Perplexity** (perplexity.ai)
- **Microsoft Copilot** (copilot.microsoft.com)
- **DeepSeek** (chat.deepseek.com)
- **Grok** (grok.com)

Single global on/off toggle, persistent across browser restarts via
`chrome.storage.sync`. Code blocks preserved as LTR. `MutationObserver`
keeps streaming responses correctly formatted. Per-site config + CSS so
site redesigns are one-file fixes.

Open source under the MIT license. No data collection, no telemetry.

## [0.2.0] — 2026-05-23

### Added
- Four additional target sites: Perplexity, Microsoft Copilot, DeepSeek,
  Grok.
- DeepSeek: real selectors captured (`.ds-message`, `.ds-markdown*`).
- Perplexity / Copilot / Grok: generic composer rule + browser bidi handle
  the common cases; message-level selectors still TODO for resilience.
- `homepage_url` in manifest pointing to https://dvirnaaman.co.il/.
- Real PNG icons (16/48/128) + `icon.svg` source.
- `LICENSE` (MIT), `PRIVACY.md`, `STORE_LISTING.md`, `TESTING.md`.
- `scripts/smoke-check.mjs` — automated build verification (75 checks).

### Fixed
- Race condition in `content-script.js`: message listener now registered
  before the storage `await`, so state-change broadcasts during init are
  no longer dropped.
- Manifest description trimmed to 119 chars (Chrome Web Store ≤132 limit).

## [0.1.0] — 2026-05-23

### Added
- Initial v1 skeleton + working RTL transformation:
  - MV3 manifest, esbuild build, background service worker.
  - Content-script pipeline, RTL engine, MutationObserver for streaming.
  - Per-site configs (Claude, ChatGPT, Gemini) with real selectors captured
    from live DOM.
  - English popup with functional on/off toggle, default ON.
  - Base CSS keeping code blocks LTR; per-site CSS for chat content.
  - `web_accessible_resources` declared so injected `<link>` survives the
    sites' CSP.

### Pending
- Real icon design (`icons/*.png` are placeholders).
- License choice.
