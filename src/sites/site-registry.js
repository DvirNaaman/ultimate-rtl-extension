import { claudeConfig } from "./claude.js";
import { chatgptConfig } from "./chatgpt.js";
import { geminiConfig } from "./gemini.js";
import { perplexityConfig } from "./perplexity.js";
import { copilotConfig } from "./copilot.js";
import { deepseekConfig } from "./deepseek.js";
import { grokConfig } from "./grok.js";

const CONFIGS = [
  claudeConfig,
  chatgptConfig,
  geminiConfig,
  perplexityConfig,
  copilotConfig,
  deepseekConfig,
  grokConfig,
];

export function getSiteConfig(hostname = window.location.hostname) {
  return CONFIGS.find((c) => hostname === c.hostname || hostname.endsWith("." + c.hostname)) || null;
}
