# Mini-Game Task 5.0 – Persisting Duel Results (Optional)

## Table Sketch
```sql
CREATE TABLE IF NOT EXISTS public.mini_game_duels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  game_id UUID REFERENCES active_games(id) ON DELETE CASCADE,
  winner_id UUID REFERENCES auth.users(id),
  loser_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

## Edge Function: `record-duel-result`

The Edge Function resides at **`/supabase/functions/record-duel-result`**
( **not** in any draft folder). Deploy with:

```bash
supabase functions deploy record-duel-result --env-file supabase/.env
```

Input payload:
```json
{ "duelId":"...", "winner":"...", "loser":"..." }
```

## Steps
1. Create migration & policy (RLS: players can select on their own duels).
2. Implement Edge Function insert with service-role key.
3. Client call after duel ends.

## Future
- Build leaderboard view filtered by last 24 h wins.


### Migration & Security

Filename: `supabase/migrations/005_mini_game_duels.sql`

```sql
-- 005_mini_game_duels.sql
CREATE TABLE IF NOT EXISTS public.mini_game_duels ( ... );

ALTER TABLE public.mini_game_duels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Row owner can select"
  ON public.mini_game_duels
  FOR SELECT
  USING (auth.uid() = winner_id OR auth.uid() = loser_id);

CREATE POLICY "Service role insert only"
  ON public.mini_game_duels
  FOR INSERT
  WITH CHECK (auth.role() = 'service_role');
```

### Edge Function Stub (`record-duel-result/index.ts`)

```ts
import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const supabase = createClient(DENO_ENV.SUPABASE_URL, DENO_ENV.SERVICE_ROLE);
  const { duelId, winner, loser } = await req.json();

  const { error } = await supabase
    .from('mini_game_duels')
    .insert({ id: duelId, winner_id: winner, loser_id: loser });
  if (error) return new Response(error.message, { status: 400 });

  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json' } });
});
```

Deploy with:

```bash
supabase functions deploy record-duel-result \
  --no-verify-jwt
```