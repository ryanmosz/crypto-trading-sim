# Active Context

## Current Sprint:
   - [x] Fixed authentication flow for game saving
   - [x] Added test user login buttons
   - [x] Fixed game saving to match database schema
   - [x] Fixed bug where clicking past games started new game instead of showing details
   - [x] Improved past game details modal layout to prevent text overlap
   - [x] Fixed dashboard past games list to prevent date/percentage overlap
   - [x] Split game details modal into main and details pages for better layout
   - [ ] Debug and fix save functionality for real game simulations
   - [ ] Implement "Now" mode with real-time prices

## Immediate Tasks:
   - Fix the current save bug for real game simulations
   - Continue implementing "Now" mode functionality
   - Polish UI and error handling

## Recent Decisions

1. Added modal overlay to show past game details instead of starting new game on click
2. Dynamically adjust modal height based on content to prevent overlap
3. Split game details into two pages (main + details) to handle space constraints
4. Fixed dashboard layout spacing to prevent overlapping text between profit percentage and dates

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