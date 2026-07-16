/**
 * The rePROMPTer 2 brand emblem — the chrome "rP" monogram inside the crimson
 * recursion loop. In the app it renders the transparent-background variant
 * (`/icon-optimized.svg`) so the mark floats on the dark UI without the tile
 * behind it; the tiled `/icon.svg` remains the favicon / PWA / iOS home-screen
 * icon. Both are cut from the same vector master (reprompter-icon-ios.svg →
 * public/icon.svg; keep them in sync).
 */
export default function Logo({ size = 72 }: { size?: number }) {
  return (
    // Pure vector, but next/image won't optimize SVG without dangerouslyAllowSVG,
    // so we render it directly to stay in lockstep with the master mark.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon-optimized.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="rp-emblem"
      draggable={false}
    />
  );
}
