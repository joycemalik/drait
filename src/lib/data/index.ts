import "server-only";
import { cache } from "react";
import { connection } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createClient } from "@/lib/supabase/server";
import { getDemo } from "@/lib/demo";
import { campusDate, campusTime, todayISO, addDays } from "@/lib/dates";
import type { Announcement, Club, Discussion, Event, Opportunity } from "@/lib/types";

/* eslint-disable @typescript-eslint/no-explicit-any -- rows are mapped field by field below */

const toClub = (r: any): Club => ({
  id: r.id,
  slug: r.slug,
  name: r.name,
  shortName: r.short_name,
  tagline: r.tagline,
  description: r.description,
  category: r.category,
  color: r.color,
  memberCount: r.member_count,
  foundedYear: r.founded_year ?? 0,
  externalLink: r.external_link ?? undefined,
  instagramLink: r.instagram_link ?? undefined,
  leads: r.leads ?? [],
  tags: r.tags ?? [],
  featured: r.featured,
});

const toEvent = (r: any): Event => ({
  id: r.id,
  title: r.title,
  clubSlug: r.club_slug,
  clubName: r.club_name,
  clubColor: r.club_color,
  type: r.type,
  date: campusDate(r.starts_at),
  time: campusTime(r.starts_at),
  endTime: r.ends_at ? campusTime(r.ends_at) : undefined,
  venue: r.venue,
  description: r.description,
  registrationLink: r.registration_link ?? undefined,
  maxSeats: r.max_seats ?? undefined,
  registeredCount: r.rsvp_count,
  tags: r.tags ?? [],
  featured: r.featured,
  image: r.image_url ?? undefined,
});

const toAnnouncement = (r: any): Announcement => ({
  id: r.id,
  title: r.title,
  body: r.body,
  clubSlug: r.club_slug,
  clubName: r.club_name,
  clubColor: r.club_color,
  priority: r.priority,
  postedAt: r.created_at,
  author: r.author_display,
  pinned: r.pinned,
});

const toDiscussion = (r: any): Discussion => ({
  id: r.id,
  title: r.title,
  body: r.body,
  author: r.author_display,
  authorYear: r.author_year_display,
  category: r.category,
  subcategory: r.subcategory,
  postedAt: r.created_at,
  upvotes: r.upvotes,
  replyCount: r.reply_count,
  tags: r.tags ?? [],
  pinned: r.pinned,
  solved: r.solved,
});

const toOpportunity = (r: any): Opportunity => ({
  id: r.id,
  title: r.title,
  type: r.type,
  organizer: r.organizer,
  deadline: r.deadline,
  eligibility: r.eligibility,
  prize: r.prize ?? undefined,
  stipend: r.stipend ?? undefined,
  description: r.description,
  link: r.link,
  tags: r.tags ?? [],
  featured: r.featured,
});

// Sample data is shifted to "today", so it must be read per request, never baked in at build time.
async function demo() {
  await connection();
  return getDemo();
}

function must<T>(res: { data: T | null; error: { message: string } | null }): T {
  if (res.error) throw new Error(res.error.message);
  return res.data as T;
}

export const getClubs = cache(async (): Promise<Club[]> => {
  if (!isSupabaseConfigured) return (await demo()).clubs;
  const sb = await createClient();
  return must(await sb.from("clubs").select("*").order("name")).map(toClub);
});

export const getClubBySlug = cache(async (slug: string): Promise<Club | undefined> => {
  return (await getClubs()).find((c) => c.slug === slug);
});

/** Events from `from` (inclusive, YYYY-MM-DD) for `days` days, oldest first. */
export const getEvents = cache(
  async (opts: { from?: string; days?: number; clubSlug?: string } = {}): Promise<Event[]> => {
    const from = opts.from ?? todayISO();
    const to = opts.days ? addDays(from, opts.days) : undefined;

    let events: Event[];
    if (!isSupabaseConfigured) {
      events = (await demo()).events;
    } else {
      const sb = await createClient();
      // Widen by a day on each side for timezone edges; filtered precisely below.
      let q = sb.from("events_view").select("*").gte("starts_at", addDays(from, -1));
      if (to) q = q.lt("starts_at", addDays(to, 1));
      if (opts.clubSlug) q = q.eq("club_slug", opts.clubSlug);
      events = must(await q.order("starts_at")).map(toEvent);
    }

    return events
      .filter((e) => e.date >= from && (!to || e.date < to))
      .filter((e) => !opts.clubSlug || e.clubSlug === opts.clubSlug)
      .sort((a, b) => a.date.localeCompare(b.date) || toMinutes(a.time) - toMinutes(b.time));
  },
);

