# Next Steps: Phase 2 - Backend Functions

## Relevant Files

- `crypto-trader/supabase/functions/create-game/index.ts` - Edge function for creating multiplayer games (to be created)
- `crypto-trader/supabase/functions/join-game/index.ts` - Edge function for joining existing games (to be created)
- `crypto-trader/supabase/functions/update-active-games/index.ts` - Cron function for price updates (to be created)
- `crypto-trader/supabase/functions/fetch-prices/index.ts` - Existing price fetching function
- `crypto-trader/public/scenes/NowModeSetupScene.js` - Scene that will call create_game
- `crypto-trader/public/scenes/AllocationScene.js` - Scene that will call join_game
- `crypto-trader/public/shared/utils.js` - Utility functions (may need game code generator)

## Objective

Implement secure backend Edge Functions to handle multiplayer game creation, joining, and automated price updates. These functions will provide the API endpoints needed for the multiplayer flow while maintaining data integrity and preventing cheating.

## Tasks

- [x] 1.0 Create Edge Function for Game Creation
  - [x] 1.1 Set up new Edge Function directory `supabase/functions/create-game`
  - [x] 1.2 Implement game code generation (4-char alphanumeric, check uniqueness)
  - [x] 1.3 Validate request payload (userId, duration, allocations)
  - [x] 1.4 Fetch current prices from prices_cache table
  - [x] 1.5 Insert new game record into active_games with game_code
  - [x] 1.6 Insert creator as first participant in game_participants
  - [x] 1.7 Return game_id, game_code, and starting_prices

- [x] 2.0 Create Edge Function for Joining Games
  - [x] 2.1 Set up new Edge Function directory `supabase/functions/join-game`
  - [x] 2.2 Validate request payload (gameId, userId, allocations)
  - [x] 2.3 Check game exists and is_multiplayer = true
  - [x] 2.4 Verify user hasn't already joined this game
  - [x] 2.5 Insert participant record into game_participants
  - [x] 2.6 Increment participant_count in active_games
  - [x] 2.7 Return success status with game details

- [x] 3.0 Create Cron Function for Price Updates
  - [x] 3.1 Set up new Edge Function directory `supabase/functions/update-active-games`
  - [x] 3.2 Query all active games where is_complete = false
  - [x] 3.3 Fetch latest prices from CoinGecko API or prices_cache
  - [x] 3.4 Calculate new portfolio values for each game
  - [x] 3.5 Update current_prices and current_value in active_games
  - [x] 3.6 Update current_value for each participant in game_participants
  - [x] 3.7 Mark games as complete where NOW() > ends_at
  - [x] 3.8 Set final_value and completed_at for completed games

- [x] 4.0 Implement Utility Functions
  - [x] 4.1 Create game code generator function (alphanumeric, 4 chars)
  - [x] 4.2 Add retry logic for unique code generation
  - [x] 4.3 Create portfolio value calculator utility
  - [x] 4.4 Add input validation helpers
  - [x] 4.5 Create error response formatter

- [x] 5.0 Test Backend Functions
  - [x] 5.1 Test create_game with valid and invalid inputs
  - [x] 5.2 Test game code uniqueness across multiple creates
  - [x] 5.3 Test join_game with valid game codes
  - [x] 5.4 Test duplicate join prevention
  - [x] 5.5 Test update_active_games price calculations
  - [x] 5.6 Test game completion logic
  - [x] 5.7 Verify RLS policies work with Edge Functions

- [x] 6.0 Deploy and Configure Functions
  - [x] 6.1 Deploy create-game function to Supabase
  - [x] 6.2 Deploy join-game function to Supabase  
  - [x] 6.3 Deploy update-active-games function to Supabase
  - [x] 6.4 Configure CORS settings for frontend access
  - [ ] 6.5 Set up cron schedule (every 5 minutes) for update-active-games
  - [x] 6.6 Add environment variables if needed
  - [x] 6.7 Test deployed endpoints from frontend

## Success Criteria

- `create_game` function generates unique 4-character game codes
- `create_game` properly inserts into both active_games and game_participants tables
- `join_game` prevents duplicate joins and validates game existence
- `join_game` correctly increments participant_count
- `update_active_games` updates all active games every 5 minutes
- Games are automatically marked complete when ends_at is reached
- All functions handle errors gracefully
- Functions are deployed and accessible via Supabase endpoints

## Notes

- Game codes should use alphanumeric characters (A-Z, a-z, 0-9) for 62^4 = 14,776,336 combinations
- Price updates should be atomic to prevent race conditions
- Consider rate limiting to prevent abuse
- Edge functions should validate all inputs and use RLS policies
- Cron job timing is critical - must run reliably every 5 minutes

## Phase 2 Completion Summary

**Date Completed**: July 21, 2025

All backend Edge Functions have been successfully implemented and deployed:

### Completed Functions
1. **create-game** - Generates unique game codes and creates multiplayer games
2. **join-game** - Allows users to join existing games with validation
3. **update-active-games** - Updates prices and marks completed games

### Key Features Implemented
- 4-character alphanumeric game code generation with retry logic
- Proper authentication and authorization checks
- Input validation for allocations and game parameters
- Atomic updates with rollback on failures
- Portfolio value calculation logic
- CORS support for frontend access

### Deployment Status
- All functions deployed to Supabase Edge Functions
- Functions accessible at: `https://yuobwpszomojorrjiwlp.supabase.co/functions/v1/{function-name}`
- CORS headers configured for cross-origin access

### Next Steps
- Configure cron schedule for update-active-games function (5 minutes)
- Update frontend scenes to use the new API endpoints
- Test end-to-end multiplayer flow

The backend infrastructure is now ready to support multiplayer gameplay! 