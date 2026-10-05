# AIT Hub: student portal for Dr. Ambedkar Institute of Technology (Dr. AIT), Bengaluru

**Live site: [drait.vercel.app](https://drait.vercel.app)**

AIT Hub is an open-source student portal for **Dr. Ambedkar Institute of Technology (Dr. AIT / DRAIT), Bengaluru**. Club events, announcements, discussions, study resources (notes and past papers) and student achievements, in one place instead of a dozen WhatsApp groups. Students sign in with their college Google account (`@drait.edu.in`).

Built with **Next.js**, **Supabase** and **Vercel**. Free to use, MIT licensed, and open to contributions from any Dr. AIT student.

<p align="center"><img src="public/logo.svg" alt="AIT Hub logo" width="320"></p>

The home page shows the next two weeks as a hand-drawn river: every event is a paper boat you can open and RSVP to, every club is a village on the bank, and notices drift by as lanterns. The design borrows from Santiniketan: open air, handmade paper, ink and earth colours.

## What works

- **The river** (`/`): scroll or drag to drift through 14 days. Phones get a river that runs down the page, and there's a plain list view for screen readers and reduced motion.
- **Today** (`/today`): what needs you right now, including urgent notices, today's schedule, what's next, and your clubs.
- **Clubs** (`/clubs/[slug]`): join a club, RSVP, and add to Google Calendar. Club leads can post notices and add events from the club page.
- **Community** (`/community`): ask, reply, and nod. Replies appear live.
- **Events, Announcements, Opportunities, Academics, Achievements.**
- **Day and Dusk themes.** By default the page follows your system setting, and the sky follows your local time of day.

## Stack

All of it is free and open source:

| Part | Choice |
|---|---|
| App | [Next.js 16](https://nextjs.org) (App Router, server actions), React 19, TypeScript |
| Styling | Tailwind CSS v4 plus a small design token set in `src/app/globals.css` |
| Database, auth, realtime | [Supabase](https://supabase.com) (Postgres with row-level security, Google sign-in) |
| Motion | [`motion`](https://motion.dev), with river shapes drawn from seeded [`simplex-noise`](https://github.com/jwagner/simplex-noise.js) |
| Hosting | Vercel Hobby and the Supabase free tier are plenty for ~3,000 students |

## Run it

### 1. Quickest: sample data, nothing to set up

```bash
npm install
npm run dev
```

Open http://localhost:3000. With no Supabase keys the app runs read-only on the sample data in `src/lib/demo`, shifted so it always looks like this week. Sign-in and saving are off.

### 2. With a real local database

You'll need [Docker Desktop](https://www.docker.com/products/docker-desktop/) running.

```bash
npm install
npm run db:start          # starts Postgres, Auth and Realtime locally, then prints the URL and anon key
cp .env.example .env.local
# paste the API URL and anon key into .env.local
npm run dev
```

`npm run db:reset` rebuilds the database from `supabase/migrations` and loads `supabase/seed.sql`.

To try Google sign-in locally, copy `supabase/.env.example` to `supabase/.env` and add OAuth credentials (the file explains how), then restart with `npx supabase stop && npm run db:start`.

### 3. Deploying for the college

1. Create a free project at supabase.com and run the migration: `npx supabase link` then `npx supabase db push`. Optionally load `supabase/seed.sql` from the SQL editor.
2. In Supabase, go to Authentication → Providers → Google and add your OAuth client. Then add `https://<your-domain>/auth/callback` to Authentication → URL Configuration → Redirect URLs.
3. Import the repo on Vercel and set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `NEXT_PUBLIC_REPO_URL`.

### Making someone a club lead

Leads are set by hand for now. Run this in the Supabase SQL editor:

```sql
insert into club_members (club_id, user_id, role)
select c.id, p.id, 'lead' from clubs c, profiles p
where c.slug = 'gdg-ait' and p.full_name = 'Their Name'
on conflict (club_id, user_id) do update set role = 'lead';
```

Set `profiles.is_site_admin = true` for people who should manage every club and the opportunities board.

## How it's put together

```
src/app/(landing)/     the river (public front page)
src/app/(app)/         everything with the sidebar: today, clubs, events, community…
src/components/river/  Sky, River, PaperBoat, Village, PaperNote, Voices, Shore
src/lib/data/          every read goes through here (Supabase, or sample data when unconfigured)
src/lib/actions.ts     every write: RSVP, vote, join, post, reply, notices, events
supabase/migrations/   schema and row-level security, the real source of truth for permissions
scripts/               generate-seed.mts turns src/lib/demo into supabase/seed.sql
```

Permissions are enforced in the database, not just the UI. Students can only RSVP, vote, and post as themselves. Only a club's leads can post notices or events for that club, and nobody can promote themselves.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md). Small fixes are welcome, and so are new villages.

## License

[MIT](LICENSE)
