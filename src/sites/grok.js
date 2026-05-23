// grok.com site config.
//
// TODO: capture real DOM selectors via DevTools (see claude.js for procedure).
export const grokConfig = {
  hostname: "grok.com",
  cssFile: "styles/grok.css",
  selectors: {
    chatContainer:    "",
    userMessage:      "",
    assistantMessage: "",
    message:          "",
    composer:         'textarea, div[contenteditable="true"], .ProseMirror',
    codeBlock:        "pre",
  },
};
