import Link from "next/link";
import { notFound } from "next/navigation";
import { getDiscussions, getReplies, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { timeAgo } from "@/lib/dates";
import VoteButton from "@/components/VoteButton";
import Thread from "./Thread";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const d = (await getDiscussions()).find((x) => x.id === id);
  return { title: d?.title ?? "Conversation" };
}

export default async function DiscussionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [discussions, viewer] = await Promise.all([getDiscussions(), getViewer()]);
  const d = discussions.find((x) => x.id === id);
  if (!d) notFound();
  const replies = await getReplies(id);

  return (
    <article style={{ maxWidth: "44rem" }}>
      <Link href="/community" style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
        ← Community
      </Link>

      <div style={{ display: "flex", gap: "1rem", marginTop: "1.5rem" }}>
        <VoteButton id={d.id} voted={viewer?.votes.includes(d.id) ?? false} count={d.upvotes} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <h1 className="font-display" style={{ fontSize: "clamp(1.7rem, 4vw, 2.4rem)", fontWeight: 400, lineHeight: 1.15 }}>
            {d.title}
          </h1>
          <p style={{ marginTop: "0.6rem", fontSize: "0.85rem", color: "var(--ink-faint)" }}>
            {d.author}
            {d.authorYear ? `, ${d.authorYear}` : ""} · {timeAgo(d.postedAt)}
            {d.solved ? <span style={{ color: "var(--sal)" }}> · answered</span> : null}
          </p>
          {d.body && (
            <p style={{ marginTop: "1.2rem", fontSize: "1rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{d.body}</p>
          )}
          {d.tags.length > 0 && (
            <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--ink-soft)" }}>
              {d.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join("  ")}
            </p>
          )}
        </div>
      </div>

      <Thread
        discussionId={d.id}
        initial={replies}
        legacyCount={isSupabaseConfigured ? 0 : d.replyCount}
        signedIn={!!viewer}
        configured={isSupabaseConfigured}
      />
    </article>
  );
}
