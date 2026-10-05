"use client";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import AuthButton from "@/components/AuthButton";
import { InkTick } from "@/components/InkMarks";
import { setAchievementVerified, submitAchievement } from "@/lib/actions";
import type { Achievement } from "@/lib/types";

const categories: { id: Achievement["category"]; label: string }[] = [
  { id: "hackathon", label: "Hackathon" },
  { id: "competition", label: "Competition" },
  { id: "certification", label: "Certification" },
  { id: "research", label: "Research" },
  { id: "sports", label: "Sports" },
  { id: "design", label: "Design" },
  { id: "other", label: "Other" },
];
const label = (id: string) => categories.find((c) => c.id === id)?.label ?? id;

type Row = Achievement & { canVerify: boolean };

const button: React.CSSProperties = {
  padding: "0.55rem 1.2rem",
  borderRadius: "999px / 900px",
  background: "var(--ink)",
  color: "var(--paper)",
  fontWeight: 600,
  fontSize: "0.9rem",
};

export default function AchievementsView({
  achievements,
  clubs,
  signedIn,
  configured,
}: {
  achievements: Row[];
  clubs: { slug: string; name: string }[];
  signedIn: boolean;
  configured: boolean;
}) {
  const [writing, setWriting] = useState(false);
  const [filter, setFilter] = useState<Achievement["category"] | "all">("all");
  const list = achievements.filter((a) => filter === "all" || a.category === filter);

  return (
    <div>
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
            Achievements
          </h1>
          <p style={{ marginTop: "0.4rem", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            Wins, papers and certifications from AIT students.
          </p>
        </div>
        {signedIn ? (
          <button onClick={() => setWriting((w) => !w)} style={button}>
            {writing ? "Cancel" : "Submit an achievement"}
          </button>
        ) : (
          <AuthButton configured={configured} next="/achievements" style={button}>
            Sign in to submit
          </AuthButton>
        )}
      </header>

      {writing && <SubmitForm clubs={clubs} onDone={() => setWriting(false)} />}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 1.1rem", margin: "2rem 0 0.75rem", fontSize: "0.9rem" }}>
        {[{ id: "all" as const, label: "All" }, ...categories].map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.id)}
            style={{
              color: filter === c.id ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: filter === c.id ? 600 : 400,
              textDecoration: filter === c.id ? "underline" : "none",
              textDecorationColor: "var(--turmeric)",
              textDecorationThickness: 3,
              textUnderlineOffset: 6,
            }}
          >
            {c.label}
          </button>
        ))}
      </div>
      <div className="wobble-rule" />

      <ol style={{ listStyle: "none", margin: 0, padding: 0 }}>
        {list.map((a) => (
          <li key={a.id} style={{ display: "flex", gap: "1.25rem", padding: "1.4rem 0" }}>
            <div style={{ width: "3.6rem", flexShrink: 0, textAlign: "center", paddingTop: "0.2rem" }}>
              <div style={{ fontSize: "0.7rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-soft)" }}>
                {new Date(`${a.achievedOn}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" })}
              </div>
              <div className="font-display" style={{ fontSize: "1.4rem", lineHeight: 1 }}>
                {a.achievedOn.slice(0, 4)}
              </div>
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: "0.75rem", color: "var(--ink-faint)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                {label(a.category)}
              </p>
              <h2 className="font-display" style={{ fontSize: "1.35rem", fontWeight: 400, lineHeight: 1.25, marginTop: "0.15rem" }}>
                {a.link ? (
                  <a href={a.link} target="_blank" rel="noreferrer" style={{ color: "inherit" }}>
                    {a.title}
                  </a>
                ) : (
                  a.title
                )}
              </h2>
              <p style={{ marginTop: "0.3rem", fontSize: "0.88rem", color: "var(--ink-soft)" }}>
                {a.people}
                {a.team ? ` (${a.team})` : ""}
                {a.clubName && (
                  <>
                    {" · "}
                    <span style={{ display: "inline-block", width: 8, height: 8, borderRadius: "50%", background: a.clubColor, marginRight: 5 }} />
                    {a.clubName}
                  </>
                )}
              </p>
              {a.description && <p style={{ marginTop: "0.45rem", fontSize: "0.92rem", lineHeight: 1.6 }}>{a.description}</p>}
              <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginTop: "0.6rem", fontSize: "0.8rem" }}>
                {a.verified ? (
                  <span style={{ display: "inline-flex", alignItems: "center", gap: "0.35rem", color: "var(--sal)" }}>
                    <InkTick size={13} /> Verified
                  </span>
                ) : (
                  <span style={{ color: "var(--ink-faint)" }}>Awaiting verification</span>
                )}
                {a.canVerify && <VerifyButton id={a.id} verified={a.verified} />}
              </div>
            </div>
          </li>
        ))}
      </ol>

      {list.length === 0 && (
        <p style={{ padding: "3rem 0", textAlign: "center", color: "var(--ink-soft)" }}>Nothing here yet. Submit the first one.</p>
      )}
    </div>
  );
}

function VerifyButton({ id, verified }: { id: string; verified: boolean }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <>
      <button
        disabled={pending}
        onClick={() =>
          start(async () => {
            const res = await setAchievementVerified(id, !verified);
            setError(res.ok ? "" : res.error);
          })
        }
        style={{ color: "var(--ink)", textDecoration: "underline", textUnderlineOffset: 3 }}
      >
        {pending ? "Saving…" : verified ? "Remove verification" : "Verify"}
      </button>
      {error && <span style={{ color: "var(--laterite)" }}>{error}</span>}
    </>
  );
}

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
const lbl: React.CSSProperties = { display: "grid", gap: "0.3rem", fontSize: "0.8rem", color: "var(--ink-soft)" };

function SubmitForm({ clubs, onDone }: { clubs: { slug: string; name: string }[]; onDone: () => void }) {
  const [state, action, pending] = useActionState(submitAchievement, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) {
      ref.current?.reset();
      onDone();
    }
  }, [state, onDone]);

  return (
    <form ref={ref} action={action} className="leaf" style={{ marginTop: "1.5rem", padding: "1.4rem 1.6rem", display: "grid", gap: "0.8rem" }}>
      <label style={lbl}>
        What was achieved
        <input name="title" required minLength={3} maxLength={200} placeholder="e.g. 2nd place, Smart India Hackathon 2026" style={field} />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(12rem, 1fr))", gap: "0.8rem" }}>
        <label style={lbl}>
          Who
          <input name="people" required minLength={2} maxLength={200} placeholder="Names" style={field} />
        </label>
        <label style={lbl}>
          Team name (optional)
          <input name="team" maxLength={120} style={field} />
        </label>
        <label style={lbl}>
          Club (optional)
          <select name="club" defaultValue="" style={field}>
            <option value="">None</option>
            {clubs.map((c) => (
              <option key={c.slug} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Category
          <select name="category" defaultValue="hackathon" style={field}>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Date
          <input name="achieved_on" type="date" required style={field} />
        </label>
        <label style={lbl}>
          Link (optional)
          <input name="link" type="url" placeholder="https://" style={field} />
        </label>
      </div>
      <label style={lbl}>
        Details (optional)
        <textarea name="description" rows={3} maxLength={2000} style={{ ...field, resize: "vertical" }} />
      </label>
      <p style={{ fontSize: "0.8rem", color: "var(--ink-faint)" }}>
        It shows as &ldquo;Awaiting verification&rdquo; until a lead of the club (or a site admin) verifies it.
      </p>
      <button disabled={pending} style={{ ...button, justifySelf: "start" }}>
        {pending ? "Submitting…" : "Submit"}
      </button>
      {state && !state.ok && (
        <p role="status" style={{ color: "var(--laterite)", fontSize: "0.85rem" }}>
          {state.error}
        </p>
      )}
    </form>
  );
}
