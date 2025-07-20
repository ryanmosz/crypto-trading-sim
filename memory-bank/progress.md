# Progress Tracker

## Overall Status
Phase 1 (Historical trading) is ~85% complete with core gameplay functional but save system needs fixes.

## What Works
- Complete authentication flow (login/signup)
- Dashboard displays past games correctly
- Past game details modal with two-page layout (main + details)
- Historical scenario gameplay (all 3 scenarios)
- Portfolio allocation system
- Real-time price simulation
- Results calculation and display
- Test game saves work (via Test Save button)
- UI layout improvements prevent text overlap

## Current Issues
1. Real game saves fail (not using Test Save button)
2. "Now" mode not implemented yet
3. Test Save button uses hardcoded profitable data even for crash scenarios (misleading)

### ✅ Completed Milestones

**UI Enhancements:**
- Redesigned dashboard past runs list to prevent overlapping text
- Split game details modal into main/details views for better space usage
- Fixed details view to show accurate calculated totals from historical data
- Optimized details view layout to support up to 5 crypto allocations
- Redesigned details view with left-aligned layout and taller modal (450px) for 5 cryptos
- Fixed centering and added proper spacing to prevent label/value overlap
- Improved past games list with full scenario descriptions for better context
- Fixed past games list value overlap with proper spacing and alignment
- Limited past games to 4 most recent to prevent Sign Out button from being pushed off screen
- Added paging functionality with up/down navigation for accessing all past games
- Fixed paging controls positioning to prevent cutoff at screen bottom
- Fixed paging controls overlap with 100px spacing between elements

#### M0 - Auth + Backend Infrastructure (July 19, 2025)
- **Supabase Project**: Created and fully configured
- **Authentication**: auth.js module with signUp/signIn/signOut
- **Database Schema**: All tables created with RLS policies
  - profiles (user profiles)
  - past_runs (game history)
  - now_entries (live mode allocations)
  - now_snapshots (portfolio tracking)
  - price_cache (30 cryptocurrencies)
- **Price Updates**: Edge function fetching from CoinGecko
- **Cron Schedule**: Updates every 5 minutes automatically
- **MCP Tools**: Connected and working for programmatic management
- **Test Page**: Authentication flows verified at test-auth.html

#### Game Implementation (Phaser.js)
- **Complete Game Flow**: Login → Scenario → Speed → Allocation → Simulation → Results
- **Historical Scenarios**: 
  - March 12, 2020 (COVID crash) - 24 hours
  - May 19, 2021 (China FUD) - 24 hours
  - 2013 (Bitcoin's first bull run) - Full year
  - "Now" (placeholder for future real-time mode)
- **UI Features**:
  - Consistent hover effects (border + text color change)
  - Money change animations (cyan for gains, pink for losses)
  - Clean black background with white text
  - Back navigation throughout
  - Historical accuracy (unavailable cryptos grayed out)
- **Deployment**: GitHub Pages with CI/CD pipeline

#### M1 - Persist Past Runs (July 19, 2025) ✅
**Status: Complete**

Past game runs are successfully saved to Supabase and displayed on the dashboard with:
- Full game history with scenario, allocations, and performance
- Details modal showing investment breakdown
- Paging system for navigating many past games
- Proper UI layout preventing overlap

#### M2 - Now Mode (July 20, 2025) 🎉
**Status: 95% Complete**

**Completed:**
- ✅ Database tables created (active_games, price_history, prices_cache)
- ✅ Database functions for updating values and completing games
- ✅ Now mode setup scene with duration selection
- ✅ Allocation scene modified to handle current prices
- ✅ Now mode result scene saves games to database
- ✅ Dashboard shows active games with performance
- ✅ Active game detail view with full breakdown
- ✅ Manual price update mechanism for testing
- ✅ Edge function structure created
- ✅ Performance chart visualization
- ✅ Expiration warnings with color coding
- ✅ CoinGecko API integration module
- ✅ Complete deployment guide

**Remaining (5%):**
- ⏳ Deploy to production
- ⏳ Enable cron schedule
- ⏳ Activate live API calls

**Key Features:**
- Line chart showing portfolio trends
- Visual warnings for expiring games (yellow → red)
- Ready for real-time price integration
- Full deployment documentation

**Testing Guide:** See NOW_MODE_TESTING.md
**Deployment:** See DEPLOYMENT_GUIDE.md

#### M3 - Polish Pass
**Status: Not Started**
- Loading states throughout
- Error handling and toasts
- Performance optimizations
- Final deployment tweaks

## Technical Stack

### Frontend
- **Game Engine**: Phaser 3.90.0
- **Auth**: Supabase JS Client
- **Hosting**: GitHub Pages
- **Build**: GitHub Actions

### Backend
- **Database**: Supabase (PostgreSQL)
- **Auth**: Supabase Auth
- **Functions**: Edge Functions (Deno)
- **Scheduling**: pg_cron
- **API**: CoinGecko for prices

## Live Price Data
Currently tracking 30 cryptocurrencies:
- BTC: $118,020
- ETH: $3,656.66
- BNB: $742.15
- SOL: $178.03
- XRP: $3.42
- And 25 more...

## Metrics

### Development Progress
- Milestones Complete: 1/4 (M0 ✅)
- Database Tables: 5/5 ✅
- Edge Functions: 1/1 ✅
- Auth Integration: Backend ✅, Frontend ⏳
- Game Scenes: 6/7 (missing Dashboard)

### Code Stats
- Main game file: ~1,200 lines
- Auth module: ~130 lines
- SQL migrations: ~200 lines
- Edge function: ~50 lines

## Next Critical Path

1. **Import auth.js into game.js**
2. **Replace LoginScene buttons with auth form**
3. **Add savePastRun() to ResultsScene**
4. **Create new DashboardScene**
5. **Update navigation flow**

**Time estimate**: 5-6 hours for M1 completion 