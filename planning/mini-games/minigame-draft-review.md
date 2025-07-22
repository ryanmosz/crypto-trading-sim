# 🕹️ Button-Mash Duel – Draft Implementation Review
*Date: 2025-07-22*

## 1. Executive Summary
The current **draft** for the Button-Mash Duel mini-game is a solid proof-of-concept.
Gameplay logic, real-time channel wiring, and basic UI scaffolding are present.
However, several structural, naming and integration issues must be resolved before
merging into the main Crypto-Trader codebase or deploying to Supabase.

**Verdict:** _Works as an isolated prototype_, **needs refinement** for production.

---

## 2. What Already Works 🔥
| Area | Notes |
| ---- | ----- |
| Core constants (`constants/minigame.js`) | Correct values & exported symbols. |
| Scene logic (`ButtonMashScene.js`) | Countdown, throttled input, increment broadcast, finish logic. |
| Realtime helper (`services/realtime.js`) | Clean wrappers around presence & broadcast. |
| Modal stub (`ui/DuelInviteModal.js`) | Adequate for UI prototype. |
| SQL migration & Edge Function drafts | Correct table schema & service-role insert logic. |

---

## 3. Key Issues & Gaps 🛠️

1. **Duplicate / Conflicting Paths (RESOLVED)**
   The extraneous draft directory that lived under
   `public/services/planning/mini-games/draft/…` has been removed, leaving a
   single canonical copy of all Button-Mash Duel draft code under
   `planning/mini-games/draft/crypto-trader/**`.
   No further action needed on this item.

2. **Host Determination Logic**
   * The current host check
     `if (this.userId === this.opponentId /* temp host condition */)`
     is incorrect; both IDs will never match.
     ➜ Decide host role (e.g., lexicographic min(userId, opponentId)) or
     introduce an explicit `isHost` flag in scene data.

3. **Race on `finish` Broadcast**
   * Both clients call `broadcastFinish()`. A simple dedupe strategy
     (first payload wins) is needed server-side or in-client.

4. **Throttle Enforcement**
   * Client throttles to 20 msg/s, but server has no guard.
     ➜ Add `COUNT(distinct ...)` check in Edge Function or rely on Realtime
     rate limits (document this).

5. **Supabase Function Paths**
   * Draft Edge Function paths live under
     `public/services/planning/…/supabase/functions`.
     In production they must move to
     `supabase/functions/record-duel-result/`.

6. **Missing Integration Points**
   * `ButtonMashScene` is **not registered** in `public/index.js`.
   * No UI in `DashboardScene` to open `DuelInviteModal`.
   * No build / asset pipeline for mini-game sprites.

7. **TypeScript Edge Function**
   * `record-duel-result/index.ts` imports `Deno.env.get` keys that are not
     defined in local `.env` samples; add them before deploy.

8. **Security / RLS**
   * Policy allows any authenticated user to insert duel rows if they know
     IDs; consider `WITH CHECK (auth.role() = 'service_role')` or run
     function with `service_role` only.

9. **Testing**
   * No Jest / Cypress tests yet (defined in checklist).
     ➜ Add unit tests for countdown timer & message handling.

---

## 4. Recommended File Moves / Deletions
| Action | From | To |
| ------ | ---- | -- |
| **KEEP** | `planning/mini-games/draft/**` | Reference only |
| **MOVE** | Draft sources | `public/mini-games/…` (one clean folder) |
| **DELETE** | Duplicate draft tree under `public/services/planning/mini-games/draft/**` | — |

---

## 5. Next-Step Checklist ✅

1. **De-duplicate & organise files** (high)
   * Keep single source of truth in `public/mini-games/`.

2. **Implement host selection & single-finish rule** (high).

3. **Integrate with main game**
   * Add scene import in `public/index.js`.
   * Register invite button in `DashboardScene` → open `DuelInviteModal`.
   * Wire modal → `ButtonMashScene` launch.

4. **Edge Function hardening**
   * Validate JWT, restrict to service role.
   * Add input schema validation (Zod).

5. **Update migrations**
   * Rename `005_mini_game_duels.sql` to next sequential number in real
     migrations folder (`006_…`) and delete draft copies.

6. **Automated tests**
   * Unit tests for scene timer, broadcast handling.
   * Cypress e2e: invite → accept → duel flow.

7. **Assets & Styling**
   * Add countdown sprites / GO! graphic to `/public/assets/`.
   * Replace placeholder fonts with game fonts.

8. **Performance & Cleanup**
   * Unsubscribe channel on `shutdown()`.
   * Pause timers when tab hidden (Phaser auto-pause covers most cases).

---

## 6. Detailed Implementation Plans

### 2. Host Determination Logic
*Decision*
Use a deterministic rule so both clients independently agree on the host (the client responsible for sending the authoritative `start` and `finish` messages).

*Implementation Steps*
1. Add an `isHost` flag to the data passed into `ButtonMashScene` (`scene.start('ButtonMashScene', { …, isHost })`).
2. Compute `isHost` in the launching scene by sorting the two `userId`s and picking the lexicographically-smallest as host.
3. Replace the temporary check in `ButtonMashScene.create()` with:
   ```js
   if (this.isHost) this.time.delayedCall(500, () => this.broadcastStart());
   ```
4. Guard `broadcastFinish()` so **only the host** sends it.

### 3. Race on `finish` Broadcast
*Decision*
Only the host transmits `finish`. Non-hosts ignore any local timeout.

