# Cron Job Setup Guide

## Overview

The crypto trader game requires a cron job to:
1. Update cryptocurrency prices every minute
2. Calculate portfolio values for all active games
3. Complete expired games
4. Trigger win/loss notifications

## Edge Function

The `update-game-prices` Edge Function handles all these tasks. It's already deployed and ready to use.

## Setting Up the Cron Job

### Method 1: Using Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard
2. Navigate to "Database" → "Extensions"
3. Enable the `pg_cron` extension if not already enabled
4. Go to "SQL Editor" and run:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Remove any existing job
SELECT cron.unschedule('update-game-prices');

-- Create new job to run every minute
SELECT cron.schedule(
  'update-game-prices',
  '* * * * *',  -- Every minute
  $$
  SELECT net.http_post(
    url:='https://[YOUR-PROJECT-REF].supabase.co/functions/v1/update-game-prices',
    headers:='{"Authorization": "Bearer [YOUR-SERVICE-ROLE-KEY]", "Content-Type": "application/json"}',
    body:='{}',
    timeout_milliseconds:=30000
  );
  $$
);
```

Replace:
- `[YOUR-PROJECT-REF]` with your project reference (e.g., `yuobwpszomojorrjiwlp`)
- `[YOUR-SERVICE-ROLE-KEY]` with your service role key from Settings → API

### Method 2: Using fetch-prices Function (Alternative)

The `fetch-prices` Edge Function also updates prices and completes games. To use it:

```sql
SELECT cron.schedule(
  'fetch-prices',
  '* * * * *',
  $$
  SELECT net.http_post(
    url:='https://[YOUR-PROJECT-REF].supabase.co/functions/v1/fetch-prices',
    headers:='{"Authorization": "Bearer [YOUR-SERVICE-ROLE-KEY]"}',
    body:='{}',
    timeout_milliseconds:=30000
  );
  $$
);
```

## Verifying the Cron Job

Check if the job is running:

```sql
-- List all cron jobs
SELECT * FROM cron.job;

-- Check recent job runs
SELECT * FROM cron.job_run_details 
WHERE jobname = 'update-game-prices' 
ORDER BY start_time DESC 
LIMIT 10;
```

## Monitoring

You can monitor the cron job execution:

1. **Edge Function Logs**: Check the function logs in Supabase Dashboard
2. **Price Updates**: Query `prices_cache` table to see latest prices
3. **Game Completions**: Check `active_games` for `is_complete = true`

## Troubleshooting

### Job Not Running
- Verify pg_cron extension is enabled
- Check the service role key is correct
- Ensure the Edge Function URL is correct

### Prices Not Updating
- Check Edge Function logs for errors
- Verify CoinGecko API is accessible
- Check `prices_cache` table has write permissions

### Games Not Completing
- Verify `complete_expired_games()` function exists
- Check for errors in Edge Function logs
- Ensure games have proper `ends_at` timestamps

## Manual Testing

To test the Edge Function manually:

```bash
curl -X POST https://[YOUR-PROJECT-REF].supabase.co/functions/v1/update-game-prices \
  -H "Authorization: Bearer [YOUR-SERVICE-ROLE-KEY]" \
  -H "Content-Type: application/json" \
  -d '{}'
```

## Important Notes

1. **6-Minute Games**: These rely on minute-level updates to work properly
2. **Notifications**: Win/loss notifications depend on games being marked complete
3. **Performance**: The cron job runs every minute, so keep the Edge Function efficient
4. **Costs**: Frequent Edge Function invocations may impact your Supabase usage 