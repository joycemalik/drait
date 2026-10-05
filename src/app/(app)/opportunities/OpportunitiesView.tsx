"use client";
import { useState } from "react";
import { Rocket, Calendar, ExternalLink, Trophy, Briefcase, BookOpen, Star } from "lucide-react";
import { daysBetween, todayISO } from "@/lib/dates";
import type { Opportunity, OpportunityType } from "@/lib/types";

const typeConfig: Record<
  OpportunityType,
  { label: string; color: string; icon: React.ElementType }
> = {
  hackathon: { label: "Hackathon", color: "bg-violet-100 text-violet-700", icon: Rocket },
  internship: { label: "Internship", color: "bg-blue-100 text-blue-700", icon: Briefcase },
  competition: { label: "Competition", color: "bg-orange-100 text-orange-700", icon: Trophy },
  scholarship: { label: "Scholarship", color: "bg-yellow-100 text-yellow-700", icon: Star },
  research: { label: "Research", color: "bg-teal-100 text-teal-700", icon: BookOpen },
  certification: { label: "Certification", color: "bg-green-100 text-green-700", icon: BookOpen },
};

export default function OpportunitiesView({ opportunities }: { opportunities: Opportunity[] }) {
  const [filter, setFilter] = useState<OpportunityType | "all">("all");

  const filtered =
    filter === "all" ? opportunities : opportunities.filter((o) => o.type === filter);

  function daysUntil(deadline: string) {
    const diff = daysBetween(todayISO(), deadline);
    if (diff < 0) return { label: "Closed", urgent: false };
    if (diff === 0) return { label: "Today!", urgent: true };
    if (diff <= 7) return { label: `${diff}d left`, urgent: true };
    return { label: `${diff}d left`, urgent: false };
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-gray-900">Opportunities</h1>
        <p className="text-gray-500 text-sm mt-1">
          Hackathons, internships, competitions, scholarships and more
        </p>
      </div>

      {/* Type filters */}
      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
            filter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          All
        </button>
        {(Object.keys(typeConfig) as OpportunityType[]).map((type) => {
          const cfg = typeConfig[type];
          return (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                filter === type
                  ? "bg-indigo-600 text-white"
                  : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
              }`}
            >
              {cfg.label}
            </button>
          );
        })}
      </div>

      {/* Featured */}
      {filter === "all" && (
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">🔥 Featured</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {opportunities.filter((o) => o.featured).map((opp) => (
              <OpportunityCard key={opp.id} opp={opp} daysUntil={daysUntil} />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered
          .filter((o) => filter !== "all" || !o.featured)
          .map((opp) => (
            <OpportunityCard key={opp.id} opp={opp} daysUntil={daysUntil} />
          ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No opportunities found in this category.
        </div>
      )}
    </div>
  );
}

function OpportunityCard({
  opp,
  daysUntil,
}: {
  opp: Opportunity;
  daysUntil: (d: string) => { label: string; urgent: boolean };
}) {
  const cfg = typeConfig[opp.type];
  const Icon = cfg.icon;
  const deadline = daysUntil(opp.deadline);

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-indigo-200 hover:shadow-sm transition-all p-5 flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className={`p-2 rounded-lg ${cfg.color.replace("text-", "text-").split(" ")[0]}`}>
          <Icon size={16} className={cfg.color.split(" ")[1]} />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${cfg.color}`}>
          {cfg.label}
        </span>
      </div>
      <h3 className="font-semibold text-gray-900 leading-snug">{opp.title}</h3>
      <p className="text-xs text-gray-500 mt-0.5 mb-2">{opp.organizer}</p>
      <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed flex-1">{opp.description}</p>
      {opp.prize && (
        <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
          🏆 {opp.prize}
        </p>
      )}
      {opp.stipend && (
        <p className="text-xs text-emerald-600 font-medium mt-2 flex items-center gap-1">
          💰 {opp.stipend}
        </p>
      )}
      <div className="flex flex-wrap gap-1 mt-3">
        {opp.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
        <div className="flex items-center gap-1.5 text-xs">
          <Calendar size={11} className="text-gray-400" />
          <span className="text-gray-500">
            {new Date(opp.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
          </span>
          <span
            className={`font-semibold ${deadline.urgent ? "text-red-600" : "text-gray-600"}`}
          >
            · {deadline.label}
          </span>
        </div>
        <a
          href={opp.link}
          className="text-xs text-indigo-600 hover:underline flex items-center gap-1"
        >
          Apply <ExternalLink size={11} />
        </a>
      </div>
    </div>
  );
}
