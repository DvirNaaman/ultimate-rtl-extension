// gemini.google.com site config.
//
// Selectors captured 2026-05-23 from live DOM:
//   - User query bubble: [data-test-id="luminous-collapsed-bubble"]
//     also carries .user-query-bubble-with-background
//   - Assistant responses already render RTL natively for Hebrew text
//     (the site detects direction), so we only need to fix the user bubble
//     and the composer.
//   - Composer in Gemini is a rich-textarea custom element with a
//     contenteditable inside.
export const geminiConfig = {
  hostname: "gemini.google.com",
  cssFile: "styles/gemini.css",
  selectors: {
    chatContainer:    "",
    userMessage:      '[data-test-id="luminous-collapsed-bubble"], .user-query-bubble-with-background',
    assistantMessage: 'message-content, .model-response-text',
    message:          '[data-test-id="luminous-collapsed-bubble"], .user-query-bubble-with-background',
    composer:         'rich-textarea [contenteditable="true"], .ql-editor, [contenteditable="true"]',
    codeBlock:        "pre",
  },
};
