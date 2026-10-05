import "./globals.css";
import type { Metadata, Viewport } from "next";
import { Fraunces, Instrument_Sans } from "next/font/google";
import { SITE_DESCRIPTION, SITE_URL } from "@/lib/site";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  axes: ["SOFT", "WONK", "opsz"],
  style: ["normal", "italic"],
});
const body = Instrument_Sans({ subsets: ["latin"], variable: "--font-body" });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "AIT Hub: clubs, events and community at Dr. AIT Bengaluru", template: "%s · AIT Hub" },
  description: SITE_DESCRIPTION,
  applicationName: "AIT Hub",
  keywords: [
    "Dr. AIT",
    "Dr. Ambedkar Institute of Technology",
    "DRAIT",
    "AIT Bangalore",
    "Dr AIT clubs",
    "Dr AIT events",
    "VTU",
    "college clubs Bengaluru",
    "student portal",
  ],
  openGraph: {
    type: "website",
    siteName: "AIT Hub",
    locale: "en_IN",
    url: SITE_URL,
    title: "AIT Hub: campus life at Dr. AIT, in one place",
    description: SITE_DESCRIPTION,
  },
  twitter: { card: "summary_large_image", title: "AIT Hub", description: SITE_DESCRIPTION },
  icons: { icon: "/logo-mark.svg" },
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f3ecdf" },
    { media: "(prefers-color-scheme: dark)", color: "#15181f" },
  ],
};

// Applies a saved day/dusk choice before paint so the page never flashes the wrong theme.
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="day"||t==="dusk")document.documentElement.dataset.theme=t}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${body.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
