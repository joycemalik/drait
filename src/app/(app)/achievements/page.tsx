import AchievementsView from "./AchievementsView";
import { getAchievements, getClubs, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Achievements" };

export default async function AchievementsPage() {
  const [achievements, clubs, viewer] = await Promise.all([getAchievements(), getClubs(), getViewer()]);
  const canVerify = (clubSlug?: string) =>
    !!viewer && (viewer.isSiteAdmin || (!!clubSlug && viewer.clubs.some((m) => m.slug === clubSlug && m.role !== "member")));

  return (
    <AchievementsView
      achievements={achievements.map((a) => ({ ...a, canVerify: canVerify(a.clubSlug) }))}
      clubs={clubs.map((c) => ({ slug: c.slug, name: c.name }))}
      signedIn={!!viewer}
      configured={isSupabaseConfigured}
    />
  );
}
