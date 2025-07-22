/**
 * Supabase Realtime helper for the Button-Mash Duel mini-game.
 *
 * Usage:
 *   import { joinButtonMashChannel } from '../services/realtime.js'
 *   const channel = await joinButtonMashChannel(gameId, duelId, presencePayload);
 */

import { createClient } from '@supabase/supabase-js';
import { CHANNEL_PREFIX } from '../constants/minigame.js';

/* In draft space we fetch keys from window.CONFIG like the main app does */
const supabase = createClient(window.CONFIG.SUPABASE_URL, window.CONFIG.SUPABASE_ANON_KEY);

/**
 * Join (or create) a realtime channel dedicated to a duel.
 * @param {string} gameId  Parent game UUID
 * @param {string} duelId  Duel UUID
 * @param {object} presencePayload Arbitrary user data for presence tracking
 * @returns {Promise<RealtimeChannel>} The subscribed channel
 */
export async function joinButtonMashChannel(gameId, duelId, presencePayload = {}) {
  const channelName = `${CHANNEL_PREFIX}:${gameId}:${duelId}`;

  const channel = supabase.channel(channelName, {
    config: { broadcast: { ack: true }, presence: { key: 'id' } }
  });

  /* Register presence before subscribing */
  channel.track(presencePayload);

  /* Convenience wrappers */
  channel.onSync = (cb)       => channel.on('presence',  { event: 'sync'     }, cb);
  channel.onIncrement = (cb)  => channel.on('broadcast', { event: 'increment'}, cb);
  channel.onStart = (cb)      => channel.on('broadcast', { event: 'start'    }, cb);
  channel.onFinish = (cb)     => channel.on('broadcast', { event: 'finish'   }, cb);

  /* Subscribe */
  const { error } = await channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') console.info('[Mini-Game] Realtime channel ready');
  });
  if (error) throw error;

  return channel;
}