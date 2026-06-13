import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "rePROMPTer 2 — Prompt Optimization Engine",
  description:
    "Perfect your prompts with Claude Opus 4.8 and GPT-5.5 — enhance, expand, clarify, and rewrite via recursive iteration. A VASEY/AI production.",
  applicationName: "rePROMPTer 2",
  authors: [{ name: "VASEY/AI" }],
  icons: {
    icon: "/icon.svg",
    shortcut: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "rePROMPTer 2",
    description: "The advanced prompt optimization engine. Opus 4.8 · GPT-5.5.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a0a0b",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
