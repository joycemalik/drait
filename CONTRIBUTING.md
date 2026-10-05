# Contributing to AIT Hub

Thanks for wanting to help. You don't need to be an expert; plenty of useful changes are a few lines.

## Getting set up

Follow "Run it" in the [README](README.md). Option 1 (sample data) is enough for most UI work. Use option 2 (local Supabase) if you're touching anything that saves data.

## Making a change

1. Fork the repo and create a branch: `git checkout -b fix/short-description`.
2. Make your change, then check it:
   ```bash
   npx tsc --noEmit
   npm run lint
   npm run build
   ```
3. Open the pages you touched in a browser, in both Day and Dusk (the toggle is in the top bar), and at phone width.
4. Open a pull request saying what you changed and why. Screenshots help a lot for anything visual.

## Changing the database

- Never edit an existing migration. Add a new file instead: `npx supabase migration new describe_change`.
- Every new table needs `enable row level security` and explicit policies. Look at `supabase/migrations/*_init.sql` for the patterns: public reads, "your own rows" writes, and `is_club_admin(club_id)` for club-lead actions.
- Server actions in `src/lib/actions.ts` must check the signed-in user first. Server actions can be called directly over HTTP, so the UI hiding a button isn't protection.
- If you change the sample data in `src/lib/demo`, run `npm run seed:generate` so `supabase/seed.sql` matches.

## Design notes

The look is meant to feel handmade and calm, not like a dashboard template.

- Colours come from the tokens at the top of `src/app/globals.css` (paper, ink, laterite, sal, turmeric, river). Please don't add new hex values in components.
- Avoid hard rectangles. Use the `.leaf` class or uneven `border-radius` for surfaces, and `.wobble-rule` instead of straight dividers.
- Use Fraunces (the `font-display` class) for headings and Instrument Sans for everything else.
- Anything that moves should respect `prefers-reduced-motion`. The global rule in `globals.css` covers CSS animations.
- Write copy like a person: "Nothing planned yet", not "No data available".

## Good first issues

- Move Academics and Achievements onto the database (they still use inline data).
- Add a profile page where students set their branch and year.
- An `.ics` feed per club so people can subscribe in their calendar app.
- Search in the top bar (it's a placeholder right now).
- Draw a new kind of village for cultural and social clubs.

## Code of conduct

Be kind. This is a student project, so assume good intent and help each other learn.
