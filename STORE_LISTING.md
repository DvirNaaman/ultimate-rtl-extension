# Chrome Web Store Listing for Ultimate RTL

Copy/paste-ready text for the developer dashboard.

---

## Name

```
Ultimate RTL
```

## Short description (≤132 chars, used in manifest "description" field)

```
Right-to-left layout for Claude, ChatGPT, Gemini, Perplexity, Copilot, DeepSeek, Grok. Natural Hebrew/Arabic chat.
```

## Category

Productivity

## Language

English

---

## Detailed description (store listing)

```
Ultimate RTL flips the chat interface of major AI assistants so people
working in Hebrew, Arabic, Persian, Urdu or any other right-to-left
language can read and write naturally.

If you have ever sent a mixed Hebrew + English message and watched the
words rearrange in confusing ways, this fixes it. The extension applies
right-to-left direction to chat messages and the input box, so the
browser's native bidirectional text algorithm orders everything the way
you would expect.

Supported sites:
• claude.ai
• chatgpt.com
• gemini.google.com
• perplexity.ai
• copilot.microsoft.com
• chat.deepseek.com
• grok.com

Features:
• One simple on/off toggle in the popup.
• Per-message direction detection: a Hebrew message reads RTL, an
  English message stays LTR. Automatic, no manual switching.
• Code blocks are protected and stay left-to-right.
• Works offline. No account, no server, no telemetry.
• Open source under the MIT license.

Privacy:
Ultimate RTL never collects, transmits or stores your messages. It does
not talk to any server. The only thing it remembers is whether you have
the toggle on or off. Full privacy policy is available in the extension
listing.

How it works:
The extension injects a small stylesheet into chat pages and tags message
elements so the browser's bidirectional text algorithm can apply the
correct direction per message. That's it. No AI, no rewriting, no
content analysis.
```

---

## Screenshots (required: 1 to 5; recommended size 1280×800)

Prepare screenshots showing each supported site BEFORE / AFTER the toggle
is enabled, focused on:

1. claude.ai with a Hebrew-with-English message reading correctly.
2. chatgpt.com with the same, including a code block staying LTR.
3. gemini.google.com with an assistant response reading RTL.
4. The popup UI showing the toggle.
5. (optional) chat.deepseek.com or perplexity.ai for variety.

## Small promo tile (optional, 440×280)

Use the extension icon centered on a clean background, with the text
"Ultimate RTL" beside it. Keep margins generous.

---

## Privacy practices section (developer dashboard)

When the Chrome Web Store form asks "Does this extension collect or use
user data?":

- **Answer: No.**
- For each data category (personal info, financial info, health info,
  authentication info, personal communications, location, web history,
  user activity, website content), select "Not collected".
- Single purpose: "Display chat interfaces in right-to-left direction."
- Justify each permission:
  - `storage`: remember the user's on/off preference.
  - Host permissions for the 7 domains: inject the RTL stylesheet into
    chat pages. No data is read from these pages.

## Privacy policy URL

`PRIVACY.md` from this repo needs to be published at a stable URL before
submission. Options:

1. Host on the project's homepage: https://dvirnaaman.co.il/ultimate-rtl/privacy
2. Use the GitHub raw URL once the repo is public.

The Chrome Web Store will not accept submission without a valid URL.
