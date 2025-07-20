-- Migration: 002_core_tables.sql
-- Purpose: Create core game data tables with RLS

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