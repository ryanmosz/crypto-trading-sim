# 🚦 Crypto-Trading Sim – "Just Ship It" Roadmap (v0.1)

_Audience: internal devs & tech-savvy collaborators_
_Goal: deliver the **smallest** complete slice that fulfils the two headline user stories._

---

## 0. TL;DR

We already have:
✔️ Single-player **Past Mode** working locally with 2 canned scenarios & 2 playback speeds.

We still need (minimum viable):
1. Supabase auth & profile storage.
2. Persist a user’s Past-Mode runs and surface them in their dashboard.
3. A **Now Mode (global leaderboard version)** – one rolling contest everyone can join.
4. Simple web backend (Supabase functions) to record allocations & compute standings on a cron.

Everything else (private invites, fancy charts, extra speeds, more scenarios) is "vNext".

---

## 1. User Stories re-phrased as Finite-State Machines

### 1A – Past Mode FSM

```
[Logged-Out] --login--> [Dashboard]
[Dashboard] --select past--> [ScenarioSelect]
[ScenarioSelect] --run sim--> [Replay]
[Replay] --finish--> [ResultStored] --> back to [Dashboard]
```

States to persist: `userId`, `scenarioId`, `allocations[]`, `score`, `timestamp`.

### 1B – Now Mode (Global) FSM

```
[Dashboard] --select now--> [AllocateNow]
[AllocateNow] --submit--> [NowEntryStored]
[NowEntryStored] --cron price tick--> [ScoreUpdated] (repeat)
[User opens dashboard] -> view [LeaderboardSnapshot]
```

States to persist: `entryId`, `userId`, `allocations[]`, `createdAt`, `currentValue`, `rank`.

---

## 2. Minimal Data Model  (Supabase - Postgres)

Table | Key Columns | Notes
----- | ----------- | -----
`users` | id (uuid), email, handle | Supabase auth handles signup/login
`past_runs` | id, user_id, scenario_key, allocations (json), final_value, created_at | One row per replay
`now_entries` | id, user_id, allocations (json), start_prices (json), created_at | Current value & rank updated via cron
`prices_cache` | symbol, price, fetched_at | CoinGecko pull every 5 min

No joins? Keep queries dead simple.

---

## 3. Milestones & Sprint Order

Milestone | What we build | Timebox
--------- | -------------- | -------
M0  🔒  Auth + Profile stub | Enable Supabase email/password login. Show "My Replays" list (empty). | ½ day
M1  📜  Persist Past Runs | After replay finishes, POST to `/api/past_run`. Retrieve & list on dashboard. | 1 day
M2  🌐  Now Mode (global) | "Allocate-Now" screen → inserts into `now_entries`, cron job updates values & rank, simple leaderboard page. | 2–3 days
M3  🎁  Polish Pass | Loading states, basic error toasts, deploy to GH Pages + Supabase. | 1 day

_Total ≈ 1 working week._

---

## 4. Backend "API" Sketch (Supabase Edge Functions)

Route | Verb | Body | Action
----- | ---- | ---- | ------
`/past_run` | POST | `scenario_key, allocations[]` | compute final, insert row
`/past_run/list` | GET | - | return past_runs for user
`/now_entry` | POST | `allocations[]` | insert new entry w/ start prices
`/now_leaderboard` | GET | - | SELECT top 100 ordered by current_value

A scheduled function `cron/update_now_scores` every 5 min:
1. Fetch latest prices.
2. Re-calc `current_value` for each entry.
3. Re-rank.

---

## 5. Front-End Chops Needed

Component | Re-use? | New work
--------- | ------- | --------
LoginScene | new | call Supabase SDK
ScenarioSelectScene | keep | minor tweak: hide "Now" if not ready
ResultsScene | keep | add "Save" callback
DashboardScene (new) | list past runs & "Now" leaderboard

All other Phaser scenes stay as is.

---

## 6. Assumptions & Cut Lines

• Hourly granularity is fine for both past (replay) & now (scoring).
• No friend invites yet – global leaderboard only.
• Emails for signup (avoid OAuth complexity).
• Cron-driven updates acceptable (no real-time websockets).
• UI remains "text & numbers"; charts are stretch goals.

---

## 7. Next Step for Devs

1. Wire Supabase auth locally (`env.js` with anon/public keys).
2. Build M0 end-to-end (login → empty dashboard).
3. Celebrate, then crank through M1-M3.

Good enough to show investors and decide if it’s worth polishing further 🚀