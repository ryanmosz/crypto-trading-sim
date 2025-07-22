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