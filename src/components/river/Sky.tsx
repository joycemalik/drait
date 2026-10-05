"use client";
import { useSyncExternalStore } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "motion/react";
import AuthButton from "@/components/AuthButton";
import { InkArrow } from "@/components/InkMarks";

type Phase = "dawn" | "day" | "golden" | "night";

function phaseFor(h: number): Phase {
  if (h >= 5 && h < 8) return "dawn";
  if (h >= 8 && h < 16) return "day";
  if (h >= 16 && h < 18.75) return "golden";
  return "night";
}

const greeting: Record<Phase, string> = {
  dawn: "Good morning.",
  day: "Good afternoon.",
  golden: "Good evening.",
  night: "Good evening.",
};

const noSubscribe = () => () => {};

export default function Sky({
  sketch,
  todayCount,
  fortnightCount,
  clubCount,
  signedIn,
  configured,
}: {
  sketch: React.ReactNode;
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

  const { scrollY } = useScroll();
  const drift = useTransform(scrollY, [0, 900], [0, 70]);

  return (
    <header className="sky hero" data-phase={phase}>
      <div className="hero-words">
        <p className="font-display" style={{ fontStyle: "italic", fontSize: "1.1rem", color: "var(--ink-soft)" }}>
          {greeting[phase]}
        </p>
        <h1
          className="font-display"
          style={{ fontSize: "clamp(2.8rem, 6.4vw, 5.6rem)", lineHeight: 0.98, fontWeight: 400, letterSpacing: "-0.02em", margin: "0.6rem 0 1.4rem" }}
        >
          Campus life,
          <br />
          in <em style={{ color: "var(--laterite)" }}>one</em> place.
        </h1>
        <p style={{ fontSize: "clamp(1rem, 1.5vw, 1.15rem)", lineHeight: 1.65, color: "var(--ink-soft)", maxWidth: "30rem" }}>
          Clubs, events, announcements and discussions at Dr. Ambedkar Institute of Technology. Stay up to date without
          checking a dozen group chats.
        </p>
        <p style={{ marginTop: "1.2rem", fontSize: "0.95rem", color: "var(--ink)" }}>
          {fortnightCount > 0 ? (
            <>
              <strong>{fortnightCount}</strong> events in the next two weeks
              {todayCount > 0 && (
                <>
                  , <strong style={{ color: "var(--laterite)" }}>{todayCount} today</strong>
                </>
              )}
              . {clubCount} active clubs.
            </>
          ) : (
            <>{clubCount} active clubs. No events scheduled this week.</>
          )}
        </p>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.4rem", marginTop: "2rem" }}>
          <a href="#river" className="ink-button">
            See upcoming events <InkArrow direction="down" />
          </a>
          {signedIn ? (
            <Link href="/today" style={{ color: "var(--ink)", fontSize: "0.95rem", textUnderlineOffset: 4, display: "inline-flex", alignItems: "center", gap: "0.4rem" }}>
              Your day at AIT <InkArrow />
            </Link>
          ) : (
            <AuthButton configured={configured} style={{ color: "var(--ink)", fontSize: "0.95rem", textDecoration: "underline", textUnderlineOffset: 4 }}>
              Step in with Google
            </AuthButton>
          )}
        </div>
      </div>

      <motion.div className="hero-sketch" style={{ y: drift }}>
        {sketch}
      </motion.div>
    </header>
  );
}
