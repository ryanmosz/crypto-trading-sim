-- Migration: 004_public_usernames.sql
-- Purpose: Allow public reading of usernames for multiplayer features

-- Drop the restrictive policy
DROP POLICY IF EXISTS "Profiles are readable by owner" ON public.profiles;

-- Create new policies that allow public username reading
CREATE POLICY "Usernames are publicly readable"
  ON public.profiles 
  FOR SELECT 
  USING (true); -- Allow everyone to read profiles

-- Keep the existing write restrictions
-- (The INSERT and UPDATE policies remain unchanged) 