"use client";
import { useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import { blobPath, noise1D, rng, smoothPath } from "@/lib/noise";
import AuthButton from "@/components/AuthButton";

type Phase = "dawn" | "day" | "golden" | "night";

function phaseFor(h: number): Phase {
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 16) return "day";
  if (h >= 16 && h < 18.75) return "golden";
  return "night";
}

const greeting: Record<Phase, string> = {
  dawn: "Good morning.",
  day: "Good day.",
  golden: "Good evening.",
  night: "Good night, almost.",
};

// Where the sun or moon sits for each part of the day (percent of the hero).
const orb: Record<Phase, { x: number; y: number }> = {
  dawn: { x: 14, y: 62 },
  day: { x: 78, y: 18 },
  golden: { x: 86, y: 52 },
  night: { x: 80, y: 20 },
};

/** A canopy silhouette: the outline of many overlapping, uneven tree crowns. */
function treeLine(seed: number, base: number, minH: number, maxH: number) {
  const r = rng(seed);
  const broad = noise1D(seed);
  const crowns: { x: number; y: number; r: number }[] = [];
  for (let x = -40; x < 1660; x += 8 + r() * 18) {
    const rad = 18 + r() * 26;
    const lift = minH + (maxH - minH) * (0.5 + 0.5 * broad(x / 300)) * (0.6 + r() * 0.4);
    crowns.push({ x, y: base - lift + rad * 0.6, r: rad });
  }
  const pts: [number, number][] = [];
  for (let x = -10; x <= 1610; x += 4) {
    let top = base;
    for (const c of crowns) {
      const dx = x - c.x;
      if (Math.abs(dx) < c.r) top = Math.min(top, c.y - Math.sqrt(c.r * c.r - dx * dx) * 0.85);
    }
    pts.push([x, top]);
  }
  return `${smoothPath(pts)} L1610 220 L-10 220 Z`;
}

const noSubscribe = () => () => {};

export default function Sky({
  todayCount,
  fortnightCount,
  clubCount,
  signedIn,
  configured,
}: {
  todayCount: number;
  fortnightCount: number;
  clubCount: number;
  signedIn: boolean;
  configured: boolean;
}) {
  // The server can't know the visitor's local time; it renders "day" and the client corrects it.
  const phase = useSyncExternalStore(
    noSubscribe,
    () => {
      const d = new Date();
      return phaseFor(d.getHours() + d.getMinutes() / 60);
    },
    () => "day" as Phase,
  );

  const far = useMemo(() => treeLine(3, 160, 30, 85), []);
  const near = useMemo(() => treeLine(8, 205, 25, 110), []);
  const { scrollY } = useScroll();
  const farY = useTransform(scrollY, [0, 800], [0, 60]);
  const nearY = useTransform(scrollY, [0, 800], [0, 20]);
  const sunY = useTransform(scrollY, [0, 800], [0, 140]);

  const o = orb[phase];
  const night = phase === "night";

  return (
    <header
      className="sky"
      data-phase={phase}
      style={{
        position: "relative",
        minHeight: "100svh",
        overflow: "hidden",
        background: "linear-gradient(180deg, var(--sky-top) 0%, var(--sky-mid) 48%, var(--paper) 100%)",
        transition: "background 1.2s ease",
      }}
    >
      <motion.svg
        aria-hidden
        viewBox="0 0 100 100"
        style={{ position: "absolute", left: `${o.x}%`, top: `${o.y}%`, width: "clamp(70px, 9vw, 130px)", y: sunY }}
      >
        {night ? (
          <path d="M62 8 C36 12 18 32 20 56 C22 78 42 94 66 92 C48 84 36 68 36 50 C36 32 46 16 62 8 Z" fill="#f6eedb" opacity="0.92" />
        ) : (
          <path d={blobPath(5, 50, 50, 46, 45, 0.03, 12)} fill="var(--turmeric)" opacity="0.75" />
        )}
      </motion.svg>

      <svg aria-hidden style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none" }}>
        {[0, 1].map((i) => (
          <g key={i} className="bird" style={{ animationDelay: `${-i * 31}s` }}>
            <g transform={`translate(0 ${120 + i * 70})`}>
              <path d="M0 0 q6 -6 12 0 q6 -6 12 0" fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" opacity="0.5" />
            </g>
          </g>
        ))}
      </svg>

      <motion.svg aria-hidden viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: 0, left: 0, width: "100%", height: "38%", y: farY }}>
        <path d={far} fill="var(--sal)" opacity="0.16" />
      </motion.svg>
      <motion.svg aria-hidden viewBox="0 0 1600 220" preserveAspectRatio="xMidYMax slice" style={{ position: "absolute", bottom: -2, left: 0, width: "100%", height: "34%", y: nearY }}>
        <path d={near} fill="var(--sal)" opacity="0.3" />
        <path d="M0 214 C300 206 520 218 800 211 S1300 206 1600 213 L1600 220 L0 220 Z" fill="var(--paper)" />
      </motion.svg>

      <div style={{ position: "relative", padding: "clamp(7rem, 18vh, 11rem) clamp(1.25rem, 6vw, 5rem) 0", maxWidth: "52rem" }}>
        <p className="font-display" style={{ fontStyle: "italic", fontSize: "1.1rem", color: "var(--ink-soft)" }}>
          {greeting[phase]}
        </p>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(2.8rem, 7.5vw, 6.2rem)", lineHeight: 0.98, fontWeight: 400, letterSpacing: "-0.02em", margin: "0.6rem 0 1.4rem" }}
        >
          Learn under
          <br />
          the <em style={{ color: "var(--laterite)" }}>open</em> sky.
        </h1>
        <p style={{ fontSize: "clamp(1rem, 1.6vw, 1.2rem)", lineHeight: 1.6, color: "var(--ink-soft)", maxWidth: "34rem" }}>
          Every club, gathering and conversation at Dr. Ambedkar Institute of Technology, in one place. No group chats to
          dig through and no posters you missed.
        </p>
        <p style={{ marginTop: "1.2rem", fontSize: "0.95rem", color: "var(--ink)" }}>
          {fortnightCount > 0 ? (
            <>
              <strong>{fortnightCount}</strong> gatherings on the water in the next two weeks
              {todayCount > 0 && (
                <>
                  , <strong style={{ color: "var(--laterite)" }}>{todayCount} today</strong>
                </>
              )}
              . {clubCount} clubs along the banks.
            </>
          ) : (
            <>{clubCount} clubs along the banks. The water is quiet this week.</>
          )}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.25rem", marginTop: "2rem" }}>
          <a
            href="#river"
            style={{
              padding: "0.75rem 1.5rem",
              borderRadius: "999px / 900px",
              background: "var(--ink)",
              color: "var(--paper)",
              fontWeight: 600,
              fontSize: "0.95rem",
              textDecoration: "none",
            }}
          >
            Follow the river ↓
          </a>
          {signedIn ? (
            <Link href="/today" style={{ color: "var(--ink)", fontSize: "0.95rem", textUnderlineOffset: 4 }}>
              Your day at AIT →
            </Link>
          ) : (
            <AuthButton configured={configured} style={{ color: "var(--ink)", fontSize: "0.95rem", textDecoration: "underline", textUnderlineOffset: 4 }}>
              Step in with Google
            </AuthButton>
          )}
        </div>
      </div>
    </header>
  );
}
