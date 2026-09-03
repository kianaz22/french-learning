# L'Atelier Companion

A mobile-first PWA to practice **L'Atelier A1 — Unités 1–3** on days between class. Each unit has a detailed lesson plus large practice banks so you can drill for weeks without repeating the same set.

## Units

| Unité | Title | Topics |
|-------|-------|--------|
| 1 | *C'est qui ?* | Greetings, introductions, être / avoir / s'appeler |
| 2 | *On fait quoi ce week-end ?* | Objects, hobbies, sports, aimer / faire / aller |
| 3 | *On va où cet été ?* | Weather, city, directions, futur proche, venir / prendre |

Each unit now includes a full lesson (12 grammar points with explanations, examples, common mistakes, a model dialogue, and culture notes) plus large practice banks: ~120–140 flashcards, 240 quiz questions, 240 fill-in-the-blanks, 10 verbs, and 20 writing missions. Daily sessions sample a fresh set so you can practice for weeks without repeating the same items.

Switch units from the home screen — progress is saved separately per unit.

Each unit includes a **Leçon** section (grammar, vocabulary, verb tables, key phrases) to study before the daily exercises.

## Run locally

```bash
nvm use 18
npm install
cp .env.example .env   # then add your Supabase keys
npm run dev
```

Open the URL shown in the terminal (usually `http://localhost:5173`).

## Supabase setup (free — cloud sync + auth)

1. Create a project at [supabase.com](https://supabase.com) (free tier, no credit card).
2. In **Project Settings → API**, copy:
   - Project URL → `VITE_SUPABASE_URL`
   - `anon` public key → `VITE_SUPABASE_ANON_KEY`
3. Paste them into `.env` in the project root.
4. In **SQL Editor**, run the script in [`supabase/schema.sql`](supabase/schema.sql).
5. (Optional) **Authentication → Providers → Google** — enable Google sign-in and add `http://localhost:5173` to redirect URLs.

Restart the dev server after editing `.env`.

### What you get free

- Email/password login
- Google OAuth (after enabling in Supabase)
- Progress synced to Postgres (500 MB free)
- 50,000 monthly active users — far more than you'll need

## Auth behavior

| Mode | Progress stored |
|------|-----------------|
| **Signed in** | Local + Supabase cloud (syncs across devices) |
| **Guest** | Browser `localStorage` only |

On first sign-in, local progress is **merged** with any cloud data (best streak, completed steps, scores kept).

## Install on your phone

1. Run `npm run build && npm run preview -- --host`, or deploy the `dist/` folder.
2. Add your production URL to Supabase **Authentication → URL Configuration**.
3. On iOS Safari: Share → **Add to Home Screen**
4. On Android Chrome: Menu → **Install app**

## Daily session (~30 min)

Study the **Leçon** first, then complete the practice steps:

| Step | Activity |
|------|----------|
| Cartes | Flashcards — vocab by category |
| Quiz | Multiple choice grammar & vocab |
| Phrases | Fill-in-the-blank |
| Verbes | Conjugation drill (unit-specific verbs) |
| Mission | Writing prompts (self-check) |

## Stack

- Vite + React + TypeScript
- Supabase Auth + Postgres
- Service worker (offline-capable)
