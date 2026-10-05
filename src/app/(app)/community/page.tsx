import CommunityView from "./CommunityView";
import { getDiscussions, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Community" };

export default async function CommunityPage() {
  const [discussions, viewer] = await Promise.all([getDiscussions(), getViewer()]);
  return <CommunityView discussions={discussions} votes={viewer?.votes ?? []} signedIn={!!viewer} configured={isSupabaseConfigured} />;
}
