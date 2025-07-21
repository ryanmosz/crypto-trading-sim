# 🧪 Comprehensive Testing Protocol - Crypto Trading Simulator

## Test User: Ted (ted@test.com)

### Phase 1: Authentication & Onboarding (5 min)

#### 1.1 New User Signup
- [ ] Navigate to game URL
- [ ] Click "Sign Up" mode
- [ ] Enter: ted@test.com / password123
- [ ] Verify signup success
- [ ] ✅ **Expected**: Dashboard loads with "Welcome, ted!"

#### 1.2 Tutorial Flow
- [ ] Verify tutorial starts automatically on first login
- [ ] Click through each tutorial step:
  1. [ ] Welcome message
  2. [ ] NEW GAME tab explanation
  3. [ ] ACTIVE tab explanation
  4. [ ] PAST tab explanation
  5. [ ] Leaderboard button explanation
  6. [ ] Start New Game prompt
- [ ] Click "START NEW GAME" when tutorial prompts
- [ ] ✅ **Expected**: Tutorial continues on ScenarioSelectScene

#### 1.3 Complete Tutorial
- [ ] Continue tutorial through scenario selection
- [ ] Follow tutorial through allocation screen
- [ ] Click "Skip Tutorial" or complete all steps
- [ ] ✅ **Expected**: Tutorial marked complete, no longer shows on refresh

### Phase 2: Historical Trading (10 min)

#### 2.1 First Historical Game - COVID Crash
- [ ] From dashboard, click "START NEW GAME"
- [ ] Select "March 12, 2020 - COVID Crash"
- [ ] Select "1x Speed" (24 hours in 30 seconds)
- [ ] Allocation screen:
  - [ ] Verify starting money: $10,000,000
  - [ ] Allocate: BTC: 30%, ETH: 30%, BNB: 20%, XRP: 20%
  - [ ] Use + and - buttons to adjust
  - [ ] Verify CASH updates correctly
  - [ ] Click "LOCK IN"
- [ ] Watch simulation:
  - [ ] Verify prices drop (red numbers)
  - [ ] Verify portfolio value decreases
  - [ ] Wait for completion
- [ ] Results screen:
  - [ ] Verify loss around -36.4%
  - [ ] Verify "Black Thursday got you!" message
  - [ ] Click "SAVE RESULTS"
- [ ] ✅ **Expected**: Returns to dashboard, game appears in PAST tab

#### 2.2 Second Historical Game - Bull Run
- [ ] Click "START NEW GAME" again
- [ ] Select "2013 - Bitcoin's First Bull Run"
- [ ] Select "100x Speed" (365 days in 3.65 seconds)
- [ ] Allocation: 100% BTC (note: only BTC available)
- [ ] Watch massive gains
- [ ] Save results
- [ ] ✅ **Expected**: Huge profit (8000%+)

### Phase 3: Now Mode - Active Game (10 min)

#### 3.1 Start Now Mode Game
- [ ] Click "START NEW GAME"
- [ ] Select "Trade with real-time prices"
- [ ] Click "UPDATE PRICES" button
- [ ] Verify current prices load
- [ ] Select "30 DAYS"
- [ ] Allocate diversified portfolio:
  - [ ] BTC: 25%
  - [ ] ETH: 25%
  - [ ] SOL: 25%
  - [ ] BNB: 15%
  - [ ] XRP: 10%
- [ ] Click "BEGIN TRACKING"
- [ ] ✅ **Expected**: Game saves, redirects to dashboard ACTIVE tab

#### 3.2 View Active Game
- [ ] Verify game appears in ACTIVE tab
- [ ] Shows "30 days left"
- [ ] Shows current value and profit %
- [ ] Click "VIEW" button
- [ ] Active game details:
  - [ ] Verify performance chart displays
  - [ ] Check portfolio breakdown
  - [ ] Verify "Last updated" timestamp
- [ ] Return to dashboard
- [ ] ✅ **Expected**: All data displays correctly

### Phase 4: Multiplayer Features (15 min)

#### 4.1 Create Multiplayer Game
- [ ] From ACTIVE tab, find the Now mode game
- [ ] Note: All games are multiplayer by default
- [ ] Copy game details for Beth

#### 4.2 Test with Second User - Beth
- [ ] Open incognito/private window
- [ ] Sign up as beth@test.com / password123
- [ ] Complete quick tutorial (can skip)
- [ ] Go to ACTIVE tab
- [ ] Find Ted's game (should show as joinable)
- [ ] Click "JOIN" button
- [ ] Make different allocations:
  - [ ] BTC: 10%
  - [ ] ETH: 10%
  - [ ] SOL: 60%
  - [ ] BNB: 10%
  - [ ] XRP: 10%
