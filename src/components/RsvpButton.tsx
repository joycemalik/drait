"use client";
import { useState, useTransition } from "react";
import { toggleRsvp } from "@/lib/actions";
import { signInWithGoogle } from "./AuthButton";

export default function RsvpButton({
  eventId,
  initiallyGoing,
  count,
  maxSeats,
}: {
  eventId: string;
  initiallyGoing: boolean;
  count: number;
  maxSeats?: number;
}) {
  const [going, setGoing] = useState(initiallyGoing);
  const [n, setN] = useState(count);
  const [msg, setMsg] = useState<{ text: string; signIn?: boolean } | null>(null);
  const [pending, start] = useTransition();
  const full = maxSeats !== undefined && n >= maxSeats && !going;

  function click() {
    const next = !going;
    setGoing(next);
    setN((x) => x + (next ? 1 : -1));
    setMsg(null);
    start(async () => {
      const res = await toggleRsvp(eventId);
      if (!res.ok) {
        setGoing(!next);
        setN((x) => x + (next ? -1 : 1));
        setMsg({ text: res.error, signIn: res.needsSignIn });
      }
    });
  }

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", gap: "0.35rem" }}>
      <span style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
        <button
          onClick={click}
          disabled={pending || full}
          style={{
            padding: "0.4rem 1rem",
            borderRadius: "999px / 900px",
            fontSize: "0.82rem",
            fontWeight: 600,
            background: going ? "transparent" : "var(--ink)",
            color: going ? "var(--ink)" : "var(--paper)",
            boxShadow: going ? "inset 0 0 0 1.3px var(--ink)" : "none",
            opacity: full ? 0.5 : 1,
          }}
        >
          {going ? "Going ✓" : full ? "Full" : "I'll be there"}
        </button>
        <span style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>
          {n} going{maxSeats ? ` · ${Math.max(0, maxSeats - n)} left` : ""}
        </span>
      </span>
      {msg && (
        <span role="status" style={{ fontSize: "0.78rem", color: "var(--laterite)" }}>
          {msg.text}{" "}
          {msg.signIn && (
            <button onClick={() => signInWithGoogle(location.pathname)} style={{ textDecoration: "underline", color: "var(--ink)" }}>
              Sign in
            </button>
          )}
        </span>
      )}
    </span>
  );
}
