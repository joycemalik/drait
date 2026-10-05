-- Who RSVPs or votes is private; only the counts are public.

drop policy "rsvps are public" on public.event_rsvps;
create policy "students see own rsvps" on public.event_rsvps
  for select to authenticated using (user_id = (select auth.uid()));

drop policy "votes are public" on public.discussion_votes;
create policy "students see own votes" on public.discussion_votes
  for select to authenticated using (user_id = (select auth.uid()));

-- Counting needs to see every row, so it runs with the owner's rights and returns only a number.
create function private.rsvp_count(eid uuid)
returns int
language sql stable
security definer set search_path = ''
as $$ select count(*)::int from public.event_rsvps where event_id = eid $$;

create function private.vote_count(did uuid)
returns int
language sql stable
security definer set search_path = ''
as $$ select count(*)::int from public.discussion_votes where discussion_id = did $$;

grant usage on schema private to anon;
revoke execute on function private.rsvp_count(uuid), private.vote_count(uuid) from public;
grant execute on function private.rsvp_count(uuid), private.vote_count(uuid) to anon, authenticated;

create or replace view public.events_view with (security_invoker = true) as
select
  e.*,
  c.slug as club_slug,
  c.name as club_name,
  c.color as club_color,
  private.rsvp_count(e.id) as rsvp_count
from public.events e
join public.clubs c on c.id = e.club_id;

create or replace view public.discussions_view with (security_invoker = true) as
select
  d.*,
  coalesce(p.full_name, d.author_name, 'A student') as author_display,
  coalesce(nullif(concat_ws(' ', p.year, p.branch), ''), d.author_year, '') as author_year_display,
  private.vote_count(d.id) as upvotes,
  (select count(*) from public.discussion_replies r where r.discussion_id = d.id)::int as reply_count
from public.discussions d
left join public.profiles p on p.id = d.author_id;
