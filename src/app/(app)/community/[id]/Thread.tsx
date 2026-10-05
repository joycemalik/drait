"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { replyToDiscussion, type ActionResult } from "@/lib/actions";
import { timeAgo } from "@/lib/dates";
import AuthButton from "@/components/AuthButton";
import type { Reply } from "@/lib/data";

export default function Thread({
  discussionId,
  initial,
  legacyCount,
  signedIn,
  configured,
}: {
  discussionId: string;
  initial: Reply[];
  legacyCount: number;
  signedIn: boolean;
  configured: boolean;
}) {
  const [replies, setReplies] = useState(initial);
  // After a reply, the server sends a fresh list; keep any live ones it doesn't have yet.
  const [seen, setSeen] = useState(initial);
  if (initial !== seen) {
    setSeen(initial);
    setReplies((rs) => [...initial, ...rs.filter((r) => !initial.some((i) => i.id === r.id))]);
  }

  // New replies from anyone appear without a reload.
  useEffect(() => {
    if (!configured) return;
    const sb = createClient();
    const channel = sb
      .channel(`replies:${discussionId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "discussion_replies", filter: `discussion_id=eq.${discussionId}` },
        async (payload) => {
          const row = payload.new as { id: string; body: string; created_at: string; author_id: string };
          const { data: p } = await sb.from("profiles").select("full_name, avatar_url").eq("id", row.author_id).maybeSingle();
          setReplies((rs) =>
            rs.some((r) => r.id === row.id)
              ? rs
              : [...rs, { id: row.id, body: row.body, createdAt: row.created_at, author: p?.full_name ?? "A student", avatarUrl: p?.avatar_url ?? undefined }],
          );
        },
      )
      .subscribe();
    return () => {
      sb.removeChannel(channel);
    };
  }, [configured, discussionId]);

  const reply = replyToDiscussion.bind(null, discussionId);
  const [state, action, pending] = useActionState<ActionResult | null, FormData>(reply, null);
  const formRef = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) formRef.current?.reset();
  }, [state]);

  return (
    <section style={{ marginTop: "2.5rem" }}>
      <div className="wobble-rule" />
      <p className="section-label" style={{ margin: "1rem 0 0.5rem" }}>
        {replies.length === 0 ? (legacyCount ? `${legacyCount} replies (not loaded in sample mode)` : "No replies yet") : `${replies.length} ${replies.length === 1 ? "reply" : "replies"}`}
      </p>

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "1.4rem" }}>
        {replies.map((r) => (
          <li key={r.id} style={{ display: "flex", gap: "0.8rem" }}>
            {r.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.avatarUrl} alt="" width={32} height={32} style={{ borderRadius: "50%", flexShrink: 0 }} referrerPolicy="no-referrer" />
            ) : (
              <span style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--paper-deep)", flexShrink: 0, display: "grid", placeItems: "center", fontSize: "0.8rem" }}>
                {r.author.slice(0, 1)}
              </span>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: "0.82rem", color: "var(--ink-soft)" }}>
                <strong style={{ color: "var(--ink)" }}>{r.author}</strong> · {timeAgo(r.createdAt)}
              </p>
              <p style={{ marginTop: "0.25rem", lineHeight: 1.65, whiteSpace: "pre-wrap" }}>{r.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div style={{ marginTop: "2rem" }}>
        {signedIn ? (
          <form ref={formRef} action={action} className="leaf" style={{ padding: "1.1rem 1.3rem", display: "grid", gap: "0.7rem" }}>
            <textarea
              name="body"
              required
              maxLength={5000}
              rows={3}
              placeholder="Add your voice"
              style={{ background: "transparent", border: 0, outline: "none", resize: "vertical", color: "var(--ink)", fontSize: "0.95rem", lineHeight: 1.6 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
              {state && !state.ok && (
                <span role="status" style={{ color: "var(--laterite)", fontSize: "0.85rem" }}>
                  {state.error}
                </span>
              )}
              <button
                disabled={pending}
                style={{ marginLeft: "auto", padding: "0.45rem 1.1rem", borderRadius: "999px / 900px", background: "var(--ink)", color: "var(--paper)", fontWeight: 600 }}
              >
                {pending ? "Sending…" : "Reply"}
              </button>
            </div>
          </form>
        ) : (
          <AuthButton configured={configured} next={`/community/${discussionId}`} style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 4 }}>
            Sign in with Google to reply
          </AuthButton>
        )}
      </div>
    </section>
  );
}
