# Multiplayer Testing Plan

## 🎯 Overview

This document outlines a comprehensive testing strategy for the multiplayer functionality in Crypto Trader Simulator. The testing will be done in phases to ensure all edge cases are covered.

## 📋 Pre-Testing Setup

### 1. Database Cleanup
Before testing, clean up old/invalid data:

1. Open `http://localhost:8001/test-db-cleanup.html`
2. Click "Refresh Stats" to see current data
3. Run these cleanup operations:
   - Find & Delete Invalid Games (no game codes)
   - Find & Remove Extra Cryptos (keep only BTC, ETH, BNB, SOL, XRP)
   - Optional: Full Game Reset for clean slate

### 2. Test Accounts
- **Browser 1**: Log in as `adam@test.com`
- **Browser 2**: Use private/incognito mode, log in as `beth@test.com`
- **Browser 3** (optional): Use different browser, log in as `charlie@test.com`

### 3. Test URLs

#### Primary Test Pages:
- **Comprehensive Test**: `http://localhost:8001/test-multiplayer-comprehensive.html`
- **Simple API Test**: `http://localhost:8001/test-api-simple.html`
- **Full API Test**: `http://localhost:8001/test-multiplayer-api.html`
- **Database Cleanup**: `http://localhost:8001/test-db-cleanup.html`

#### Main Application:
- **Game**: `http://localhost:8001/`

## 🧪 Test Scenarios

### Phase 1: Basic Multiplayer Flow

#### Test 1.1: Create Game (Adam)
1. Open comprehensive test page as Adam
2. Click "Create 30-Day Game"
3. Verify:
   - Game code displayed (4 characters, case-sensitive)
   - Starting prices shown for only 5 cryptos
   - Game appears in "My Games" list

#### Test 1.2: Join Game (Beth)
1. Open comprehensive test page as Beth
2. Enter the game code from Test 1.1
3. Click "Find Game"
4. Verify:
   - Game details shown correctly
   - Can join with same or different allocations
   - Join button works

#### Test 1.3: View Leaderboard
1. In both browsers, click "View Leaderboard"
2. Verify:
   - Both players shown
   - Current values displayed
   - Allocations visible
   - User's own row highlighted

### Phase 2: Edge Cases

#### Test 2.1: Case Sensitivity
1. Create game, note code (e.g., "Q92U")
2. Try finding with wrong case (e.g., "q92u")
3. Verify: Game NOT found (case matters!)

#### Test 2.2: Invalid Operations
1. Try to join own game → Should fail
2. Try to join same game twice → Should fail
3. Try bad allocations (sum ≠ 10) → Should fail
4. Try expired game → Should show as expired

#### Test 2.3: Multiple Games
1. Adam creates 3 different games
2. Beth joins 2 of them
3. Charlie joins all 3
4. Verify each leaderboard shows correct participants

### Phase 3: In-Game Testing

#### Test 3.1: Full Game Flow
1. In main app, go to Dashboard
2. Click "Start New Game" → "Now Mode"
3. Enable multiplayer toggle
4. Choose duration and allocations
5. Verify game code displayed after creation

#### Test 3.2: Join via Main App
1. In second browser, click "Join Multiplayer"
2. Enter code from Test 3.1
3. Complete allocation
4. Verify joined successfully

#### Test 3.3: Active Games View
1. Go to Dashboard → Active Games tab
2. Click on multiplayer game
3. Verify:
   - Leaderboard displays correctly
   - Medals for top 3
   - Auto-refresh working (wait 60s)

### Phase 4: Stress Testing

#### Test 4.1: Rapid Creation
1. Use comprehensive test page
2. Click "Create 5 Games Rapidly"
3. Verify all games created with unique codes

#### Test 4.2: Price Updates
1. Click "Trigger Price Update"
2. Wait for update
3. Check leaderboards update accordingly

#### Test 4.3: Concurrent Access
1. Have 3+ users viewing same leaderboard
2. Trigger price update
3. All should update within 60s

## 🐛 Known Issues to Watch For

1. **Price Data**: Ensure only 5 cryptos (BTC, ETH, BNB, SOL, XRP) appear
2. **Case Sensitivity**: Codes MUST be case-sensitive
3. **Auto-refresh**: Leaderboard should update every 60 seconds
4. **CORS**: All Edge Functions should handle CORS properly

## 📊 Success Criteria

- [ ] Can create multiplayer games with unique codes
- [ ] Codes are case-sensitive (62^4 possibilities)
- [ ] Can join games with exact code match
- [ ] Cannot join own game or same game twice
- [ ] Leaderboard shows all participants correctly
- [ ] Only 5 cryptocurrencies tracked
- [ ] Auto-refresh works every 60 seconds
- [ ] All Edge Functions respond correctly
- [ ] No console errors during normal flow

## 🔧 Troubleshooting

### Common Issues:

1. **"CONFIG not loaded"**
   - Refresh the page
   - Check console for script loading errors

2. **"Failed to create game"**
   - Check Edge Function logs
   - Verify service role key is used

3. **Wrong cryptos showing**
   - Run cleanup to remove extra cryptos
   - Check fetch-prices function

4. **Can't join game**
   - Verify exact case match
   - Check if already joined
   - Ensure game not expired

## 📝 Test Results Template

```
Date: ___________
Tester: ___________

Basic Flow:
- [ ] Create game: ______
- [ ] Join game: ______  
- [ ] View leaderboard: ______

Edge Cases:
- [ ] Case sensitivity: ______
- [ ] Invalid operations: ______
- [ ] Multiple games: ______

In-Game:
- [ ] Full flow: ______
- [ ] Join flow: ______
- [ ] Active view: ______

Notes:
_________________________
_________________________
```

## 🚀 Next Steps After Testing

1. Document any bugs found
2. Note UX improvements needed
3. Performance observations
4. Feature requests from testing

Remember: The goal is to ensure a smooth multiplayer experience before public release! 