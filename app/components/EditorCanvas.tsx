"use client";

import { useRef } from "react";
import type { Attachment } from "@/app/lib/types";

const MAX_ATTACH = 4;
const MAX_BYTES = 5 * 1024 * 1024; // 5MB per image

function fileToAttachment(file: File): Promise<Attachment> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result);
      const base64 = result.includes(",") ? result.split(",")[1] : result;
      resolve({ name: file.name, mediaType: file.type, data: base64 });
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export default function EditorCanvas({
  value,
  onChange,
  attachments,
  onAttachmentsChange,
  onSubmit,
  disabled,
}: {
  value: string;
  onChange: (v: string) => void;
  attachments: Attachment[];
  onAttachmentsChange: (a: Attachment[]) => void;
  onSubmit: () => void;
  disabled: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  async function handleFiles(list: FileList | null) {
    if (!list) return;
    const incoming: Attachment[] = [];
    for (const file of Array.from(list)) {
      if (!file.type.startsWith("image/")) continue;
      if (file.size > MAX_BYTES) continue;
      incoming.push(await fileToAttachment(file));
    }
    const next = [...attachments, ...incoming].slice(0, MAX_ATTACH);
    onAttachmentsChange(next);
    if (fileRef.current) fileRef.current.value = "";
  }

  function removeAttachment(idx: number) {
    onAttachmentsChange(attachments.filter((_, i) => i !== idx));
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
      e.preventDefault();
      onSubmit();
    }
  }

  const chars = value.length;

  return (
    <div className="canvas">
      <div className="canvas-head">
        <span className="canvas-dot" aria-hidden="true" />
        <span className="canvas-title">Editor Canvas</span>
        <span className="canvas-count">{chars.toLocaleString()} chars</span>
      </div>

      <textarea
        className="canvas-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onDrop={(e) => {
          e.preventDefault();
          void handleFiles(e.dataTransfer.files);
        }}
        onDragOver={(e) => e.preventDefault()}
        placeholder="Start typing, paste, or drop a prompt…"
        spellCheck={false}
      />

      {attachments.length > 0 && (
        <div className="attach-row">
          {attachments.map((a, i) => (
            <span className="attach-chip" key={`${a.name}-${i}`}>
              <img src={`data:${a.mediaType};base64,${a.data}`} alt="" />
              <span className="attach-name">{a.name}</span>
              <button
                type="button"
                aria-label={`Remove ${a.name}`}
                onClick={() => removeAttachment(i)}
              >
                ×
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="canvas-foot">
        <button
          type="button"
          className="ghost-btn"
          onClick={() => fileRef.current?.click()}
          disabled={attachments.length >= MAX_ATTACH}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <rect x="3" y="4" width="18" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
            <circle cx="8.5" cy="9.5" r="1.8" fill="currentColor" />
            <path d="M4 17l5-5 4 4 3-2.5L20 17" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          Media
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => void handleFiles(e.target.files)}
        />

        <button
          type="button"
          className="primary-btn"
          onClick={onSubmit}
          disabled={disabled || (!value.trim() && attachments.length === 0)}
        >
          <svg viewBox="0 0 24 24" width="18" height="18" fill="none" aria-hidden="true">
            <path
              d="M12 3l1.8 4.2L18 9l-4.2 1.8L12 15l-1.8-4.2L6 9l4.2-1.8L12 3z"
              fill="currentColor"
            />
          </svg>
          Refine
          <kbd className="kbd">⌘↵</kbd>
        </button>
      </div>
    </div>
  );
}