- [ ] Lock in allocations
- [ ] ✅ **Expected**: Beth successfully joins Ted's game

#### 4.3 Multiplayer Interactions
- [ ] As Ted: Go to ACTIVE tab
- [ ] View the active game
- [ ] Click participant count (should show "2 players")
- [ ] View leaderboard within game
- [ ] ✅ **Expected**: Both Ted and Beth appear with usernames

#### 4.4 Test Leaderboard
- [ ] As Ted: Click "VIEW LEADERBOARD" from dashboard
- [ ] Verify global leaderboard loads
- [ ] Check for both users' entries
- [ ] ✅ **Expected**: Shows rankings across all games

### Phase 5: Tab Navigation & UI (5 min)

#### 5.1 Tab Switching
- [ ] Click through all tabs multiple times:
  - [ ] NEW GAME → ACTIVE → PAST → NEW GAME
  - [ ] Verify no content overlap
  - [ ] Verify tab highlights correctly
- [ ] ✅ **Expected**: Clean transitions, no visual artifacts

#### 5.2 Past Games Pagination
- [ ] Go to PAST tab
- [ ] If > 4 games, test pagination:
  - [ ] Click down arrow
  - [ ] Verify page 2 loads
  - [ ] Click up arrow
  - [ ] Verify returns to page 1
- [ ] View past game details:
  - [ ] Click on a past game
  - [ ] Navigate between Summary/Details views
  - [ ] Check all values display correctly
- [ ] ✅ **Expected**: Smooth navigation

### Phase 6: Edge Cases & Error Handling (5 min)

#### 6.1 Session Persistence
- [ ] Refresh the page (F5)
- [ ] ✅ **Expected**: Auto-login, maintains dashboard state

#### 6.2 Quick User Switching
- [ ] Click "Sign Out"
- [ ] Login as Ted again
- [ ] Verify all games still present
- [ ] ✅ **Expected**: Data persists correctly

#### 6.3 Price Updates
- [ ] Start new Now mode game
- [ ] Click "UPDATE PRICES" multiple times
- [ ] Verify "Last update" timestamp changes
- [ ] ✅ **Expected**: No errors, prices update

#### 6.4 Allocation Edge Cases
- [ ] Try to allocate > 100%
- [ ] Try negative allocations
- [ ] Try to proceed with 0% allocated
- [ ] ✅ **Expected**: Proper validation messages

### Phase 7: Performance & Polish (5 min)

#### 7.1 Loading States
- [ ] Note any screens with delays
- [ ] Check for loading indicators
- [ ] ✅ **Expected**: No frozen UI

#### 7.2 Mobile Responsiveness
- [ ] Open developer tools (F12)
- [ ] Toggle device toolbar
- [ ] Test on mobile viewport (375x667)
- [ ] ⚠️ **Note**: Game designed for desktop, check usability

#### 7.3 Console Errors
- [ ] Open browser console
- [ ] Navigate through entire app
- [ ] ✅ **Expected**: No red errors (warnings OK)

### Phase 8: Automated Features (Wait Time)

#### 8.1 Price Updates (5 min wait)
- [ ] Note current prices in active game
- [ ] Wait 5 minutes
- [ ] Refresh and check active game
- [ ] ✅ **Expected**: Prices updated via cron job

#### 8.2 Game Value Updates (1 hour wait - optional)
- [ ] Note portfolio value
- [ ] Wait 1 hour
- [ ] Check if value updated
- [ ] ✅ **Expected**: Hourly updates via cron job

---

## 🎯 Testing Summary

### Critical Paths to Verify:
1. ✅ New user can sign up and see tutorial
2. ✅ Historical trading works with accurate results
3. ✅ Now mode creates active games
4. ✅ Multiplayer allows joining and shows usernames
5. ✅ All tabs function without overlap
6. ✅ Data persists across sessions

### Time Estimate: 45-50 minutes
- Phase 1-6: 45 minutes active testing
- Phase 7-8: Optional extended testing

### Bug Report Format:
```
ISSUE: [Brief description]
STEPS: [How to reproduce]
EXPECTED: [What should happen]
ACTUAL: [What actually happened]
BROWSER: [Chrome/Firefox/Safari + version]
CONSOLE: [Any errors]
```

### Success Criteria:
- [ ] All core features work as designed
- [ ] No blocking bugs found
- [ ] UI is responsive and polished
- [ ] Multiplayer shows correct usernames
- [ ] Tutorial guides new users effectively
- [ ] Data persists correctly

---

## 🚀 Quick Smoke Test (5 min)

If short on time, prioritize:
1. Sign up as new user
2. Complete one historical game
3. Start a Now mode game
4. Check ACTIVE tab shows game
5. Sign out and back in
6. Verify data persisted

Good luck, Ted! 🎮 