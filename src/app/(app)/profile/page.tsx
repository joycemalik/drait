import Link from "next/link";
import { redirect } from "next/navigation";
import { getClubs, getEvents, getProfile, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { departmentName } from "@/lib/college";
import { todayISO } from "@/lib/dates";
import AvatarUpload from "@/components/AvatarUpload";
import { InkTick } from "@/components/InkMarks";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "Your profile" };

const label: React.CSSProperties = { fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--ink-faint)" };

export default async function ProfilePage() {
  if (!isSupabaseConfigured) redirect("/today");
  const [profile, viewer] = await Promise.all([getProfile(), getViewer()]);
  if (!profile || !viewer) redirect("/");

  const [clubs, events] = await Promise.all([getClubs(), getEvents({ from: todayISO(), days: 60 })]);
  const myClubs = clubs.filter((c) => viewer.clubs.some((m) => m.slug === c.slug));
  const going = events.filter((e) => viewer.rsvps.includes(e.id));

  const record: [string, string][] = [
    ["College email", profile.email ?? ""],
    ["USN", profile.usn || "Not detected"],
    ["Department", departmentName(profile.department) || "Not set"],
    ["Joined", profile.admissionYear ? String(profile.admissionYear) : "Not detected"],
  ];

  return (
    <div style={{ maxWidth: "46rem" }}>
      <header style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem" }}>
        <div>
          <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
            Your profile
          </h1>
          <p style={{ marginTop: "0.4rem", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
            What other students see next to your posts, RSVPs and achievements.
          </p>
        </div>
        <Link href={`/people/${profile.id}`} style={{ fontSize: "0.9rem", color: "var(--ink)" }}>
          View public profile →
        </Link>
      </header>

      <section style={{ marginTop: "2rem" }}>
        <AvatarUpload userId={profile.id} url={profile.avatarUrl} name={profile.fullName} />
      </section>

      <section className="leaf" style={{ marginTop: "2rem", padding: "1.2rem 1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.8rem" }}>
          <span className="section-label">From your college account</span>
          {profile.verified && (
            <span style={{ display: "inline-flex", alignItems: "center", gap: "0.3rem", fontSize: "0.78rem", color: "var(--sal)" }}>
              <InkTick size={12} /> Verified Dr. AIT student
            </span>
          )}
        </div>
        <dl style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(11rem, 1fr))", gap: "0.9rem 1.5rem", margin: 0 }}>
          {record.map(([k, v]) => (
            <div key={k}>
              <dt style={label}>{k}</dt>
              <dd style={{ margin: "0.15rem 0 0", fontSize: "0.92rem", wordBreak: "break-all" }}>{v}</dd>
            </div>
          ))}
        </dl>
        <p style={{ marginTop: "0.9rem", fontSize: "0.78rem", color: "var(--ink-faint)" }}>
          These come from your college email and can&apos;t be edited. Your USN is only visible to signed-in students.
        </p>
      </section>

      <section style={{ marginTop: "2rem" }}>
        <p className="section-label" style={{ marginBottom: "0.6rem" }}>
          Details
        </p>
        <ProfileForm profile={profile} />
      </section>

      <div className="dash-grid-2" style={{ marginTop: "2.5rem", gap: "2rem" }}>
        <section>
          <p className="section-label">Your clubs</p>
          <div className="wobble-rule" style={{ margin: "0.3rem 0 0.5rem" }} />
          {myClubs.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>
              You haven&apos;t joined a club yet. <Link href="/clubs">Browse clubs</Link>
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" }}>
              {myClubs.map((c) => (
                <li key={c.slug} style={{ fontSize: "0.92rem" }}>
                  <span style={{ display: "inline-block", width: 9, height: 9, borderRadius: "50%", background: c.color, marginRight: 8 }} />
                  <Link href={`/clubs/${c.slug}`} style={{ color: "var(--ink)" }}>
                    {c.name}
                  </Link>
                  <span style={{ color: "var(--ink-faint)" }}> · {viewer.clubs.find((m) => m.slug === c.slug)?.role}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <p className="section-label">Events you&apos;re going to</p>
          <div className="wobble-rule" style={{ margin: "0.3rem 0 0.5rem" }} />
          {going.length === 0 ? (
            <p style={{ fontSize: "0.9rem", color: "var(--ink-soft)" }}>
              No upcoming RSVPs. <Link href="/events">See events</Link>
            </p>
          ) : (
            <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "0.45rem" }}>
              {going.map((e) => (
                <li key={e.id} style={{ fontSize: "0.92rem" }}>
                  {e.title}
                  <span style={{ color: "var(--ink-faint)" }}>
                    {" "}
                    · {new Date(`${e.date}T00:00:00Z`).toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "UTC" })},{" "}
                    {e.time}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
