-- =====================================================================
-- World Cup Pool — Supabase database setup
-- (automatic + manual override version)
-- Paste this whole file into the Supabase SQL Editor and click "Run".
-- =====================================================================

-- 1. The results table. One row per match.
--    "locked" = true means a human set this manually; the auto-updater
--    will NOT overwrite it on its next run.
create table if not exists results (
  match_id   integer primary key,
  winner     text not null,          -- a team name, or the literal text 'draw'
  locked     boolean default false,  -- true when set manually (sync won't touch it)
  updated_at timestamptz default now()
);

-- If you set the table up with the earlier version, add the column safely:
alter table results add column if not exists locked boolean default false;

-- 2. Row Level Security on.
alter table results enable row level security;

-- 3. Anyone may READ results (this powers the public standings).
drop policy if exists "Public can read results" on results;
create policy "Public can read results"
  on results for select
  using (true);

-- 4. We do NOT add public write policies. Two things write to this table,
--    both privileged and both bypassing RLS with the service_role key:
--      a) the scheduled "sync-results" Edge Function (automatic), and
--      b) the "manual-result" Edge Function (your password-protected
--         override button on the site).
--    The public website itself can only read.

-- 5. Realtime broadcast so every open browser updates instantly.
alter publication supabase_realtime add table results;
