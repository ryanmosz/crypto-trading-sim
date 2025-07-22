# Mini-Game Task 2.0 – Supabase Realtime Channel

## Channel Naming
`button_mash:<gameId>:<duelId>`

## Steps
1. **Same-Origin Check**
   Run both local tabs at `http://localhost:5173` to ensure auth tokens propagate.
2. **Extend realtime.js**
   Add:
   ```js
   export function joinButtonMashChannel(gameId, duelId) { … }
   ```
3. **Presence Payload**
   ```js
   { id: user.id, name: profile.username, colour: playerColour }
   ```
4. **Auth Test**
   Two incognito windows → channel join → presence list length === 2.

## Success Criteria
- Both clients receive authenticated presence events.
- Increment messages propagate in under 150 ms round-trip.

### Quick-Start Code Snippet (ES Module)

```js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON
);

export async function joinButtonMashChannel(gameId, duelId) {
  const channelName = `button_mash:${gameId}:${duelId}`;
  const channel = supabase.channel(channelName, {
    config: { broadcast: { ack: true }, presence: { key: 'id' } }
  });

  // Presence
  channel.on('presence', { event: 'sync' }, () => {
    const users = channel.presenceState();
    console.log('Presence list', users);
  });

  // Broadcast
  channel.on('broadcast', { event: 'increment' }, ({ payload }) => {
    window.dispatchEvent(new CustomEvent('mm_increment', { detail: payload }));
  });

  // Connect & subscribe
  const { error } = await channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      console.info('Joined mini-game channel');
    }
  });
  if (error) throw error;
  return channel;
}
```

### Channel Lifecycle Checklist

1. **Create** channel via `supabase.channel(name)`.
2. **Before subscribe**: `channel.track(presencePayload)` to register user.
3. **Subscribe** and wait for `SUBSCRIBED`.
4. **Handle** events (`increment`, `start`, `finish`).
5. **On Scene shutdown**
   • `channel.untrack()` then `channel.unsubscribe()`.
6. **Error Handling**
   • Reconnect on `CLOSED` status (exponential backoff ≤ 3 retries).
   • If auth token refreshes, use `supabase.auth.onAuthStateChange` and re-join the channel with the new JWT.

### Throttling Helper

Use `lodash.throttle(sendIncrement, 50, { leading: true, trailing: false })`
to cap traffic at exactly 20 messages per second.

Ensure `throttle` lives outside of the React/Phaser update loop so the
function reference remains stable.