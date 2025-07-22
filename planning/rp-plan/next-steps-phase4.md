# Phase 4: Scene Integration (Current Phase)

## Overview
Now that the frontend service layer is complete and tested, we need to integrate the multiplayer functionality into the game's Phaser scenes.

## Key Considerations
- Game codes are case-sensitive (62^4 = ~14.8M possible combinations)
- Only 5 cryptocurrencies are tracked: BTC, ETH, BNB, SOL, XRP
- Service layer is in `/services/nowGameApi.js` with utility functions in `/utils/slug.js`

## Tasks

### 1. Update NowModeSetupScene ✅
- [x] Multiplayer toggle already exists
- [x] Passes isMultiplayer flag to AllocationScene

### 2. Update AllocationScene 
- [x] Already receives isMultiplayer flag
- [x] Passes it to NowModeResultScene

### 3. Update NowModeResultScene ✅
- [x] Import `createNowGame` from `/services/nowGameApi.js`
- [x] Call API when creating multiplayer games
- [x] Display game code prominently with format helper
- [x] Show "Share this code" message
- [x] Add copy-to-clipboard functionality
- [x] Handle loading state during API call
- [x] Show error messages if creation fails

### 4. Update DashboardScene ✅
- [x] Add "Join Game" button
- [x] Display game codes for multiplayer games
- [x] Navigate to JoinGameScene

### 5. Update JoinGameScene ✅
- [x] Input field for 4-character game code (case-sensitive)
- [x] Import `findGameByCode` from `/services/nowGameApi.js`
- [x] Show game details when code is found
- [x] Navigate to AllocationScene for joining
- [x] Handle "game not found" errors
- [x] Format code display with space

### 6. Update ActiveGameViewScene ✅
- [x] Import `getGameParticipants` from `/services/nowGameApi.js`
- [x] Show multiplayer leaderboard
- [x] Display all participants with their current values
- [x] Highlight current user
- [x] Auto-refresh participant data every minute

### 7. UI Improvements & Live Features 🚧
- [x] **Dashboard Active Games List**
  - [x] Fetch and display current user's updated value (not starting value)
  - [x] Add position indicator (e.g., "Pos. 2 of 2" or "2/2")
  - [x] Replace "X days left" with live countdown ("29d 23h 59m 45s")
  - [ ] Ensure JOIN/VIEW button shows correctly based on participation
- [x] **Live Countdown Timer**
  - [x] Create countdown utility function
  - [x] Format as "29d 23h 59m 45s"
  - [x] Update every second
  - [x] Calculate from game created_at + duration_days
  - [x] Add to: Dashboard list, Leaderboard header, Details page
- [x] **Leaderboard Improvements**
  - [x] Remove Allocation column to fix overlap
  - [x] Make entire rows clickable (add hover effects)
  - [x] Add countdown timer at top of leaderboard
- [x] **Game Details Page**
  - [x] Check if GameDetailsScene exists (or recover from git) - Used existing ActiveGameViewScene
  - [x] Show player name and current position
  - [x] Display current portfolio allocation
  - [x] Show performance metrics
  - [ ] Display trade history (if available)
  - [x] Works for ANY player in the game (not just logged-in user)
  - [x] Navigate from leaderboard row clicks

## Testing Checklist
- [ ] Create a game and verify code is displayed
- [ ] Join a game with exact case matching
- [ ] Verify case mismatch fails (e.g., "Q92U" vs "q92u")
- [ ] Check that only 5 cryptos show in price data
- [ ] Verify multiplayer leaderboard updates
- [ ] Test error handling for all API calls

## Phase 4 Complete! 🎉

All scene integration tasks have been completed. The multiplayer functionality is now fully integrated into the game:

1. **Game Creation** - Multiplayer games are created via the API and receive unique case-sensitive codes
2. **Game Code Display** - Codes are displayed with formatting (e.g., "Q9 2U") and copy-to-clipboard
3. **Join Flow** - Players can join games by entering the exact code (case-sensitive)
4. **Leaderboard** - Real-time multiplayer leaderboard with:
   - Rank display with medals for top 3
   - Player names and current values
   - Profit/loss percentages
   - Allocation breakdown
   - Current user highlighting
   - Auto-refresh every 60 seconds

Ready for full end-to-end testing!

### 8. Critical UI Fixes & Calculation Bugs 🔧
- [x] **Fix Details View Refresh Issue** (PRIORITY 1) ✅
  - [x] Prevent details view from kicking back to leaderboard on refresh
  - [x] Store current view state to survive data updates
  - [x] Only call scene.restart() when user explicitly navigates
- [ ] **Fix Percentage Calculation Bug** (PRIORITY 1) 
  - [ ] Beth shows 4.0% on leaderboard but 0.4% on details
  - [ ] Find the decimal/multiplication issue
  - [ ] Ensure consistent calculation across all views
- [x] **Fix Chart Data Issues** ✅
  - [x] Chart using wrong/stale data (shows $9.8M vs actual $10.04M)
  - [x] Fix chart showing negative when player is positive
  - [x] Add cyan line connecting the dots
  - [x] Fix "since start" to show actual date/time
  - [x] Use participant's current_value for chart endpoint
- [x] **Add Missing Info to Details Page** ✅
  - [x] Add game code (e.g., "S5DM") at top
  - [x] Add username (not "You") 
  - [x] Add total current value & change at bottom of holdings
  - [x] Remove "Detailed Portfolio Analysis" subtitle
- [x] **Fix Username Display** ✅
  - [x] Change "You" to actual username in leaderboard
  - [x] Keep the cyan bold styling for current user
- [ ] **Minimize Flicker** (if time permits)
  - [ ] Optimize data updates to reduce visual flicker
  - [ ] Only update changed DOM elements 