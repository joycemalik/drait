"use client";
import { useState, useTransition } from "react";
import { toggleVote } from "@/lib/actions";
import { signInWithGoogle } from "./AuthButton";

export default function VoteButton({ id, voted, count }: { id: string; voted: boolean; count: number }) {
  const [on, setOn] = useState(voted);
  const [n, setN] = useState(count);
  const [err, setErr] = useState<{ text: string; signIn?: boolean } | null>(null);
  const [pending, start] = useTransition();

  function click(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const next = !on;
    setOn(next);
    setN((x) => x + (next ? 1 : -1));
    setErr(null);
    start(async () => {
      const res = await toggleVote(id);
      if (!res.ok) {
        setOn(!next);
        setN((x) => x + (next ? -1 : 1));
        setErr({ text: res.error, signIn: res.needsSignIn });
      }
    });
  }

  return (
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", minWidth: "2.6rem" }}>
      <button
        onClick={click}
        disabled={pending}
        aria-pressed={on}
        aria-label={on ? "Remove your nod" : "Nod: this matters to me too"}
        title={on ? "You nodded" : "This matters to me too"}
        style={{ color: on ? "var(--laterite)" : "var(--ink-faint)", lineHeight: 0, padding: "0.2rem" }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill={on ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round">
          <path d="M12 3.5c-3.6 3.4-5.6 7-5.2 10.4.3 2.9 2.4 4.6 5.2 4.6s4.9-1.7 5.2-4.6C17.6 10.5 15.6 6.9 12 3.5Z" />
          <path d="M12 7v13.5" fill="none" />
        </svg>
      </button>
      <span style={{ fontSize: "0.8rem", fontWeight: 600, color: on ? "var(--laterite)" : "var(--ink-soft)" }}>{n}</span>
      {err && (
        <span role="status" style={{ fontSize: "0.7rem", color: "var(--laterite)", maxWidth: "7rem", textAlign: "center" }}>
          {err.signIn ? (
            <button onClick={() => signInWithGoogle(location.pathname)} style={{ textDecoration: "underline" }}>
              Sign in to nod
            </button>
          ) : (
            err.text
          )}
        </span>
      )}
    </span>
  );
}
