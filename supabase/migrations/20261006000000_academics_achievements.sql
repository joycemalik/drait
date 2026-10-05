-- Study resources shared by students, and achievements submitted by students and verified by leads.

-- ─── Academic resources ────────────────────────────────────
create table public.academic_resources (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  department text not null check (department in ('cse', 'ise', 'aiml', 'ece', 'eee', 'mech', 'civil', 'other')),
  semester smallint not null check (semester between 1 and 8),
  subject text not null check (char_length(subject) between 2 and 120),
  kind text not null default 'notes' check (kind in ('notes', 'pyq', 'lab', 'reference', 'other')),
  url text not null check (url ~* '^https?://' and char_length(url) <= 2000),
  submitted_by uuid references public.profiles on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index academic_resources_browse_idx on public.academic_resources (department, semester, subject);
create index academic_resources_submitted_by_idx on public.academic_resources (submitted_by);

alter table public.academic_resources enable row level security;
create policy "resources are public" on public.academic_resources for select using (true);
create policy "students share resources" on public.academic_resources
  for insert to authenticated with check (submitted_by = (select auth.uid()));
create policy "sharers or admins remove resources" on public.academic_resources
  for delete to authenticated using (submitted_by = (select auth.uid()) or public.is_site_admin());

-- ─── Achievements ──────────────────────────────────────────
create table public.achievements (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 3 and 200),
  people text not null check (char_length(people) between 2 and 200),
  team text,
  club_id uuid references public.clubs on delete set null,
  category text not null default 'other'
    check (category in ('hackathon', 'competition', 'certification', 'research', 'sports', 'design', 'other')),
  achieved_on date not null,
  description text not null default '' check (char_length(description) <= 2000),
  link text check (link is null or (link ~* '^https?://' and char_length(link) <= 2000)),
  verified boolean not null default false,
  submitted_by uuid references public.profiles on delete set null default auth.uid(),
  created_at timestamptz not null default now()
);
create index achievements_achieved_on_idx on public.achievements (achieved_on desc);
create index achievements_club_id_idx on public.achievements (club_id);
create index achievements_submitted_by_idx on public.achievements (submitted_by);

alter table public.achievements enable row level security;
create policy "achievements are public" on public.achievements for select using (true);
-- Anyone signed in can submit; it starts unverified.
create policy "students submit achievements" on public.achievements
  for insert to authenticated
  with check (submitted_by = (select auth.uid()) and verified = false);
-- The club's leads (or site admins) verify; without a club, only site admins.
create policy "leads verify achievements" on public.achievements
  for update to authenticated
  using (public.is_site_admin() or (club_id is not null and public.is_club_admin(club_id)))
  with check (public.is_site_admin() or (club_id is not null and public.is_club_admin(club_id)));
create policy "submitters withdraw unverified, admins remove" on public.achievements
  for delete to authenticated
  using ((submitted_by = (select auth.uid()) and verified = false) or public.is_site_admin());

create view public.achievements_view with (security_invoker = true) as
select a.*, c.slug as club_slug, c.name as club_name, c.color as club_color
from public.achievements a
left join public.clubs c on c.id = a.club_id;

-- ─── Indexes on foreign keys from the first migration ──────
create index club_members_user_id_idx on public.club_members (user_id);
create index events_club_id_idx on public.events (club_id);
create index events_created_by_idx on public.events (created_by);
create index event_rsvps_user_id_idx on public.event_rsvps (user_id);
create index announcements_club_id_idx on public.announcements (club_id);
create index announcements_author_id_idx on public.announcements (author_id);
create index discussions_author_id_idx on public.discussions (author_id);
create index discussion_replies_author_id_idx on public.discussion_replies (author_id);
create index discussion_votes_user_id_idx on public.discussion_votes (user_id);
