# 🎯 NEXT-STEPS: M1 - Persist Past Runs (1 Day Sprint)

> **Current Status**: M0 Complete ✅ (Auth + Backend Infrastructure)  
> **Next Milestone**: M1 - Save game results & show user history

---

## Quick Context

We now have:
- ✅ Supabase auth working (test page verified)
- ✅ Database tables ready (past_runs, profiles)
- ✅ Live price updates every 5 minutes
- ✅ Game fully playable with fake users

We need:
- Real login/signup in the game
- Save results after each game
- Dashboard to view past games

---

## 1. Replace Fake Users with Auth (2 hours) ✅

### 1.1 Update LoginScene ✅
- [x] Import auth.js module
- [x] Replace Alice/Bob/Quick Play buttons with:
  - Email/password input fields
  - Sign Up button
  - Sign In button
- [x] Store user session in game state
- [x] Show logged-in user email

### 1.2 Handle Auth State ✅
- [x] Check for existing session on game start
- [x] If logged in → skip login, go to dashboard
- [x] If not → show login screen
- [x] Add Sign Out button somewhere

**Test**: Can sign up, sign in, and see email displayed

---

## 2. Save Game Results (1 hour) ✅

### 2.1 Modify ResultsScene ✅
- [x] When results load, immediately save to database:
  ```javascript
  // In ResultsScene.create()
  this.savePastRun();
  ```

### 2.2 Create savePastRun Method ✅
- [x] Get current user from auth
- [x] Prepare data:
  - scenario_key (e.g., 'march_2020')
  - allocations object
  - final_value
  - profit_percent
- [x] INSERT into past_runs table via Supabase client

**Test**: Play a game, check Supabase dashboard for new row

---

## 3. Create Dashboard Scene (2 hours) ✅

### 3.1 New DashboardScene ✅
- [x] Shows after login
- [x] Display:
  - Welcome message with user email
  - "Play New Game" button → ScenarioSelectScene
  - "My Past Games" section
  - Sign Out button

### 3.2 Load & Display Past Runs ✅
- [x] Query past_runs for current user
- [x] Sort by created_at DESC
- [x] Show each run:
  - Scenario name & date
  - Final value & profit %
  - When played
  - "Play Again" link

### 3.3 Add to Scene List ✅
- [x] Update game config to include DashboardScene
- [x] Update navigation flow

**Test**: See your game history after playing multiple rounds

---

## 4. Quick Wins (if time allows) ⏳

- [ ] Add loading states while saving/fetching
- [ ] Show success message after saving game
- [ ] Add basic error handling for auth failures
- [ ] Style the dashboard nicely

---

## 5. Commit Checkpoint ✅

```bash
git add -A
git commit -m "feat: M1 complete - auth integration & game persistence

- Replaced fake users with real Supabase auth
- Games now save to past_runs table
- Added dashboard showing user's game history
- Users can sign up, play, and track progress"
git push
```

---

## Success Criteria ✅

1. ✅ Can create account with email/password
2. ✅ Game saves results to database automatically
3. ✅ Dashboard shows all my past games
4. ✅ Can sign out and sign back in
5. ✅ Past games persist between sessions

---

## What's Next After This?

**M2: Now Mode** - Real-time multiplayer competition with live leaderboard

---

**Time Estimate**: ~~5-6 hours~~ 2 hours (completed!)
**Complexity**: Medium (mostly wiring existing pieces together) 