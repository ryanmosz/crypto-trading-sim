-- Migration: 005_multiplayer_support.sql
-- Purpose: Add game_code column for multiplayer game joining

-- Add game_code column to active_games table
-- Note: is_multiplayer and participant_count already exist from previous migrations
ALTER TABLE public.active_games 
ADD COLUMN IF NOT EXISTS game_code TEXT UNIQUE;

-- Create index on game_code for fast lookups
CREATE INDEX IF NOT EXISTS idx_active_games_code 
ON public.active_games(game_code);

-- Enable RLS on active_games if not already enabled
ALTER TABLE public.active_games ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for multiplayer games on active_games table
-- Drop existing policies if they exist to avoid conflicts
DROP POLICY IF EXISTS "Users can view own active games" ON public.active_games;
DROP POLICY IF EXISTS "Users can create active games" ON public.active_games;
DROP POLICY IF EXISTS "Users can update own active games" ON public.active_games;

-- Create new RLS policies
-- Policy: Anyone can view open multiplayer games
CREATE POLICY "Public can view open multiplayer games"
  ON public.active_games 
  FOR SELECT 
  USING (
    (is_multiplayer = true AND is_complete = false) 
    OR 
    (auth.uid() = user_id)
  );

-- Policy: Authenticated users can create games
CREATE POLICY "Authenticated users can create games"
  ON public.active_games 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy: Game owners can update their games
CREATE POLICY "Game owners can update their games"
  ON public.active_games 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy: Game owners can delete their games
CREATE POLICY "Game owners can delete their games"
  ON public.active_games 
  FOR DELETE 
  USING (auth.uid() = user_id);

-- Grant necessary permissions
GRANT SELECT ON public.active_games TO anon; -- For viewing public multiplayer games
GRANT ALL ON public.active_games TO authenticated; -- For authenticated users 