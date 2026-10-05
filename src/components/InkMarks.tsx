/** Small hand-drawn marks used in place of text glyphs like arrows, ticks and flags. */

export function InkArrow({ direction = "right", size = 22 }: { direction?: "right" | "down"; size?: number }) {
  return (
    <svg
      width={size}
      height={size * 0.6}
      viewBox="0 0 40 24"
      aria-hidden
      style={{ transform: direction === "down" ? "rotate(90deg)" : undefined, flexShrink: 0, overflow: "visible" }}
    >
      <path d="M2 13.5 C10 11 20 13.8 33 11.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M25.5 4.8 C29 7.6 31.6 9.6 34.4 11.4 C31 13.4 28.6 15.8 26.4 19.6" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InkTick({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0, overflow: "visible" }}>
      <path d="M3.5 13.2 C5.6 14.6 7.4 16.6 9.2 19.4 C12 12.6 15.8 7.6 21.2 3.6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function InkFlag({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden style={{ flexShrink: 0, overflow: "visible", verticalAlign: "-2px" }}>
      <path d="M5.5 22 C5.2 15 5.6 8 6 2.4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6.2 3.2 C10 1.6 13.4 5.4 19.6 3.4 C18.4 6.6 18.6 9 20 12 C14.4 13.8 10.4 10.6 6.2 12.4 Z" fill="currentColor" fillOpacity="0.85" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" />
    </svg>
  );
}
