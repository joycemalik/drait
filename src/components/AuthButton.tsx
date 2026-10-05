"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function signInWithGoogle(next = "/today") {
  const supabase = createClient();
  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
      // Always show the account picker, so students can choose their college account.
      queryParams: { prompt: "select_account" },
    },
  });
}

export default function AuthButton({
  configured,
  next = "/today",
  children = "Sign in with Google",
  className = "",
  style,
}: {
  configured: boolean;
  next?: string;
  children?: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  const [note, setNote] = useState(false);
  const [busy, setBusy] = useState(false);

  async function go() {
    if (!configured) {
      setNote(true);
      return;
    }
    setBusy(true);
    await signInWithGoogle(next);
  }

  return (
    <span style={{ position: "relative", display: "inline-block" }}>
      <button onClick={go} disabled={busy} className={className} style={style}>
        {busy ? "Opening Google…" : children}
      </button>
      {note && (
        <span
          role="status"
          className="leaf"
          style={{
            position: "absolute",
            top: "calc(100% + 0.5rem)",
            right: 0,
            width: "16rem",
            padding: "0.75rem 0.9rem",
            fontSize: "0.8rem",
            lineHeight: 1.45,
            color: "var(--ink-soft)",
            zIndex: 60,
          }}
        >
          This copy is running on sample data, so sign-in is off. Add Supabase keys to <code>.env.local</code> to turn it on
          (see the README).
        </span>
      )}
    </span>
  );
}
