# 🚀 Quick Deploy Guide

Once you have your CoinGecko API key, here's how to deploy in 5 minutes:

## 1. Install Supabase CLI (if not already)
```bash
npm install -g supabase
```

## 2. Login to Supabase
```bash
supabase login
```

## 3. Link your project
```bash
cd crypto-trader
supabase link --project-ref yuobwpszomojorrjiwlp
```

## 4. Set your API key
```bash
supabase secrets set COINGECKO_API_KEY=your-api-key-here
```

## 5. Deploy the edge function
```bash
supabase functions deploy update-game-prices
```

## 6. Set up the cron job

Go to your Supabase dashboard SQL editor and run:

```sql
-- Enable pg_cron extension (if not already)
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule hourly price updates
SELECT cron.schedule(
    'update-game-prices',
    '0 * * * *', -- Every hour
    $$
    SELECT net.http_post(
        url:='https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/update-game-prices',
        headers:=jsonb_build_object(
            'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key')
        )
    ) AS request_id;
    $$
);
```

## 7. Test it!

Test the edge function manually:
```bash
curl -X POST https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/update-game-prices \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json"
```

## That's it! 🎉

Your Now mode games will update prices every hour automatically.

## Verify it's working:
1. Check edge function logs in Supabase dashboard
2. Look at the `prices_cache` table - `fetched_at` should update
3. Active games will show real price movements!

## Troubleshooting:
- If prices don't update, check edge function logs
- Make sure the API key is set correctly
- Verify the cron job is active: `SELECT * FROM cron.job;`