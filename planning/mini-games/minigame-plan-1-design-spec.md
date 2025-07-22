# Mini-Game Task 1.0 – Design & Technical Specification

## Goal
Lock down the precise game rules and the data contracts that all other tasks depend on.

### Sub-Tasks & Guidance
1. **Confirm 5-Second Mash Rule**
   Validate with product owner that the mash phase lasts exactly 5 s after the "GO!" cue.
2. **Decide Input-Throttling**
   Implement a debounce so that no more than 20 `increment` messages are emitted per player per second.
3. **Victory Tie-Breaker**
   • Option A: Whoever reaches the higher count wins.
   • Option B (tie): earliest timestamp of final key-press wins.
4. **Message Schema**
   Draft JSON contracts:
   ```json
   // increment
   { "type":"increment","playerId":"uuid","ts":1690000000 }
   // finish
   { "type":"finish","p1":42,"p2":37,"ts":1690000005 }
   ```
5. **Documentation**
   Update `/docs/game-modes.md` with a short description of Button-Mash Duel.

## Deliverables
- Updated PRD section
- Final JSON schema snippet
- Signed-off rulebook

### Reference Constants

| Constant | Value | Rationale |
| -------- | ----- | --------- |
| `MASH_DURATION_MS` | **5000** | Exactly 5 000 ms active phase |
| `COUNTDOWN_STEP_MS` | **1000** | 1 s between "3", "2", "1", "GO!" |
| `MAX_MSGS_PER_SEC` | **20** | Prevent WS spam & keyboard repeat |
| `WIN_TEXT` | `"You Win!"` | Copy agreed with UX |
| `LOSE_TEXT` | `"You Lose…"` | Copy agreed with UX |

These values are **authoritative** and should be imported by both the
frontend scene and any backend validation helpers to avoid drift.

### Definitive Message Contracts

```jsonc
// client → channel  (throttled)
{                               // type: increment
  "type": "increment",
  "duelId": "uuid",             // shared duel identifier
  "playerId": "uuid",           // sender’s auth.uid
  "count": 1,                   // always 1 – server tallies
  "ts": 1690000000123           // ms since epoch, from Date.now()
}

/* host → channel, sent once at T0 */
{
  "type": "start",
  "duelId": "uuid",
  "hostId": "uuid",
  "startTs": 1690000000000      // canonical start time
}

/* host → channel, sent exactly after 5 s */
{
  "type": "finish",
  "duelId": "uuid",
  "p1": 42,
  "p2": 37,
  "winnerId": "uuid",
  "ts": 1690000005123
}
```

All other keys are **forbidden**; validate with
`zod.strict()` or similar.

### UX Timeline

```
t-3s  Modal dims, both players in lobby
t-3s → t0  "3…2…1…" every 1 000 ms
t0    "GO!" flashes neon green, counters turn active
t0 → t+5 s Players mash keys; local counter updates immediately
t+5 s "TIME!" sound + vibration, counters freeze
t+5 s → t+5.5 s Host broadcasts finish tallies
t+6 s Winner text fades in, CTA button enabled ("Return to Dashboard")
```

Implementors must **sync to host’s `startTs`** to avoid drift on slow
clients.