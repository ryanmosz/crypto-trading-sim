## Relevant Files

- `planning/mini-games/possible-mini-game-ideas.md` – Original idea / PRD for the Button-Mash Duel mini-game.
- `src/scenes/ButtonMashScene.js` – New Phaser scene implementing the mini-game.
- `src/services/realtime.js` – Supabase Realtime helper (extend if it already exists).
- `src/ui/DuelInviteModal.js` – UI component for selecting opponents & sending invites.
- `supabase/functions/record-duel-result/index.ts` – *Optional* Edge Function to persist duel outcomes.
- `src/scenes/DashboardScene.js` – Existing scene that will expose the "Duel" entry-point.
- `tests/mini-game/` – Jest/Cypress tests for the new feature set.

### Notes

- Unit tests should sit next to the files they test (e.g. `ButtonMashScene.test.js`).
- Execute all tests with `npm test` (Jest configured).

## Tasks

- [ ] 1.0 Define Game Design & Technical Spec
  - [ ] 1.1 Confirm 5-second mash rule & countdown UX
  - [ ] 1.2 Decide input-throttling limit (≤ 20 msgs/s)
  - [ ] 1.3 Finalise victory tie-breaker rule
  - [ ] 1.4 Document Realtime message schema
  - [ ] 1.5 Update product wiki with mini-game overview

- [ ] 2.0 Prepare Supabase Realtime Channel
  - [ ] 2.1 Establish channel naming: `button_mash:<gameId>:<duelId>`
  - [ ] 2.2 Verify same-origin requirement for auth tokens
  - [ ] 2.3 Extend `realtime.js` with `joinButtonMashChannel()`
  - [ ] 2.4 Implement presence payload (display name & colour)
  - [ ] 2.5 Manual two-browser auth test

- [ ] 3.0 Build ButtonMashScene (Gameplay)
  - [ ] 3.1 Scaffold new Phaser scene file
  - [ ] 3.2 Add 3-2-1-GO! countdown via timed events
  - [ ] 3.3 Capture `keydown`, increment local counter, broadcast `increment`
  - [ ] 3.4 Render opponent counter updates in real-time
  - [ ] 3.5 Emit `finish` message after 5 s with tallies
  - [ ] 3.6 Display win/lose result & "Return to Dashboard" button
  - [ ] 3.7 Unit-test timer & counter logic

- [ ] 4.0 Implement Invite / Accept UI Flow
  - [ ] 4.1 Add "Duel" button to `DashboardScene`
  - [ ] 4.2 Create `DuelInviteModal` listing online players (presence)
  - [ ] 4.3 Generate `duelId` & send `duel_invite` message
  - [ ] 4.4 Handle accept/decline → start scene on both clients
  - [ ] 4.5 Manage disconnect / navigation away edge-cases

- [ ] 5.0 Persist (Optional) Duel Results
  - [ ] 5.1 Add SQL table `mini_game_duels` (*optional*)
  - [ ] 5.2 Write `record-duel-result` Edge Function
  - [ ] 5.3 Call function from client after duel ends
  - [ ] 5.4 (Stretch) Show leaderboard stub on dashboard

- [ ] 6.0 QA & Integration Validation
  - [ ] 6.1 Manual two-browser happy-path test
  - [ ] 6.2 Simulate 200 ms latency → counters stay in sync
  - [ ] 6.3 Confirm auth failure for anonymous users
  - [ ] 6.4 Regression: existing Now-mode flow unaffected
  - [ ] 6.5 End-to-end Cypress test for duel flow