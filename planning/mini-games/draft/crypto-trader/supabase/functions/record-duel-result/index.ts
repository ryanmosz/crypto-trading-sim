import { serve } from 'std/server';
import { createClient } from '@supabase/supabase-js';

serve(async (req) => {
  const body = await req.json();
  const { duelId, winnerId, loserId } = body;

  if (!duelId || !winnerId || !loserId) {
    return new Response('Invalid payload', { status: 400 });
  }

  const supabase = createClient(Deno.env.get('SUPABASE_URL')!,
                                Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);

  const { error } = await supabase
    .from('mini_game_duels')
    .insert({ id: duelId, winner_id: winnerId, loser_id: loserId });

  if (error) return new Response(error.message, { status: 500 });

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json' }
  });
});