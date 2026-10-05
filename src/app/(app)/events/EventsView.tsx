"use client";
import { useState } from "react";
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react";
import RsvpButton from "@/components/RsvpButton";
import { googleCalendarUrl } from "@/lib/dates";
import type { Event, EventType } from "@/lib/types";

const typeColors: Record<EventType, string> = {
  workshop: "bg-blue-100 text-blue-700",
  hackathon: "bg-violet-100 text-violet-700",
  competition: "bg-orange-100 text-orange-700",
  seminar: "bg-teal-100 text-teal-700",
  practice: "bg-red-100 text-red-700",
  meeting: "bg-gray-100 text-gray-600",
  social: "bg-green-100 text-green-700",
};

const filters: { id: EventType | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "workshop", label: "Workshops" },
  { id: "hackathon", label: "Hackathons" },
  { id: "competition", label: "Competitions" },
  { id: "practice", label: "Practice" },
  { id: "social", label: "Social" },
];

function formatDate(dateStr: string) {
  return new Date(`${dateStr}T00:00:00Z`).toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    timeZone: "UTC",
  });
}

export default function EventsView({ events, rsvps }: { events: Event[]; rsvps: string[] }) {
  const [activeFilter, setActiveFilter] = useState<EventType | "all">("all");

  const sorted = [...events].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const filtered =
    activeFilter === "all"
      ? sorted
      : sorted.filter((e) => e.type === activeFilter);

  // Group by date
  const grouped = filtered.reduce<Record<string, typeof events>>((acc, ev) => {
    acc[ev.date] = [...(acc[ev.date] ?? []), ev];
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl text-gray-900">Events</h1>
        <p className="text-gray-500 text-sm mt-1">
          All upcoming events, workshops, and activities across AIT
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setActiveFilter(f.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
              activeFilter === f.id
                ? "bg-indigo-600 text-white"
                : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Events grouped by date */}
      {Object.entries(grouped).map(([date, dayEvents]) => (
        <div key={date}>
          <div className="flex items-center gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Calendar size={14} className="text-indigo-600" />
              <span className="text-sm font-semibold text-gray-800">{formatDate(date)}</span>
            </div>
            <div className="flex-1 h-px bg-gray-200" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {dayEvents.map((ev) => (
              <div
                key={ev.id}
                className="leaf"
              >
                                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-gray-900 text-sm">{ev.title}</h3>
                    <span className={`shrink-0 text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[ev.type]}`}>
                      {ev.type}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 mb-3">{ev.description}</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Clock size={11} className="text-gray-400" />
                      {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ""}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <MapPin size={11} className="text-gray-400" />
                      {ev.venue}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <div
                        className="w-2 h-2 rounded-full"
                        style={{ backgroundColor: ev.clubColor }}
                      />
                      {ev.clubName}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <RsvpButton eventId={ev.id} initiallyGoing={rsvps.includes(ev.id)} count={ev.registeredCount} maxSeats={ev.maxSeats} />
                    <a href={googleCalendarUrl(ev)} target="_blank" rel="noreferrer" className="text-xs text-gray-600 underline underline-offset-4">
                      Add to calendar
                    </a>
                    {ev.registrationLink && ev.registrationLink !== "#" && (
                      <a href={ev.registrationLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-gray-600 underline underline-offset-4">
                        <ExternalLink size={11} /> Club form
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No {activeFilter === "all" ? "" : activeFilter} events found.
        </div>
      )}
    </div>
  );
}
