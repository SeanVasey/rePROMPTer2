/**
 * The rePROMPTer 2 brand emblem — renders the official app icon so the header
 * logo is always identical to the favicon / PWA icon (one source of truth).
 * The icon is the chrome "rP" monogram inside the crimson recursion loop.
 */
export default function Logo({ size = 72 }: { size?: number }) {
  return (
    // /icon.svg embeds a raster, which next/image won't optimize without
    // dangerouslyAllowSVG, so we render it directly to stay in sync with it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/icon.svg"
      alt=""
      aria-hidden="true"
      width={size}
      height={size}
      className="rp-emblem"
      draggable={false}
    />
  );
}
