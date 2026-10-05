import { blobPath } from "@/lib/noise";

/** A hand-drawn map of how AIT Hub fits together. */

function Node({ seed, cx, cy, rx, ry, fill }: { seed: number; cx: number; cy: number; rx: number; ry: number; fill: string }) {
  return (
    <>
      <path d={blobPath(seed, cx + 4, cy + 4, rx, ry, 0.06, 12)} style={{ fill }} opacity="0.55" />
      <path d={blobPath(seed + 1, cx, cy, rx, ry, 0.05, 12)} fill="none" stroke="var(--ink)" strokeWidth="1.4" />
    </>
  );
}

function Arrow({ d, dashed, head }: { d: string; dashed?: boolean; head: string }) {
  return (
    <>
      <path d={d} fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" strokeDasharray={dashed ? "5 6" : undefined} />
      <path d={head} fill="none" stroke="var(--ink)" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
    </>
  );
}

const t = (size: number, italic = false): React.CSSProperties => ({
  fontFamily: italic ? "var(--font-fraunces), Georgia, serif" : "var(--font-body), sans-serif",
  fontStyle: italic ? "italic" : "normal",
  fontSize: size,
});

export default function SystemSketch() {
  return (
    <figure style={{ margin: "1.2rem 0 0" }}>
      <div style={{ overflowX: "auto" }}>
        <svg viewBox="0 0 700 330" style={{ width: "100%", minWidth: 520, height: "auto", display: "block" }} role="img"
          aria-label="Your browser talks to AIT Hub on Vercel. AIT Hub reads and writes through Supabase in Mumbai, which holds the database with its access rules, sign-in, photos and live replies. Google confirms who you are when you sign in.">
          <Node seed={3} cx={88} cy={120} rx={66} ry={46} fill="color-mix(in srgb, var(--turmeric) 30%, transparent)" />
          <text x={88} y={116} textAnchor="middle" style={t(19, true)} fill="var(--ink)">You</text>
          <text x={88} y={136} textAnchor="middle" style={t(11)} fill="var(--ink-soft)">browser or phone</text>

          <Node seed={7} cx={318} cy={120} rx={92} ry={52} fill="color-mix(in srgb, var(--laterite) 22%, transparent)" />
          <text x={318} y={114} textAnchor="middle" style={t(19, true)} fill="var(--ink)">AIT Hub</text>
          <text x={318} y={134} textAnchor="middle" style={t(11)} fill="var(--ink-soft)">Next.js on Vercel</text>

          <Node seed={11} cx={578} cy={140} rx={108} ry={118} fill="color-mix(in srgb, var(--sal) 22%, transparent)" />
          <text x={578} y={62} textAnchor="middle" style={t(19, true)} fill="var(--ink)">Supabase</text>
          <text x={578} y={80} textAnchor="middle" style={t(11)} fill="var(--ink-soft)">Mumbai region</text>
          {["Database + access rules", "Sign-in", "Profile photos", "Live replies"].map((s, i) => (
            <g key={s}>
              <path d={`M${506} ${108 + i * 32}c2-1 4-1 6 0`} stroke="var(--ink)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
              <text x={518} y={112 + i * 32} style={t(12.5)} fill="var(--ink)">{s}</text>
            </g>
          ))}

          <Node seed={19} cx={318} cy={270} rx={78} ry={30} fill="color-mix(in srgb, var(--river) 24%, transparent)" />
          <text x={318} y={268} textAnchor="middle" style={t(15, true)} fill="var(--ink)">Google</text>
          <text x={318} y={284} textAnchor="middle" style={t(11.5)} fill="var(--ink-soft)">college account sign-in</text>

          <Arrow d="M158 108c28-8 48-9 66-6" head="M216 96l9 6-9 6" />
          <Arrow d="M226 136c-22 6-42 7-66 3" head="M168 133l-9 6 9 6" />
          <text x={192} y={92} textAnchor="middle" style={t(11.5, true)} fill="var(--ink-soft)">pages</text>
          <text x={192} y={160} textAnchor="middle" style={t(11.5, true)} fill="var(--ink-soft)">your actions</text>

          <Arrow d="M412 112c22-6 40-7 56-4" head="M460 102l9 6-9 6" />
          <text x={440} y={96} textAnchor="middle" style={t(11.5, true)} fill="var(--ink-soft)">reads &amp; writes</text>
          <text x={440} y={144} textAnchor="middle" style={t(11.5, true)} fill="var(--ink-soft)">as you, checked</text>
          <text x={440} y={157} textAnchor="middle" style={t(11.5, true)} fill="var(--ink-soft)">by the rules</text>

          <Arrow d="M110 168c20 50 70 92 128 100" dashed head="M230 261l10 7-11 4" />
          <text x={118} y={246} style={t(11.5, true)} fill="var(--ink-soft)">sign in</text>
          <Arrow d="M398 268c40-4 70-20 92-48" head="M480 222l11-4-1 11" />
          <text x={452} y={278} style={t(11.5, true)} fill="var(--ink-soft)">confirms who you are</text>
        </svg>
      </div>
    </figure>
  );
}
