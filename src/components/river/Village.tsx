"use client";
import { useRouter } from "next/navigation";
import { blobPath, hashString, rng } from "@/lib/noise";
import type { Club } from "@/lib/types";

/** A club, drawn as a few huts and a tree on the bank. (0,0) is where the village meets the ground. */
export default function Village({ club, active, x, y }: { club: Club; active: boolean; x: number; y: number }) {
  const router = useRouter();
  const seed = hashString(club.slug);
  const r = rng(seed);
  const huts = 2 + (seed % 2);
  const treeLeft = seed % 3 !== 0;
  const href = `/clubs/${club.slug}`;

  return (
    <g transform={`translate(${x.toFixed(1)} ${y.toFixed(1)})`}>
      <a
        href={href}
        className="village"
        aria-label={`${club.name}: ${club.tagline}`}
        onClick={(e) => {
          e.preventDefault();
          router.push(href);
        }}
      >
        <title>{club.tagline}</title>
        <ellipse cx="0" cy="-26" rx="70" ry="44" fill="transparent" />

        {/* tree */}
        <g transform={`translate(${treeLeft ? -46 : 48} 0)`}>
          <path d="M0 0 C-1 -10 1 -18 0 -26" stroke="var(--ink)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={blobPath(seed + 1, 0, -40, 19, 17, 0.18)} fill="var(--sal)" fillOpacity="0.55" stroke="var(--ink)" strokeWidth="0.9" strokeOpacity="0.6" />
          <path d={blobPath(seed + 2, -6, -47, 10, 9, 0.2)} fill="var(--sal)" fillOpacity="0.4" />
        </g>

        {/* huts */}
        {Array.from({ length: huts }, (_, i) => {
          const hx = (i - (huts - 1) / 2) * 30 + (r() * 6 - 3) + (treeLeft ? 8 : -8);
          const s = 0.85 + r() * 0.3;
          const chimney = i === 0;
          return (
            <g key={i} transform={`translate(${hx.toFixed(1)} 0) scale(${s.toFixed(2)})`}>
              <path
                d="M-11 0 C-11.5 -6 -11 -12 -10.5 -15 L10.5 -15.5 C11 -10 11.4 -5 11 0 Z"
                fill="var(--paper-raised)"
                stroke="var(--ink)"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <path
                d="M-16 -13 C-9 -22 -4 -29 0.5 -33 C5 -28 10 -21 16.5 -13.5 C6 -11.5 -6 -11.5 -16 -13 Z"
                fill={club.color}
                fillOpacity="0.85"
                stroke="var(--ink)"
                strokeWidth="1.1"
                strokeLinejoin="round"
              />
              <path d="M-3.5 0 L-3.5 -6.5 Q0 -10 3.5 -6.5 L3.5 0" fill="var(--ink)" fillOpacity="0.75" />
              {chimney && active && (
                <path
                  className="smoke"
                  d="M2 -34 C-3 -40 6 -45 1 -51 S 5 -60 0 -66"
                  fill="none"
                  stroke="var(--ink-faint)"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                />
              )}
            </g>
          );
        })}

        <path d="M-62 1 C-30 -1 -8 2.5 20 0.5 S 52 1.5 62 0" fill="none" stroke="var(--ink)" strokeWidth="0.9" opacity="0.45" />

        <text
          y="22"
          textAnchor="middle"
          style={{ fontFamily: "var(--font-fraunces), Georgia, serif", fontSize: 15, fontStyle: "italic" }}
          fill="var(--ink)"
        >
          {club.name}
        </text>
        <text className="village-tagline" y="39" textAnchor="middle" style={{ fontSize: 11 }} fill="var(--ink-soft)">
          {club.tagline.length > 34 ? club.tagline.slice(0, 33) + "…" : club.tagline}
        </text>
      </a>
    </g>
  );
}
