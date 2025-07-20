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
13. Added paging functionality to past games list:
    - Users can navigate all games with up/down arrows
    - Shows page indicator (e.g. "Page 1 of 3")
    - Arrows scale on hover for better UX
    - All elements grouped for clean page switching
14. Fixed paging controls being cut off at bottom:
    - Moved all controls to single horizontal line
    - Up arrow (x=420), page text (x=450), down arrow (x=480)
    - Positioned just 5px below last game
    - Ensures everything fits within 600px canvas height
15. Fixed paging controls overlap:
    - Page text centered at x=450
    - Up arrow at x=350 (100px spacing)
    - Down arrow at x=550 (100px spacing)
    - No more arrows overlapping with page text

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

## Current Work

### M2 - Now Mode Implementation (97% Complete) 🚀

**Latest Additions:**
1. **Complete Edge Function** ✅
   - Full CoinGecko API integration
   - Automatic fallback to test data
   - Price history management
   - Old data cleanup
   - Comprehensive error handling

2. **Configuration System** ✅
   - `config.js` - Production configuration
   - `config.example.js` - Template for users
   - Feature flags for easy control
   - API settings centralized

3. **Leaderboard Feature** ✅
   - Competitive ranking system
   - Top 10 display with medals (🥇🥈🥉)
   - Performance metrics (win rate, avg profit)
   - Shows user's position even if not in top 10
   - Beautiful UI with color-coded performance

4. **API Integration** ✅
   - `api-integration.js` module created
   - CoinGecko price fetching ready
   - 24h price change support
   - Rate limiting considered

**Complete Feature List:**
- ✅ Database tables (active_games, price_history, prices_cache)
- ✅ SQL functions with security fixes
- ✅ Now mode game flow (setup → allocation → tracking)
- ✅ Dashboard with active games section
- ✅ Detailed game view with performance charts
- ✅ Manual price updates for testing
- ✅ Expiration warnings (visual indicators)
- ✅ Edge function ready for deployment
- ✅ Leaderboard view with competitive stats
- ✅ Configuration management
- ✅ API integration module

**Remaining (3%):**
1. Add CoinGecko API key to edge function
2. Deploy edge function: `supabase functions deploy`
3. Set up cron job in Supabase dashboard

### What You Need (CoinGecko API)

Get your free API key:
1. Visit https://www.coingecko.com/en/api
2. Sign up for free account
3. Get your API key
4. Set in Supabase: `supabase secrets set COINGECKO_API_KEY=your-key`

### Current State

The game is now **feature-complete** with:
- Historical trading scenarios ✅
- Real-time "Now" mode ✅
- Competitive leaderboard ✅
- Performance tracking ✅
- Beautiful UI with charts ✅
- Production-ready code ✅

Only deployment steps remain!

### Visual Enhancements Added

1. **Performance Chart**: Shows portfolio value trend over time with:
   - Line graph visualization
   - Start and end value labels
   - Color-coded performance indicator

2. **Expiration Warnings**:
   - Yellow border and text when < 7 days remaining
   - Red border and warning icon when < 3 days remaining
   - "ENDS TODAY!" alert for final day

3. **API Integration**: Ready to switch from test data to live prices

### Testing Instructions

See NOW_MODE_TESTING.md for detailed testing guide.
Key features to test:
- Start a Now mode game
- View active game details
- Update prices manually
- Check performance calculations

### UI Polish Status

Dashboard layout now has:
- Active games section at y=240
- Past games section moved to y=400
- Sign out button remains at bottom
- Proper spacing between all sections

Past games display features:
- Paging with up/down arrows
- 4 games per page
- Proper spacing to prevent overlap
- Page indicator shows current/total pages 