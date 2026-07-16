# CLAUDE.md

Guidance for Claude Code (and other agents) working in this repository.

## What this is

**rePROMPTer 2** is a prompt enhancement & refinement web app — the more functional,
more aesthetically refined successor to rePROMPTer (v2.4.3). You paste/type a prompt,
pick a **mode** (Enhance / Expand / Clarify / Rewrite) and a **model** (Claude Opus 4.8
or GPT‑5.5), and the app streams back a perfected prompt. Output can be fed back in for
**recursive iteration** — the core motif of the brand (the looping arrows in the icon).

A VASEY/AI production. © VASEY Multimedia.

## Tech stack

- **Next.js 15** (App Router) + **React 19** + **TypeScript**
- **Streaming** Server-Sent-Events API route (`app/api/refine/route.ts`)
- **Anthropic SDK** (`@anthropic-ai/sdk`) → Claude **Opus 4.8** (`claude-opus-4-8`)
- **OpenAI SDK** (`openai`) → **GPT‑5.5** (`gpt-5.5`)
- Hand-written CSS (`app/globals.css`) using design tokens — no UI framework, for full
  control of the black / crimson / chrome aesthetic.
- Deployment target: **Vercel** (zero-config; deploys from the GitHub repo).

## Project layout

```
app/
  layout.tsx          Root layout, fonts, metadata
  globals.css         Design tokens + all component styles
  page.tsx            The single-page app (client component, orchestrates state)
  api/refine/route.ts Streaming endpoint; routes to Anthropic or OpenAI
  components/
    Logo.tsx          The "rp" recursive monogram, recreated as inline SVG
    EditorCanvas.tsx  Prompt textarea + media attach
    ModeSelector.tsx  Enhance / Expand / Clarify / Rewrite
    ModelSelector.tsx Opus 4.8 / GPT-5.5
    OutputPanel.tsx   Streamed result, copy / download / iterate-again
    HistoryRail.tsx   Iteration history (recursive passes)
  lib/
    types.ts          Shared types (Mode, ModelId, etc.)
    models.ts         Model registry (id, label, provider)
    prompts.ts        System prompts per mode
public/
  icon.svg            App icon — full crimson-bordered tile (favicon / PWA / iOS)
  icon-optimized.svg  Transparent-background mark (in-app logo / where alpha is ideal)
```

## Brand & design system

Faithfully derived from the supplied icon restyle and the v2.4.3 screenshot.

- **Palette** (see `:root` in `globals.css`):
  - Background: near-black `#0a0a0b` with a faint crimson radial glow.
  - Accent / crimson: `#e0383b` (primary), `#b3282b` (deep).
  - Chrome/silver: gradient `#f5f5f7 → #9a9a9f → #d8d8dc` for the monogram & wordmark.
  - Surfaces: glassmorphic dark panels with hairline borders and inner glow.
- **Wordmark:** `re` (silver) · `PROMPT` (crimson) · `er` (silver), bold.
- **Icon motif:** chrome `rp` monogram encircled by two crimson recursive arrows,
  flanked by quotation marks — the recursion = refinement loop.
- Keep it dark, glossy, high-contrast, restrained. No purple gradients, no generic
  "AI slop" aesthetics.
- **Logo / app icon assets:** `public/icon.svg` is the canonical SVG source (the full
  crimson-bordered tile, cut from `reprompter-icon-ios.svg` — a full-bleed red border
  plate so iOS's own squircle mask never shows light/dark mode through the corners) for
  the README logo, favicon, and PWA / iOS home-screen icon;
  `public/icon-optimized.svg` is the same mark on a **transparent background** (tile,
  border, and vignette stripped) for in-app use and anywhere alpha is ideal;
  `public/apple-icon.png` and `public/icon-{16,32,48,192,512}.png` (+ `icon-512-maskable.png`)
  are raster variants used by the PWA manifest / iOS home screen; `app/components/Logo.tsx`
  is the in-app header emblem (renders `icon-optimized.svg`). Regenerate the rasters from
  `icon.svg` with `node scripts/generate-icons.mjs`. Keep all of these in sync when the
  brand mark changes.

## Commands

```bash
npm install        # install deps
npm run dev        # local dev at http://localhost:3000
npm run build      # production build (also what Vercel runs)
npm run start      # serve the production build
npm run lint       # next lint
```

## Environment variables

Copy `.env.example` → `.env.local` for local dev; set the same in Vercel project settings.

| Var                 | Purpose                                  | Default        |
| ------------------- | ---------------------------------------- | -------------- |
| `ANTHROPIC_API_KEY` | Claude Opus 4.8 access                   | — (required for Claude) |
| `OPENAI_API_KEY`    | GPT‑5.5 access                           | — (required for GPT) |
| `ANTHROPIC_MODEL`   | Override Claude model id                 | `claude-opus-4-8` |
| `OPENAI_MODEL`      | Override OpenAI model id                 | `gpt-5.5`      |

These four variables are the **complete set** of configuration flags the app reads from the
environment (see `app/api/refine/route.ts` and `app/lib/models.ts`). The only other
user-facing "flags" are the in-app selectors — **Mode** (Enhance / Expand / Clarify /
Rewrite) and **Model** (Opus 4.8 / GPT‑5.5).

The API route degrades gracefully: if the key for the selected provider is missing it
returns a clear, user-facing error (no silent failure), and the UI surfaces it.

## Working agreements for agents

- **Models:** default to `claude-opus-4-8` and `gpt-5.5`. Do not downgrade. Both ids are
  configurable via env — read them from `app/lib/models.ts`.
- **Claude API:** use the official `@anthropic-ai/sdk`, **streaming** (`messages.stream`;
  use `.finalMessage()` if you don't need per-event handling). Adaptive thinking is left
  off for latency on this short-output task — safe here only because the system prompt
  forces final-answer-only output (`prompts.ts`); without that, Opus 4.8 can leak reasoning
  into the visible response, so keep that instruction or turn adaptive thinking on. Never
  use `budget_tokens`, `temperature`, `top_p`, or `top_k` on Opus 4.8 (they 400). See the
  project's `claude-api` skill for specifics.
- **Secrets:** never hardcode keys; never commit `.env*`. Keys live in env only.
- **Aesthetic:** match the existing tokens and component idiom in `globals.css`. Keep the
  black/crimson/chrome system coherent.
- **Don't** introduce a CSS framework or rewrite the design system without reason.
- Keep the build green (`npm run build`) before committing.

## Deployment (Vercel)

1. Import the GitHub repo into Vercel (Framework preset auto-detects **Next.js**).
2. Add `ANTHROPIC_API_KEY` and `OPENAI_API_KEY` (and optional model overrides) as
   Environment Variables.
3. Deploy. Pushes to the default branch trigger production deploys; other branches get
   preview deploys. No `vercel.json` is required — Next.js is zero-config on Vercel.
