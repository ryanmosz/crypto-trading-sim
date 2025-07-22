-- Enable pg_cron extension if not already enabled
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Grant usage on cron schema to postgres user
GRANT USAGE ON SCHEMA cron TO postgres;

-- Remove existing cron job if it exists
SELECT cron.unschedule('update-game-prices');

-- Schedule the update-game-prices Edge Function to run every minute
-- This will update prices and complete expired games
SELECT cron.schedule(
  'update-game-prices',           -- job name
  '* * * * *',                   -- cron expression: every minute
  $$
  SELECT net.http_post(
    url:='https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/update-game-prices',
    headers:='{"Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU", "Content-Type": "application/json"}',
    body:='{}',
    timeout_milliseconds:=30000
  );
  $$
);

-- Verify the job was created
SELECT * FROM cron.job WHERE jobname = 'update-game-prices';

-- Instructions:
-- 1. Run this script in the Supabase SQL Editor
-- 2. Make sure to replace the service role key in the Authorization header with your actual key
-- 3. The job will run every minute to:
--    - Fetch latest crypto prices
--    - Update all active game values
--    - Complete any expired games
--    - Trigger notifications for completed games 