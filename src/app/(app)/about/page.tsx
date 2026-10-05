import Link from "next/link";
import { COLLEGE, DEPARTMENTS, DEVELOPER } from "@/lib/college";

export const metadata = {
  title: "About",
  description: "What AIT Hub is, how it works, who can sign in, and how to contribute.",
};

const h2: React.CSSProperties = { fontSize: "1.7rem", fontWeight: 400, lineHeight: 1.15, scrollMarginTop: "5rem" };
const p: React.CSSProperties = { fontSize: "0.98rem", lineHeight: 1.75, marginTop: "0.7rem" };
const li: React.CSSProperties = { fontSize: "0.95rem", lineHeight: 1.65 };
const code: React.CSSProperties = {
  display: "block",
  marginTop: "0.6rem",
  padding: "0.8rem 1rem",
  background: "var(--paper-deep)",
  borderRadius: "12px 16px 10px 14px",
  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
  fontSize: "0.85rem",
  overflowX: "auto",
  whiteSpace: "pre",
};

const sections = [
  ["features", "What you can do"],
  ["sign-in", "Who can sign in"],
  ["roles", "Roles and permissions"],
  ["how", "How it works"],
  ["data", "Your data"],
  ["contribute", "Contribute"],
  ["college", "About Dr. AIT"],
  ["contact", "Contact"],
] as const;

const roles: [string, string][] = [
  ["Anyone", "Browse clubs, events, announcements, discussions, study resources and achievements."],
  ["Signed-in student", "RSVP, join clubs, post and reply in Community, share study resources, submit achievements, edit their profile."],
  ["Club lead", "Everything above, plus post announcements and create events for their club, and verify achievements linked to it."],
  ["Site admin", "Manage all clubs, opportunities and moderation."],
];

