"use client";
import { useState, useTransition } from "react";
import { toggleMembership } from "@/lib/actions";
import { signInWithGoogle } from "@/components/AuthButton";

export default function JoinButton({ slug, initiallyMember, configured }: { slug: string; initiallyMember: boolean; configured: boolean }) {
  const [member, setMember] = useState(initiallyMember);
  const [msg, setMsg] = useState<{ text: string; signIn?: boolean } | null>(null);
  const [pending, start] = useTransition();

  function click() {
    const next = !member;
    setMember(next);
    setMsg(null);
    start(async () => {
      const res = await toggleMembership(slug);
      if (!res.ok) {
        setMember(!next);
        setMsg({ text: res.error, signIn: res.needsSignIn });
      }
    });
  }

  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "0.7rem" }}>
      <button
        onClick={click}
        disabled={pending}
        style={{
          padding: "0.5rem 1.2rem",
          borderRadius: "999px / 900px",
          fontWeight: 600,
          fontSize: "0.88rem",
          background: member ? "transparent" : "var(--ink)",
          color: member ? "var(--ink)" : "var(--paper)",
          boxShadow: member ? "inset 0 0 0 1.3px var(--ink)" : "none",
        }}
      >
        {member ? "You're in ✓" : "Join this club"}
      </button>
      {msg && (
        <span role="status" style={{ fontSize: "0.8rem", color: "var(--laterite)" }}>
          {msg.signIn && configured ? (
            <button onClick={() => signInWithGoogle(location.pathname)} style={{ textDecoration: "underline" }}>
              Sign in to join
            </button>
          ) : (
            msg.text
          )}
        </span>
      )}
    </span>
  );
}
