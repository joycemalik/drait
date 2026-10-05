import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
import { getClubs, getDiscussions } from "@/lib/data";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const pages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["", 1, "daily"],
    ["/clubs", 0.9, "weekly"],
    ["/events", 0.9, "daily"],
    ["/announcements", 0.8, "daily"],
    ["/community", 0.8, "daily"],
    ["/academics", 0.7, "weekly"],
    ["/achievements", 0.6, "weekly"],
    ["/opportunities", 0.6, "weekly"],
    ["/about", 0.5, "monthly"],
    ["/privacy", 0.2, "yearly"],
    ["/terms", 0.2, "yearly"],
  ];
  const [clubs, discussions] = await Promise.all([getClubs(), getDiscussions()]);
  return [
    ...pages.map(([path, priority, changeFrequency]) => ({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency, priority })),
    ...clubs.map((c) => ({ url: `${SITE_URL}/clubs/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.7 })),
    ...discussions.map((d) => ({ url: `${SITE_URL}/community/${d.id}`, lastModified: new Date(d.postedAt), changeFrequency: "weekly" as const, priority: 0.5 })),
  ];
}
