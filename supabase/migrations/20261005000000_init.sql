-- AIT Hub initial schema

-- ─── Profiles ──────────────────────────────────────────────
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  full_name text,
  avatar_url text,
  branch text,
  year text,
  is_verified_student boolean not null default false,
  is_site_admin boolean not null default false,
  created_at timestamptz not null default now()
);

create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─── Clubs ─────────────────────────────────────────────────
create table public.clubs (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  short_name text not null,
  tagline text not null default '',
  description text not null default '',
  category text not null check (category in ('technical', 'sports', 'cultural', 'social')),
  color text not null default '#4F7C8A',
  -- members on record, maintained by club leads (most members never sign up)
  member_count integer not null default 0,
  founded_year integer,
  external_link text,
  instagram_link text,
  leads jsonb not null default '[]',
  tags text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.club_members (
  club_id uuid not null references public.clubs on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  role text not null default 'member' check (role in ('member', 'lead', 'admin')),
  joined_at timestamptz not null default now(),
  primary key (club_id, user_id)
);

create function public.is_site_admin()
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select coalesce((select is_site_admin from public.profiles where id = auth.uid()), false);
$$;

create function public.is_club_admin(cid uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select public.is_site_admin() or exists (
    select 1 from public.club_members
    where club_id = cid and user_id = auth.uid() and role in ('lead', 'admin')
  );
$$;

-- ─── Events ────────────────────────────────────────────────
create table public.events (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs on delete cascade,
  title text not null,
  description text not null default '',
  type text not null default 'meeting'
    check (type in ('workshop', 'hackathon', 'competition', 'seminar', 'practice', 'meeting', 'social')),
  starts_at timestamptz not null,
  ends_at timestamptz,
  venue text not null default '',
  registration_link text,
  max_seats integer,
  tags text[] not null default '{}',
  featured boolean not null default false,
  image_url text,
  created_by uuid references public.profiles on delete set null,
  created_at timestamptz not null default now()
);
create index events_starts_at_idx on public.events (starts_at);

create table public.event_rsvps (
  event_id uuid not null references public.events on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (event_id, user_id)
);

-- ─── Announcements ─────────────────────────────────────────
create table public.announcements (
  id uuid primary key default gen_random_uuid(),
  club_id uuid not null references public.clubs on delete cascade,
  title text not null,
  body text not null default '',
  priority text not null default 'info' check (priority in ('urgent', 'important', 'info')),
  pinned boolean not null default false,
  author_id uuid references public.profiles on delete set null,
  author_name text,
  created_at timestamptz not null default now()
);
create index announcements_created_at_idx on public.announcements (created_at desc);

-- ─── Community ─────────────────────────────────────────────
create table public.discussions (
  id uuid primary key default gen_random_uuid(),
  author_id uuid references public.profiles on delete set null,
  -- used for seeded/imported posts that have no account
  author_name text,
  author_year text,
  title text not null check (char_length(title) between 3 and 200),
  body text not null default '' check (char_length(body) <= 10000),
  category text not null default 'general'
    check (category in ('academic', 'career', 'campus', 'projects', 'general')),
  subcategory text not null default '',
  tags text[] not null default '{}',
  pinned boolean not null default false,
  solved boolean not null default false,
  created_at timestamptz not null default now()
);

create table public.discussion_replies (
  id uuid primary key default gen_random_uuid(),
  discussion_id uuid not null references public.discussions on delete cascade,
  author_id uuid not null references public.profiles on delete cascade,
  body text not null check (char_length(body) between 1 and 5000),
  created_at timestamptz not null default now()
);
create index discussion_replies_discussion_idx on public.discussion_replies (discussion_id, created_at);

create table public.discussion_votes (
  discussion_id uuid not null references public.discussions on delete cascade,
  user_id uuid not null references public.profiles on delete cascade,
  created_at timestamptz not null default now(),
  primary key (discussion_id, user_id)
);

-- ─── Opportunities ─────────────────────────────────────────
create table public.opportunities (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null
    check (type in ('hackathon', 'internship', 'competition', 'scholarship', 'research', 'certification')),
  organizer text not null,
  deadline date not null,
  eligibility text not null default '',
  prize text,
  stipend text,
  description text not null default '',
  link text not null default '',
  tags text[] not null default '{}',
  featured boolean not null default false,
  created_at timestamptz not null default now()
);

-- ─── Read views (security_invoker so RLS of base tables applies) ─
create view public.events_view with (security_invoker = true) as
select
  e.*,
  c.slug as club_slug,
  c.name as club_name,
  c.color as club_color,
  (select count(*) from public.event_rsvps r where r.event_id = e.id)::int as rsvp_count
from public.events e
join public.clubs c on c.id = e.club_id;

create view public.announcements_view with (security_invoker = true) as
select
  a.*,
  c.slug as club_slug,
  c.name as club_name,
  c.color as club_color,
  coalesce(p.full_name, a.author_name, c.name) as author_display
from public.announcements a
join public.clubs c on c.id = a.club_id
left join public.profiles p on p.id = a.author_id;

create view public.discussions_view with (security_invoker = true) as
select
  d.*,
  coalesce(p.full_name, d.author_name, 'A student') as author_display,
  coalesce(nullif(concat_ws(' ', p.year, p.branch), ''), d.author_year, '') as author_year_display,
  (select count(*) from public.discussion_votes v where v.discussion_id = d.id)::int as upvotes,
  (select count(*) from public.discussion_replies r where r.discussion_id = d.id)::int as reply_count
from public.discussions d
left join public.profiles p on p.id = d.author_id;

-- ─── Row-level security ────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.clubs enable row level security;
alter table public.club_members enable row level security;
alter table public.events enable row level security;
alter table public.event_rsvps enable row level security;
alter table public.announcements enable row level security;
alter table public.discussions enable row level security;
alter table public.discussion_replies enable row level security;
alter table public.discussion_votes enable row level security;
alter table public.opportunities enable row level security;

-- Public reads: the landing page works signed out.
create policy "profiles are public" on public.profiles for select using (true);
create policy "clubs are public" on public.clubs for select using (true);
create policy "memberships are public" on public.club_members for select using (true);
create policy "events are public" on public.events for select using (true);
create policy "rsvps are public" on public.event_rsvps for select using (true);
create policy "announcements are public" on public.announcements for select using (true);
create policy "discussions are public" on public.discussions for select using (true);
create policy "replies are public" on public.discussion_replies for select using (true);
create policy "votes are public" on public.discussion_votes for select using (true);
create policy "opportunities are public" on public.opportunities for select using (true);

-- Profiles: users edit their own basic fields only.
create policy "users update own profile" on public.profiles
  for update to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
revoke update on public.profiles from authenticated, anon;
grant update (full_name, avatar_url, branch, year) on public.profiles to authenticated;

-- Clubs: site admins manage clubs; club admins edit their own club.
create policy "site admins insert clubs" on public.clubs
  for insert to authenticated with check (public.is_site_admin());
create policy "club admins update club" on public.clubs
  for update to authenticated using (public.is_club_admin(id)) with check (public.is_club_admin(id));
create policy "site admins delete clubs" on public.clubs
  for delete to authenticated using (public.is_site_admin());

-- Memberships: anyone can join as a member or leave; admins manage roles.
create policy "users join clubs as members" on public.club_members
  for insert to authenticated
  with check (
    (user_id = (select auth.uid()) and role = 'member')
    or public.is_club_admin(club_id)
  );
create policy "admins change roles" on public.club_members
  for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "users leave or admins remove" on public.club_members
  for delete to authenticated
  using (user_id = (select auth.uid()) or public.is_club_admin(club_id));

-- Events & announcements: only that club's leads/admins.
create policy "club admins insert events" on public.events
  for insert to authenticated with check (public.is_club_admin(club_id));
create policy "club admins update events" on public.events
  for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "club admins delete events" on public.events
  for delete to authenticated using (public.is_club_admin(club_id));

create policy "club admins insert announcements" on public.announcements
  for insert to authenticated with check (public.is_club_admin(club_id));
create policy "club admins update announcements" on public.announcements
  for update to authenticated using (public.is_club_admin(club_id)) with check (public.is_club_admin(club_id));
create policy "club admins delete announcements" on public.announcements
  for delete to authenticated using (public.is_club_admin(club_id));

-- RSVPs and votes: your own rows only.
create policy "users rsvp" on public.event_rsvps
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users un-rsvp" on public.event_rsvps
  for delete to authenticated using (user_id = (select auth.uid()));

create policy "users vote" on public.discussion_votes
  for insert to authenticated with check (user_id = (select auth.uid()));
create policy "users unvote" on public.discussion_votes
  for delete to authenticated using (user_id = (select auth.uid()));

-- Discussions and replies: authors own their posts; site admins moderate.
create policy "users post discussions" on public.discussions
  for insert to authenticated
  with check (author_id = (select auth.uid()) and pinned = false);
create policy "authors edit discussions" on public.discussions
  for update to authenticated
  using (author_id = (select auth.uid()) or public.is_site_admin())
  with check (author_id = (select auth.uid()) or public.is_site_admin());
create policy "authors delete discussions" on public.discussions
  for delete to authenticated using (author_id = (select auth.uid()) or public.is_site_admin());

create policy "users reply" on public.discussion_replies
  for insert to authenticated with check (author_id = (select auth.uid()));
create policy "authors delete replies" on public.discussion_replies
  for delete to authenticated using (author_id = (select auth.uid()) or public.is_site_admin());

-- Opportunities: site admins only.
create policy "site admins manage opportunities" on public.opportunities
  for all to authenticated using (public.is_site_admin()) with check (public.is_site_admin());

-- Live replies in community threads.
alter publication supabase_realtime add table public.discussion_replies;
