# 🧪 Final Testing Checklist

## Before You Start Testing

### ✅ API Integration Check
- [ ] Visit http://localhost:8001/public/test-api.html
- [ ] Verify "✅ API Key Detected!" shows at top
- [ ] Click "Test with Key" - should show real prices
- [ ] Click "Test Local Integration" - should work

### ✅ Game Features to Test

#### 1. Historical Mode
- [ ] Login/Register works
- [ ] Play each scenario (2013 Bull, 2020 Crash, 2021 Peak)
- [ ] Check allocations save correctly
- [ ] Verify results calculation
- [ ] Confirm past games show on dashboard

#### 2. Now Mode
- [ ] Start a 30-day game
- [ ] Verify it shows in Active Games
- [ ] Click VIEW to see details
- [ ] Test [Update Prices] button
- [ ] Check performance chart displays

#### 3. Leaderboard
- [ ] Click 🏆 Leaderboard button
- [ ] Verify it shows after 2+ games
- [ ] Check your ranking appears

### ✅ Database Verification
Run these in Supabase SQL editor:

```sql
-- Check prices cache
SELECT * FROM prices_cache;

-- Check active games
SELECT * FROM active_games WHERE user_id = auth.uid();

-- Check past runs
SELECT * FROM past_runs WHERE user_id = auth.uid() ORDER BY created_at DESC LIMIT 5;

-- Check leaderboard
SELECT * FROM leaderboard LIMIT 10;
```

### ✅ Edge Function Deployment (Final 2%)

1. **Install Supabase CLI** (if not already):
   ```bash
   npm install -g supabase
   ```

2. **Login and link**:
   ```bash
   supabase login
   cd crypto-trader
   supabase link --project-ref yuobwpszomojorrjiwlp
   ```

3. **Set API key secret**:
   ```bash
   supabase secrets set COINGECKO_API_KEY=CG-PkKqSj9jtXcCR53uBnnYyNVf
   ```

4. **Deploy function**:
   ```bash
   supabase functions deploy update-game-prices
   ```

5. **Test it**:
   ```bash
   curl -X POST https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/update-game-prices \
     -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b2J3cHN6b21vam9ycmppd2xwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5ODI1MDQsImV4cCI6MjA2ODU1ODUwNH0.3ee0zwMXcl4-zlv5sn0gKyJ7BDjtKTVLbL73Qj6eNJs" \
     -H "Content-Type: application/json"
   ```

6. **Set up cron** (in Supabase SQL editor):
   ```sql
   -- Enable extension
   CREATE EXTENSION IF NOT EXISTS pg_cron;
   
   -- Schedule hourly updates
   SELECT cron.schedule(
     'update-game-prices',
     '0 * * * *',
     $$
     SELECT net.http_post(
       url:='https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/update-game-prices',
       headers:=jsonb_build_object(
         'Authorization', 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl1b2J3cHN6b21vam9ycmppd2xwIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1Mjk4MjUwNCwiZXhwIjoyMDY4NTU4NTA0fQ.KwV539YHeWRY7vRQ3pJcX6gKhYtGAWs9Rq2QCwqnlvE'
       )
     ) AS request_id;
     $$
   );
   ```

### ✅ Common Issues & Fixes

1. **Prices not updating?**
   - Check edge function logs in Supabase
   - Verify cron job: `SELECT * FROM cron.job;`
   
2. **Leaderboard empty?**
   - Need at least 2 games played
   - Check view: `SELECT * FROM leaderboard;`

3. **API errors?**
   - Check rate limits (CoinGecko free tier)
   - Verify API key is correct

### 🎉 Ready to Ship!

Once you've checked all these items, your Crypto Trading Simulator is:
- ✅ Feature complete
- ✅ Production ready
- ✅ Live price updates working
- ✅ 100% COMPLETE!

### 🚀 Optional Enhancements
- Add sound effects (toggle in config)
- Create mobile app version
- Add more cryptocurrencies
- Social sharing features
- Tournament mode