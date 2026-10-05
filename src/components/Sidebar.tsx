"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sun,
  Users,
  CalendarDays,
  Megaphone,
  MessageCircle,
  Compass,
  BookOpen,
  Award,
  Waves,
  X,
} from "lucide-react";
import type { ShellClub } from "./AppShell";

const nav = [
  { label: "Home", href: "/", icon: Waves },
  { label: "Today", href: "/today", icon: Sun },
  { label: "Clubs", href: "/clubs", icon: Users },
  { label: "Events", href: "/events", icon: CalendarDays },
  { label: "Announcements", href: "/announcements", icon: Megaphone },
  { label: "Community", href: "/community", icon: MessageCircle },
  { label: "Opportunities", href: "/opportunities", icon: Compass },
  { label: "Academics", href: "/academics", icon: BookOpen },
  { label: "Achievements", href: "/achievements", icon: Award },
];

export default function Sidebar({
  open,
  onClose,
  clubs,
  clubsLabel,
}: {
  open: boolean;
  onClose: () => void;
  clubs: ShellClub[];
  clubsLabel: string;
}) {
  const pathname = usePathname();

  const content = (
    <nav style={{ height: "100%", display: "flex", flexDirection: "column", padding: "1.25rem 0.9rem", overflowY: "auto" }}>
      {nav.map(({ label, href, icon: Icon }) => {
        const active = href === "/" ? pathname === "/" : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onClose}
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              gap: "0.7rem",
              padding: "0.5rem 0.8rem",
              textDecoration: "none",
              fontSize: "0.92rem",
              color: active ? "var(--ink)" : "var(--ink-soft)",
              fontWeight: active ? 600 : 400,
            }}
          >
            {active && (
              <svg
                aria-hidden
                viewBox="0 0 200 40"
                preserveAspectRatio="none"
                style={{ position: "absolute", inset: 0, width: "100%", height: "100%", zIndex: -1 }}
              >
                <path
                  d="M6 22C8 9 40 5 100 6s92 4 94 15-36 15-96 14S4 35 6 22Z"
                  fill="var(--turmeric)"
                  opacity="0.28"
                />
              </svg>
            )}
            <Icon size={16} strokeWidth={1.6} />
            {label}
          </Link>
        );
      })}

      {clubs.length > 0 && (
        <>
          <div className="wobble-rule" style={{ margin: "1.1rem 0.6rem 0.8rem" }} />
          <span className="section-label" style={{ padding: "0 0.8rem 0.4rem" }}>
            {clubsLabel}
          </span>
          {clubs.map((club) => (
            <Link
              key={club.slug}
              href={`/clubs/${club.slug}`}
              onClick={onClose}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "0.6rem",
                padding: "0.4rem 0.8rem",
                textDecoration: "none",
                fontSize: "0.86rem",
                color: "var(--ink-soft)",
              }}
            >
              <span
                aria-hidden
                style={{
                  width: 10,
                  height: 10,
                  background: club.color,
                  borderRadius: "60% 40% 55% 45% / 50% 60% 40% 50%",
                }}
              />
              {club.name}
            </Link>
          ))}
        </>
      )}

      <p style={{ marginTop: "auto", padding: "1rem 0.8rem 0", fontSize: "0.72rem", lineHeight: 1.5, color: "var(--ink-faint)" }}>
        Dr. Ambedkar Institute of Technology
        <br />
        Open source, built by students.
      </p>
    </nav>
  );

  return (
    <>
      <aside
        className="sidebar-desktop"
        style={{ position: "fixed", top: "3.75rem", left: 0, bottom: 0, width: "15rem", zIndex: 40 }}
      >
        {content}
      </aside>

      {open && (
        <>
          <div onClick={onClose} style={{ position: "fixed", inset: 0, zIndex: 45, background: "rgba(20,22,28,0.35)" }} />
          <aside
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              bottom: 0,
              width: "16rem",
              background: "var(--paper)",
              zIndex: 50,
              borderRadius: "0 28px 34px 0",
              boxShadow: "8px 0 40px -20px rgba(0,0,0,0.4)",
            }}
          >
            <button
              onClick={onClose}
              style={{ position: "absolute", top: "0.9rem", right: "0.9rem", color: "var(--ink-soft)" }}
              aria-label="Close menu"
            >
              <X size={18} />
            </button>
            <div style={{ paddingTop: "2.5rem", height: "100%" }}>{content}</div>
          </aside>
        </>
      )}
    </>
  );
}