*Implementation Steps*
1. After adding the `isHost` flag (see #2), wrap `broadcastFinish()` with:
   ```js
   if (!this.isHost || this.finishSent) return;
   this.finishSent = true;
   ...
   ```
2. In `handleFinish` guard against duplicate receipts (`if (this.matchComplete) return;`).

### 4. Throttle Enforcement
*Decision*
Keep client-side throttle (20 msg/s) and document Realtime’s built-in 1 KB/s limit; add lightweight server validation later if needed.

*Implementation Steps*
1. Export `MAX_MSGS_PER_SEC` in constants.
2. Document throttle in README / API doc.
3. Optional: add a counter in the Edge Function that discards >20 msgs/s per connection (future).

### 5. Supabase Function Paths
*Decision*
Move the draft Edge Function to the canonical serverless folder.

*Implementation Steps*
1. Physically move `public/services/planning/mini-games/draft/crypto-trader/supabase/functions/record-duel-result/` → `supabase/functions/record-duel-result/`.
2. Delete all duplicate draft copies.
3. Update deployment script (`supabase functions deploy record-duel-result`).

### 6. Missing Integration Points
*Dashboard UI*
1. Add a "Duel" button in `DashboardScene` (Active tab) → opens `DuelInviteModal`.
2. Wire `onInvite` to create a `duelId` (uuid) and start `ButtonMashScene` on both clients via Realtime invite message.

*Game Registration*
1. Register `ButtonMashScene` in `public/index.js` scene list.
2. Add asset pre-loads (count-down sprites, "GO!" graphic) in `ButtonMashScene.preload()`.

### 7. TypeScript Edge Function Env Keys
*Decision*
Expose `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` in the Supabase function’s project-level `.env` file and reference via `Deno.env.get()`.

*Implementation Steps*
1. Create `/supabase/.env` with the two keys.
2. Document in `README` how to `supabase functions deploy --env-file supabase/.env`.

### 8. Security / RLS
*Decision*
Restrict inserts to the service role, keep selects for row owners.

*Implementation Steps*
1. Replace the current insert policy with:
   ```sql
   CREATE POLICY "Service role insert only"
     ON public.mini_game_duels
     FOR INSERT
     WITH CHECK (auth.role() = 'service_role');
   ```
2. Ensure Edge Function is deployed with `--no-verify-jwt` and uses the service-role key.

### 9. Testing Strategy
*Unit Tests* (`jest`)
1. `ButtonMashScene` – countdown ends at ~5000 ms (±50 ms).
2. `realtime.js` – emits `onIncrement` & `onFinish` callbacks.

*E2E* (`cypress`)
1. Player A clicks "Duel", invites Player B.
2. Both mash for 5 s; winner text matches server result.
3. Verify duel row persisted via `mini_game_duels` table.

---

## 7. Conclusion 📌
The draft lays a strong foundation; only moderate clean-up,
deduplication, and integration work remain. Address the high-priority
items (1-3) before merging into `main`.
With these fixes, Button-Mash Duel will integrate smoothly into the
Crypto-Trader ecosystem and provide a fun, low-risk competitive mini-game
for players.

## 8. Post-Implementation Review (2025-07-22)

Below is a consolidated "state-of-the-union" snapshot after applying the latest
planning edits and runtime patches.

### 1. What’s solid
• Deterministic gameplay loop
  – `isHost` flag passed into `ButtonMashScene`; host alone emits canonical
    **start** and **finish**.
  – Duplicate-finish defence with `matchComplete` / `finishSent`.
  – Client-side input throttle (20 msg/s) in place.

• Realtime helper (`realtime.js`) exposes clear `onStart / onIncrement /
  onFinish` hooks.

• Constants live in a single file
  (`constants/minigame.js`) and are consumed by both the scene and helper.

• Planning artefacts (checklist + **minigame-plan-1…6** files) are aligned with
  the codebase; every open issue maps to a parent task + sub-tasks.

• RLS policy tightened in `005_mini_game_duels.sql`
  (`service_role` insert-only).

---

### 2. Remaining gaps / next actions
A. **Project structure & build**
   1. Move the *draft* tree into real `public/mini-games/` & `supabase/` roots.
   2. Register `ButtonMashScene` in `public/index.js`; preload assets.
   3. Add countdown sprites / "GO!" graphic under `/assets/minigame/`.

B. **Invite / launch flow**
   • Flesh out `DuelInviteModal` and add a "Duel" button in
     `DashboardScene`.
   • Generate `duelId`, broadcast `duel_invite`, compute `isHost` (lexicographic
     min `userId`), then start `ButtonMashScene` on both clients.

C. **Edge Function & migration placement**
   • Move `record-duel-result` to `supabase/functions/` and bump migration to
     `006_…`.
   • Provide `.env` with `SUPABASE_SERVICE_ROLE_KEY`.

D. **Testing**
   • Jest: countdown timing, host determination, duplicate-finish guard.
   • Cypress: invite → accept → mash → winner persists row.

E. **Scene housekeeping**
   • Ensure timers & channel unsubscribes in `shutdown()`.
   • Optional `visibilitychange` handling for background tabs.

F. **Security & quotas**
   • Document 20 msg/s throttle; rely on Realtime limits for now.
   • Confirm Edge Function runs with service-role key (`--no-verify-jwt`).

---

### 3. Checklist parity
All items in **minigame-plan-checklist.md** now correspond to active technical
work:

0.0 ✅ Duplicate-paths resolved
7.0-13.0 ➜ Host logic, single-finish, throttle, Supabase paths/env,
security/RLS, integration, tests — all present and cross-linked to the six
design docs.

---

### 4. Overall verdict
Foundation is solid and works in isolation.  Remaining effort is mainly
integration (invite UI, asset loading, repo moves) plus automated tests.  No
architectural blockers detected.