import EventsView from "./EventsView";
import { getEvents, getViewer } from "@/lib/data";
import { todayISO } from "@/lib/dates";

export const metadata = { title: "Events" };

export default async function EventsPage() {
  const [events, viewer] = await Promise.all([getEvents({ from: todayISO(), days: 90 }), getViewer()]);
  return <EventsView events={events} rsvps={viewer?.rsvps ?? []} />;
}
