"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type ActionResult = { ok: true } | { ok: false; error: string; needsSignIn?: boolean };

const DISCUSSION_CATEGORIES = ["academic", "career", "campus", "projects", "general"];
const PRIORITIES = ["urgent", "important", "info"];
const EVENT_TYPES = ["workshop", "hackathon", "competition", "seminar", "practice", "meeting", "social"];

type Authed =
  | { error: ActionResult }
  | { supabase: Awaited<ReturnType<typeof createClient>>; user: { id: string } };

async function authed(): Promise<Authed> {
  if (!isSupabaseConfigured) return { error: { ok: false, error: "This copy runs on sample data, so changes are off." } };
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) return { error: { ok: false, error: "Sign in first.", needsSignIn: true } };
  return { supabase, user: data.user };
}

const text = (fd: FormData, key: string) => String(fd.get(key) ?? "").trim();

async function clubIdFor(supabase: Awaited<ReturnType<typeof createClient>>, slug: string) {
  const { data } = await supabase.from("clubs").select("id").eq("slug", slug).maybeSingle();
  return data?.id as string | undefined;
}

function refresh() {
  revalidatePath("/", "layout");
}

export async function toggleRsvp(eventId: string): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const { data: existing } = await supabase
    .from("event_rsvps")
    .select("event_id")
    .eq("event_id", eventId)
    .eq("user_id", user.id)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("event_rsvps").delete().eq("event_id", eventId).eq("user_id", user.id)
    : await supabase.from("event_rsvps").insert({ event_id: eventId, user_id: user.id });
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function toggleVote(discussionId: string): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const { data: existing } = await supabase
    .from("discussion_votes")
    .select("discussion_id")
    .eq("discussion_id", discussionId)
    .eq("user_id", user.id)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("discussion_votes").delete().eq("discussion_id", discussionId).eq("user_id", user.id)
    : await supabase.from("discussion_votes").insert({ discussion_id: discussionId, user_id: user.id });
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function toggleMembership(clubSlug: string): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const clubId = await clubIdFor(supabase, clubSlug);
  if (!clubId) return { ok: false, error: "Club not found." };
  const { data: existing } = await supabase
    .from("club_members")
    .select("role")
    .eq("club_id", clubId)
    .eq("user_id", user.id)
    .maybeSingle();
  const { error } = existing
    ? await supabase.from("club_members").delete().eq("club_id", clubId).eq("user_id", user.id)
    : await supabase.from("club_members").insert({ club_id: clubId, user_id: user.id, role: "member" });
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

export async function createDiscussion(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const title = text(fd, "title");
  const body = text(fd, "body");
  const category = text(fd, "category");
  if (title.length < 3 || title.length > 200) return { ok: false, error: "Give it a title (3–200 characters)." };
  if (body.length > 10000) return { ok: false, error: "That's a bit long. Keep it under 10,000 characters." };
  if (!DISCUSSION_CATEGORIES.includes(category)) return { ok: false, error: "Pick a topic." };

  const { data, error } = await supabase
    .from("discussions")
    .insert({ author_id: user.id, title, body, category })
    .select("id")
    .single();
  if (error) return { ok: false, error: error.message };
  refresh();
  redirect(`/community/${data.id}`);
}

export async function replyToDiscussion(discussionId: string, _prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const body = text(fd, "body");
  if (body.length < 1 || body.length > 5000) return { ok: false, error: "Write something (up to 5,000 characters)." };
  const { error } = await supabase
    .from("discussion_replies")
    .insert({ discussion_id: discussionId, author_id: user.id, body });
  if (error) return { ok: false, error: error.message };
  revalidatePath(`/community/${discussionId}`);
  return { ok: true };
}

export async function postAnnouncement(clubSlug: string, _prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const clubId = await clubIdFor(supabase, clubSlug);
  if (!clubId) return { ok: false, error: "Club not found." };
  const title = text(fd, "title");
  const body = text(fd, "body");
  const priority = text(fd, "priority") || "info";
  if (title.length < 3) return { ok: false, error: "Add a title." };
  if (!PRIORITIES.includes(priority)) return { ok: false, error: "Unknown priority." };

  const { error } = await supabase
    .from("announcements")
    .insert({ club_id: clubId, title, body, priority, author_id: user.id });
  // RLS rejects non-admins; say so plainly.
  if (error) return { ok: false, error: error.code === "42501" ? "Only this club's leads can post here." : error.message };
  refresh();
  return { ok: true };
}

export async function createEvent(clubSlug: string, _prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const clubId = await clubIdFor(supabase, clubSlug);
  if (!clubId) return { ok: false, error: "Club not found." };

  const title = text(fd, "title");
  const date = text(fd, "date");
  const start = text(fd, "start");
  const end = text(fd, "end");
  const type = text(fd, "type") || "meeting";
  const seats = text(fd, "max_seats");
  if (title.length < 3) return { ok: false, error: "Add a title." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(start)) return { ok: false, error: "Pick a date and start time." };
  if (end && !/^\d{2}:\d{2}$/.test(end)) return { ok: false, error: "End time looks wrong." };
  if (!EVENT_TYPES.includes(type)) return { ok: false, error: "Unknown event type." };

  // Times are entered in campus time (IST, +05:30).
  const { error } = await supabase.from("events").insert({
    club_id: clubId,
    title,
    description: text(fd, "description"),
    venue: text(fd, "venue"),
    type,
    starts_at: `${date}T${start}:00+05:30`,
    ends_at: end ? `${date}T${end}:00+05:30` : null,
    max_seats: seats ? Math.max(1, parseInt(seats, 10) || 0) || null : null,
    created_by: user.id,
  });
  if (error) return { ok: false, error: error.code === "42501" ? "Only this club's leads can add events." : error.message };
  refresh();
  return { ok: true };
}
