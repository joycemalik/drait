"use client";
import { useState } from "react";
import { Megaphone, Clock } from "lucide-react";
import type { Announcement, Club } from "@/lib/types";

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

export default function AnnouncementsView({ announcements, clubs }: { announcements: Announcement[]; clubs: Club[] }) {
  const [filter, setFilter] = useState<string>("all");

  const filtered =
    filter === "all"
      ? announcements
      : announcements.filter((a) => a.clubSlug === filter);

  const sortedAnnouncements = [...filtered].sort((a, b) => {
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    return new Date(b.postedAt).getTime() - new Date(a.postedAt).getTime();
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-gray-900">Announcements</h1>
        <p className="text-gray-500 text-sm mt-1">
          Official announcements from clubs and college administration
        </p>
      </div>

      {/* Filter by club */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          All Clubs
        </button>
        {clubs.map((c) => (
          <button
            key={c.slug}
            onClick={() => setFilter(c.slug)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              filter === c.slug
                ? "text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
            style={filter === c.slug ? { backgroundColor: c.color } : {}}
          >
            {c.shortName}
          </button>
        ))}
      </div>

      {/* Announcements list */}
      <div className="space-y-3">
        {sortedAnnouncements.map((ann) => (
          <div
            key={ann.id}
            className={`bg-white rounded-xl border p-5 ${
              ann.priority === "urgent"
                ? "border-red-200 bg-red-50"
                : ann.priority === "important"
                ? "border-amber-200 bg-amber-50"
                : "border-gray-200"
            } ${ann.pinned ? "ring-1 ring-indigo-200" : ""}`}
          >
            <div className="flex items-start gap-3">
              <Megaphone
                size={18}
                className={
                  ann.priority === "urgent"
                    ? "text-red-500 mt-0.5 shrink-0"
                    : ann.priority === "important"
                    ? "text-amber-500 mt-0.5 shrink-0"
                    : "text-gray-400 mt-0.5 shrink-0"
                }
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  {ann.pinned && (
                    <span className="text-xs bg-indigo-100 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                      📌 Pinned
                    </span>
                  )}
                  <span
                    className={`text-xs font-bold px-1.5 py-0.5 rounded ${
                      ann.priority === "urgent"
                        ? "bg-red-100 text-red-600"
                        : ann.priority === "important"
                        ? "bg-amber-100 text-amber-600"
                        : "bg-blue-100 text-blue-600"
                    }`}
                  >
                    {ann.priority.toUpperCase()}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900">{ann.title}</h3>
                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{ann.body}</p>
                <div className="flex items-center gap-3 mt-3">
                  <div
                    className="flex items-center gap-1.5 text-xs font-medium"
                    style={{ color: ann.clubColor }}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: ann.clubColor }} />
                    {ann.clubName}
                  </div>
                  <span className="text-xs text-gray-400">by {ann.author}</span>
                  <div className="flex items-center gap-1 text-xs text-gray-400 ml-auto">
                    <Clock size={11} />
                    {timeAgo(ann.postedAt)}
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No announcements from this club yet.
        </div>
      )}
    </div>
  );
}
