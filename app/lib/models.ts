import type { ModelId, ModelInfo, Provider } from "./types";

export const MODELS: ModelInfo[] = [
  {
    id: "claude-opus-4-8",
    label: "Claude Opus 4.8",
    name: "Anthropic Claude Opus 4.8",
    provider: "anthropic",
    vendor: "Anthropic",
  },
  {
    id: "gpt-5.5",
    label: "GPT-5.5",
    name: "OpenAI GPT-5.5",
    provider: "openai",
    vendor: "OpenAI",
  },
];

export const DEFAULT_MODEL: ModelId = "claude-opus-4-8";

export function getModel(id: string): ModelInfo | undefined {
  return MODELS.find((m) => m.id === id);
}

export function providerOf(id: ModelId): Provider {
  return getModel(id)?.provider ?? "anthropic";
}

/**
 * Resolve the concrete model string to send to the provider. Allows overriding
 * via env without touching the UI registry.
 */
export function resolveModelString(id: ModelId): string {
  if (id === "claude-opus-4-8") {
    return process.env.ANTHROPIC_MODEL || "claude-opus-4-8";
  }
  return process.env.OPENAI_MODEL || "gpt-5.5";
}
