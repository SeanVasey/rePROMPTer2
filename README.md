<div align="center">

<img src="public/icon.svg" alt="rePROMPTer 2 icon" width="128" height="128" />

# rePROMPTer 2

**The advanced prompt optimization engine — Claude Opus 4.8 · GPT‑5.5 · recursive iteration.**

[![License: MIT](https://img.shields.io/badge/License-MIT-e0383b.svg)](./LICENSE)
[![Next.js 15](https://img.shields.io/badge/Next.js-15-0a0a0b?logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![React 19](https://img.shields.io/badge/React-19-0a0a0b?logo=react&logoColor=61dafb)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-0a0a0b?logo=typescript&logoColor=3178c6)](https://www.typescriptlang.org)
[![Claude Opus 4.8](https://img.shields.io/badge/Claude-Opus%204.8-e0383b?logo=anthropic&logoColor=white)](https://www.anthropic.com)
[![GPT‑5.5](https://img.shields.io/badge/OpenAI-GPT‑5.5-0a0a0b?logo=openai&logoColor=white)](https://openai.com)
[![Deploy on Vercel](https://img.shields.io/badge/Deploy-Vercel-0a0a0b?logo=vercel&logoColor=white)](https://vercel.com)
[![PWA](https://img.shields.io/badge/PWA-installable-e0383b.svg)](#install-as-an-app-pwa)

</div>

**rePROMPTer 2** is a prompt enhancement & refinement tool that perfects your prompts via
LLM-tuning and recursive iteration — the more functional, more aesthetically refined
successor to rePROMPTer.

Paste or type a prompt, choose a **mode** and a **model**, and rePROMPTer streams back a
perfected version. Feed the result back through the engine to refine recursively.

- **Modes** — Enhance · Expand · Clarify · Rewrite
- **Models** — Claude **Opus 4.8** (`claude-opus-4-8`) and **GPT‑5.5** (`gpt-5.5`)
- **Media** — attach reference images (vision) to inform the refinement
- **Recursive iteration** — "Refine again" runs the output back through a new pass; every
  pass is tracked in the iteration history
- **Streaming** output, copy / save, keyboard shortcut (⌘/Ctrl + ↵)

A VASEY/AI production. Built with Next.js, deployable to Vercel with zero config.

## Quick start

```bash
npm install
cp .env.example .env.local   # then add your API keys
npm run dev                  # http://localhost:3000
```

## Available scripts and flags

| Command | Purpose | Notes / useful flags |
| --- | --- | --- |
| `npm run dev` | Start the local Next.js dev server. | Add Next flags after `--`, for example `npm run dev -- --hostname 0.0.0.0 --port 3000`. |
| `npm run build` | Create the production build used by Vercel. | Run before deploys/PRs to verify App Router compilation. |
| `npm run start` | Serve the built app locally. | Requires `npm run build` first; supports Next flags after `--`. |
| `npm run lint` | Run linting. | Falls back to `eslint .` if the local Next CLI does not provide `next lint`. |
| `npm run typecheck` | Run TypeScript without emitting files. | Equivalent to `tsc --noEmit`. |

## Mobile-first polish

The UI is tuned for iOS Safari and standalone PWA use: safe-area-aware page padding,
44px minimum touch targets for primary controls, 16px input text to prevent focus zoom,
and momentum scrolling in long output panels. The header capability pills summarize the
core workflow without adding extra navigation friction on small screens.

## Install as an app (PWA)

rePROMPTer 2 ships a web app manifest and a full icon set, so it installs to your home
screen / desktop as a standalone app with the crimson‑on‑charcoal `rp` mark.

- **iOS / iPadOS** — open in Safari → **Share** → **Add to Home Screen**.
- **Android / Chrome** — open the menu → **Install app** / **Add to Home Screen**.
- **Desktop** — use the install icon in the browser address bar.

Icons are served from `public/icon.svg` (favicon), `public/apple-icon.png`
(iOS home screen), and `public/icon-192.png` / `public/icon-512.png` (manifest), generated
from the faithful red‑on‑charcoal restyle. The in‑app header emblem uses
`public/icon-optimized.svg` — the same mark on a transparent background.

## Configuration flags

### Environment variables

The complete set of configuration flags the app reads from the environment. Copy
`.env.example` → `.env.local` for local dev, and set the same values in your Vercel
project's **Settings → Environment Variables**.

| Flag | Purpose | Required | Default |
| --- | --- | --- | --- |
| `ANTHROPIC_API_KEY` | Claude Opus 4.8 access | Yes, to use Claude | — |
| `OPENAI_API_KEY` | GPT‑5.5 access | Yes, to use GPT | — |
| `ANTHROPIC_MODEL` | Override the Claude model id | No | `claude-opus-4-8` |
| `OPENAI_MODEL` | Override the OpenAI model id | No | `gpt-5.5` |

The app degrades gracefully: if the key for the selected provider is missing, the UI shows
a clear, actionable message instead of failing silently.

### In-app selectors

The flags you toggle in the UI for each refinement pass:

| Selector | Options |
| --- | --- |
| **Mode** | `Enhance` · `Expand` · `Clarify` · `Rewrite` |
| **Model** | `Claude Opus 4.8` (`claude-opus-4-8`) · `GPT‑5.5` (`gpt-5.5`) |

## Deploy to Vercel

1. Push this repo to GitHub.
2. In Vercel, **Import** the repository — the **Next.js** preset is auto-detected.
3. Add `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` (and optional model overrides) under
   **Settings → Environment Variables**.
4. Deploy. The default branch deploys to production; other branches get preview URLs.

No `vercel.json` is needed — Next.js is zero-config on Vercel.

## Architecture

- `app/page.tsx` — single-page app; orchestrates state and the streaming refine flow.
- `app/api/refine/route.ts` — streaming endpoint; routes to Anthropic or OpenAI.
- `app/lib/` — model registry, per-mode system prompts, shared types.
- `app/components/` — Logo, EditorCanvas, ModeSelector, ModelSelector, OutputPanel,
  HistoryRail.
- `app/globals.css` — the full black / crimson / chrome design system.
- `app/manifest.ts` — PWA web app manifest (icons, theme, standalone display).
- `public/icon.svg` — app icon / favicon (the chrome `rp` monogram in the crimson recursion
  loop, full tile); `public/icon-optimized.svg` — the transparent-background mark for in-app
  use; `public/apple-icon.png` + `public/icon-{16,32,48,192,512}.png` are the raster variants.

See [`CLAUDE.md`](./CLAUDE.md) for agent/developer working notes.

## License

MIT © 2026 Sean Vasey / VASEY Multimedia. See [`LICENSE`](./LICENSE).
