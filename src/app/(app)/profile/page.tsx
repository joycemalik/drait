import { redirect } from "next/navigation";
import { getProfile } from "@/lib/data";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import ProfileForm from "./ProfileForm";

export const metadata = { title: "Your profile" };

export default async function ProfilePage() {
  if (!isSupabaseConfigured) redirect("/today");
  const profile = await getProfile();
  if (!profile) redirect("/");

  return (
    <div style={{ maxWidth: "34rem" }}>
      <h1 className="font-display" style={{ fontSize: "2.6rem", fontWeight: 400, lineHeight: 1.05 }}>
        Your profile
      </h1>
      <p style={{ marginTop: "0.4rem", color: "var(--ink-soft)", fontSize: "0.95rem" }}>
        Your branch and semester show next to your posts, so seniors know who&apos;s asking.
      </p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.9rem", margin: "2rem 0 1.2rem" }}>
        {profile.avatarUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={profile.avatarUrl} alt="" width={48} height={48} style={{ borderRadius: "50%" }} referrerPolicy="no-referrer" />
        )}
        <span style={{ fontSize: "0.88rem", color: "var(--ink-soft)" }}>Signed in as {profile.email}</span>
      </div>
      <ProfileForm profile={profile} />
    </div>
  );
}
