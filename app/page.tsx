"use client";

import { useCallback, useRef, useState } from "react";
import Logo from "./components/Logo";
import EditorCanvas from "./components/EditorCanvas";
import ModeSelector from "./components/ModeSelector";
import ModelSelector from "./components/ModelSelector";
import OutputPanel from "./components/OutputPanel";
import HistoryRail from "./components/HistoryRail";
import { DEFAULT_MODEL } from "./lib/models";
import type { Attachment, Iteration, Mode, ModelId } from "./lib/types";

const VERSION = "v2.0.0";

export default function Page() {
  const [prompt, setPrompt] = useState("");
  const [mode, setMode] = useState<Mode>("enhance");
  const [model, setModel] = useState<ModelId>(DEFAULT_MODEL);
  const [attachments, setAttachments] = useState<Attachment[]>([]);

  const [output, setOutput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [iterations, setIterations] = useState<Iteration[]>([]);

  const abortRef = useRef<AbortController | null>(null);

  const refine = useCallback(
    async (sourceText: string) => {
      const text = sourceText.trim();
      if ((!text && attachments.length === 0) || streaming) return;

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      setStreaming(true);
      setError(null);
      setOutput("");

      try {
        const res = await fetch("/api/refine", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ prompt: text, mode, model, attachments }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          let message = `Request failed (${res.status}).`;
          try {
            const data = await res.json();
            if (data?.error) message = data.error;
          } catch {
            /* keep default */
          }
          setError(message);
          setStreaming(false);
          return;
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let acc = "";
        for (;;) {
          const { value, done } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          setOutput(acc);
        }

        const finalText = acc.trim();
        if (finalText) {
          setIterations((prev) =>
            [
              {
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
                mode,
                model,
                input: text,
                output: finalText,
                createdAt: Date.now(),
              },
              ...prev,
            ].slice(0, 20),
          );
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setError((err as Error)?.message ?? "Network error.");
        }
      } finally {
        setStreaming(false);
      }
    },
    [attachments, mode, model, streaming],
  );

  const handleSubmit = useCallback(() => void refine(prompt), [prompt, refine]);

  const handleIterate = useCallback(() => {
    // Recursive pass: feed the current output back through the engine.
    setPrompt(output);
    setAttachments([]);
    void refine(output);
  }, [output, refine]);

  const handleUseAsInput = useCallback(() => {
    setPrompt(output);
    setAttachments([]);
  }, [output]);

  const restore = useCallback((it: Iteration) => {
    setPrompt(it.input);
    setMode(it.mode);
    setModel(it.model);
    setOutput(it.output);
    setError(null);
  }, []);

  return (
    <div className="shell">
      <div className="bg-glow" aria-hidden="true" />
      <div className="bg-grid" aria-hidden="true" />

      <main className="stage">
        <header className="masthead">
          <p className="eyebrow">VASEY/AI presents</p>
          <Logo size={84} />
          <h1 className="wordmark">
            <span className="wm-silver">re</span>
            <span className="wm-crimson">PROMPT</span>
            <span className="wm-silver">er</span>
            <span className="wm-chip">{VERSION}</span>
          </h1>
          <p className="tagline">The advanced prompt optimization engine.</p>
        </header>

        <section className="console">
          <EditorCanvas
            value={prompt}
            onChange={setPrompt}
            attachments={attachments}
            onAttachmentsChange={setAttachments}
            onSubmit={handleSubmit}
            disabled={streaming}
          />

          <div className="controls">
            <ModeSelector value={mode} onChange={setMode} />
            <ModelSelector value={model} onChange={setModel} />
          </div>

          <OutputPanel
            output={output}
            streaming={streaming}
            mode={mode}
            model={model}
            error={error}
            onIterate={handleIterate}
            onUseAsInput={handleUseAsInput}
          />
        </section>

        <HistoryRail
          items={iterations}
          onRestore={restore}
          onClear={() => setIterations([])}
        />

        <footer className="footer">
          <div className="footer-marks" aria-hidden="true">
            <span className="mark-m">M</span>
            <span className="footer-div" />
            <span className="mark-vai">VAI</span>
          </div>
          <p className="footer-prod">A VASEY/AI production</p>
          <p className="footer-line">
            rePROMPTer {VERSION} · Opus 4.8 &amp; GPT-5.5 · recursive prompt refinement
          </p>
          <p className="footer-copy">
            © {new Date().getFullYear()} VASEY Multimedia. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
