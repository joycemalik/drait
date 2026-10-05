import AnnouncementsView from "./AnnouncementsView";
import { getAnnouncements, getClubs } from "@/lib/data";

export const metadata = { title: "Announcements" };

export default async function AnnouncementsPage() {
  const [announcements, clubs] = await Promise.all([getAnnouncements({ limit: 100 }), getClubs()]);
  return <AnnouncementsView announcements={announcements} clubs={clubs} />;
}
