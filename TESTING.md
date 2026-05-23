# Manual Test Plan — Ultimate RTL

Definition-of-Done verification per SPEC §10. Run before each release.

For each row, check ☐ → ✅ once verified, or ☐ → ❌ + note the issue.

---

## Per-site tests

| Site | A. RTL message reads correctly | B. Code block stays LTR | C. Toggle OFF restores LTR cleanly | D. Toggle ON re-applies | E. New message after toggle is consistent |
|---|---|---|---|---|---|
| claude.ai | ☐ | ☐ | ☐ | ☐ | ☐ |
| chatgpt.com | ☐ | ☐ | ☐ | ☐ | ☐ |
| gemini.google.com | ☐ | ☐ | ☐ | ☐ | ☐ |
| perplexity.ai | ☐ | ☐ | ☐ | ☐ | ☐ |
| copilot.microsoft.com | ☐ | ☐ | ☐ | ☐ | ☐ |
| chat.deepseek.com | ☐ | ☐ | ☐ | ☐ | ☐ |
| grok.com | ☐ | ☐ | ☐ | ☐ | ☐ |

### Test sentences

- Mixed Hebrew + English:
  `?ENGLISH האם אתה מבין משפט מעורב`
- With numbers:
  `המחיר הוא 100 USD לחודש`
- Code-block request:
  `Show me a JavaScript snippet that prints "Hello world".`

---

## Global tests

- ☐ **F. Persistence across browser restart.**
  Set toggle OFF → close Chrome fully → reopen → toggle is still OFF.
  Repeat with ON.

- ☐ **G. No console errors.**
  DevTools → Console on each site — no red errors mentioning
  `chrome-extension://` or Ultimate RTL.

- ☐ **H. Popup status text reflects current tab.**
  On a supported site → "RTL is ON/OFF for <hostname>."
  On an unsupported site → "Open a supported site to see it."

- ☐ **I. Default-ON on first install.**
  Remove the extension, install unpacked again. Toggle is ON by default.

- ☐ **J. Permissions match manifest.**
  `chrome://extensions` → Details → "Site access" lists only the 7
  declared domains. No `<all_urls>`.

---

## Known limitations (acceptable, not blockers)

- Gemini and Copilot: user-message bubble visually positioned on the left
  side of its container (RTL text inside reads correctly, only the
  bubble's container alignment is LTR).
- Claude: conversation title in the top bar stays LTR.
- Perplexity, Copilot, Grok: message-level selectors are not captured —
  RTL relies on the browser's bidi algorithm via the generic composer
  rule. Functional but more fragile to site redesigns.
