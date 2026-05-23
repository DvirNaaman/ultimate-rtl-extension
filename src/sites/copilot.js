// copilot.microsoft.com site config.
//
// TODO: capture real DOM selectors via DevTools (see claude.js for procedure).
export const copilotConfig = {
  hostname: "copilot.microsoft.com",
  cssFile: "styles/copilot.css",
  selectors: {
    chatContainer:    "",
    userMessage:      "",
    assistantMessage: "",
    message:          "",
    composer:         'textarea, div[contenteditable="true"], .ProseMirror',
    codeBlock:        "pre",
  },
};
