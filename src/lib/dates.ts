export const CAMPUS_TZ = "Asia/Kolkata";

/** Today's date (YYYY-MM-DD) on campus, regardless of server timezone. */
export function todayISO(now = new Date()) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CAMPUS_TZ }).format(now);
}

export function addDays(iso: string, days: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

export function daysBetween(fromISO: string, toISO: string) {
  return Math.round((Date.parse(toISO.slice(0, 10)) - Date.parse(fromISO.slice(0, 10))) / 86_400_000);
}

export function campusDate(ts: string | Date) {
  return new Intl.DateTimeFormat("en-CA", { timeZone: CAMPUS_TZ }).format(new Date(ts));
}

export function campusTime(ts: string | Date) {
  return new Intl.DateTimeFormat("en-US", { timeZone: CAMPUS_TZ, hour: "numeric", minute: "2-digit" }).format(new Date(ts));
}

export function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const h = Math.floor(diff / 3_600_000);
  if (h < 1) return "just now";
  if (h < 24) return `${h}h ago`;
  return `${Math.floor(h / 24)}d ago`;
}

/** "4:00 PM" on a campus date, as a real instant. */
function campusInstant(dateISO: string, time: string) {
  const m = time.match(/(\d+):(\d+)\s*(AM|PM)/i);
  const h = m ? (+m[1] % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0) : 9;
  const min = m ? +m[2] : 0;
  return Date.UTC(+dateISO.slice(0, 4), +dateISO.slice(5, 7) - 1, +dateISO.slice(8, 10), h, min) - 330 * 60_000;
}

const icsStamp = (ms: number) => new Date(ms).toISOString().replace(/[-:]/g, "").slice(0, 15) + "Z";

export function googleCalendarUrl(e: { title: string; date: string; time: string; endTime?: string; venue: string; description: string }) {
  const start = campusInstant(e.date, e.time);
  const end = e.endTime ? campusInstant(e.date, e.endTime) : start + 3_600_000;
  const q = new URLSearchParams({
    action: "TEMPLATE",
    text: e.title,
    dates: `${icsStamp(start)}/${icsStamp(end)}`,
    location: e.venue,
    details: e.description,
  });
  return `https://calendar.google.com/calendar/render?${q}`;
}

export function weekdayShort(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString("en-US", { weekday: "short", timeZone: "UTC" });
}
