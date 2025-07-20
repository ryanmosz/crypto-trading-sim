# 🚀 Manual Supabase Setup Commands

Copy and run these commands in your Supabase SQL Editor:
https://supabase.com/dashboard/project/yuobwpszomojorrjiwlp/sql

## Step 1: Create Auth Profiles Table

```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username TEXT UNIQUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Profiles are readable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Profiles are writable by owner" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;

-- Create RLS policies
CREATE POLICY "Profiles are readable by owner"
  ON public.profiles 
  FOR SELECT 
  USING (auth.uid() = id);

CREATE POLICY "Profiles are writable by owner"
  ON public.profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles 
  FOR UPDATE
  USING (auth.uid() = id);

-- Create index for username lookups
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles(username);

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT SELECT ON public.profiles TO anon;
```

## Step 2: Create Core Game Tables

```sql
-- 1. Past runs table (historical mode results)
CREATE TABLE IF NOT EXISTS public.past_runs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  scenario_key TEXT NOT NULL,
  allocations JSONB NOT NULL,
  final_value NUMERIC(15,2) NOT NULL,
  finished_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on past_runs
ALTER TABLE public.past_runs ENABLE ROW LEVEL SECURITY;

-- Policies for past_runs
CREATE POLICY "Users can view own past runs"
  ON public.past_runs 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own past runs"
  ON public.past_runs 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 2. Now entries table (live mode allocations)
CREATE TABLE IF NOT EXISTS public.now_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE,
  allocations JSONB NOT NULL,
  start_prices JSONB NOT NULL,
  current_value NUMERIC(15,2),
  rank INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on now_entries
ALTER TABLE public.now_entries ENABLE ROW LEVEL SECURITY;

-- Policies for now_entries
CREATE POLICY "Now entries are publicly readable"
  ON public.now_entries 
  FOR SELECT 
  USING (true); -- Public leaderboard

CREATE POLICY "Users can insert own entries"
  ON public.now_entries 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 3. Now snapshots table (periodic portfolio valuations)
CREATE TABLE IF NOT EXISTS public.now_snapshots (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  entry_id UUID NOT NULL REFERENCES public.now_entries ON DELETE CASCADE,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  portfolio_value NUMERIC(15,2) NOT NULL
);

-- Enable RLS on now_snapshots
ALTER TABLE public.now_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies for now_snapshots
CREATE POLICY "Snapshots are publicly readable"
  ON public.now_snapshots 
  FOR SELECT 
  USING (true); -- For charting

-- 4. Price cache table
CREATE TABLE IF NOT EXISTS public.price_cache (
  symbol TEXT PRIMARY KEY,
  price NUMERIC(15,6) NOT NULL,
  fetched_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS on price_cache
ALTER TABLE public.price_cache ENABLE ROW LEVEL SECURITY;

-- Policies for price_cache
CREATE POLICY "Prices are publicly readable"
  ON public.price_cache 
  FOR SELECT 
  USING (true);

-- Only service role can update prices
CREATE POLICY "Only service role can update prices"
  ON public.price_cache 
  FOR ALL 
  USING (auth.role() = 'service_role');

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS past_runs_user_id_idx ON public.past_runs(user_id);
CREATE INDEX IF NOT EXISTS past_runs_scenario_key_idx ON public.past_runs(scenario_key);
CREATE INDEX IF NOT EXISTS now_entries_user_id_idx ON public.now_entries(user_id);
CREATE INDEX IF NOT EXISTS now_entries_rank_idx ON public.now_entries(rank);
CREATE INDEX IF NOT EXISTS now_snapshots_entry_id_idx ON public.now_snapshots(entry_id);
CREATE INDEX IF NOT EXISTS now_snapshots_timestamp_idx ON public.now_snapshots(timestamp);

-- Grant permissions
GRANT ALL ON public.past_runs TO authenticated;
GRANT ALL ON public.now_entries TO authenticated;
GRANT SELECT ON public.now_snapshots TO authenticated;
GRANT SELECT ON public.now_snapshots TO anon;
GRANT SELECT ON public.price_cache TO authenticated;
GRANT SELECT ON public.price_cache TO anon;
```

## Step 3: Create Leaderboard View (Optional)

```sql
-- Create a view for the current leaderboard
CREATE OR REPLACE VIEW public.now_leaderboard AS
SELECT 
  ne.id,
  ne.user_id,
  p.username,
  ne.allocations,
  ne.current_value,
  ne.rank,
  ne.created_at
FROM public.now_entries ne
LEFT JOIN public.profiles p ON ne.user_id = p.id
ORDER BY ne.rank ASC NULLS LAST, ne.current_value DESC NULLS LAST;

-- Grant access to the view
GRANT SELECT ON public.now_leaderboard TO authenticated;
GRANT SELECT ON public.now_leaderboard TO anon;
```

## Step 4: Test the Setup

After running all the above, test with this query:

```sql
-- Check all tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;
```

You should see:
- now_entries
- now_snapshots
- past_runs
- price_cache
- profiles

## Step 5: Edge Function Deployment

1. Go to: https://supabase.com/dashboard/project/yuobwpszomojorrjiwlp/functions
2. Click "New Function"
3. Name it: `fetch-prices`
4. Copy the contents of `crypto-trader/supabase/functions/fetch-prices/index.ts`
5. Deploy

## Step 6: Schedule Price Updates (After Edge Function is Deployed)

First, enable the extensions:
```sql
-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;
```

Then create the schedule (replace YOUR_SERVICE_ROLE_KEY):
```sql
-- Schedule price updates every 5 minutes
SELECT cron.schedule(
  'fetch-crypto-prices',
  '*/5 * * * *',
  $$
  SELECT net.http_post(
    url:='https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/fetch-prices',
    headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
  ) as request_id;
  $$
);
```

## 🎉 Setup Complete!

Your game now has:
- ✅ User authentication
- ✅ Data persistence
- ✅ Price tracking
- ✅ Leaderboard ready

Test it at: http://localhost:8001 