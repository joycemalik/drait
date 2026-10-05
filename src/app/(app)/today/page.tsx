import Link from "next/link";
import { Clock, AlertCircle, ArrowUpRight } from "lucide-react";
import { getAnnouncements, getClubs, getDiscussions, getEvents, getOpportunities, getViewer } from "@/lib/data";
import { daysBetween, timeAgo, todayISO } from "@/lib/dates";

export const metadata = { title: "Today" };

function fmtDate(iso: string) {
  const d = new Date(`${iso}T00:00:00Z`);
  return {
    day: d.toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" }),
    date: d.getUTCDate(),
    month: d.toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }),
  };
}

function greeting() {
  const h = +new Intl.DateTimeFormat("en-US", { hour: "numeric", hourCycle: "h23", timeZone: "Asia/Kolkata" }).format(new Date());
  return h < 12 ? "Good morning" : h < 17 ? "Good afternoon" : "Good evening";
}

export default async function Dashboard() {
  const todayStr = todayISO();
  const [events, announcements, discussions, clubs, opportunities, viewer] = await Promise.all([
    getEvents({ from: todayStr, days: 30 }),
    getAnnouncements({ limit: 12 }),
    getDiscussions(),
    getClubs(),
    getOpportunities(),
    getViewer(),
  ]);

  const todayEvents = events.filter((e) => e.date === todayStr);
  const upcoming = events.filter((e) => e.date > todayStr).slice(0, 5);

  const urgentAnn = announcements.filter((a) => a.priority === "urgent").slice(0, 2);
  const recentAnn = announcements.slice(0, 4);
  const trending = [...discussions].sort((a, b) => b.upvotes - a.upvotes).slice(0, 4);
  const mine = viewer ? clubs.filter((c) => viewer.clubs.some((m) => m.slug === c.slug)) : [];
  const myClubs = mine.length ? mine : clubs.filter((c) => c.featured).slice(0, 3);
  const topOpps = opportunities.filter((o) => o.featured && o.deadline >= todayStr).slice(0, 3);
  const longToday = new Date(`${todayStr}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  });

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2.5rem" }}>

      {/* ── Greeting ─────────────────────────────── */}
      <div>
        <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.25rem" }}>
          {longToday}
        </p>
        <h1 className="font-display" style={{ fontSize: "2.4rem", fontWeight: 400, color: "var(--text)", lineHeight: 1.1 }}>
          {greeting()}{viewer ? `, ${viewer.name.split(" ")[0]}` : ""}.
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "0.375rem" }}>
          Here&apos;s what needs you at AIT today.
        </p>
      </div>

      {/* ── Urgent alerts ────────────────────────── */}
      {urgentAnn.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          {urgentAnn.map((ann) => (
            <div
              key={ann.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "0.875rem 1rem",
                background: "rgba(248, 113, 113, 0.07)",
                border: "1px solid rgba(248, 113, 113, 0.25)",
                borderRadius: "16px 20px 14px 18px",
              }}
            >
              <AlertCircle size={15} style={{ color: "var(--red)", flexShrink: 0, marginTop: "0.125rem" }} />
              <div>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)" }}>{ann.title}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginTop: "0.125rem" }}>
                  {ann.clubName} · {timeAgo(ann.postedAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Today + Up Next ──────────────────────── */}
      <div className="dash-grid-2">

        {/* TODAY */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className="section-label">Today</span>
            <Link href="/events" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              All events <ArrowUpRight size={11} />
            </Link>
          </div>

          {todayEvents.length === 0 ? (
            <p style={{ fontSize: "0.875rem", color: "var(--faint)", paddingTop: "0.25rem" }}>
              No events scheduled today.
            </p>
          ) : (
            <div>
              {todayEvents.map((ev, i) => (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    gap: "0.875rem",
                    padding: "0.75rem 0",
                    borderTop: i === 0 ? "1px solid var(--border)" : "none",
                    borderBottom: "1px solid var(--border)",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "0.4rem", flexShrink: 0, paddingTop: "0.1rem" }}>
                    <Clock size={12} style={{ color: "var(--faint)" }} />
                    <span style={{ fontSize: "0.8rem", color: "var(--muted)", fontVariantNumeric: "tabular-nums", minWidth: "2.5rem" }}>
                      {ev.time}
                    </span>
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", marginBottom: "0.125rem" }}>
                      {ev.title}
                    </p>
                    <p style={{ fontSize: "0.775rem", color: "var(--muted)" }}>
                      {ev.clubName} · {ev.venue.split(",")[0]}
                    </p>
                  </div>
                  <div
                    style={{
                      flexShrink: 0,
                      width: "3px",
                      borderRadius: "99px",
                      background: ev.clubColor,
                      opacity: 0.7,
                      alignSelf: "stretch",
                    }}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* UP NEXT */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className="section-label">Upcoming</span>
          </div>

          <div>
            {upcoming.map((ev, i) => {
              const { day, date, month } = fmtDate(ev.date);
              return (
                <div
                  key={ev.id}
                  style={{
                    display: "flex",
                    gap: "0.75rem",
                    padding: "0.625rem 0",
                    borderTop: i === 0 ? "1px solid var(--border)" : "none",
                    borderBottom: "1px solid var(--border)",
                    alignItems: "flex-start",
                  }}
                >
                  {/* Date block */}
                  <div
                    style={{
                      flexShrink: 0,
                      width: "2.75rem",
                      textAlign: "center",
                      paddingTop: "0.1rem",
                    }}
                  >
                    <div style={{ fontSize: "0.65rem", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", color: "var(--muted)" }}>
                      {day}
                    </div>
                    <div style={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1, color: "var(--text)", letterSpacing: "-0.03em" }}>
                      {date}
                    </div>
                    <div style={{ fontSize: "0.65rem", color: "var(--faint)", marginTop: "0.1rem" }}>
                      {month}
                    </div>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", marginBottom: "0.125rem", lineHeight: 1.3 }}>
                      {ev.title}
                    </p>
                    <p style={{ fontSize: "0.775rem", color: "var(--muted)" }}>
                      {ev.time} · {ev.clubName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </div>

      {/* ── Your clubs ───────────────────────────── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span className="section-label">{mine.length ? "Your clubs" : "Clubs to explore"}</span>
          <Link href="/clubs" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            Browse all <ArrowUpRight size={11} />
          </Link>
        </div>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          {myClubs.map((club) => (
            <Link
              key={club.id}
              href={`/clubs/${club.slug}`}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.6rem 0.875rem",
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: "16px 20px 14px 18px",
                textDecoration: "none",
                flex: "1 1 10rem",
                minWidth: 0,
              }}
            >
              <span
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2rem",
                  height: "2rem",
                  borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                  background: `${club.color}18`,
                  border: `1px solid ${club.color}35`,
                  fontSize: "0.65rem",
                  fontWeight: 700,
                  color: club.color,
                  flexShrink: 0,
                }}
              >
                {club.shortName}
              </span>
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", marginBottom: "0.1rem", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                  {club.name}
                </p>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)" }}>
                  {club.memberCount} members
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Announcements + Community ─────────────── */}
      <div className="dash-grid-2" style={{ gap: "2rem" }}>

        {/* Announcements */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className="section-label">Announcements</span>
            <Link href="/announcements" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              All <ArrowUpRight size={11} />
            </Link>
          </div>
          <div>
            {recentAnn.map((ann, i) => (
              <div
                key={ann.id}
                style={{
                  padding: "0.75rem 0",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ display: "flex", alignItems: "flex-start", gap: "0.5rem" }}>
                  <span
                    style={{
                      display: "inline-block",
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      flexShrink: 0,
                      marginTop: "0.375rem",
                      background:
                        ann.priority === "urgent" ? "var(--red)"
                        : ann.priority === "important" ? "var(--amber)"
                        : "var(--faint)",
                    }}
                  />
                  <div>
                    <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.4 }}>
                      {ann.title}
                    </p>
                    <p style={{ fontSize: "0.775rem", color: "var(--muted)", marginTop: "0.2rem" }}>
                      {ann.clubName} · {timeAgo(ann.postedAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community */}
        <section>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <span className="section-label">Community</span>
            <Link href="/community" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
              Join <ArrowUpRight size={11} />
            </Link>
          </div>
          <div>
            {trending.map((d, i) => (
              <Link
                key={d.id}
                href={`/community/${d.id}`}
                style={{
                  display: "block",
                  padding: "0.75rem 0",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                  textDecoration: "none",
                }}
              >
                <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", lineHeight: 1.4, marginBottom: "0.25rem" }}>
                  {d.title}
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: "0.875rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>↑ {d.upvotes}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)" }}>↩ {d.replyCount}</span>
                  <span style={{ fontSize: "0.75rem", color: "var(--faint)" }}>{d.authorYear}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>

      {/* ── Opportunities ────────────────────────── */}
      <section>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
          <span className="section-label">Opportunities</span>
          <Link href="/opportunities" style={{ fontSize: "0.75rem", color: "var(--accent)", textDecoration: "none", display: "flex", alignItems: "center", gap: "0.25rem" }}>
            All <ArrowUpRight size={11} />
          </Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
          {topOpps.map((opp, i) => {
            const diff = daysBetween(todayStr, opp.deadline);
            const urgent = diff <= 14;
            return (
              <div
                key={opp.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                  padding: "0.75rem 0",
                  borderTop: i === 0 ? "1px solid var(--border)" : "none",
                  borderBottom: "1px solid var(--border)",
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: "0.875rem", fontWeight: 500, color: "var(--text)", marginBottom: "0.125rem" }}>
                    {opp.title}
                  </p>
                  <p style={{ fontSize: "0.775rem", color: "var(--muted)" }}>
                    {opp.organizer} · {opp.type}
                  </p>
                </div>
                <div style={{ flexShrink: 0, textAlign: "right" }}>
                  <span
                    style={{
                      fontSize: "0.8rem",
                      fontWeight: 600,
                      color: urgent ? "var(--red)" : "var(--muted)",
                      display: "block",
                    }}
                  >
                    {diff}d left
                  </span>
                  <span style={{ fontSize: "0.7rem", color: "var(--faint)" }}>
                    {opp.prize ?? opp.stipend ?? ""}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

    </div>
  );
}
