"use client";
import Link from "next/link";
import { Menu, Search } from "lucide-react";
import Mark from "./Mark";
import ThemeToggle from "./ThemeToggle";
import AuthButton from "./AuthButton";
import type { ShellViewer } from "./AppShell";

export default function Navbar({
  onMenuToggle,
  viewer,
  configured,
}: {
  onMenuToggle: () => void;
  viewer: ShellViewer | null;
  configured: boolean;
}) {
  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        height: "3.75rem",
        display: "flex",
        alignItems: "center",
        padding: "0 1.25rem",
        gap: "0.9rem",
        background: "color-mix(in srgb, var(--paper) 88%, transparent)",
        backdropFilter: "blur(10px)",
      }}
    >
      <button onClick={onMenuToggle} className="lg:hidden" style={{ color: "var(--ink-soft)" }} aria-label="Open menu">
        <Menu size={20} />
      </button>

      <Link href="/" style={{ display: "flex", alignItems: "center", gap: "0.5rem", textDecoration: "none" }}>
        <Mark />
        <span className="font-display" style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)" }}>
          AIT Hub
        </span>
      </Link>

      <label
        style={{
          flex: 1,
          maxWidth: "22rem",
          marginLeft: "1rem",
          display: "flex",
          alignItems: "center",
          gap: "0.5rem",
          padding: "0.4rem 0.9rem",
          borderRadius: "999px",
          background: "var(--paper-deep)",
          color: "var(--ink-faint)",
        }}
      >
        <Search size={14} />
        <input
          type="search"
          placeholder="Search AIT Hub"
          style={{ background: "transparent", border: 0, outline: "none", width: "100%", fontSize: "0.85rem", color: "var(--ink)" }}
        />
      </label>

      <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <ThemeToggle />
        {viewer ? (
          <form action="/auth/signout" method="post" style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
            <Link href="/profile" aria-label="Your profile" style={{ lineHeight: 0 }}>
            {viewer.avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={viewer.avatarUrl} alt="" width={30} height={30} style={{ borderRadius: "50%" }} referrerPolicy="no-referrer" />
            ) : (
              <span
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "var(--sal)",
                  color: "var(--paper)",
                  display: "grid",
                  placeItems: "center",
                  fontSize: "0.8rem",
                  fontWeight: 600,
                }}
              >
                {viewer.name.slice(0, 1)}
              </span>
            )}
            </Link>
            <button style={{ fontSize: "0.8rem", color: "var(--ink-soft)" }}>Sign out</button>
          </form>
        ) : (
          <AuthButton
            configured={configured}
            style={{
              fontSize: "0.85rem",
              padding: "0.4rem 0.95rem",
              borderRadius: "999px",
              background: "var(--ink)",
              color: "var(--paper)",
            }}
          >
            Sign in
          </AuthButton>
        )}
      </div>
    </header>
  );
}
