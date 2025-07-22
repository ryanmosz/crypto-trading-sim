# ✅ Future Multiplayer — Implementation Checklist

_A concise roadmap of tasks (no code)_

## Phase 0 – Pre-work (Scene Split)
- [x] Extract each Phaser scene from **game.js** into its own file under `/scenes`
- [x] Update import/bootstrapping code in `index.js`
- [x] Verify build runs unchanged

## Phase 1 – Database & Security
- [x] Apply **migration 004**
  • add `game_code`, `is_multiplayer`, `participant_count` columns to `active_games`
  • ensure `game_participants` table exists
  • create indexes on `game_code`
- [x] Create / update **RLS policies** for `active_games` & `game_participants`

## Phase 2 – Backend Functions
- [x] Edge Function **`create_game`**
  • validate payload, generate 4-char slug, insert game & creator participant
- [x] Edge Function **`join_game`**
  • prevent duplicate join, insert participant, bump `participant_count`
- [x] Cron/Edge Function **`update_active_games`**
  • every 5 min fetch prices, update games & participants, mark complete when due

## Phase 3 – Front-End Service Layer
- [x] Implement `services/nowGameApi.js` (wrapper around the above functions)
- [x] Add `utils/slug.js` for slug generation (client fallback/testing)

## Phase 4 – Scene Updates
- [ ] **NowModeSetupScene**
  • call `create_game`, receive slug & starting prices
- [ ] **DashboardScene**
  • Active tab: fetch open multiplayer games, show JOIN button
- [ ] **JoinGameScene** (new)
  • display game info + participants, route to AllocationScene
- [ ] **AllocationScene**
  • when joining, use `starting_prices` from game, call `join_game`
- [ ] **NowModeResultScene**
  • show "Game Created / Joined" confirmation with slug
- [ ] **ActiveGameViewScene**
  • if multiplayer, render leaderboard of participants

## Phase 5 – QA & Polish
- [ ] Manual test: create game, join with second account, values update
- [ ] Edge-case test: join near game end, verify price baseline
- [ ] UI pass: truncate long usernames, colour-codes for profit/loss
- [ ] Smoke-test past-mode to ensure no regression

## Phase 6 – Deploy & Monitor
- [ ] Deploy edge functions to production
- [ ] Schedule cron job
- [ ] Add basic logging/alerts