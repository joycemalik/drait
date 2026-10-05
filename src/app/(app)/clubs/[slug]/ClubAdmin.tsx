"use client";
import { useActionState, useEffect, useRef, useState } from "react";
import { createEvent, postAnnouncement, type ActionResult } from "@/lib/actions";

const field: React.CSSProperties = {
  background: "var(--paper-deep)",
  border: 0,
  borderRadius: 10,
  padding: "0.5rem 0.75rem",
  color: "var(--ink)",
  fontSize: "0.9rem",
  outline: "none",
  width: "100%",
};
const label: React.CSSProperties = { display: "grid", gap: "0.3rem", fontSize: "0.8rem", color: "var(--ink-soft)" };
const submit: React.CSSProperties = {
  justifySelf: "start",
  padding: "0.5rem 1.2rem",
  borderRadius: "999px / 900px",
  background: "var(--ink)",
  color: "var(--paper)",
  fontWeight: 600,
};


function Status({ state, done }: { state: ActionResult | null; done: string }) {
  if (!state) return null;
  return (
    <p role="status" style={{ fontSize: "0.85rem", color: state.ok ? "var(--sal)" : "var(--laterite)" }}>
      {state.ok ? done : state.error}
    </p>
  );
}

/** Shown only to this club's leads. The database enforces the same rule. */
export default function ClubAdmin({ slug }: { slug: string }) {
  const [tab, setTab] = useState<"notice" | "event">("notice");

  return (
    <section className="leaf" style={{ marginTop: "2rem", padding: "1.4rem 1.6rem" }}>
      <p className="section-label">For club leads</p>
      <div style={{ display: "flex", gap: "1.2rem", margin: "0.4rem 0 1rem", fontSize: "0.92rem" }}>
        {(["notice", "event"] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              fontWeight: tab === t ? 600 : 400,
              color: tab === t ? "var(--ink)" : "var(--ink-soft)",
              textDecoration: tab === t ? "underline" : "none",
              textDecorationColor: "var(--turmeric)",
              textDecorationThickness: 3,
              textUnderlineOffset: 6,
            }}
          >
            {t === "notice" ? "Post a notice" : "Add an event"}
          </button>
        ))}
      </div>

      {tab === "notice" ? <NoticeForm slug={slug} /> : <EventForm slug={slug} />}
    </section>
  );
}

function NoticeForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(postAnnouncement.bind(null, slug), null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} style={{ display: "grid", gap: "0.8rem" }}>
      <label style={label}>
        Title
        <input name="title" required minLength={3} maxLength={200} style={field} />
      </label>
      <label style={label}>
        Message
        <textarea name="body" rows={3} maxLength={4000} style={{ ...field, resize: "vertical" }} />
      </label>
      <label style={{ ...label, maxWidth: "14rem" }}>
        How important
        <select name="priority" defaultValue="info" style={field}>
          <option value="info">General</option>
          <option value="important">Important</option>
          <option value="urgent">Urgent</option>
        </select>
      </label>
      <button disabled={pending} style={submit}>
        {pending ? "Posting…" : "Post notice"}
      </button>
      <Status state={state} done="Announcement published." />
    </form>
  );
}

function EventForm({ slug }: { slug: string }) {
  const [state, action, pending] = useActionState(createEvent.bind(null, slug), null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) ref.current?.reset();
  }, [state]);
  return (
    <form ref={ref} action={action} style={{ display: "grid", gap: "0.8rem" }}>
      <label style={label}>
        What&apos;s happening
        <input name="title" required minLength={3} maxLength={200} style={field} />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(9rem, 1fr))", gap: "0.8rem" }}>
        <label style={label}>
          Date
          <input name="date" type="date" required style={field} />
        </label>
        <label style={label}>
          Starts (IST)
          <input name="start" type="time" required style={field} />
        </label>
        <label style={label}>
          Ends
          <input name="end" type="time" style={field} />
        </label>
        <label style={label}>
          Seats
          <input name="max_seats" type="number" min={1} placeholder="No limit" style={field} />
        </label>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "0.8rem" }}>
        <label style={label}>
          Where
          <input name="venue" maxLength={200} style={field} />
        </label>
        <label style={label}>
          Kind
          <select name="type" defaultValue="workshop" style={field}>
            {["workshop", "meeting", "seminar", "hackathon", "competition", "practice", "social"].map((t) => (
              <option key={t} value={t}>
                {t[0].toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label style={label}>
        Details
        <textarea name="description" rows={3} maxLength={4000} style={{ ...field, resize: "vertical" }} />
      </label>
      <button disabled={pending} style={submit}>
        {pending ? "Creating…" : "Create event"}
      </button>
      <Status state={state} done="Event created." />
    </form>
  );
}
