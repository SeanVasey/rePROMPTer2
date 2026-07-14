import type { MetadataRoute } from "next";

// PWA manifest — enables "Add to Home Screen" with the rePROMPTer 2 app icon.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "rePROMPTer 2 — Prompt Optimization Engine",
    short_name: "rePROMPTer 2",
    description:
      "Perfect your prompts with Claude Opus 4.8 and GPT-5.5 — enhance, expand, clarify, and rewrite via recursive iteration. A VASEY/AI production.",
    start_url: "/",
    display: "standalone",
    background_color: "#0a090d",
    theme_color: "#0a090d",
    icons: [
      {
        src: "/icon.svg",
        type: "image/svg+xml",
        sizes: "any",
        purpose: "any",
      },
      {
        src: "/icon-192.png",
        type: "image/png",
        sizes: "192x192",
        purpose: "any",
      },
      {
        src: "/icon-512.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "any",
      },
      {
        src: "/icon-512-maskable.png",
        type: "image/png",
        sizes: "512x512",
        purpose: "maskable",
      },
    ],
  };
}
