-- Migration: 003_multiplayer_tables.sql
-- Purpose: Create tables for multiplayer functionality

-- Add multiplayer flag to active_games
ALTER TABLE IF EXISTS public.active_games 
ADD COLUMN IF NOT EXISTS is_multiplayer BOOLEAN DEFAULT FALSE;

-- Create game_participants table
CREATE TABLE IF NOT EXISTS public.game_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID NOT NULL REFERENCES public.active_games(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    
    -- Player's allocation for this game
    allocations JSONB NOT NULL,
    starting_value NUMERIC DEFAULT 10000000,
    current_value NUMERIC,
    
    -- Join tracking
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_original_creator BOOLEAN DEFAULT FALSE,
    
    -- Unique constraint: one entry per user per game
    UNIQUE(game_id, user_id)
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_game_participants_game ON public.game_participants(game_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_user ON public.game_participants(user_id);

-- Enable RLS on game_participants
ALTER TABLE public.game_participants ENABLE ROW LEVEL SECURITY;

-- RLS Policies for game_participants
CREATE POLICY "Game participants are publicly readable"
  ON public.game_participants 
  FOR SELECT 
  USING (true); -- Public for leaderboards

CREATE POLICY "Users can join games"
  ON public.game_participants 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own participation"
  ON public.game_participants 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.game_participants TO authenticated;
GRANT SELECT ON public.game_participants TO anon; 