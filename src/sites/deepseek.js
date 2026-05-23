// chat.deepseek.com site config.
//
// Selectors captured 2026-05-23 from live DOM:
//   - .ds-message wraps every turn (both user and assistant)
//   - .ds-markdown / .ds-markdown-paragraph / .ds-assistant-message-main-content
//     is the assistant response body
//   - User bubble's inner div uses a hashed class (.fbb737a4) — unstable,
//     so we target the outer .ds-message instead
//   - Composer already worked via the generic contenteditable rule
export const deepseekConfig = {
  hostname: "chat.deepseek.com",
  cssFile: "styles/deepseek.css",
  selectors: {
    chatContainer:    ".ds-virtual-list-items",
    userMessage:      ".ds-message",
    assistantMessage: ".ds-markdown, .ds-assistant-message-main-content",
    message:          ".ds-message, .ds-markdown, .ds-markdown-paragraph",
    composer:         'textarea, div[contenteditable="true"], .ProseMirror',
    codeBlock:        "pre",
  },
};
