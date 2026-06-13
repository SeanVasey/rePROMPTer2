export type Mode = "enhance" | "expand" | "clarify" | "rewrite";

export type Provider = "anthropic" | "openai";

export type ModelId = "claude-opus-4-8" | "gpt-5.5";

export interface ModelInfo {
  id: ModelId;
  /** Short label shown in the selector. */
  label: string;
  /** Full marketing name. */
  name: string;
  provider: Provider;
  /** Vendor label, e.g. "Anthropic" / "OpenAI". */
  vendor: string;
}

export interface Attachment {
  /** Original file name. */
  name: string;
  /** MIME type, e.g. "image/png". */
  mediaType: string;
  /** Base64-encoded data (no data: prefix). */
  data: string;
}

export interface RefineRequest {
  prompt: string;
  mode: Mode;
  model: ModelId;
  attachments?: Attachment[];
  /** Optional extra steering from the user. */
  instructions?: string;
}

export interface Iteration {
  id: string;
  mode: Mode;
  model: ModelId;
  input: string;
  output: string;
  createdAt: number;
}
