# Active Context

## Current Sprint: M2 - Now Mode
- **Status**: Planning phase
- **Blocker**: Historical games not saving properly (need to debug)
- **Focus**: Design two-game-type system with separate data models

## Immediate Tasks
1. Fix save bug in historical games
2. Create new database tables for "Now" mode
3. Implement dual game type system

## Recent Decisions
- Use separate tables for different game types:
  - `past_runs`: Historical completed games
  - `active_games`: Ongoing "Now" mode games
- Keep existing game flow for historical, create new flow for "Now"
- Test login buttons: adam@test.com and beth@test.com (password: test12)

## Game Saving Issue
- Test save works but real games don't save
- Auth might not be initializing properly in ResultsScene
- Need to check console logs and debug

## Two Game Types Design
1. **Historical**: Instant completion with known data
2. **Now Mode**: Real-time tracking over 30/60/90 days
   - Needs starting prices stored
   - Requires periodic price updates
   - Different completion flow 