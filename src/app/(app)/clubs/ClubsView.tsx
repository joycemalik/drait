"use client";
import Link from "next/link";
import { useState } from "react";
import { Users, ArrowUpRight } from "lucide-react";
import type { Club, ClubCategory } from "@/lib/types";

const categoryConfig: Record<ClubCategory, { label: string; color: string }> = {
  technical: { label: "Technical", color: "#7c6fe0" },
  sports:    { label: "Sports",    color: "#f87171" },
  cultural:  { label: "Cultural",  color: "#fbbf24" },
  social:    { label: "Social",    color: "#34d399" },
};

export default function ClubsView({ clubs }: { clubs: Club[] }) {
  const [activeCategory, setActiveCategory] = useState<ClubCategory | "all">("all");

  const grouped = clubs.reduce<Record<string, typeof clubs>>((acc, c) => {
    (acc[c.category] ??= []).push(c);
    return acc;
  }, {}) as Record<ClubCategory, typeof clubs>;

  const filtered = activeCategory === "all"
    ? clubs
    : (grouped[activeCategory] ?? []);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>

      {/* Header */}
      <div>
        <h1 style={{ fontSize: "1.875rem", fontWeight: 700, letterSpacing: "-0.03em", color: "var(--text)" }}>
          Clubs
        </h1>
        <p style={{ fontSize: "0.9rem", color: "var(--muted)", marginTop: "0.375rem" }}>
          {clubs.length} active clubs at Dr. Ambedkar Institute of Technology
        </p>
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {(["all", ...Object.keys(categoryConfig)] as Array<"all" | ClubCategory>).map((cat) => {
          const active = activeCategory === cat;
          const color = cat === "all" ? "var(--accent)" : categoryConfig[cat].color;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "0.35rem 0.875rem",
                borderRadius: "999px",
                fontSize: "0.8125rem",
                fontWeight: active ? 500 : 400,
                cursor: "pointer",
                border: `1px solid ${active ? color : "var(--border)"}`,
                background: active ? `${color}14` : "transparent",
                color: active ? color : "var(--muted)",
                transition: "all 0.15s",
              }}
            >
              {cat === "all" ? "All" : categoryConfig[cat].label}
            </button>
          );
        })}
      </div>

      {/* Club grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(17rem, 1fr))", gap: "1px", border: "1px solid var(--border)", borderRadius: "18px 24px 16px 22px", overflow: "hidden" }}>
        {filtered.map((club) => (
          <Link
            key={club.id}
            href={`/clubs/${club.slug}`}
            style={{
              display: "flex",
              flexDirection: "column",
              padding: "1.25rem",
              background: "var(--surface)",
              textDecoration: "none",
              borderBottom: "1px solid var(--border)",
              transition: "background 0.15s",
            }}
          >
            {/* Top row */}
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "0.875rem" }}>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "2.75rem",
                  height: "2.75rem",
                  borderRadius: "16px 20px 14px 18px",
                  background: `${club.color}18`,
                  border: `1px solid ${club.color}35`,
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  color: club.color,
                  flexShrink: 0,
                }}
              >
                {club.shortName}
              </div>
              <span
                style={{
                  fontSize: "0.7rem",
                  fontWeight: 500,
                  padding: "0.2rem 0.55rem",
                  borderRadius: "4px",
                  background: `${categoryConfig[club.category]?.color ?? club.color}14`,
                  color: categoryConfig[club.category]?.color ?? club.color,
                  letterSpacing: "0.02em",
                }}
              >
                {categoryConfig[club.category]?.label}
              </span>
            </div>

            {/* Name + tagline */}
            <h3 style={{ fontSize: "0.9375rem", fontWeight: 600, color: "var(--text)", marginBottom: "0.25rem", lineHeight: 1.3 }}>
              {club.name}
            </h3>
            <p style={{ fontSize: "0.8rem", color: "var(--muted)", lineHeight: 1.5, flex: 1, marginBottom: "0.875rem" }}>
              {club.tagline}
            </p>

            {/* Footer */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "0.35rem", color: "var(--faint)" }}>
                <Users size={12} />
                <span style={{ fontSize: "0.775rem" }}>{club.memberCount} members</span>
              </div>
              <span style={{ fontSize: "0.775rem", color: "var(--accent)", display: "flex", alignItems: "center", gap: "0.2rem" }}>
                View <ArrowUpRight size={11} />
              </span>
            </div>

            {/* Tags */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.375rem", marginTop: "0.75rem" }}>
              {club.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    fontSize: "0.7rem",
                    padding: "0.15rem 0.5rem",
                    borderRadius: "4px",
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid var(--border)",
                    color: "var(--faint)",
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

    </div>
  );
}
