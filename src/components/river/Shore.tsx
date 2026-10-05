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
        <p className="font-display" style={{ fontStyle: "italic", fontSize: "clamp(1.3rem, 2.6vw, 1.9rem)", lineHeight: 1.35, maxWidth: "40rem" }}>
          “Where the mind is without fear and the head is held high…”
        </p>
        <p style={{ marginTop: "0.5rem", fontSize: "0.85rem", color: "var(--ink-soft)" }}>Rabindranath Tagore, founder of Santiniketan</p>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "3rem 5rem", marginTop: "3.5rem" }}>
          <div style={{ maxWidth: "24rem" }}>
            <h3 className="font-display" style={{ fontSize: "1.5rem", fontWeight: 500 }}>
              Step in
            </h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.92rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>
              Say you&apos;ll come to things, join your clubs, ask the seniors anything. One Google sign-in.
            </p>
            <div style={{ marginTop: "1rem" }}>
              {signedIn ? (
                <Link href="/today" style={{ color: "var(--ink)", fontWeight: 600 }}>
                  Your day at AIT →
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
              Build this with us
            </h3>
            <p style={{ marginTop: "0.5rem", fontSize: "0.92rem", lineHeight: 1.6, color: "var(--ink-soft)" }}>
              AIT Hub is open source and made by students. Add your club, fix something that bugs you, or draw the next
              village on the bank.
              {contributors ? ` ${contributors} people have pitched in so far.` : ""}
            </p>
            {repoUrl && (
              <a href={repoUrl} target="_blank" rel="noreferrer" style={{ display: "inline-block", marginTop: "1rem", color: "var(--ink)", fontWeight: 600 }}>
                Read the code on GitHub ↗
              </a>
            )}
          </div>
        </div>

        <p style={{ marginTop: "4rem", fontSize: "0.75rem", color: "var(--ink-faint)" }}>
          Dr. Ambedkar Institute of Technology, Bengaluru · MIT licensed
        </p>
      </div>
    </footer>
  );
}
