"use client";
import { useActionState } from "react";
import { updateProfile } from "@/lib/actions";
import type { Profile } from "@/lib/data";

const BRANCHES = ["CSE", "ISE", "AIML", "ECE", "EEE", "Mech", "Civil", "Other"];
const YEARS = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem", "Alumni", "Faculty"];

const field: React.CSSProperties = {
  background: "var(--paper-deep)",
  border: 0,
  borderRadius: 10,
  padding: "0.55rem 0.8rem",
  color: "var(--ink)",
  fontSize: "0.95rem",
  outline: "none",
  width: "100%",
};
const lbl: React.CSSProperties = { display: "grid", gap: "0.3rem", fontSize: "0.82rem", color: "var(--ink-soft)" };

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form action={action} className="leaf" style={{ padding: "1.5rem 1.6rem", display: "grid", gap: "0.9rem" }}>
      <label style={lbl}>
        Name
        <input name="full_name" defaultValue={profile.fullName} required minLength={2} maxLength={80} style={field} />
      </label>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.9rem" }}>
        <label style={lbl}>
          Branch
          <select name="branch" defaultValue={profile.branch} style={field}>
            <option value="">Not set</option>
            {BRANCHES.map((b) => (
              <option key={b}>{b}</option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Semester
          <select name="year" defaultValue={profile.year} style={field}>
            <option value="">Not set</option>
            {YEARS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
        <button
          disabled={pending}
          style={{ padding: "0.55rem 1.3rem", borderRadius: "999px / 900px", background: "var(--ink)", color: "var(--paper)", fontWeight: 600 }}
        >
          {pending ? "Saving…" : "Save"}
        </button>
        {state && (
          <span role="status" style={{ fontSize: "0.85rem", color: state.ok ? "var(--sal)" : "var(--laterite)" }}>
            {state.ok ? "Saved." : state.error}
          </span>
        )}
      </div>
    </form>
  );
}
