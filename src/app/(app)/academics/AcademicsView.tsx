"use client";
import { useActionState, useEffect, useRef, useState, useTransition } from "react";
import AuthButton from "@/components/AuthButton";
import { removeResource, shareResource } from "@/lib/actions";
import type { AcademicResource, Department, ResourceKind } from "@/lib/types";

const departments: { id: Department; label: string }[] = [
  { id: "cse", label: "CSE" },
  { id: "ise", label: "ISE" },
  { id: "aiml", label: "AIML" },
  { id: "ece", label: "ECE" },
  { id: "eee", label: "EEE" },
  { id: "mech", label: "Mechanical" },
  { id: "civil", label: "Civil" },
  { id: "other", label: "Other" },
];
const kinds: { id: ResourceKind; label: string }[] = [
  { id: "notes", label: "Notes" },
  { id: "pyq", label: "Past papers" },
  { id: "lab", label: "Lab manual" },
  { id: "reference", label: "Reference" },
  { id: "other", label: "Other" },
];
const kindLabel = (k: string) => kinds.find((x) => x.id === k)?.label ?? k;

const button: React.CSSProperties = {
  padding: "0.55rem 1.2rem",
  borderRadius: "999px / 900px",
  background: "var(--ink)",
  color: "var(--paper)",
  fontWeight: 600,
  fontSize: "0.9rem",
};
const tab = (active: boolean): React.CSSProperties => ({
  color: active ? "var(--ink)" : "var(--ink-soft)",
  fontWeight: active ? 600 : 400,
  textDecoration: active ? "underline" : "none",
  textDecorationColor: "var(--turmeric)",
  textDecorationThickness: 3,
  textUnderlineOffset: 6,
});

