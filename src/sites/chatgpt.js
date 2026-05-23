// chatgpt.com site config.
//
// Selectors captured 2026-05-23 from live DOM:
//   - <article data-turn="user|assistant"> wraps each turn
//   - data-composer-surface="true" wraps the composer; contenteditable inside
//   - #prompt-textarea is the known stable id of the composer
export const chatgptConfig = {
  hostname: "chatgpt.com",
  cssFile: "styles/chatgpt.css",
  selectors: {
    chatContainer:    "",
    userMessage:      '[data-turn="user"]',
    assistantMessage: '[data-turn="assistant"]',
    message:          '[data-turn="user"], [data-turn="assistant"]',
    composer:         '#prompt-textarea, [data-composer-surface="true"] [contenteditable="true"], .ProseMirror',
    codeBlock:        "pre",
  },
};
