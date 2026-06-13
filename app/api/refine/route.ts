import Anthropic from "@anthropic-ai/sdk";
import OpenAI from "openai";
import { NextRequest } from "next/server";
import { providerOf, resolveModelString } from "@/app/lib/models";
import { systemPromptFor, userContentFor } from "@/app/lib/prompts";
import type { Attachment, Mode, ModelId, RefineRequest } from "@/app/lib/types";

export const runtime = "nodejs";
export const maxDuration = 60;

const MODES: Mode[] = ["enhance", "expand", "clarify", "rewrite"];
const MODEL_IDS: ModelId[] = ["claude-opus-4-8", "gpt-5.5"];
const MAX_OUTPUT_TOKENS = 4096;

function jsonError(message: string, status = 400) {
  return new Response(JSON.stringify({ error: message }), {
    status,
    headers: { "content-type": "application/json" },
  });
}

function textStreamResponse(stream: ReadableStream<Uint8Array>) {
  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      "x-accel-buffering": "no",
    },
  });
}

export async function POST(req: NextRequest) {
  let body: RefineRequest;
  try {
    body = (await req.json()) as RefineRequest;
  } catch {
    return jsonError("Invalid JSON body.");
  }

  const prompt = (body.prompt ?? "").trim();
  const mode = body.mode;
  const model = body.model;
  const attachments = (body.attachments ?? []).slice(0, 4);
  const instructions = body.instructions;

  if (!prompt && attachments.length === 0) {
    return jsonError("Nothing to refine — add a prompt.");
  }
  if (!MODES.includes(mode)) return jsonError("Unknown mode.");
  if (!MODEL_IDS.includes(model)) return jsonError("Unknown model.");

  const system = systemPromptFor(mode, instructions);
  const provider = providerOf(model);

  try {
    if (provider === "anthropic") {
      return await streamAnthropic({ system, prompt, attachments, model });
    }
    return await streamOpenAI({ system, prompt, attachments, model });
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Unexpected error while refining.";
    return jsonError(message, 502);
  }
}

async function streamAnthropic(args: {
  system: string;
  prompt: string;
  attachments: Attachment[];
  model: ModelId;
}) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return jsonError(
      "ANTHROPIC_API_KEY is not configured. Add it in your environment to use Claude Opus 4.8.",
      503,
    );
  }

  const client = new Anthropic({ apiKey });

  const content: Anthropic.ContentBlockParam[] = [];
  for (const a of args.attachments) {
    if (a.mediaType.startsWith("image/")) {
      content.push({
        type: "image",
        source: {
          type: "base64",
          media_type: a.mediaType as
            | "image/jpeg"
            | "image/png"
            | "image/gif"
            | "image/webp",
          data: a.data,
        },
      });
    }
  }
  content.push({ type: "text", text: userContentFor(args.prompt) });

  const sse = client.messages.stream({
    model: resolveModelString(args.model),
    max_tokens: MAX_OUTPUT_TOKENS,
    system: args.system,
    messages: [{ role: "user", content }],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const event of sse) {
          if (
            event.type === "content_block_delta" &&
            event.delta.type === "text_delta"
          ) {
            controller.enqueue(encoder.encode(event.delta.text));
          }
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "stream error";
        controller.enqueue(encoder.encode(`\n\n[error] ${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return textStreamResponse(stream);
}

async function streamOpenAI(args: {
  system: string;
  prompt: string;
  attachments: Attachment[];
  model: ModelId;
}) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return jsonError(
      "OPENAI_API_KEY is not configured. Add it in your environment to use GPT-5.5.",
      503,
    );
  }

  const client = new OpenAI({ apiKey });

  const userContent: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];
  for (const a of args.attachments) {
    if (a.mediaType.startsWith("image/")) {
      userContent.push({
        type: "image_url",
        image_url: { url: `data:${a.mediaType};base64,${a.data}` },
      });
    }
  }
  userContent.push({ type: "text", text: userContentFor(args.prompt) });

  const completion = await client.chat.completions.create({
    model: resolveModelString(args.model),
    stream: true,
    max_completion_tokens: MAX_OUTPUT_TOKENS,
    messages: [
      { role: "system", content: args.system },
      { role: "user", content: userContent },
    ],
  });

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of completion) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) controller.enqueue(encoder.encode(delta));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "stream error";
        controller.enqueue(encoder.encode(`\n\n[error] ${message}`));
      } finally {
        controller.close();
      }
    },
  });

  return textStreamResponse(stream);
}
