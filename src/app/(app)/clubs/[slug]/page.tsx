import Link from "next/link";
import { notFound } from "next/navigation";
import { getAnnouncements, getClubBySlug, getEvents, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { googleCalendarUrl, timeAgo, todayISO } from "@/lib/dates";
import Village from "@/components/river/Village";
import RsvpButton from "@/components/RsvpButton";
import JoinButton from "./JoinButton";
import ClubAdmin from "./ClubAdmin";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  return { title: club?.name ?? "Club", description: club?.tagline };
}

export default async function ClubPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const club = await getClubBySlug(slug);
  if (!club) notFound();

  const [events, notices, viewer] = await Promise.all([
    getEvents({ from: todayISO(), days: 120, clubSlug: slug }),
    getAnnouncements({ clubSlug: slug, limit: 6 }),
    getViewer(),
  ]);
  const membership = viewer?.clubs.find((m) => m.slug === slug);
  const isAdmin = !!viewer && (viewer.isSiteAdmin || membership?.role === "lead" || membership?.role === "admin");

  return (
    <div>
      <Link href="/clubs" style={{ fontSize: "0.85rem", color: "var(--ink-soft)" }}>
        ← All clubs
      </Link>

      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", gap: "1.5rem 2.5rem", marginTop: "1.5rem" }}>
        <svg viewBox="-80 -82 160 100" width="200" aria-hidden style={{ flexShrink: 0 }}>
          <Village club={{ ...club, name: "", tagline: "" }} active={events.length > 0} x={0} y={0} />
        </svg>
        <div style={{ flex: "1 1 18rem" }}>
          <p className="section-label" style={{ textTransform: "capitalize" }}>
            {club.category} · since {club.foundedYear || "—"}
          </p>
          <h1 className="font-display" style={{ fontSize: "clamp(2.2rem, 5vw, 3.4rem)", fontWeight: 400, lineHeight: 1.02 }}>
            {club.name}
          </h1>
          <p className="font-display" style={{ fontStyle: "italic", fontSize: "1.15rem", color: "var(--ink-soft)", marginTop: "0.4rem" }}>
            {club.tagline}
          </p>
        </div>
      </header>

      <p style={{ marginTop: "1.6rem", fontSize: "1rem", lineHeight: 1.75, maxWidth: "40rem" }}>{club.description}</p>

      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.8rem 1.6rem", marginTop: "1.4rem", fontSize: "0.88rem", color: "var(--ink-soft)" }}>
        <JoinButton slug={slug} initiallyMember={!!membership} configured={isSupabaseConfigured} />
        <span>{club.memberCount} members on record</span>
        {club.externalLink && (
          <a href={club.externalLink} target="_blank" rel="noreferrer" style={{ color: "var(--ink)" }}>
            Website ↗
          </a>
        )}
        {club.instagramLink && (
          <a href={club.instagramLink} target="_blank" rel="noreferrer" style={{ color: "var(--ink)" }}>
            Instagram ↗
          </a>
        )}
      </div>
      {club.tags.length > 0 && (
        <p style={{ marginTop: "0.9rem", fontSize: "0.8rem", color: "var(--ink-faint)" }}>{club.tags.map((t) => `#${t.replace(/\s+/g, "")}`).join("  ")}</p>
      )}

      {isAdmin && <ClubAdmin slug={slug} />}

      <div className="dash-grid-2" style={{ gridTemplateColumns: undefined, marginTop: "3rem", gap: "3rem" }}>
        <section>
          <p className="section-label">Upcoming events</p>
          <div className="wobble-rule" style={{ margin: "0.3rem 0 0.4rem" }} />
          {events.length === 0 ? (
            <p style={{ color: "var(--ink-soft)", padding: "1rem 0" }}>No upcoming events.</p>
          ) : (
            <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {events.map((ev) => (
                <li key={ev.id} style={{ padding: "1.1rem 0", display: "flex", gap: "1rem" }}>
                  <div style={{ width: "3rem", textAlign: "center", flexShrink: 0 }}>
                    <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>
                      {new Date(`${ev.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}
                    </div>
                    <div className="font-display" style={{ fontSize: "1.7rem", lineHeight: 1 }}>
                      {+ev.date.slice(8, 10)}
                    </div>
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <h3 className="font-display" style={{ fontSize: "1.2rem", fontWeight: 500 }}>
                      {ev.title}
                    </h3>
                    <p style={{ fontSize: "0.82rem", color: "var(--ink-soft)", marginTop: "0.2rem" }}>
                      {ev.time}
                      {ev.endTime ? ` – ${ev.endTime}` : ""} · {ev.venue}
                    </p>
                    {ev.description && <p style={{ fontSize: "0.88rem", marginTop: "0.45rem", lineHeight: 1.55 }}>{ev.description}</p>}
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "0.6rem 1.2rem", marginTop: "0.7rem" }}>
                      <RsvpButton eventId={ev.id} initiallyGoing={viewer?.rsvps.includes(ev.id) ?? false} count={ev.registeredCount} maxSeats={ev.maxSeats} />
                      <a href={googleCalendarUrl(ev)} target="_blank" rel="noreferrer" style={{ fontSize: "0.78rem", color: "var(--ink-soft)" }}>
                        Add to calendar
                      </a>
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          )}
        </section>

        <aside>
          <p className="section-label">Notices</p>
          <div className="wobble-rule" style={{ margin: "0.3rem 0 0.4rem" }} />
          {notices.length === 0 ? (
            <p style={{ color: "var(--ink-soft)", padding: "1rem 0" }}>No notices yet.</p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
              {notices.map((n) => (
                <li key={n.id} style={{ padding: "0.9rem 0" }}>
                  <p style={{ fontWeight: 600, fontSize: "0.95rem" }}>
                    {n.priority === "urgent" && <span style={{ color: "var(--laterite)" }}>⚑ </span>}
                    {n.title}
                  </p>
                  {n.body && <p style={{ fontSize: "0.86rem", color: "var(--ink-soft)", marginTop: "0.25rem", lineHeight: 1.55 }}>{n.body}</p>}
                  <p style={{ fontSize: "0.75rem", color: "var(--ink-faint)", marginTop: "0.3rem" }}>
                    {n.author} · {timeAgo(n.postedAt)}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {club.leads.length > 0 && (
            <>
              <p className="section-label" style={{ marginTop: "2rem" }}>
                Who runs it
              </p>
              <div className="wobble-rule" style={{ margin: "0.3rem 0 0.6rem" }} />
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.6rem" }}>
                {club.leads.map((l) => (
                  <li key={l.name} style={{ fontSize: "0.92rem" }}>
                    {l.name} <span style={{ color: "var(--ink-soft)" }}>· {l.role}</span>
                  </li>
                ))}
              </ul>
            </>
          )}
        </aside>
      </div>
    </div>
  );
}
