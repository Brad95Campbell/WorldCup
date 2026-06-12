-- =====================================================================
-- Schedule the auto-updater to run on a timer.
-- Run this in the Supabase SQL Editor AFTER you've deployed the
-- "sync-results" Edge Function (see README, Part B).
--
-- It uses Supabase's built-in pg_cron + pg_net extensions to call your
-- function every 5 minutes. During match windows that's frequent enough
-- to catch full-time results within a few minutes, while staying well
-- under football-data.org's free rate limit.
-- =====================================================================

-- 1. Enable the scheduler + HTTP extensions (safe to run if already on).
create extension if not exists pg_cron;
create extension if not exists pg_net;

-- 2. Store your project ref + a key so cron can call the function.
--    Replace the two placeholder values below before running:
--      <PROJECT-REF>      e.g. abcdxyz  (from your project URL abcdxyz.supabase.co)
--      <SERVICE-ROLE-KEY> Settings -> API -> service_role key (keep this secret!)
--
--    We pass the service role key so the function is allowed to run.

select cron.schedule(
  'sync-worldcup-results',          -- job name
  '*/5 * * * *',                    -- every 5 minutes
  $$
  select net.http_post(
    url     := 'https://<PROJECT-REF>.supabase.co/functions/v1/sync-results',
    headers := jsonb_build_object(
                 'Content-Type',  'application/json',
                 'Authorization', 'Bearer <SERVICE-ROLE-KEY>'
               ),
    body    := '{}'::jsonb
  );
  $$
);

-- ---------------------------------------------------------------------
-- Handy management commands (run individually if needed):
--
--   -- See scheduled jobs:
--   select * from cron.job;
--
--   -- See recent runs and whether they succeeded:
--   select * from cron.job_run_details order by start_time desc limit 20;
--
--   -- Remove the schedule (e.g. after the tournament):
--   select cron.unschedule('sync-worldcup-results');
-- ---------------------------------------------------------------------
