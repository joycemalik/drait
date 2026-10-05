import Link from "next/link";
import { timeAgo } from "@/lib/dates";
import type { Discussion } from "@/lib/types";

const indents = ["0%", "16%", "5%", "24%", "10%"];

/** Community threads, staggered like conversations under a tree, joined by a hanging root. */
export default function Voices({ discussions }: { discussions: Discussion[] }) {
  if (discussions.length === 0) return null;
  return (
    <section style={{ position: "relative", padding: "6rem clamp(1.25rem, 6vw, 5rem) 5rem", maxWidth: "70rem", margin: "0 auto" }}>
      <svg
        aria-hidden
        viewBox="0 0 40 1000"
        preserveAspectRatio="none"
        style={{ position: "absolute", left: "clamp(0.4rem, 3vw, 2.6rem)", top: "4rem", bottom: "3rem", width: 40, height: "calc(100% - 7rem)" }}
      >
        <path d="M20 0 C6 120 34 220 18 360 S8 600 24 760 S14 920 20 1000" fill="none" stroke="var(--ink-faint)" strokeWidth="1.2" opacity="0.6" />
        <path d="M22 0 C10 160 30 260 20 420 S12 700 22 1000" fill="none" stroke="var(--ink-faint)" strokeWidth="0.7" opacity="0.4" />
      </svg>

      <p className="section-label">From the community</p>
      <h2 className="font-display" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 400, lineHeight: 1.08, margin: "0.3rem 0 3rem" }}>
        Recent discussions
      </h2>

      <ol style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "2.6rem" }}>
        {discussions.map((d, i) => (
          <li key={d.id} style={{ marginLeft: indents[i % indents.length], maxWidth: "38rem" }}>
            <Link href={`/community/${d.id}`} style={{ textDecoration: "none", color: "inherit", display: "block" }}>
              <p className="font-display" style={{ fontSize: "clamp(1.25rem, 2.4vw, 1.75rem)", lineHeight: 1.25, fontWeight: 400 }}>
                <span aria-hidden style={{ color: "var(--laterite)", marginRight: "0.15em" }}>
                  “
                </span>
                {d.title}
                <span aria-hidden style={{ color: "var(--laterite)" }}>”</span>
              </p>
              <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--ink-soft)" }}>
                {d.author}
                {d.authorYear ? `, ${d.authorYear}` : ""} · {d.replyCount} {d.replyCount === 1 ? "reply" : "replies"} · {timeAgo(d.postedAt)}
                {d.solved ? " · answered" : ""}
              </p>
            </Link>
          </li>
        ))}
      </ol>

      <Link
        href="/community"
        style={{ display: "inline-block", marginTop: "3rem", fontSize: "1rem", color: "var(--ink)", textUnderlineOffset: 5 }}
      >
        Sit with them →
      </Link>
    </section>
  );
}
