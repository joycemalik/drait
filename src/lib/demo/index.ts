import { demoClubs } from "./clubs";
import { demoEvents } from "./events";
import { demoAnnouncements } from "./announcements";
import { demoDiscussions } from "./discussions";
import { demoOpportunities } from "./opportunities";
import { todayISO } from "@/lib/dates";

// Demo content was written as if "today" were this date; it is shifted so it always looks current.
const AUTHORED_ON = "2026-09-21";

function dayShift() {
  return Math.round((Date.parse(todayISO()) - Date.parse(AUTHORED_ON)) / 86_400_000);
}

function shiftDate(iso: string, days: number) {
  const d = new Date(iso.length === 10 ? `${iso}T00:00:00Z` : `${iso}Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return iso.length === 10 ? d.toISOString().slice(0, 10) : d.toISOString().slice(0, 19);
}

export function getDemo() {
  const s = dayShift();
  return {
    clubs: demoClubs,
    events: demoEvents.map((e) => ({ ...e, date: shiftDate(e.date, s) })),
    announcements: demoAnnouncements.map((a) => ({ ...a, postedAt: shiftDate(a.postedAt, s) })),
    discussions: demoDiscussions.map((d) => ({ ...d, postedAt: shiftDate(d.postedAt, s) })),
    opportunities: demoOpportunities.map((o) => ({ ...o, deadline: shiftDate(o.deadline, s) })),
  };
}
