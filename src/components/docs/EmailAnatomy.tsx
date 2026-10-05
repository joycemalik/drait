/** Shows how a college email address becomes a profile: each part, underlined by hand, with what it means. */

const parts: { text: string; label: string; detail: string; color: string }[] = [
  { text: "1da", label: "College code", detail: "Dr. AIT", color: "var(--ink-soft)" },
  { text: "24", label: "Joined", detail: "2024", color: "var(--laterite)" },
  { text: "is", label: "Branch", detail: "ISE", color: "var(--river-deep)" },
  { text: "042", label: "Roll no.", detail: "042", color: "var(--ink-soft)" },
  { text: "@is.drait.edu.in", label: "College domain", detail: "Verified student", color: "var(--sal)" },
];

function Brace({ color }: { color: string }) {
  return (
    <svg viewBox="0 0 100 14" preserveAspectRatio="none" aria-hidden style={{ width: "100%", height: 12, display: "block" }}>
      <path
        d="M2 2c1 5 6 5 18 5.2s25 .4 28 5.8c3-5.4 16-5.6 28-5.8s17-.2 22-5.2"
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export default function EmailAnatomy() {
  return (
    <figure style={{ margin: "1.4rem 0 0.4rem" }} aria-label="How 1da24is042@is.drait.edu.in becomes USN 1DA24IS042, joined 2024, branch ISE">
      <div style={{ overflowX: "auto", paddingBottom: "0.3rem" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "0.2rem", minWidth: "33rem" }}>
          {parts.map((p) => (
            <div key={p.text} style={{ display: "grid", justifyItems: "center", gap: "0.25rem", flex: `${p.text.length} 0 auto` }}>
              <span
                style={{
                  fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
                  fontSize: "clamp(1rem, 2.4vw, 1.35rem)",
                  color: p.color,
                  letterSpacing: "0.02em",
                }}
              >
                {p.text}
              </span>
              <Brace color={p.color} />
              <span className="font-display" style={{ fontStyle: "italic", fontSize: "0.85rem", color: "var(--ink)" }}>
                {p.detail}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--ink-faint)", textAlign: "center" }}>{p.label}</span>
            </div>
          ))}
        </div>
      </div>
      <figcaption style={{ marginTop: "0.8rem", fontSize: "0.85rem", color: "var(--ink-soft)" }}>
        Your profile starts as <strong>USN 1DA24IS042</strong>, joined 2024, Information Science &amp; Engineering, verified.
      </figcaption>
    </figure>
  );
}
