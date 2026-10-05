-- Keep permission helpers out of the public API (they were callable at /rest/v1/rpc/*),
-- and stop the signup trigger function from being callable directly.

create schema if not exists private;
grant usage on schema private to authenticated;

alter function public.is_site_admin() set schema private;
alter function public.is_club_admin(uuid) set schema private;

-- is_club_admin referred to is_site_admin by its old schema; point it at the new one.
create or replace function private.is_club_admin(cid uuid)
returns boolean
language sql stable
security definer set search_path = ''
as $$
  select private.is_site_admin() or exists (
    select 1 from public.club_members
    where club_id = cid and user_id = auth.uid() and role in ('lead', 'admin')
  );
$$;

revoke execute on function private.is_site_admin() from public, anon;
revoke execute on function private.is_club_admin(uuid) from public, anon;
grant execute on function private.is_site_admin() to authenticated;
grant execute on function private.is_club_admin(uuid) to authenticated;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- One read policy for opportunities; admin writes split by action so reads aren't checked twice.
drop policy "site admins manage opportunities" on public.opportunities;
create policy "site admins add opportunities" on public.opportunities
  for insert to authenticated with check (private.is_site_admin());
create policy "site admins edit opportunities" on public.opportunities
  for update to authenticated using (private.is_site_admin()) with check (private.is_site_admin());
create policy "site admins remove opportunities" on public.opportunities
  for delete to authenticated using (private.is_site_admin());
