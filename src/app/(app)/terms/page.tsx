import Link from "next/link";
import { DEVELOPER } from "@/lib/college";
import { DocPage, DocSection, Points } from "@/components/docs/Doc";

export const metadata = { title: "Terms of use", description: "The rules for using AIT Hub." };

const toc = [
  ["short", "In short"],
  ["account", "Your account"],
  ["not-allowed", "What not to post"],
  ["content", "Your content"],
  ["no-guarantees", "No guarantees"],
  ["open-source", "Open source"],
  ["changes", "Changes and contact"],
] as const;

const li: React.CSSProperties = { fontSize: "0.95rem", lineHeight: 1.65 };

export default function TermsPage() {
  return (
    <DocPage
      eyebrow="Terms"
      title="Terms of use"
      toc={toc}
      lede="AIT Hub is a free, student-run portal for Dr. Ambedkar Institute of Technology, and not an official college website. By signing in you agree to these terms."
      meta="Effective 6 October 2026"
    >
      <DocSection id="short" n={1} title="In short">
        <Points
          items={[
            { icon: "user", title: "Be yourself", text: "Use your own college account and don't impersonate anyone." },
            { icon: "people", title: "Be decent", text: "No harassment, spam, or sharing other people's details." },
            { icon: "book", title: "Share fairly", text: "Only share material you have the right to share." },
            { icon: "leaf", title: "Volunteer-run", text: "Confirm important dates with the club or college." },
          ]}
        />
      </DocSection>

      <DocSection id="account" n={2} title="Your account">
        <p>
          Sign in only with your own Dr. AIT college account. You are responsible for what is posted from it. Do not
          impersonate other students, clubs or college staff.
        </p>
      </DocSection>

      <DocSection id="not-allowed" n={3} title="What not to post">
        <ul style={{ paddingLeft: "1.2rem", listStyle: "disc", display: "grid", gap: "0.4rem", maxWidth: "38rem" }}>
          <li style={li}>Harassment, hate speech, threats, or content that targets a person.</li>
          <li style={li}>Other people&apos;s personal information, such as phone numbers, without their permission.</li>
          <li style={li}>Spam, advertising unrelated to campus life, or misleading event information.</li>
          <li style={li}>
            Material you don&apos;t have the right to share, including paid course content, or anything that breaks
            college rules on question papers or exams.
          </li>
          <li style={li}>Attempts to break, overload or get around the site&apos;s security.</li>
        </ul>
      </DocSection>

      <DocSection id="content" n={4} title="Your content">
        <p>
          You keep ownership of what you post. By posting, you allow AIT Hub to display it on the site. Club leads and
          maintainers may remove content that breaks these terms, and accounts that repeatedly break them may be
          removed.
        </p>
      </DocSection>

      <DocSection id="no-guarantees" n={5} title="No guarantees">
        <p>
          AIT Hub is provided as is, by volunteers. Event times, deadlines and opportunity details are posted by clubs
          and students, so confirm anything important with the club or the college. We are not liable for losses
          arising from use of the site.
        </p>
      </DocSection>

      <DocSection id="open-source" n={6} title="Open source">
        <p>
          The source code is available under the MIT License on{" "}
          <a href={DEVELOPER.repo} target="_blank" rel="noreferrer">
            GitHub
          </a>
          . The license covers the code, not the content students post.
        </p>
      </DocSection>

      <DocSection id="changes" n={7} title="Changes and contact">
        <p>
          We may update these terms; the date at the top changes when we do. See also the{" "}
          <Link href="/privacy">privacy policy</Link>. Questions:{" "}
          <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>.
        </p>
      </DocSection>
    </DocPage>
  );
}
