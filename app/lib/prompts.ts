import type { Mode } from "./types";

interface ModeSpec {
  label: string;
  /** Short blurb for the UI. */
  blurb: string;
  /** The instruction appended to the shared system prompt. */
  directive: string;
}

export const MODE_SPECS: Record<Mode, ModeSpec> = {
  enhance: {
    label: "Enhance",
    blurb: "Sharpen clarity, structure, and specificity — intent preserved.",
    directive:
      "ENHANCE the prompt. Improve clarity, structure, specificity, and instruction-following potential while preserving the author's intent and voice. Tighten vague language, add helpful structure (role, task, constraints, output format) where it strengthens the prompt, and remove filler. Do not invent requirements the author did not imply.",
  },
  expand: {
    label: "Expand",
    blurb: "Add useful detail, context, constraints, and examples.",
    directive:
      "EXPAND the prompt. Enrich it with the context, constraints, edge cases, and concrete examples a strong response would need. Make implicit expectations explicit. Add a clear output specification. Stay faithful to the original goal — broaden depth, not scope creep.",
  },
  clarify: {
    label: "Clarify",
    blurb: "Remove ambiguity; define terms; make requirements explicit.",
    directive:
      "CLARIFY the prompt. Eliminate ambiguity and underspecification. Define vague terms, resolve conflicting instructions, state assumptions, and make every requirement explicit and testable. Prefer precise, unambiguous phrasing over flourish.",
  },
  rewrite: {
    label: "Rewrite",
    blurb: "Restructure into a clean, model-ready prompt.",
    directive:
      "REWRITE the prompt from the ground up into a clean, well-structured, model-ready prompt. Reorganize into logical sections (e.g. role, context, task, constraints, output format), use clear formatting, and optimize for reliable instruction-following — while faithfully delivering the original intent.",
  },
};

export function systemPromptFor(mode: Mode, instructions?: string): string {
  const base = [
    "You are rePROMPTer 2, an expert prompt engineer. You perfect prompts so that downstream LLMs produce excellent results.",
    "",
    "Rules:",
    "- Return ONLY the improved prompt text. No preamble, no commentary, no explanation, no markdown code fences around the whole thing unless the prompt itself is code.",
    "- Write the prompt as if it will be sent directly to a capable model.",
    "- Preserve the user's core intent. Improve craft, not goals.",
    "- Be precise and economical. Every line should earn its place.",
    "- When the input is itself a request for the assistant (not a prompt to refine), still treat it as a prompt to be perfected.",
    "",
    `Task: ${MODE_SPECS[mode].directive}`,
  ];

  if (instructions && instructions.trim()) {
    base.push("", `Additional steering from the user: ${instructions.trim()}`);
  }

  return base.join("\n");
}

export function userContentFor(prompt: string): string {
  return `Here is the prompt to refine:\n\n<prompt>\n${prompt}\n</prompt>\n\nReturn only the refined prompt.`;
}
