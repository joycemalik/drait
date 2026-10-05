"use client";
import { useActionState, useState } from "react";
import Link from "next/link";
import VoteButton from "@/components/VoteButton";
import AuthButton from "@/components/AuthButton";
import { createDiscussion } from "@/lib/actions";
import { timeAgo } from "@/lib/dates";
import type { Discussion, DiscussionCategory } from "@/lib/types";

const topics: { id: DiscussionCategory; label: string }[] = [
  { id: "academic", label: "Academics" },
  { id: "career", label: "Careers" },
  { id: "campus", label: "Campus life" },
  { id: "projects", label: "Projects" },
  { id: "general", label: "Anything else" },
];

export default function CommunityView({
  discussions,
  votes,
  signedIn,
  configured,
}: {
  discussions: Discussion[];
  votes: string[];
  signedIn: boolean;
  configured: boolean;
}) {
  const [topic, setTopic] = useState<DiscussionCategory | "all">("all");
  const [sort, setSort] = useState<"lively" | "new">("lively");
  const [writing, setWriting] = useState(false);
  const [query, setQuery] = useState("");

  const q = query.trim().toLowerCase();
  const list = discussions
    .filter((d) => topic === "all" || d.category === topic)
    .filter((d) => !q || d.title.toLowerCase().includes(q) || d.body.toLowerCase().includes(q))
    .sort((a, b) =>
      sort === "lively" ? b.upvotes * 2 + b.replyCount - (a.upvotes * 2 + a.replyCount) : b.postedAt.localeCompare(a.postedAt),
    );

  return (
    <div>
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <p className="section-label">Under the banyan</p>
          <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
            Community
          </h1>
          <p style={{ marginTop: "0.4rem", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            Ask seniors, find teammates, settle the canteen debate.
          </p>
        </div>
        {signedIn ? (
          <button
            onClick={() => setWriting((w) => !w)}
            style={{ padding: "0.55rem 1.2rem", borderRadius: "999px / 900px", background: "var(--ink)", color: "var(--paper)", fontWeight: 600, fontSize: "0.9rem" }}
          >
            {writing ? "Not now" : "Start a conversation"}
          </button>
        ) : (
          <AuthButton
            configured={configured}
            next="/community"
            style={{ padding: "0.55rem 1.2rem", borderRadius: "999px / 900px", background: "var(--ink)", color: "var(--paper)", fontWeight: 600, fontSize: "0.9rem" }}
          >
            Sign in to post
          </AuthButton>
        )}
      </header>

      {writing && <NewDiscussion onCancel={() => setWriting(false)} />}

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.4rem 1.1rem", margin: "2rem 0 0.75rem", fontSize: "0.9rem" }}>
        {[{ id: "all" as const, label: "Everything" }, ...topics].map((t) => (
          <button
            key={t.id}
            onClick={() => setTopic(t.id)}
            style={{
              color: topic === t.id ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: topic === t.id ? 600 : 400,
              textDecoration: topic === t.id ? "underline" : "none",
              textDecorationColor: "var(--turmeric)",
              textDecorationThickness: 3,
              textUnderlineOffset: 6,
            }}
          >
            {t.label}
          </button>
        ))}
        <span style={{ marginLeft: "auto", display: "flex", gap: "0.9rem", fontSize: "0.82rem", color: "var(--ink-soft)" }}>
          <input
            type="search"
            placeholder="Search conversations"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ background: "var(--paper-deep)", borderRadius: 999, padding: "0.3rem 0.8rem", border: 0, outline: "none", color: "var(--ink)" }}
          />
          <button onClick={() => setSort("lively")} style={{ fontWeight: sort === "lively" ? 600 : 400, color: sort === "lively" ? "var(--ink)" : undefined }}>
            Lively
          </button>
          <button onClick={() => setSort("new")} style={{ fontWeight: sort === "new" ? 600 : 400, color: sort === "new" ? "var(--ink)" : undefined }}>
            Newest
          </button>
        </span>
      </div>
      <div className="wobble-rule" />

      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {list.map((d) => (
          <li key={d.id} style={{ display: "flex", gap: "1rem", padding: "1.3rem 0 1.1rem", alignItems: "flex-start" }}>
            <VoteButton id={d.id} voted={votes.includes(d.id)} count={d.upvotes} />
            <Link href={`/community/${d.id}`} style={{ flex: 1, textDecoration: "none", color: "inherit", minWidth: 0 }}>
              <p className="font-display" style={{ fontSize: "1.3rem", lineHeight: 1.25 }}>
                {d.pinned && <span title="Pinned" style={{ color: "var(--laterite)" }}>⚑ </span>}
                {d.title}
              </p>
              {d.body && (
                <p style={{ marginTop: "0.35rem", color: "var(--ink-soft)", fontSize: "0.9rem", lineHeight: 1.55, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                  {d.body}
                </p>
              )}
              <p style={{ marginTop: "0.5rem", fontSize: "0.8rem", color: "var(--ink-faint)" }}>
                {d.author}
                {d.authorYear ? `, ${d.authorYear}` : ""} · {timeAgo(d.postedAt)} · {d.replyCount} {d.replyCount === 1 ? "reply" : "replies"}
                {d.solved ? <span style={{ color: "var(--sal)" }}> · answered</span> : null}
              </p>
            </Link>
          </li>
        ))}
      </ol>

      {list.length === 0 && (
        <p style={{ padding: "3rem 0", color: "var(--ink-soft)", textAlign: "center" }}>
          {q ? "Nothing matches that yet." : "Nobody has started one here yet. You could be first."}
        </p>
      )}
    </div>
  );
}

function NewDiscussion({ onCancel }: { onCancel: () => void }) {
  const [state, action, pending] = useActionState(createDiscussion, null);
  return (
    <form action={action} className="leaf" style={{ marginTop: "1.5rem", padding: "1.5rem 1.6rem", display: "grid", gap: "0.9rem" }}>
      <input
        name="title"
        required
        minLength={3}
        maxLength={200}
        placeholder="What's on your mind?"
        className="font-display"
        style={{ fontSize: "1.3rem", background: "transparent", border: 0, outline: "none", color: "var(--ink)" }}
      />
      <div className="wobble-rule" />
      <textarea
        name="body"
        rows={4}
        maxLength={10000}
        placeholder="Add details, links, or context (optional)"
        style={{ background: "transparent", border: 0, outline: "none", resize: "vertical", color: "var(--ink)", fontSize: "0.95rem", lineHeight: 1.6 }}
      />
      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.8rem" }}>
        <select
          name="category"
          defaultValue="general"
          style={{ background: "var(--paper-deep)", border: 0, borderRadius: 999, padding: "0.4rem 0.8rem", color: "var(--ink)" }}
        >
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.label}
            </option>
          ))}
        </select>
        <span style={{ marginLeft: "auto", display: "flex", gap: "1rem", alignItems: "center" }}>
          <button type="button" onClick={onCancel} style={{ color: "var(--ink-soft)", fontSize: "0.9rem" }}>
            Cancel
          </button>
          <button
            disabled={pending}
            style={{ padding: "0.5rem 1.2rem", borderRadius: "999px / 900px", background: "var(--ink)", color: "var(--paper)", fontWeight: 600 }}
          >
            {pending ? "Posting…" : "Post"}
          </button>
        </span>
      </div>
      {state && !state.ok && (
        <p role="status" style={{ color: "var(--laterite)", fontSize: "0.85rem" }}>
          {state.error}
        </p>
      )}
    </form>
  );
}
