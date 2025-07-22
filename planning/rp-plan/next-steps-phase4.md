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

### 6. Update ActiveGameViewScene
- [ ] Import `getGameParticipants` from `/services/nowGameApi.js`
- [ ] Show multiplayer leaderboard
- [ ] Display all participants with their current values
- [ ] Highlight current user
- [ ] Auto-refresh participant data

## Testing Checklist
- [ ] Create a game and verify code is displayed
- [ ] Join a game with exact case matching
- [ ] Verify case mismatch fails (e.g., "Q92U" vs "q92u")
- [ ] Check that only 5 cryptos show in price data
- [ ] Verify multiplayer leaderboard updates
- [ ] Test error handling for all API calls 