function toMinutes(t: string) {
  const m = t.match(/(\d+):(\d+)\s*(AM|PM)/i);
  if (!m) return 0;
  return ((+m[1] % 12) + (m[3].toUpperCase() === "PM" ? 12 : 0)) * 60 + +m[2];
}

export const getAnnouncements = cache(
  async (opts: { limit?: number; clubSlug?: string } = {}): Promise<Announcement[]> => {
    let list: Announcement[];
    if (!isSupabaseConfigured) {
      list = (await demo()).announcements.filter((a) => !opts.clubSlug || a.clubSlug === opts.clubSlug);
    } else {
      const sb = await createClient();
      let q = sb.from("announcements_view").select("*").order("created_at", { ascending: false });
      if (opts.clubSlug) q = q.eq("club_slug", opts.clubSlug);
      if (opts.limit) q = q.limit(opts.limit);
      list = must(await q).map(toAnnouncement);
    }
    list.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    return opts.limit ? list.slice(0, opts.limit) : list;
  },
);

export const getDiscussions = cache(async (): Promise<Discussion[]> => {
  if (!isSupabaseConfigured) return (await demo()).discussions;
  const sb = await createClient();
  return must(await sb.from("discussions_view").select("*").order("created_at", { ascending: false })).map(
    toDiscussion,
  );
});

export interface Reply {
  id: string;
  body: string;
  author: string;
  avatarUrl?: string;
  createdAt: string;
}

export async function getReplies(discussionId: string): Promise<Reply[]> {
  if (!isSupabaseConfigured) return [];
  const sb = await createClient();
  const rows = must(
    await sb
      .from("discussion_replies")
      .select("id, body, created_at, profiles(full_name, avatar_url)")
      .eq("discussion_id", discussionId)
      .order("created_at"),
  ) as any[];
  return rows.map((r) => ({
    id: r.id,
    body: r.body,
    author: r.profiles?.full_name ?? "A student",
    avatarUrl: r.profiles?.avatar_url ?? undefined,
    createdAt: r.created_at,
  }));
}

export const getOpportunities = cache(async (): Promise<Opportunity[]> => {
  if (!isSupabaseConfigured) return (await demo()).opportunities;
  const sb = await createClient();
  return must(await sb.from("opportunities").select("*").order("deadline")).map(toOpportunity);
});

export interface Viewer {
  id: string;
  name: string;
  avatarUrl?: string;
  rsvps: string[];
  votes: string[];
  clubs: { slug: string; role: string }[];
  isSiteAdmin: boolean;
}

/** The signed-in student and what they've interacted with, or null. */
export const getViewer = cache(async (): Promise<Viewer | null> => {
  if (!isSupabaseConfigured) return null;
  const sb = await createClient();
  const { data } = await sb.auth.getUser();
  const user = data.user;
  if (!user) return null;

  const [profile, rsvps, votes, memberships] = await Promise.all([
    sb.from("profiles").select("full_name, avatar_url, is_site_admin").eq("id", user.id).maybeSingle(),
    sb.from("event_rsvps").select("event_id").eq("user_id", user.id),
    sb.from("discussion_votes").select("discussion_id").eq("user_id", user.id),
    sb.from("club_members").select("role, clubs(slug)").eq("user_id", user.id),
  ]);

  return {
    id: user.id,
    name: profile.data?.full_name ?? user.email ?? "Student",
    avatarUrl: profile.data?.avatar_url ?? undefined,
    isSiteAdmin: profile.data?.is_site_admin ?? false,
    rsvps: (rsvps.data ?? []).map((r) => r.event_id),
    votes: (votes.data ?? []).map((v) => v.discussion_id),
    clubs: ((memberships.data ?? []) as any[]).map((m) => ({ slug: m.clubs?.slug, role: m.role })),
  };
});
