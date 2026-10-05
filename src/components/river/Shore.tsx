import AuthButton from "@/components/AuthButton";
import Link from "next/link";

export default function Shore({
  signedIn,
  configured,
  repoUrl,
  contributors,
}: {
  signedIn: boolean;
  configured: boolean;
  repoUrl?: string;
  contributors?: number;
}) {
  return (
    <footer style={{ position: "relative", marginTop: "2rem", background: "var(--paper-deep)" }}>
      <svg aria-hidden viewBox="0 0 1600 60" preserveAspectRatio="none" style={{ position: "absolute", top: -59, left: 0, width: "100%", height: 60 }}>
        <path d="M0 60 L0 34 C200 18 380 44 640 30 S1100 10 1340 28 S1540 40 1600 30 L1600 60 Z" fill="var(--paper-deep)" />
      </svg>

      <div style={{ maxWidth: "70rem", margin: "0 auto", padding: "4rem clamp(1.25rem, 6vw, 5rem) 3rem" }}>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem 5rem", marginTop: "3.5rem" }}>
          <div style={{ maxWidth: "24rem" }}>
            <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500 }}>
              Get started
            </h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.92rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>
              RSVP to events, join clubs and ask questions. Sign in with your Google account.
            </p>
            <div style={{ marginTop: "1rem" }}>
              {signedIn ? (
                <Link href="/today" style={{ color: "var(--ink)", fontWeight: 600 }}>
                  Go to your dashboard →
                </Link>
              ) : (
                <AuthButton
                  configured={configured}
                  style={{ padding: "0.65rem 1.3rem", borderRadius: "999px / 900px", background: "var(--ink)", color: "var(--paper)", fontWeight: 600 }}
                >
                  Sign in with Google
                </AuthButton>
              )}
            </div>
          </div>

          <div style={{ maxWidth: "26rem" }}>
            <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500 }}>
              Contribute
            </h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.92rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>
              AIT Hub is open source and built by students. Add your club, report issues or submit improvements on GitHub.
              {contributors ? ` ${contributors} contributors so far.` : ""}
            </p>
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "1rem", color: "var(--ink)", fontWeight: 600 }}>
                View on GitHub ↗
              </a>
            )}
          </div>
        </div>

        <p style={{ marginTop: "4rem", fontSize: "0.75rem", color: "var(--ink-faint)", display: "flex", flexWrap: "wrap", gap: "0.3rem 1rem" }}>
          <span>A student project for Dr. Ambedkar Institute of Technology, Bengaluru · MIT licensed</span>
          <Link href="/about" style={{ color: "var(--ink-soft)" }}>About</Link>
          <Link href="/privacy" style={{ color: "var(--ink-soft)" }}>Privacy</Link>
          <Link href="/terms" style={{ color: "var(--ink-soft)" }}>Terms</Link>
        </p>
      </div>
    </footer>
  );
}
