"use client";

import { MODE_SPECS } from "@/app/lib/prompts";
import { getModel } from "@/app/lib/models";
import type { Iteration } from "@/app/lib/types";

export default function HistoryRail({
  items,
  onRestore,
  onClear,
}: {
  items: Iteration[];
  onRestore: (it: Iteration) => void;
  onClear: () => void;
}) {
  if (items.length === 0) return null;

  return (
    <aside className="history">
      <div className="history-head">
        <span className="history-title">
          Iterations
          <span className="history-count">{items.length}</span>
        </span>
        <button type="button" className="link-btn" onClick={onClear}>
          Clear
        </button>
      </div>
      <ol className="history-list">
        {items.map((it, i) => (
          <li key={it.id}>
            <button type="button" className="history-item" onClick={() => onRestore(it)}>
              <span className="history-index">#{items.length - i}</span>
              <span className="history-info">
                <span className="history-mode">
                  {MODE_SPECS[it.mode].label}
                  <span className="history-dot" />
                  {getModel(it.model)?.label ?? it.model}
                </span>
                <span className="history-snippet">
                  {it.output.slice(0, 90).replace(/\s+/g, " ").trim() || "—"}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>
    </aside>
  );
}
