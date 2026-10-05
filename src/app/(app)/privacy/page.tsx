import Link from "next/link";
import { DEVELOPER } from "@/lib/college";
import { DocPage, DocSection, Matrix, Points } from "@/components/docs/Doc";

export const metadata = { title: "Privacy policy", description: "What AIT Hub collects, why, who can see it, and how to delete it." };

const toc = [
  ["short", "In short"],
  ["visibility", "Who sees what"],
  ["collect", "What we collect"],
  ["use", "How we use it"],
  ["storage", "Where it's stored"],
  ["google", "Google user data"],
  ["delete", "Keeping and deleting"],
  ["changes", "Changes and contact"],
] as const;

const mail = <a href={`mailto:${DEVELOPER.email}`}>{DEVELOPER.email}</a>;

export default function PrivacyPage() {
  return (
    <DocPage
      eyebrow="Privacy"
      title="Privacy policy"
      toc={toc}
      lede="AIT Hub is a student-run, open-source portal for Dr. Ambedkar Institute of Technology. This is what we collect, why, who can see it, and how to have it removed."
      meta="Effective 6 October 2026"
    >
      <DocSection id="short" n={1} title="In short">
        <Points
          items={[
            { icon: "lock", title: "Only what's needed", text: "We collect what the site needs to work, nothing more." },
            { icon: "shield", title: "Never sold", text: "No ads, no third-party tracking, no data shared for marketing." },
            { icon: "eye", title: "Private where it matters", text: "Your email and RSVPs aren't shown to other students." },
            { icon: "trash", title: "Removable", text: "Edit your profile anytime; ask us and we delete your account within 7 days." },
          ]}
        />
      </DocSection>

      <DocSection id="visibility" n={2} title="Who sees what">
        <Matrix
          cols={["Everyone", "Signed-in students", "Only you"]}
          rows={[
            ["Name, photo, department, semester", [true, true, true]],
            ["Bio, skills and links", [true, true, true]],
            ["Posts, replies, achievements, clubs", [true, true, true]],
            ["USN", [false, true, true]],
            ["Email address", [false, false, true]],
            ["Which events you RSVP to", [false, false, true]],
            ["Which posts you nodded", [false, false, true]],
          ]}
        />
        <p style={{ marginTop: "1rem", fontSize: "0.88rem", color: "var(--ink-soft)" }}>
          Counts (how many are going, how many nods) are public. The student maintainers can access the database to
          run and fix the service.
        </p>
      </DocSection>

      <DocSection id="collect" n={3} title="What we collect">
        <Points
          items={[
            { icon: "user", title: "From Google, at sign-in", text: "Your name, college email and profile photo. Nothing else from your Google account: not your mail, Drive or contacts." },
            { icon: "link", title: "From your college email", text: "Your USN, department and joining year, read from the address itself." },
            { icon: "chat", title: "What you add", text: "Profile details, posts, replies, nods, RSVPs, club memberships, shared links and achievements." },
            { icon: "server", title: "Technical", text: "A sign-in cookie that keeps you logged in, and standard server logs kept by our hosting providers for security." },
          ]}
        />
      </DocSection>

      <DocSection id="use" n={4} title="How we use it">
        <p>
          Only to run AIT Hub: to show who posted or how many are attending, to let club leads manage their club, to
          keep the portal limited to Dr. AIT students, and to fix problems. We do not use your data for advertising,
          and we do not sell it or share it for marketing.
        </p>
      </DocSection>

      <DocSection id="storage" n={5} title="Where it's stored">
        <Points
          items={[
            { icon: "server", title: "Supabase, Mumbai", text: "Database, sign-in and profile photos (ap-south-1 region)." },
            { icon: "code", title: "Vercel", text: "Hosts the website itself." },
            { icon: "shield", title: "Google", text: "Confirms your identity when you sign in." },
          ]}
        />
        <p style={{ marginTop: "1rem", fontSize: "0.9rem", color: "var(--ink-soft)" }}>
          Each provider processes data under its own privacy terms.
        </p>
      </DocSection>

      <DocSection id="google" n={6} title="Google user data">
        <p>
          AIT Hub requests only the basic Google sign-in scopes: your name, email address and profile photo. This is
          used only to create and identify your AIT Hub account. It is not shared with third parties, transferred for
          advertising, or used to train AI models. AIT Hub&apos;s use of information received from Google APIs adheres
          to the Google API Services User Data Policy, including the Limited Use requirements.
        </p>
      </DocSection>

      <DocSection id="delete" n={7} title="Keeping and deleting">
        <p>
          Your account stays until you ask us to remove it. Change your details anytime on{" "}
          <Link href="/profile">your profile</Link>. To delete your account and everything linked to it, email {mail}{" "}
          from your college address and we will remove it within 7 days.
        </p>
      </DocSection>

      <DocSection id="changes" n={8} title="Changes and contact">
        <p>
          If this policy changes, we update the date at the top and mention it on the site. Questions or requests:{" "}
          {mail}. See also the <Link href="/terms">terms of use</Link>.
        </p>
      </DocSection>
    </DocPage>
  );
}
