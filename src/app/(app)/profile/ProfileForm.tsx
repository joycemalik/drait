"use client";
import { useActionState } from "react";
import { updateProfile } from "@/lib/actions";
import { DEPARTMENTS, SEMESTERS } from "@/lib/college";
import type { Profile } from "@/lib/data";

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
const hint: React.CSSProperties = { fontSize: "0.74rem", color: "var(--ink-faint)" };
const grid: React.CSSProperties = { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "0.9rem" };

export default function ProfileForm({ profile }: { profile: Profile }) {
  const [state, action, pending] = useActionState(updateProfile, null);
  return (
    <form action={action} className="leaf" style={{ padding: "1.5rem 1.6rem", display: "grid", gap: "1rem" }}>
      <label style={lbl}>
        Name
        <input name="full_name" defaultValue={profile.fullName} required minLength={2} maxLength={80} style={field} />
      </label>

      <div style={grid}>
        <label style={lbl}>
          Department
          <select name="department" defaultValue={profile.department} style={field}>
            <option value="">Not set</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.name}
              </option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Semester
          <select name="year" defaultValue={profile.year} style={field}>
            <option value="">Not set</option>
            {SEMESTERS.map((y) => (
              <option key={y}>{y}</option>
            ))}
          </select>
        </label>
        <label style={lbl}>
          Section
          <input name="section" defaultValue={profile.section} maxLength={1} placeholder="A" style={{ ...field, textTransform: "uppercase" }} />
        </label>
      </div>

      <label style={lbl}>
        Bio
        <textarea name="bio" defaultValue={profile.bio} maxLength={280} rows={3} placeholder="What you're into, what you're building" style={{ ...field, resize: "vertical" }} />
        <span style={hint}>Up to 280 characters.</span>
      </label>

      <label style={lbl}>
        Skills and interests
        <input name="skills" defaultValue={profile.skills.join(", ")} placeholder="React, robotics, public speaking" style={field} />
        <span style={hint}>Separate with commas, up to 12.</span>
      </label>

      <div style={grid}>
        <label style={lbl}>
          GitHub username
          <input name="github" defaultValue={profile.github} placeholder="username" style={field} />
        </label>
        <label style={lbl}>
          LinkedIn
          <input name="linkedin" defaultValue={profile.linkedin} placeholder="the part after linkedin.com/in/" style={field} />
        </label>
        <label style={lbl}>
          Instagram
          <input name="instagram" defaultValue={profile.instagram} placeholder="handle" style={field} />
        </label>
        <label style={lbl}>
          Website
          <input name="website" defaultValue={profile.website} placeholder="https://" style={field} />
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
