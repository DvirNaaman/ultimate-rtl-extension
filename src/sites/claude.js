// Claude.ai site config.
//
// TODO(v1): replace each placeholder with the real selector discovered by
// inspecting https://claude.ai with DevTools. Procedure:
//   1. Open a chat on claude.ai.
//   2. In DevTools → Elements, locate the scrolling message list, a single
//      message bubble, the composer textarea, and a code-block wrapper.
//   3. Pick the most stable selector available — prefer data-* attributes
//      or ARIA roles over hashed class names (e.g. "css-xyz123").
//   4. Paste below. Keep this file pure data, no logic.
export const claudeConfig = {
  hostname: "claude.ai",
  cssFile: "styles/claude.css",
  selectors: {
    // Captured 2026-05-23 from live DOM.
    chatContainer: "",                                 // TODO: scrolling list (not yet needed — message-level scoping works)
    userMessage:      '[data-testid="user-message"]',  // stable data-testid
    assistantMessage: '.font-claude-response-body',    // class on each assistant <p>
    message:          '[data-testid="user-message"], .font-claude-response-body',
    composer:         'div[contenteditable="true"], .ProseMirror',
    codeBlock:        "pre",                           // base-rtl.css already locks pre/code to LTR
  },
};
