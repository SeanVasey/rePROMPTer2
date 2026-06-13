"use client";

import { useEffect, useRef, useState } from "react";
import { getModel } from "@/app/lib/models";
import { MODE_SPECS } from "@/app/lib/prompts";
import type { Mode, ModelId } from "@/app/lib/types";

export default function OutputPanel({
  output,
  streaming,
  mode,
  model,
  error,
  onIterate,
  onUseAsInput,
}: {
  output: string;
  streaming: boolean;
  mode: Mode;
  model: ModelId;
  error: string | null;
  onIterate: () => void;
  onUseAsInput: () => void;
}) {
  const [copied, setCopied] = useState(false);
  const bodyRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (streaming && bodyRef.current) {
      bodyRef.current.scrollTop = bodyRef.current.scrollHeight;
    }
  }, [output, streaming]);

  async function copy() {
    try {
      await navigator.clipboard.writeText(output);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* ignore */
    }
  }

  function download() {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `reprompter-${mode}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  const hasOutput = output.length > 0;
  const modelLabel = getModel(model)?.label ?? model;

  return (
    <div className={`output${streaming ? " is-streaming" : ""}`}>
      <div className="output-head">
        <span className={`output-dot${streaming ? " live" : ""}`} aria-hidden="true" />
        <span className="output-title">Refined Prompt</span>
        <span className="output-meta">
          {MODE_SPECS[mode].label} · {modelLabel}
        </span>
        <div className="output-tools">
          <button type="button" className="tool-btn" onClick={copy} disabled={!hasOutput}>
            {copied ? "Copied" : "Copy"}
          </button>
          <button type="button" className="tool-btn" onClick={download} disabled={!hasOutput}>
            Save
          </button>
        </div>
      </div>

      <div className="output-body" ref={bodyRef}>
        {error ? (
          <div className="output-error">
            <strong>Couldn&apos;t refine.</strong>
            <span>{error}</span>
          </div>
        ) : hasOutput ? (
          <pre className="output-text">
            {output}
            {streaming && <span className="caret" />}
          </pre>
        ) : (
          <div className="output-empty">
            <p>Your perfected prompt will appear here.</p>
            <p className="muted">
              Then iterate recursively — feed the result back through another pass.
            </p>
          </div>
        )}
      </div>

      {hasOutput && !streaming && !error && (
        <div className="output-foot">
          <button type="button" className="ghost-btn" onClick={onUseAsInput}>
            Use as input
          </button>
          <button type="button" className="primary-btn subtle" onClick={onIterate}>
            <svg viewBox="0 0 24 24" width="17" height="17" fill="none" aria-hidden="true">
              <path
                d="M4 12a8 8 0 0 1 13.7-5.6L20 8M20 4v4h-4M20 12a8 8 0 0 1-13.7 5.6L4 16M4 20v-4h4"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Refine again
          </button>
        </div>
      )}
    </div>
  );
}
