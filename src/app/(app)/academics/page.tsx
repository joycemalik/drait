import AcademicsView from "./AcademicsView";
import { getAcademicResources, getProfile, getViewer } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Study resources" };

export default async function AcademicsPage() {
  const [resources, viewer, profile] = await Promise.all([getAcademicResources(), getViewer(), getProfile()]);
  const sem = parseInt(profile?.year ?? "", 10);
  return (
    <AcademicsView
      resources={resources}
      viewerId={viewer?.id}
      isAdmin={viewer?.isSiteAdmin ?? false}
      signedIn={!!viewer}
      configured={isSupabaseConfigured}
      initialDepartment={profile?.branch?.toLowerCase() || "cse"}
      initialSemester={sem >= 1 && sem <= 8 ? sem : 0}
    />
  );
}
