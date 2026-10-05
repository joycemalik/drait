import { addDays, daysBetween } from "@/lib/dates";
import type { Announcement, Event } from "@/lib/types";

const dayName = (iso: string, i: number) =>
  i === 0
    ? "Today"
    : i === 1
      ? "Tomorrow"
      : new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });

/** The same river, as plain text. Also what screen readers and reduced-motion users get. */
export default function RiverList({
  today,
  days,
  events,
  announcements,
  going,
  countOf,
  open,
  openNotice,
}: {
  today: string;
  days: number;
  events: Event[];
  announcements: Announcement[];
  going: Set<string>;
  countOf: (e: Event) => number;
  open: (e: Event) => void;
  openNotice: (a: Announcement) => void;
}) {
  const withEvents = Array.from({ length: days }, (_, i) => {
    const iso = addDays(today, i);
    return { iso, i, list: events.filter((e) => daysBetween(today, e.date) === i) };
  }).filter((d) => d.list.length > 0);

  return (
    <div style={{ maxWidth: "44rem", margin: "1.5rem auto 4rem", padding: "0 1.25rem" }}>
      {withEvents.length === 0 && <p style={{ color: "var(--ink-soft)" }}>Nothing planned in the next two weeks yet.</p>}
      {withEvents.map(({ iso, i, list }) => (
        <section key={iso} style={{ marginBottom: "1.75rem" }}>
          <h3 className="font-display" style={{ fontStyle: "italic", fontSize: "1.2rem", color: i === 0 ? "var(--laterite)" : "var(--ink)" }}>
            {dayName(iso, i)}
          </h3>
          <div className="wobble-rule" style={{ margin: "0.35rem 0 0.6rem" }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.85rem" }}>
            {list.map((e) => (
              <li key={e.id} style={{ display: "flex", gap: "1rem", alignItems: "baseline" }}>
                <span style={{ minWidth: "4.5rem", fontSize: "0.85rem", color: "var(--ink-soft)", fontVariantNumeric: "tabular-nums" }}>{e.time}</span>
                <span style={{ flex: 1 }}>
                  <button
                    onClick={() => open(e)}
                    style={{ fontSize: "1rem", fontWeight: 600, textAlign: "left", color: "var(--ink)" }}
                  >
                    {e.title}
                  </button>
                  <span style={{ display: "block", fontSize: "0.82rem", color: "var(--ink-soft)", marginTop: 2 }}>
                    <span style={{ color: e.clubColor }}>●</span> {e.clubName} · {e.venue} · {countOf(e)} going
                    {going.has(e.id) ? " · you're going" : ""}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}

      {announcements.length > 0 && (
        <section>
          <h3 className="font-display" style={{ fontStyle: "italic", fontSize: "1.2rem" }}>
            Notices
          </h3>
          <div className="wobble-rule" style={{ margin: "0.35rem 0 0.6rem" }} />
          <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: "0.6rem" }}>
            {announcements.map((a) => (
              <li key={a.id}>
                <button onClick={() => openNotice(a)} style={{ textAlign: "left", color: "var(--ink)", fontSize: "0.95rem" }}>
                  {a.priority === "urgent" ? "⚑ " : ""}
                  {a.title}
                </button>
                <span style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}> · {a.clubName}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
