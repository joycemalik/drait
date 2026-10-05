import Link from "next/link";
import { COLLEGE, DEPARTMENTS, DEVELOPER } from "@/lib/college";
import { DocPage, DocSection, Matrix, Points, Steps } from "@/components/docs/Doc";
import EmailAnatomy from "@/components/docs/EmailAnatomy";
import SystemSketch from "@/components/docs/SystemSketch";
import HeroSketch from "@/components/river/HeroSketch";
import InkIcon from "@/components/InkIcons";

export const metadata = {
  title: "About",
  description: "What AIT Hub is, how it works, who can sign in, and how to contribute.",
};

const toc = [
  ["features", "What you can do"],
  ["sign-in", "Who can sign in"],
  ["roles", "Roles"],
  ["how", "How it works"],
  ["data", "Your data"],
  ["contribute", "Contribute"],
  ["college", "About Dr. AIT"],
  ["contact", "Contact"],
] as const;

export default function AboutPage() {
  return (
    <DocPage
      eyebrow="About"
      title="AIT Hub"
      toc={toc}
      lede={
        <>
          Club events, announcements, discussions, study resources and achievements at {COLLEGE.name}, in one place.
          Run by students, open source, free to use.
        </>
      }
      meta={
        <>
          A student project, not an official website of {COLLEGE.short}. For official information, visit{" "}
          <a href={COLLEGE.website} target="_blank" rel="noreferrer" style={{ color: "var(--ink-soft)" }}>
            drait.edu.in
          </a>
          .
        </>
      }
      art={
        <div className="sky" data-phase="day">
          <HeroSketch />
        </div>
      }
    >
      <DocSection id="features" n={1} title="What you can do">
        <Points
          items={[
            { icon: "calendar", title: "Never miss an event", text: "Every club event for the next two weeks, with RSVP and add-to-calendar." },
            { icon: "people", title: "Follow your clubs", text: "Join clubs and see their announcements on your Today page." },
            { icon: "chat", title: "Ask and answer", text: "Discussions with seniors and classmates. Replies appear live." },
            { icon: "book", title: "Share study material", text: "Notes, past papers and lab manuals by department and semester." },
            { icon: "award", title: "Celebrate wins", text: "Submit achievements; club leads verify them." },
            { icon: "user", title: "Your profile", text: "Department, skills and links, so people know who's asking." },
          ]}
        />
      </DocSection>

      <DocSection id="sign-in" n={2} title="Who can sign in">
        <p>
          Anyone can browse. To RSVP, post or share, sign in with your <strong>Dr. AIT college Google account</strong>:
          any address ending in <code>drait.edu.in</code>, including department addresses. Personal Gmail accounts are
          not accepted.
        </p>
        <p>The first time you sign in, your profile is filled in from your email address:</p>
        <EmailAnatomy />
        <p style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>
          Faculty or staff without a college Google account can <a href="#contact">ask to be added</a>.
        </p>
      </DocSection>

      <DocSection id="roles" n={3} title="Roles">
        <Matrix
          cols={["Anyone", "Student", "Club lead", "Admin"]}
          rows={[
            ["Browse everything", [true, true, true, true]],
            ["RSVP and join clubs", [false, true, true, true]],
            ["Post, reply and nod in Community", [false, true, true, true]],
            ["Share resources, submit achievements", [false, true, true, true]],
            ["Post announcements and events for their club", [false, false, true, true]],
            ["Verify achievements for their club", [false, false, true, true]],
            ["Manage clubs and opportunities", [false, false, false, true]],
          ]}
        />
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
          These rules are enforced by the database itself, not just the website. To get your club&apos;s leads added,{" "}
          <a href="#contact">write to us</a>.
        </p>
      </DocSection>

      <DocSection id="how" n={4} title="How it works">
        <SystemSketch />
        <Points
          items={[
            { icon: "code", title: "Website", text: "Next.js and React, with server rendering, hosted on Vercel." },
            { icon: "server", title: "Database", text: "PostgreSQL on Supabase (Mumbai). Every table has row-level security." },
            { icon: "shield", title: "Sign-in", text: "Google via Supabase Auth. A database rule rejects accounts outside drait.edu.in." },
            { icon: "leaf", title: "Where the code lives", text: <>Pages in <code>src/app</code>, reads in <code>src/lib/data</code>, writes in <code>src/lib/actions.ts</code>, rules in <code>supabase/migrations</code>.</> },
          ]}
        />
      </DocSection>

      <DocSection id="data" n={5} title="Your data">
        <Points
          items={[
            { icon: "lock", title: "Only what's needed", text: "Your name, college email, photo, profile details and what you post or RSVP to." },
            { icon: "eye", title: "Private where it matters", text: "Your email and RSVPs aren't shown to others. Your USN is visible only to signed-in students." },
            { icon: "shield", title: "No ads, never sold", text: "No advertising, no third-party tracking, nothing shared for marketing." },
            { icon: "trash", title: "Yours to remove", text: <>Edit anytime on <Link href="/profile">your profile</Link>, or ask us to delete your account.</> },
          ]}
        />
        <p style={{ marginTop: "1.2rem" }}>
          Details in the <Link href="/privacy">privacy policy</Link> and <Link href="/terms">terms of use</Link>.
        </p>
      </DocSection>

      <DocSection id="contribute" n={6} title="Contribute">
        <p>
          AIT Hub is MIT licensed and its code is on{" "}
          <a href={DEVELOPER.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
          . Fix a bug, add a feature, or improve these docs.
        </p>
        <div style={{ marginTop: "1.2rem" }}>
          <Steps
            items={[
              <>
                Get the code and start it. It runs on sample data until you connect a database.
                <div className="doc-note">{`git clone ${DEVELOPER.repo}.git\ncd drait\nnpm install\nnpm run dev`}</div>
              </>,
              <>
                Open <code>http://localhost:3000</code>. To use a real database, follow the README to connect your own
                free Supabase project.
              </>,
              <>
                Make your change on a branch and open a pull request. <a href={`${DEVELOPER.repo}/blob/main/CONTRIBUTING.md`}>CONTRIBUTING.md</a>{" "}
                has the checklist.
              </>,
            ]}
          />
        </div>
        <p style={{ marginTop: "1.2rem", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
          Found a problem? <a href={`${DEVELOPER.repo}/issues`}>Open an issue</a>.
        </p>
      </DocSection>

      <DocSection id="college" n={7} title="About Dr. AIT">
        <div className="doc-figures">
          {[
            [String(COLLEGE.founded), "Founded"],
            ["A+", "NAAC grade"],
            [String(COLLEGE.schools.length), "Schools"],
            [String(DEPARTMENTS.length - 1), "Departments"],
          ].map(([v, l]) => (
            <div key={l}>
              <div className="doc-figure-value">{v}</div>
              <div className="doc-figure-label">{l}</div>
            </div>
          ))}
        </div>
        <p style={{ marginTop: "1.4rem" }}>
          Founded by {COLLEGE.founder}, {COLLEGE.short} is an {COLLEGE.status.toLowerCase()} institute affiliated to{" "}
          {COLLEGE.affiliation}. It is accredited by NBA, approved by AICTE and recognised by UGC, with {COLLEGE.nirf}.
        </p>
        <div style={{ marginTop: "1.4rem", display: "flex", gap: "0.8rem", alignItems: "flex-start" }}>
          <span style={{ color: "var(--laterite)", marginTop: 2 }}>
            <InkIcon name="leaf" size={20} />
          </span>
          <p style={{ fontSize: "0.92rem", lineHeight: 1.6 }}>
            {COLLEGE.address}
            <br />
            <span style={{ color: "var(--ink-soft)" }}>
              Office {COLLEGE.enquiry.phone} · {COLLEGE.enquiry.email} · Admissions {COLLEGE.enquiry.admissions}
            </span>
          </p>
        </div>
        <p className="section-label" style={{ marginTop: "1.6rem", marginBottom: "0.5rem" }}>
          Departments
        </p>
        <ul className="doc-chips">
          {DEPARTMENTS.filter((d) => d.id !== "other").map((d) => (
            <li key={d.id}>{d.name}</li>
          ))}
        </ul>
        <p style={{ marginTop: "1rem", fontSize: "0.8rem", color: "var(--ink-faint)" }}>
          From drait.edu.in and public listings, October 2026. Something out of date? <a href="#contact">Tell us</a>.
        </p>
      </DocSection>

      <DocSection id="contact" n={8} title="Contact">
        <p>Questions, bugs, getting your club on AIT Hub, or adding club leads:</p>
        <a
          href={`mailto:${DEVELOPER.email}`}
          className="font-display"
          style={{ display: "inline-flex", alignItems: "center", gap: "0.6rem", marginTop: "0.8rem", fontSize: "clamp(1.2rem, 3vw, 1.6rem)", color: "var(--ink)" }}
        >
          <InkIcon name="mail" size={24} />
          {DEVELOPER.email}
        </a>
        <p style={{ marginTop: "0.8rem", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
          Or <a href={`${DEVELOPER.repo}/issues`}>open an issue on GitHub</a>.
        </p>
      </DocSection>

      <footer className="doc-credit">
        <span>An initiative by joycemalik</span>
        <a href={DEVELOPER.website} target="_blank" rel="noreferrer">
          joycemalik.com
        </a>
        <a href={DEVELOPER.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
        <a href={DEVELOPER.repo} target="_blank" rel="noreferrer">
          Source on GitHub
        </a>
      </footer>
    </DocPage>
  );
}
