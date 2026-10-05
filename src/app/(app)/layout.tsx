import AppShell from "@/components/AppShell";
import { getClubs, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const [viewer, clubs] = await Promise.all([getViewer(), getClubs()]);

  const mine = viewer ? clubs.filter((c) => viewer.clubs.some((m) => m.slug === c.slug)) : [];
  const shown = mine.length > 0 ? mine : clubs.filter((c) => c.featured).slice(0, 4);

  return (
    <AppShell
      viewer={viewer && { name: viewer.name, avatarUrl: viewer.avatarUrl }}
      clubs={shown.map((c) => ({ slug: c.slug, name: c.name, color: c.color }))}
      clubsLabel={mine.length > 0 ? "Your clubs" : "Clubs to explore"}
      configured={isSupabaseConfigured}
    >
      {children}
    </AppShell>
  );
}
