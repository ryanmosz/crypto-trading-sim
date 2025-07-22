-- Migration 005_mini_game_duels.sql
-- Purpose: store Button-Mash Duel outcomes

CREATE TABLE IF NOT EXISTS public.mini_game_duels (
  id UUID PRIMARY KEY,
  game_id UUID REFERENCES public.active_games(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES auth.users(id),
  loser_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE public.mini_game_duels
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Row owner can select own duels"
  ON public.mini_game_duels
  FOR SELECT
  USING (auth.uid() = winner_id OR auth.uid() = loser_id);

CREATE POLICY "Service role inserts allowed"
  ON public.mini_game_duels
  FOR INSERT
  WITH CHECK (true);

GRANT SELECT ON public.mini_game_duels TO authenticated;