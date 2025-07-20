# 🚀 NEXT-STEPS CHECKLIST (48-Hour Sprint)

> Audience: **you** (and anyone pairing).
> Scope: Only the **very next** concrete actions; larger roadmap lives in `minimum-roadmap.md`.

---

## 0. Sanity Sync (15 min)

- [ ] Re-read `minimum-roadmap.md` once—catch anything fuzzy.
- [ ] Open a scratch doc (`/notes/today.md`) to log blockers/questions as they pop up.

---

## 1. Supabase Project Bootstrap (30 min)

1. Log in to Supabase → **New Project** `crypto-trading-sim`.
2. Copy `anon` and `service_role` keys into `.env.local` (keep local only).
3. Enable Row Level Security (RLS) globally (default is ON).
4. In SQL editor, paste the "M0-auth.sql" snippet below and run.

```sql
-- M0-auth.sql  ▶ basic auth schema
create table profiles (
  id uuid primary key references auth.users,
  username text,
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Profiles are readable by owner"
  on profiles for select using ( auth.uid() = id );
create policy "Profiles are writable by owner"
  on profiles for insert with check ( auth.uid() = id );
```

📌  Result: e-mail/password signup works & each user has a profile row.

---

## 2. Local Auth Smoke-Test (20 min)

- [ ] `npm i @supabase/supabase-js` inside `crypto-trader`.
- [ ] In a new `auth.js`, wire `signUp(email,pw)` + `signIn(email,pw)`; console-log the session.
- [ ] Hard-code a quick call in `public/game.js` (run once) to verify login succeeds.

---

## 3. Draft Detailed Data Model (1 h)

Open Supabase SQL editor → create a new script **`m1_core_tables.sql`** but DON’T run yet.

Table | Purpose | Key fields
----- | ------- | ----------
`past_runs` | stores completed historical replays | id pk, user_id fk, scenario_key, allocations jsonb, final_value, finished_at
`now_entries` | user’s live-mode allocation snapshot | id pk, user_id fk, allocations jsonb, start_prices jsonb, created_at
`now_snapshots` | periodic portfolio valuation (denormalised, keeps history) | entry_id fk, ts, portfolio_value
`price_cache` | latest price per symbol | symbol pk, price, fetched_at

🚩  Notes:
- `now_entries` is **append-only**; users can create multiple bets.
- `now_snapshots` populated by cron edge-function; lets us chart lines later.

*Leave TODO comments for indices & RLS policies—will flesh out after code spike.*

---

## 4. Price Ingestion Spike (45 min)

- [ ] Create folder `supabase/functions/fetch_prices/`.
- [ ] Use Supabase Edge-Functions template (`deno`).
- [ ] Inside, write minimal script: fetch BTC/ETH/BNB/SOL/XRP from CoinGecko → upsert into `price_cache`.
- [ ] Test locally: `supabase functions serve --env-file ./supabase/.env.local`.
- [ ] Schedule: in Supabase dashboard → "Scheduled triggers" → every 5 min.

Outcome: you now have fresh prices in DB → foundation for Future-mode valuation.

---

## 5. Commit & Push (10 min)

```bash
git add planning/rp-plan/next-steps.md
git add supabase/*
git commit -m "chore: bootstrap supabase auth, price-cache function stub"
git push
```

---

## 6. Tomorrow’s Focus Preview

1. Build Past-mode result write-back (`/api/past_run`).
2. Front-end – replace fake users with actual auth flow.
3. Crank through `m1_core_tables.sql`, RLS, and simple leaderboard view (`now_leaderboard`).

---

### 🔗  How Data Model Connects to Future-Mode

• `now_entries` holds **user choice** (allocations + start prices).
• Cron function reads `price_cache`, calc current value, inserts into `now_snapshots`, updates a materialized view `current_leaderboard`.
• Front-end fetches `/rpc/current_leaderboard` for live ranks.
✱  Because start_prices are stored per entry, we’re immune to later price-feed corrections.

---

Happy hacking!  Add / strike tasks directly in this file as you go.