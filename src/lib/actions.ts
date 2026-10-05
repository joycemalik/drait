"use server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, supabaseUrl } from "@/lib/supabase/env";
import { DEPARTMENTS as COLLEGE_DEPARTMENTS, departmentShort } from "@/lib/college";

export type ActionResult = { ok: true } | { ok: false; error: string; needsSignIn?: boolean };

const DISCUSSION_CATEGORIES = ["academic", "career", "campus", "projects", "general"];
const PRIORITIES = ["urgent", "important", "info"];
const DEPARTMENTS: string[] = COLLEGE_DEPARTMENTS.map((d) => d.id);
const RESOURCE_KINDS = ["notes", "pyq", "lab", "reference", "other"];
const ACHIEVEMENT_CATEGORIES = ["hackathon", "competition", "certification", "research", "sports", "design", "other"];
const YEARS = ["1st Sem", "2nd Sem", "3rd Sem", "4th Sem", "5th Sem", "6th Sem", "7th Sem", "8th Sem", "Alumni", "Faculty"];


function isHttpUrl(v: string) {
  try {
    const u = new URL(v);
    return u.protocol === "https:" || u.protocol === "http:";
  } catch {
    return false;
  }
}

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

export async function shareResource(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const title = text(fd, "title");
  const subject = text(fd, "subject");
  const department = text(fd, "department");
  const kind = text(fd, "kind");
  const url = text(fd, "url");
  const semester = parseInt(text(fd, "semester"), 10);
  if (title.length < 3 || title.length > 200) return { ok: false, error: "Add a title (3–200 characters)." };
  if (subject.length < 2 || subject.length > 120) return { ok: false, error: "Add the subject name." };
  if (!DEPARTMENTS.includes(department)) return { ok: false, error: "Pick a department." };
  if (!(semester >= 1 && semester <= 8)) return { ok: false, error: "Pick a semester." };
  if (!RESOURCE_KINDS.includes(kind)) return { ok: false, error: "Pick a type." };
  if (!isHttpUrl(url) || url.length > 2000) return { ok: false, error: "Paste a full link starting with https://" };

  const { error } = await supabase
    .from("academic_resources")
    .insert({ title, subject, department, semester, kind, url, submitted_by: user.id });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/academics");
  return { ok: true };
}

export async function removeResource(id: string): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { error, count } = await a.supabase.from("academic_resources").delete({ count: "exact" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  if (!count) return { ok: false, error: "You can only remove links you shared." };
  revalidatePath("/academics");
  return { ok: true };
}

export async function submitAchievement(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const title = text(fd, "title");
  const people = text(fd, "people");
  const category = text(fd, "category");
  const achievedOn = text(fd, "achieved_on");
  const clubSlug = text(fd, "club");
  const link = text(fd, "link");
  if (title.length < 3 || title.length > 200) return { ok: false, error: "Add a title (3–200 characters)." };
  if (people.length < 2 || people.length > 200) return { ok: false, error: "Say who achieved it." };
  if (!ACHIEVEMENT_CATEGORIES.includes(category)) return { ok: false, error: "Pick a category." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(achievedOn)) return { ok: false, error: "Add the date." };
  if (link && (!isHttpUrl(link) || link.length > 2000)) return { ok: false, error: "The link should start with https://" };

  const clubId = clubSlug ? await clubIdFor(supabase, clubSlug) : null;
  const { error } = await supabase.from("achievements").insert({
    title,
    people,
    team: text(fd, "team") || null,
    club_id: clubId ?? null,
    category,
    achieved_on: achievedOn,
    description: text(fd, "description").slice(0, 2000),
    link: link || null,
    submitted_by: user.id,
  });
  if (error) return { ok: false, error: error.message };
  revalidatePath("/achievements");
  return { ok: true };
}

export async function setAchievementVerified(id: string, verified: boolean): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { error, count } = await a.supabase.from("achievements").update({ verified }, { count: "exact" }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  if (!count) return { ok: false, error: "Only the club's leads can verify this." };
  revalidatePath("/achievements");
  return { ok: true };
}

const handle = (v: string) =>
  v
    .trim()
    .replace(/^https?:\/\/(www\.)?(github\.com|linkedin\.com\/in|instagram\.com)\//i, "")
    .replace(/^@/, "")
    .replace(/\/+$/, "");

export async function updateProfile(_prev: ActionResult | null, fd: FormData): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const fullName = text(fd, "full_name");
  const department = text(fd, "department");
  const year = text(fd, "year");
  const section = text(fd, "section").toUpperCase();
  const bio = text(fd, "bio");
  const skills = text(fd, "skills")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean)
    .map((x) => x.slice(0, 30));
  const github = handle(text(fd, "github"));
  const linkedin = handle(text(fd, "linkedin"));
  const instagram = handle(text(fd, "instagram"));
  let website = text(fd, "website");
  if (website && !/^https?:\/\//i.test(website)) website = `https://${website}`;

  if (fullName.length < 2 || fullName.length > 80) return { ok: false, error: "Add your name (2–80 characters)." };
  if (department && !DEPARTMENTS.includes(department)) return { ok: false, error: "Pick your department." };
  if (year && !YEARS.includes(year)) return { ok: false, error: "Pick your semester." };
  if (section && !/^[A-Z]$/.test(section)) return { ok: false, error: "Section should be a single letter, like A." };
  if (bio.length > 280) return { ok: false, error: "Keep your bio under 280 characters." };
  if (skills.length > 12) return { ok: false, error: "Up to 12 skills, separated by commas." };
  if (github && !/^[A-Za-z0-9-]{1,39}$/.test(github)) return { ok: false, error: "That GitHub username doesn't look right." };
  if (linkedin && !/^[A-Za-z0-9-]{3,100}$/.test(linkedin)) return { ok: false, error: "Use the part after linkedin.com/in/." };
  if (instagram && !/^[A-Za-z0-9._]{1,30}$/.test(instagram)) return { ok: false, error: "That Instagram handle doesn't look right." };
  if (website && (!isHttpUrl(website) || website.length > 200 || website.startsWith("http:")))
    return { ok: false, error: "Website should be a full https:// link." };

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name: fullName,
      department: department || null,
      branch: departmentShort(department) || null,
      year: year || null,
      section: section || null,
      bio: bio || null,
      skills,
      github: github || null,
      linkedin: linkedin || null,
      instagram: instagram || null,
      website: website || null,
    })
    .eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}

/** Saves the URL of a picture the student just uploaded to their own avatars folder. */
export async function setAvatar(url: string): Promise<ActionResult> {
  const a = await authed();
  if ("error" in a) return a.error;
  const { supabase, user } = a;
  const prefix = `${supabaseUrl}/storage/v1/object/public/avatars/${user.id}/`;
  if (!url.startsWith(prefix) || url.length > 400) return { ok: false, error: "That upload didn't come from your account." };
  const { error } = await supabase.from("profiles").update({ avatar_url: url }).eq("id", user.id);
  if (error) return { ok: false, error: error.message };
  refresh();
  return { ok: true };
}