export default function AcademicsView({
  resources,
  viewerId,
  isAdmin,
  signedIn,
  configured,
  initialDepartment,
  initialSemester,
}: {
  resources: AcademicResource[];
  viewerId?: string;
  isAdmin: boolean;
  signedIn: boolean;
  configured: boolean;
  initialDepartment: string;
  initialSemester: number;
}) {
  const [dept, setDept] = useState<Department>(
    departments.some((d) => d.id === initialDepartment) ? (initialDepartment as Department) : "cse",
  );
  const [sem, setSem] = useState(initialSemester);
  const [sharing, setSharing] = useState(false);

  const shown = resources.filter((r) => r.department === dept && (sem === 0 || r.semester === sem));
  const bySubject = shown.reduce<Record<string, AcademicResource[]>>((acc, r) => {
    const key = `Sem ${r.semester} · ${r.subject}`;
    (acc[key] ??= []).push(r);
    return acc;
  }, {});
  const deptLabel = departments.find((d) => d.id === dept)?.label;

  return (
    <div>
      <header style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
            Study resources
          </h1>
          <p style={{ marginTop: "0.4rem", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            Notes, past papers and lab manuals shared by students, by department and semester.
          </p>
        </div>
        {signedIn ? (
          <button onClick={() => setSharing((s) => !s)} style={button}>
            {sharing ? "Cancel" : "Share a link"}
          </button>
        ) : (
          <AuthButton configured={configured} next="/academics" style={button}>
            Sign in to share
          </AuthButton>
        )}
      </header>

      {sharing && <ShareForm dept={dept} sem={sem} onDone={() => setSharing(false)} />}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 1.1rem", margin: "2rem 0 0.6rem", fontSize: "0.92rem" }}>
        {departments.map((d) => (
          <button key={d.id} onClick={() => setDept(d.id)} style={tab(dept === d.id)}>
            {d.label}
          </button>
        ))}
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem 0.9rem", marginBottom: "0.75rem", fontSize: "0.85rem" }}>
        <button onClick={() => setSem(0)} style={tab(sem === 0)}>
          All semesters
        </button>
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <button key={n} onClick={() => setSem(n)} style={tab(sem === n)}>
            Sem {n}
          </button>
        ))}
      </div>
      <div className="wobble-rule" />

      {Object.keys(bySubject).length === 0 ? (
        <p style={{ padding: "3rem 0", textAlign: "center", color: "var(--ink-soft)" }}>
          {configured
            ? `Nothing shared for ${deptLabel}${sem ? `, semester ${sem}` : ""} yet. If you have notes or past papers, share the first link.`
            : "Shared resources appear here once the database is connected."}
        </p>
      ) : (
        Object.entries(bySubject).map(([subject, items]) => (
          <section key={subject} style={{ padding: "1.3rem 0 0.4rem" }}>
            <h2 className="font-display" style={{ fontSize: "1.25rem", fontWeight: 500 }}>
              {subject}
            </h2>
            <ul style={{ listStyle: "none", margin: "0.5rem 0 0", padding: 0, display: "grid", gap: "0.55rem" }}>
              {items.map((r) => (
                <li key={r.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "baseline", gap: "0.3rem 0.8rem" }}>
                  <span style={{ fontSize: "0.72rem", textTransform: "uppercase", letterSpacing: "0.05em", color: "var(--ink-faint)", minWidth: "6.5rem" }}>
                    {kindLabel(r.kind)}
                  </span>
                  <a href={r.url} target="_blank" rel="noreferrer nofollow" style={{ color: "var(--ink)", fontWeight: 500 }}>
                    {r.title} ↗
                  </a>
                  <span style={{ fontSize: "0.78rem", color: "var(--ink-faint)" }}>{r.sharedBy ? `shared by ${r.sharedBy}` : ""}</span>
                  {(isAdmin || (viewerId && r.sharedById === viewerId)) && <RemoveButton id={r.id} />}
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

function RemoveButton({ id }: { id: string }) {
  const [pending, start] = useTransition();
  const [error, setError] = useState("");
  return (
    <button
      disabled={pending}
      onClick={() =>
        start(async () => {
          const res = await removeResource(id);
          setError(res.ok ? "" : res.error);
        })
      }
      style={{ fontSize: "0.78rem", color: error ? "var(--laterite)" : "var(--ink-soft)", textDecoration: "underline" }}
    >
      {error || (pending ? "Removing…" : "Remove")}
    </button>
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

function ShareForm({ dept, sem, onDone }: { dept: Department; sem: number; onDone: () => void }) {
  const [state, action, pending] = useActionState(shareResource, null);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => {
    if (state?.ok) {
      ref.current?.reset();
      onDone();
    }
  }, [state, onDone]);

  return (
    <form ref={ref} action={action} className="leaf" style={{ marginTop: "1.5rem", padding: "1.4rem 1.6rem", display: "grid", gap: "0.8rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(10rem, 1fr))", gap: "0.8rem" }}>
        <label style={lbl}>
          Department
          <select name="department" defaultValue={dept} style={field}>
            {departments.map((d) => (
              <option key={d.id} value={d.id}>
                {d.label}
              </option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Semester
          <select name="semester" defaultValue={sem || 1} style={field}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Subject
          <input name="subject" required minLength={2} maxLength={120} placeholder="e.g. DBMS" style={field} />
        </label>
        <label style={lbl}>
          Type
          <select name="kind" defaultValue="notes" style={field}>
            {kinds.map((k) => (
              <option key={k.id} value={k.id}>
                {k.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <label style={lbl}>
        Title
        <input name="title" required minLength={3} maxLength={200} placeholder="e.g. Module 3 handwritten notes" style={field} />
      </label>
      <label style={lbl}>
        Link
        <input name="url" type="url" required placeholder="https://drive.google.com/…" style={field} />
      </label>
      <p style={{ fontSize: "0.8rem", color: "var(--ink-faint)" }}>Make sure the link is set so anyone with it can view.</p>
      <button disabled={pending} style={{ ...button, justifySelf: "start" }}>
        {pending ? "Sharing…" : "Share"}
      </button>
      {state && !state.ok && (
        <p role="status" style={{ color: "var(--laterite)", fontSize: "0.85rem" }}>
          {state.error}
        </p>
      )}
    </form>
  );
}
