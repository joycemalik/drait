import Link from "next/link";
import { DEVELOPER } from "@/lib/college";

export const metadata = { title: "Privacy policy", description: "What AIT Hub collects, why, who can see it, and how to delete it." };

const h2: React.CSSProperties = { fontSize: "1.4rem", fontWeight: 400, marginTop: "2.2rem" };
const p: React.CSSProperties = { fontSize: "0.96rem", lineHeight: 1.75, marginTop: "0.6rem" };
const li: React.CSSProperties = { fontSize: "0.95rem", lineHeight: 1.65 };

export default function PrivacyPage() {
  return (
    <article style={{ maxWidth: "42rem" }}>
      <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
        Privacy policy
      </h1>
      <p style={{ ...p, color: "var(--ink-faint)", fontSize: "0.85rem" }}>Effective 6 October 2026</p>
      <p style={p}>
        AIT Hub is a student-run, open-source portal for students of Dr. Ambedkar Institute of Technology. This page
        explains what we collect, why, who can see it, and how to have it removed. In short: we collect only what the
        site needs to work, we never sell it, and we do not show ads.
      </p>

      <h2 className="font-display" style={h2}>
        What we collect
      </h2>
      <ul style={{ marginTop: "0.6rem", paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.4rem" }}>
        <li style={li}>
          <strong>From Google when you sign in:</strong> your name, college email address and profile photo. We do not
          get access to your Gmail, Drive, contacts or anything else in your Google account.
        </li>
        <li style={li}>
          <strong>From your college email:</strong> your USN, department and joining year, read from the address
          itself.
        </li>
        <li style={li}>
          <strong>What you add:</strong> profile details (semester, section, bio, skills, links, photo), posts,
          replies, votes, RSVPs, club memberships, shared resource links and submitted achievements.
        </li>
        <li style={li}>
          <strong>Technical:</strong> a sign-in cookie that keeps you logged in, and standard server logs kept by our
          hosting providers for security and debugging.
        </li>
      </ul>

      <h2 className="font-display" style={h2}>
        How we use it
      </h2>
      <p style={p}>
        Only to run AIT Hub: to show who posted or is attending, to let club leads manage their club, to keep the
        portal limited to Dr. AIT students, and to fix problems. We do not use your data for advertising or sell or
        share it with anyone for marketing.
      </p>

      <h2 className="font-display" style={h2}>
        Who can see what
      </h2>
      <ul style={{ marginTop: "0.6rem", paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.4rem" }}>
        <li style={li}>
          <strong>Everyone, including people not signed in:</strong> your name, photo, department, semester, section,
          bio, skills, links, posts, replies, achievements and club memberships.
        </li>
        <li style={li}>
          <strong>Signed-in students:</strong> also your USN.
        </li>
        <li style={li}>
          <strong>Not shown to other users:</strong> your email address and which events you RSVP to (only counts are
          shown).
        </li>
        <li style={li}>
          <strong>Maintainers:</strong> the student maintainers can access the database to run and fix the service.
        </li>
      </ul>

      <h2 className="font-display" style={h2}>
        Where it is stored
      </h2>
      <p style={p}>
        The database, sign-in and photos are hosted by Supabase in their Mumbai (ap-south-1) region. The website is
        hosted by Vercel. Sign-in is provided by Google. Each of these providers processes data under their own
        privacy terms.
      </p>

      <h2 className="font-display" style={h2}>
        Google user data
      </h2>
      <p style={p}>
        AIT Hub requests only the basic Google sign-in scopes (your name, email address and profile photo). This
        information is used solely to create and identify your AIT Hub account. It is not shared with third parties,
        transferred for advertising, or used to train AI models. AIT Hub&apos;s use of information received from Google
        APIs adheres to the Google API Services User Data Policy, including the Limited Use requirements.
      </p>

      <h2 className="font-display" style={h2}>
        Keeping and deleting your data
      </h2>
      <p style={p}>
        Your account stays until you ask us to remove it. You can edit your profile at any time on{" "}
        <Link href="/profile">your profile page</Link>. To delete your account and everything linked to it, email{" "}
        <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a> from your college email and we will remove it
        within 7 days.
      </p>

      <h2 className="font-display" style={h2}>
        Changes and contact
      </h2>
      <p style={p}>
        If this policy changes, we will update the date above and mention it on the site. Questions or requests:{" "}
        <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>.
      </p>
    </article>
  );
}
