// perplexity.ai site config.
//
// TODO: capture real DOM selectors via DevTools (see claude.js for procedure).
// Composer uses a generic contenteditable selector that should work out of
// the box; messages stay placeholder until we inspect.
export const perplexityConfig = {
  hostname: "perplexity.ai",
  cssFile: "styles/perplexity.css",
  selectors: {
    chatContainer:    "",
    userMessage:      "",
    assistantMessage: "",
    message:          "",
    composer:         'textarea, div[contenteditable="true"], .ProseMirror',
    codeBlock:        "pre",
  },
};
