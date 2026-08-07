# L'Atelier Companion

A mobile-first PWA to practice **L'Atelier A1 — Unité 1** (*C'est qui ?*) on days between class.

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

## Daily session (~15 min)

| Step | Activity |
|------|----------|
| Cartes | Flashcards — vocab by category |
| Quiz | Multiple choice grammar & vocab |
| Phrases | Fill-in-the-blank |
| Verbes | Conjugate s'appeler, être, avoir |
| Mission | Writing prompts (self-check) |

## Stack

- Vite + React + TypeScript
- Supabase Auth + Postgres
- Service worker (offline-capable)
