-- Run this in Supabase: SQL Editor → New query → Run

create table if not exists public.user_progress (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users (id) on delete cascade not null,
  unit_number int not null default 1,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique (user_id, unit_number)
);

alter table public.user_progress enable row level security;

create policy "Users read own progress"
  on public.user_progress
  for select
  using (auth.uid() = user_id);

create policy "Users insert own progress"
  on public.user_progress
  for insert
  with check (auth.uid() = user_id);

create policy "Users update own progress"
  on public.user_progress
  for update
  using (auth.uid() = user_id);

create index if not exists user_progress_user_unit_idx
  on public.user_progress (user_id, unit_number);
