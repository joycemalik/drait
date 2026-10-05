import Link from "next/link";
import { DEVELOPER } from "@/lib/college";

export const metadata = { title: "Terms of use", description: "The rules for using AIT Hub." };

const h2: React.CSSProperties = { fontSize: "1.4rem", fontWeight: 400, marginTop: "2.2rem" };
const p: React.CSSProperties = { fontSize: "0.96rem", lineHeight: 1.75, marginTop: "0.6rem" };
const li: React.CSSProperties = { fontSize: "0.95rem", lineHeight: 1.65 };

export default function TermsPage() {
  return (
    <article style={{ maxWidth: "42rem" }}>
      <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
        Terms of use
      </h1>
      <p style={{ ...p, color: "var(--ink-faint)", fontSize: "0.85rem" }}>Effective 6 October 2026</p>
      <p style={p}>
        AIT Hub is a free, student-run portal for Dr. Ambedkar Institute of Technology. It is not an official website of
        the college. By signing in you agree to these terms.
      </p>

      <h2 className="font-display" style={h2}>
        Your account
      </h2>
      <p style={p}>
        Sign in only with your own Dr. AIT college account. You are responsible for what is posted from it. Do not
        impersonate other students, clubs or college staff.
      </p>

      <h2 className="font-display" style={h2}>
        What not to post
      </h2>
      <ul style={{ marginTop: "0.6rem", paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.4rem" }}>
        <li style={li}>Harassment, hate speech, threats, or content that targets a person.</li>
        <li style={li}>Other people&apos;s personal information, such as phone numbers, without their permission.</li>
        <li style={li}>Spam, advertising unrelated to campus life, or misleading event information.</li>
        <li style={li}>
          Material you do not have the right to share, including paid course content, and anything that breaks
          college rules on question papers or exams.
        </li>
        <li style={li}>Attempts to break, overload or get around the site&apos;s security.</li>
      </ul>

      <h2 className="font-display" style={h2}>
        Your content
      </h2>
      <p style={p}>
        You keep ownership of what you post. By posting, you allow AIT Hub to display it on the site. Club leads and
        maintainers may remove content that breaks these terms, and accounts that repeatedly break them may be
        removed.
      </p>

      <h2 className="font-display" style={h2}>
        No guarantees
      </h2>
      <p style={p}>
        AIT Hub is provided as is, by volunteers. Event times, deadlines and opportunity details are posted by clubs
        and students. Always confirm important information with the club or the college. We are not liable for
        losses arising from use of the site.
      </p>

      <h2 className="font-display" style={h2}>
        Open source
      </h2>
      <p style={p}>
        The AIT Hub source code is available under the MIT License at{" "}
        <a href={DEVELOPER.repo} target="_blank" rel="noreferrer">
          github.com/joycemalik/drait
        </a>
        . The license covers the code, not the content students post.
      </p>

      <h2 className="font-display" style={h2}>
        Changes and contact
      </h2>
      <p style={p}>
        We may update these terms; the date above will change when we do. See also the{" "}
        <Link href="/privacy">privacy policy</Link>. Questions: <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>.
      </p>
    </article>
  );
}
