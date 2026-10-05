import Link from "next/link";
import { notFound } from "next/navigation";
import { getPerson } from "@/lib/data";
import { departmentName } from "@/lib/college";
import { timeAgo } from "@/lib/dates";
import { InkTick } from "@/components/InkMarks";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);
  return { title: person?.profile.fullName || "Student" };
}

const linkStyle: React.CSSProperties = { color: "var(--ink)", fontSize: "0.9rem" };

export default async function PersonPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const person = await getPerson(id);
  if (!person) notFound();
  const { profile: p, clubs, discussions, achievements } = person;

  const links = [
    p.github && { href: `https://github.com/${p.github}`, label: "GitHub" },
    p.linkedin && { href: `https://www.linkedin.com/in/${p.linkedin}`, label: "LinkedIn" },
    p.instagram && { href: `https://instagram.com/${p.instagram}`, label: "Instagram" },
    p.website && { href: p.website, label: p.website.replace(/^https?:\/\//, "").replace(/\/$/, "") },
  ].filter(Boolean) as { href: string; label: string }[];

  const meta = [departmentName(p.department), p.year, p.section && `Section ${p.section}`].filter(Boolean).join(" · ");

  return (
    <div style={{ maxWidth: "46rem" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "1.4rem" }}>
        <div
          style={{
            width: 104,
            height: 104,
            borderRadius: "48% 52% 50% 50% / 52% 48% 52% 48%",
            overflow: "hidden",
            background: "var(--paper-deep)",
            display: "grid",
            placeItems: "center",
            boxShadow: "0 0 0 3px var(--paper), 0 0 0 4.5px var(--rule)",
            flexShrink: 0,
          }}
        >
          {p.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={p.avatarUrl} alt="" width={104} height={104} style={{ objectFit: "cover", width: "100%", height: "100%" }} referrerPolicy="no-referrer" />
          ) : (
            <span className="font-display" style={{ fontSize: "2.4rem", color: "var(--ink-soft)" }}>
              {p.fullName.slice(0, 1)}
            </span>
          )}
        </div>
        <div style={{ minWidth: 0 }}>
          <h1 className="font-display" style={{ fontSize: "2.3rem", fontWeight: 400, lineHeight: 1.05 }}>
            {p.fullName || "Student"}
          </h1>
          {meta && <p style={{ marginTop: "0.35rem", color: "var(--ink-soft)", fontSize: "0.92rem" }}>{meta}</p>}
          {p.verified && (
            <p style={{ marginTop: "0.3rem", display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.8rem", color: "var(--sal)" }}>
              <InkTick size={12} /> Verified Dr. AIT student
            </p>
          )}
        </div>
      </header>

      {p.bio && <p style={{ marginTop: "1.6rem", fontSize: "1.02rem", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{p.bio}</p>}

      {p.skills.length > 0 && (
        <p style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
          {p.skills.map((s) => (
            <span key={s} style={{ fontSize: "0.8rem", padding: "0.2rem 0.65rem", borderRadius: 999, background: "var(--paper-deep)", color: "var(--ink-soft)" }}>
              {s}
            </span>
          ))}
        </p>
      )}

      {links.length > 0 && (
        <p style={{ marginTop: "1rem", display: "flex", flexWrap: "wrap", gap: "0.4rem 1.2rem" }}>
          {links.map((l) => (
            <a key={l.href} href={l.href} target="_blank" rel="noreferrer nofollow" style={linkStyle}>
              {l.label} ↗
            </a>
          ))}
        </p>
      )}

      <div className="dash-grid-2" style={{ marginTop: "2.5rem", gap: "2rem" }}>
        <section>
          <p className="section-label">Clubs</p>
          <div className="wobble-rule" style={{ margin: "0.3rem 0 0.5rem" }} />
          {clubs.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--ink-faint)" }}>Not in any clubs yet.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" }}>
              {clubs.map((c) => (
                <li key={c.slug} style={{ fontSize: "0.92rem" }}>
                  <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: c.color, marginRight: 8 }} />
                  <Link href={`/clubs/${c.slug}`} style={{ color: "var(--ink)" }}>
                    {c.name}
                  </Link>
                  {c.role !== "member" && <span style={{ color: "var(--ink-faint)" }}> · {c.role}</span>}
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <p className="section-label">Achievements</p>
          <div className="wobble-rule" style={{ margin: "0.3rem 0 0.5rem" }} />
          {achievements.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--ink-faint)" }}>None submitted yet.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.5rem" }}>
              {achievements.map((a) => (
                <li key={a.id} style={{ fontSize: "0.92rem" }}>
                  {a.title}
                  <span style={{ color: "var(--ink-faint)" }}> · {a.achievedOn.slice(0, 4)}</span>
                  {a.verified && (
                    <span style={{ color: "var(--sal)", marginLeft: 6, verticalAlign: "-1px" }}>
                      <InkTick size={11} />
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section style={{ marginTop: "2.5rem" }}>
        <p className="section-label">Recent posts</p>
        <div className="wobble-rule" style={{ margin: "0.3rem 0 0.5rem" }} />
        {discussions.length === 0 ? (
          <p style={{ fontSize: "0.9rem", color: "var(--ink-faint)" }}>No posts yet.</p>
        ) : (
          <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.7rem" }}>
            {discussions.map((d) => (
              <li key={d.id}>
                <Link href={`/community/${d.id}`} className="font-display" style={{ fontSize: "1.1rem", color: "var(--ink)" }}>
                  {d.title}
                </Link>
                <span style={{ fontSize: "0.8rem", color: "var(--ink-faint)" }}>
                  {" "}
                  · {d.replyCount} {d.replyCount === 1 ? "reply" : "replies"} · {timeAgo(d.postedAt)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
