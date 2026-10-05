import Link from "next/link";
import Mark from "@/components/Mark";
import ThemeToggle from "@/components/ThemeToggle";
import AuthButton from "@/components/AuthButton";
import Sky from "@/components/river/Sky";
import HeroSketch from "@/components/river/HeroSketch";
import River from "@/components/river/River";
import Voices from "@/components/river/Voices";
import Shore from "@/components/river/Shore";
import { getAnnouncements, getClubs, getDiscussions, getEvents, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { todayISO } from "@/lib/dates";

const DAYS = 14;

async function contributorCount(repoUrl?: string) {
  const m = repoUrl?.match(/github\.com\/([^/]+)\/([^/#?]+)/);
  if (!m) return undefined;
  try {
    const res = await fetch(`https://api.github.com/repos/${m[1]}/${m[2]}/contributors?per_page=100`, {
      next: { revalidate: 86_400 },
    });
    if (!res.ok) return undefined;
    return ((await res.json()) as unknown[]).length;
  } catch {
    return undefined;
  }
}

export default async function Landing() {
  const today = todayISO();
  const repoUrl = process.env.NEXT_PUBLIC_REPO_URL;
  const [events, clubs, announcements, discussions, viewer, contributors] = await Promise.all([
    getEvents({ from: today, days: DAYS }),
    getClubs(),
    getAnnouncements({ limit: 6 }),
    getDiscussions(),
    getViewer(),
    contributorCount(repoUrl),
  ]);

  const voices = [...discussions].sort((a, b) => b.upvotes + b.replyCount - (a.upvotes + a.replyCount)).slice(0, 5);

  return (
    <>
      <nav
        aria-label="Main"
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 20,
          display: "flex",
          alignItems: "center",
          gap: "1.5rem",
          padding: "1.4rem clamp(1.25rem, 6vw, 5rem)",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.55rem", textDecoration: "none", color: "var(--ink)" }}>
          <Mark size={30} />
          <span className="font-display" style={{ fontSize: "1.3rem", fontWeight: 600 }}>
            AIT Hub
          </span>
        </Link>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "clamp(0.9rem, 2.5vw, 1.8rem)", fontSize: "0.92rem" }}>
          {[
            ["/today", "Today"],
            ["/clubs", "Clubs"],
            ["/community", "Community"],
          ].map(([href, label]) => (
            <Link key={href} href={href} className="hidden sm:inline" style={{ color: "var(--ink)", textDecoration: "none" }}>
              {label}
            </Link>
          ))}
          <ThemeToggle />
          {viewer ? (
            <Link href="/today" style={{ color: "var(--ink)", fontWeight: 600 }}>
              {viewer.name.split(" ")[0]} →
            </Link>
          ) : (
            <AuthButton configured={isSupabaseConfigured} style={{ color: "var(--ink)", fontWeight: 600 }}>
              Sign in
            </AuthButton>
          )}
        </div>
      </nav>

      <Sky
        sketch={<HeroSketch />}
        todayCount={events.filter((e) => e.date === today).length}
        fortnightCount={events.length}
        clubCount={clubs.length}
        signedIn={!!viewer}
        configured={isSupabaseConfigured}
      />

      <River
        today={today}
        days={DAYS}
        events={events}
        clubs={clubs}
        announcements={announcements}
        rsvps={viewer?.rsvps ?? []}
        configured={isSupabaseConfigured}
      />

      <Voices discussions={voices} />

      <Shore signedIn={!!viewer} configured={isSupabaseConfigured} repoUrl={repoUrl} contributors={contributors} />
    </>
  );
}
