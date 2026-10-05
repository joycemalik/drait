import { ImageResponse } from "next/og";

export const alt = "AIT Hub: clubs, events and community at Dr. Ambedkar Institute of Technology";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#f3ecdf", padding: 80, color: "#1f2a44" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <svg width="96" height="96" viewBox="0 0 128 128">
            <path d="M64 16C40 31 30 52 34 73c3 15 15 23 30 23s27-8 30-23c4-21-6-42-30-57Z" fill="#5E7A3A" stroke="#1F2A44" strokeWidth="2.4" />
            <path d="M64 24c-1.6 22-1 45 .6 70" fill="none" stroke="#F3ECDF" strokeWidth="2.6" strokeLinecap="round" />
            <path d="M14 98c8-6 16-6 24 0s16 6 24 0 16-6 24 0 16 6 24 0" fill="none" stroke="#4F7C8A" strokeWidth="4.2" strokeLinecap="round" />
            <path d="M26 110c7-5 14-5 21 0s14 5 21 0 14-5 21 0" fill="none" stroke="#4F7C8A" strokeWidth="3.2" strokeLinecap="round" opacity="0.6" />
          </svg>
          <div style={{ fontSize: 56, fontWeight: 700 }}>AIT Hub</div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2 }}>Campus life at Dr. AIT,</div>
          <div style={{ fontSize: 76, lineHeight: 1.05, letterSpacing: -2, color: "#b5532e" }}>in one place.</div>
          <div style={{ marginTop: 28, fontSize: 30, color: "#4a5368" }}>Clubs · Events · Announcements · Community · Study resources</div>
        </div>
        <div style={{ fontSize: 24, color: "#8a8574" }}>Dr. Ambedkar Institute of Technology, Bengaluru · Student-run, open source</div>
      </div>
    ),
    size,
  );
}
