# Active Context

## Current Sprint:
   - [x] Fixed authentication flow for game saving
   - [x] Added test user login buttons
   - [x] Fixed game saving to match database schema
   - [x] Fixed bug where clicking past games started new game instead of showing details
   - [x] Improved past game details modal layout to prevent text overlap
   - [x] Fixed dashboard past games list to prevent date/percentage overlap
   - [x] Split game details modal into main and details pages for better layout
   - [x] Enhanced details view to show investment performance (initial → final values)
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
5. Fixed details view to recalculate totals from historical data (test saves had incorrect hardcoded values)
6. Redesigned details view layout to scale properly with up to 5 cryptos:
   - Dynamic spacing based on number of allocations
   - Optimized font sizes and positioning
   - Centered all content at x=450 (modal center)
7. Fixed details view centering (x=450 is modal center) and increased font sizes for readability
8. Completely redesigned details view for better 5-crypto scaling:
   - Increased modal height to 450px
   - Switched to left-aligned inline layout to prevent overlap
   - Removed column headers to save space
   - Smaller fonts: 15px values, 13px percentages
9. Final centering fix: content spans x=260 to x=635 (375px wide, centered in 600px modal)
   - Added 90px spacing between label and value to prevent "TOTAL:" overlap
10. Improved past games list display:
    - Shows full scenario context (e.g. "2013 - Bitcoin's First Bull Run")
    - Handles legacy data that saved displayName instead of scenario_key
    - Adjusted column positioning for longer scenario text
11. Fixed past games list overlap issues:
    - Reverted to shorter scenario names (just displayName)
    - Separated dollar amounts and percentages with 50px gap
    - Right-aligned dollar amounts, left-aligned percentages
12. Limited past games display to prevent UI overflow:
    - Shows only 4 most recent games
    - Adds "+ X more games" indicator when user has more
    - Keeps Sign Out button always visible on screen

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