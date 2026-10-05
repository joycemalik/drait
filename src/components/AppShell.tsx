"use client";
import { useState } from "react";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

export interface ShellViewer {
  name: string;
  avatarUrl?: string;
}
export interface ShellClub {
  slug: string;
  name: string;
  color: string;
}

export default function AppShell({
  children,
  viewer,
  clubs,
  clubsLabel,
  configured,
}: {
  children: React.ReactNode;
  viewer: ShellViewer | null;
  clubs: ShellClub[];
  clubsLabel: string;
  configured: boolean;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Navbar onMenuToggle={() => setOpen((o) => !o)} viewer={viewer} configured={configured} />
      <Sidebar open={open} onClose={() => setOpen(false)} clubs={clubs} clubsLabel={clubsLabel} />
      <main className="main-content" style={{ paddingTop: "3.75rem", minHeight: "100vh", position: "relative" }}>
        <div style={{ maxWidth: "58rem", margin: "0 auto", padding: "2rem 1.25rem 4rem" }}>{children}</div>
      </main>
    </>
  );
}