export default function AboutPage() {
  return (
    <article style={{ maxWidth: "44rem" }}>
      <h1 className="font-display" style={{ fontSize: "2.8rem", fontWeight: 400, lineHeight: 1.05 }}>
        About AIT Hub
      </h1>
      <p style={{ ...p, fontSize: "1.08rem", color: "var(--ink-soft)" }}>
        AIT Hub brings the student side of {COLLEGE.name} into one place: club events, announcements, discussions, study
        resources and achievements. It is built and maintained by students, and its code is open source.
      </p>
      <p style={{ ...p, fontSize: "0.85rem", color: "var(--ink-faint)" }}>
        AIT Hub is a student project. It is not an official website of {COLLEGE.short}; for official information, visit{" "}
        <a href={COLLEGE.website} target="_blank" rel="noreferrer">
          drait.edu.in
        </a>
        .
      </p>

      <nav aria-label="On this page" style={{ margin: "2rem 0 0", display: "flex", flexWrap: "wrap", gap: "0.4rem 1.1rem", fontSize: "0.88rem" }}>
        {sections.map(([id, label]) => (
          <a key={id} href={`#${id}`} style={{ color: "var(--ink-soft)" }}>
            {label}
          </a>
        ))}
      </nav>
      <div className="wobble-rule" style={{ margin: "1rem 0 2.2rem" }} />

      <section id="features" style={{ scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          What you can do
        </h2>
        <ul style={{ marginTop: "0.8rem", paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.4rem" }}>
          <li style={li}>See every club event for the next two weeks on the home page, and RSVP or add them to your calendar.</li>
          <li style={li}>Join clubs and get their announcements on your Today page.</li>
          <li style={li}>Ask questions and help others in Community. Replies appear live.</li>
          <li style={li}>Share and find notes, past papers and lab manuals by department and semester.</li>
          <li style={li}>Submit achievements; club leads verify them.</li>
          <li style={li}>Keep a profile with your department, skills and links.</li>
        </ul>
      </section>

      <section id="sign-in" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          Who can sign in
        </h2>
        <p style={p}>
          Anyone can browse. To RSVP, post or share, sign in with your <strong>Dr. AIT college Google account</strong>, any
          address ending in <code>drait.edu.in</code>, including department addresses such as{" "}
          <code>1da23cs069@cs.drait.edu.in</code>. Personal Gmail accounts are not accepted.
        </p>
        <p style={p}>
          Your USN, department and joining year are read from your college email when you first sign in, and your
          profile is marked as a verified Dr. AIT student. If you are faculty or staff without a college Google account,
          contact us below.
        </p>
      </section>

      <section id="roles" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          Roles and permissions
        </h2>
        <dl style={{ marginTop: "0.9rem", display: "grid", gap: "0.9rem" }}>
          {roles.map(([role, can]) => (
            <div key={role}>
              <dt style={{ fontWeight: 600, fontSize: "0.95rem" }}>{role}</dt>
              <dd style={{ margin: "0.15rem 0 0", fontSize: "0.92rem", color: "var(--ink-soft)", lineHeight: 1.6 }}>{can}</dd>
            </div>
          ))}
        </dl>
        <p style={{ ...p, fontSize: "0.9rem", color: "var(--ink-soft)" }}>
          These rules are enforced by the database itself (row-level security), not only by the website. A club that
          wants its leads added can write to us.
        </p>
      </section>

      <section id="how" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          How it works
        </h2>
        <ul style={{ marginTop: "0.8rem", paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.4rem" }}>
          <li style={li}>
            <strong>Website:</strong> Next.js (React) with server rendering and server actions, hosted on Vercel.
          </li>
          <li style={li}>
            <strong>Database:</strong> PostgreSQL on Supabase, in the Mumbai region. Every table has row-level security.
          </li>
          <li style={li}>
            <strong>Sign-in:</strong> Google, through Supabase Auth. A database rule rejects accounts outside{" "}
            <code>drait.edu.in</code>.
          </li>
          <li style={li}>
            <strong>Files:</strong> profile photos in Supabase Storage, resized in your browser before upload.
          </li>
          <li style={li}>
            <strong>Live updates:</strong> Supabase Realtime for new replies in discussions.
          </li>
        </ul>
        <p style={p}>
          The code is laid out so it is easy to find your way: pages live in <code>src/app</code>, every read goes
          through <code>src/lib/data</code>, every write through <code>src/lib/actions.ts</code>, and the database
          schema and permission rules are in <code>supabase/migrations</code>.
        </p>
      </section>

      <section id="data" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          Your data
        </h2>
        <p style={p}>
          We store your name, college email, Google profile photo, the profile details you add, and what you post or
          RSVP to. Nothing is sold, there are no ads, and there is no third-party tracking. Your USN is visible only to
          signed-in students. Read the full <Link href="/privacy">privacy policy</Link> and{" "}
          <Link href="/terms">terms of use</Link>.
        </p>
      </section>

      <section id="contribute" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          Contribute
        </h2>
        <p style={p}>
          AIT Hub is MIT licensed. Fix a bug, add a feature, or improve the docs. The code is at{" "}
          <a href={DEVELOPER.repo} target="_blank" rel="noreferrer">
            github.com/joycemalik/drait
          </a>
          . To run it on your computer (it uses sample data until you connect a database):
        </p>
        <code style={code}>{`git clone ${DEVELOPER.repo}.git\ncd drait\nnpm install\nnpm run dev`}</code>
        <p style={p}>
          Then open <code>http://localhost:3000</code>. The README covers connecting your own free Supabase project,
          and <a href={`${DEVELOPER.repo}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a> explains how to send a pull
          request. Found a problem? <a href={`${DEVELOPER.repo}/issues`}>Open an issue</a>.
        </p>
      </section>

      <section id="college" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          About Dr. AIT
        </h2>
        <p style={p}>
          {COLLEGE.name} was founded in {COLLEGE.founded} by {COLLEGE.founder}. It is an {COLLEGE.status.toLowerCase()}{" "}
          institute affiliated to {COLLEGE.affiliation}, accredited {COLLEGE.accreditation.join(", ")}, with{" "}
          {COLLEGE.nirf}.
        </p>
        <dl style={{ marginTop: "1rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(13rem, 1fr))", gap: "1rem 1.5rem" }}>
          <div>
            <dt className="section-label">Address</dt>
            <dd style={{ margin: "0.2rem 0 0", fontSize: "0.92rem", lineHeight: 1.55 }}>{COLLEGE.address}</dd>
          </div>
          <div>
            <dt className="section-label">Programmes</dt>
            <dd style={{ margin: "0.2rem 0 0", fontSize: "0.92rem" }}>{COLLEGE.programmes.join(", ")}</dd>
          </div>
          <div>
            <dt className="section-label">Placements {COLLEGE.placements.year}</dt>
            <dd style={{ margin: "0.2rem 0 0", fontSize: "0.92rem", lineHeight: 1.55 }}>
              {COLLEGE.placements.placed} placed, {COLLEGE.placements.recruiters} recruiters, average{" "}
              {COLLEGE.placements.average}, highest {COLLEGE.placements.highest}
            </dd>
          </div>
          <div>
            <dt className="section-label">College office</dt>
            <dd style={{ margin: "0.2rem 0 0", fontSize: "0.92rem", lineHeight: 1.55 }}>
              {COLLEGE.enquiry.phone} · {COLLEGE.enquiry.email}
              <br />
              Admissions: {COLLEGE.enquiry.admissions}
            </dd>
          </div>
        </dl>
        <p className="section-label" style={{ marginTop: "1.4rem" }}>
          Schools
        </p>
        <ul style={{ marginTop: "0.3rem", paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.2rem" }}>
          {COLLEGE.schools.map((s) => (
            <li key={s} style={li}>
              {s}
            </li>
          ))}
        </ul>
        <p className="section-label" style={{ marginTop: "1.4rem" }}>
          Departments
        </p>
        <p style={{ ...p, marginTop: "0.3rem", fontSize: "0.92rem", color: "var(--ink-soft)" }}>
          {DEPARTMENTS.filter((d) => d.id !== "other")
            .map((d) => d.name)
            .join(" · ")}
        </p>
        <p style={{ ...p, fontSize: "0.8rem", color: "var(--ink-faint)" }}>
          Source: <a href={COLLEGE.website}>drait.edu.in</a> and public listings, October 2026. If something is out of
          date, tell us.
        </p>
      </section>

      <section id="contact" style={{ marginTop: "2.6rem", scrollMarginTop: "5rem" }}>
        <h2 className="font-display" style={h2}>
          Contact
        </h2>
        <p style={p}>
          Questions, bugs, getting your club on AIT Hub, or adding club leads: write to{" "}
          <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>, or{" "}
          <a href={`${DEVELOPER.repo}/issues`}>open an issue on GitHub</a>.
        </p>
      </section>

      <footer style={{ marginTop: "4rem", paddingTop: "1.2rem", borderTop: "1px solid var(--rule)", fontSize: "0.8rem", color: "var(--ink-faint)", lineHeight: 1.7 }}>
        Built by {DEVELOPER.name} ·{" "}
        <a href={DEVELOPER.website} target="_blank" rel="noreferrer" style={{ color: "var(--ink-soft)" }}>
          joycemalik.com
        </a>{" "}
        ·{" "}
        <a href={DEVELOPER.linkedin} target="_blank" rel="noreferrer" style={{ color: "var(--ink-soft)" }}>
          LinkedIn
        </a>{" "}
        ·{" "}
        <a href={DEVELOPER.github} target="_blank" rel="noreferrer" style={{ color: "var(--ink-soft)" }}>
          GitHub
        </a>
      </footer>
    </article>
  );
}
