-- College-only accounts, richer profiles, avatar uploads, full department list.

-- ─── Who may sign up ───────────────────────────────────────
-- Dr. AIT emails (drait.edu.in and department subdomains like cs.drait.edu.in),
-- plus a short admin-managed list of exceptions (developers, faculty with other addresses).
create table public.allowed_emails (
  email text primary key check (email = lower(email)),
  note text not null default '',
  created_at timestamptz not null default now()
);
alter table public.allowed_emails enable row level security;
-- No policies: only the database owner (SQL editor / migrations) manages this list.

create function private.is_college_email(addr text)
returns boolean
language sql immutable
set search_path = ''
as $$
  select coalesce(lower(addr) ~ '@([a-z0-9-]+\.)*drait\.edu\.in$', false);
$$;

create function private.enforce_college_email()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  if private.is_college_email(new.email)
     or exists (select 1 from public.allowed_emails a where a.email = lower(new.email)) then
    return new;
  end if;
  raise exception 'AIT Hub is only open to Dr. AIT college email accounts (@drait.edu.in).'
    using errcode = 'P0001';
end;
$$;
revoke execute on function private.enforce_college_email() from public, anon, authenticated;

create trigger enforce_college_email
  before insert on auth.users
  for each row execute function private.enforce_college_email();

-- ─── Departments ───────────────────────────────────────────
-- USNs look like 1DA24IS042: college 1DA, joined 2024, branch IS, roll 042.
create function private.department_from_code(code text)
returns text
language sql immutable
set search_path = ''
as $$
  select case upper(code)
    when 'AE' then 'aero'   when 'CV' then 'civil'  when 'CS' then 'cse'
    when 'CD' then 'csds'   when 'AI' then 'aiml'   when 'CB' then 'csbs'
    when 'IS' then 'ise'    when 'EC' then 'ece'    when 'EE' then 'eee'
    when 'EI' then 'eie'    when 'ET' then 'ete'    when 'TE' then 'ete'
    when 'ML' then 'mde'    when 'IM' then 'iem'    when 'ME' then 'mech'
    when 'MC' then 'mca'    when 'MB' then 'mba'
    else null end;
$$;

create function private.department_short(dept text)
returns text
language sql immutable
set search_path = ''
as $$
  select case dept
    when 'aero' then 'AE'   when 'civil' then 'Civil' when 'cse' then 'CSE'
    when 'csds' then 'CSE-DS' when 'aiml' then 'AIML' when 'csbs' then 'CSBS'
    when 'ise' then 'ISE'   when 'ece' then 'ECE'     when 'eee' then 'EEE'
    when 'eie' then 'EIE'   when 'ete' then 'ETE'     when 'mde' then 'MDE'
    when 'iem' then 'IEM'   when 'mech' then 'Mech'   when 'mca' then 'MCA'
    when 'mba' then 'MBA'
    else null end;
$$;

alter table public.academic_resources drop constraint academic_resources_department_check;
alter table public.academic_resources add constraint academic_resources_department_check
  check (department in ('aero', 'civil', 'cse', 'csds', 'aiml', 'csbs', 'ise', 'ece', 'eee', 'eie', 'ete', 'mde', 'iem', 'mech', 'mca', 'mba', 'other'));

-- ─── Richer profiles ───────────────────────────────────────
alter table public.profiles
  add column usn text,
  add column department text check (department is null or department in
    ('aero', 'civil', 'cse', 'csds', 'aiml', 'csbs', 'ise', 'ece', 'eee', 'eie', 'ete', 'mde', 'iem', 'mech', 'mca', 'mba', 'other')),
  add column admission_year smallint,
  add column section text check (section is null or section ~ '^[A-Z]$'),
  add column bio text check (bio is null or char_length(bio) <= 280),
  add column skills text[] not null default '{}' check (cardinality(skills) <= 12),
  add column github text check (github is null or github ~ '^[A-Za-z0-9-]{1,39}$'),
  add column linkedin text check (linkedin is null or linkedin ~ '^[A-Za-z0-9-]{3,100}$'),
  add column instagram text check (instagram is null or instagram ~ '^[A-Za-z0-9._]{1,30}$'),
  add column website text check (website is null or (website ~* '^https://' and char_length(website) <= 200));

-- Fill in what the college email tells us at signup.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
declare
  local text := lower(split_part(new.email, '@', 1));
  m text[] := regexp_match(local, '^1da(\d{2})([a-z]{2})(\d{3})$');
  dept text := case when m is null then null else private.department_from_code(m[2]) end;
begin
  insert into public.profiles (id, full_name, avatar_url, usn, admission_year, department, branch, is_verified_student)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    new.raw_user_meta_data ->> 'avatar_url',
    case when m is null then null else upper(local) end,
    case when m is null then null else 2000 + m[1]::int end,
    dept,
    private.department_short(dept),
    private.is_college_email(new.email)
  );
  return new;
end;
$$;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- Students edit their own descriptive fields; USN, joining year and verification come from the email.
grant update (department, section, bio, skills, github, linkedin, instagram, website) on public.profiles to authenticated;

-- USNs are visible to signed-in students, not to the public internet.
revoke select on public.profiles from anon;
grant select (id, full_name, avatar_url, branch, year, department, section, bio, skills, github, linkedin, instagram,
  website, is_verified_student, created_at) on public.profiles to anon;

-- ─── Avatars ───────────────────────────────────────────────
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/webp', 'image/png', 'image/jpeg'])
on conflict (id) do nothing;

create policy "students read own avatar files" on storage.objects
  for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "students upload own avatar" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "students replace own avatar" on storage.objects
  for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text)
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "students remove own avatar" on storage.objects
  for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
