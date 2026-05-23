# Privacy Policy — Ultimate RTL

_Last updated: 2026-05-23_

## Summary

Ultimate RTL **does not collect, store, transmit, sell, or share any of your
data**. The extension runs entirely inside your browser and never talks to
any server.

## What the extension stores

- **One boolean setting** — whether RTL transformation is currently enabled
  (`rtlEnabled: true | false`).
- Stored in Chrome's local sync storage (`chrome.storage.sync`), which is
  scoped to your Google account if Chrome Sync is enabled. The value is
  visible only to you and to the Ultimate RTL extension.

That is the entire extent of the stored data.

## What the extension reads on web pages

The extension applies CSS and sets a `dir="auto"` attribute on chat message
elements at the following sites only:

- claude.ai
- chatgpt.com
- gemini.google.com
- perplexity.ai
- copilot.microsoft.com
- chat.deepseek.com
- grok.com

It **reads no message contents**, does not log, transmit, or analyze any
text. It also does not modify the meaning or content of messages — only
their visual direction and alignment.

## What the extension does NOT do

- No analytics, telemetry, or usage tracking.
- No external network requests of any kind.
- No reading or transmission of message text, accounts, cookies, or any
  personal information.
- No advertising, no third-party SDKs, no remote configuration.

## Permissions explained

- `storage` — to remember the on/off toggle across sessions.
- Host permissions for the seven domains above — required so the extension
  can inject its CSS into the chat pages. Nothing broader.

## Open source

The full source code is published openly and can be audited at any time.
See the project's GitHub repository linked from
[dvirnaaman.co.il](https://dvirnaaman.co.il/).

## Contact

For privacy questions, contact the project owner via
[dvirnaaman.co.il](https://dvirnaaman.co.il/).
