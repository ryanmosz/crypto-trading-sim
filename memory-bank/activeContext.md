# Active Context - Crypto Trader Development

## Current State (January 18, 2025)

### What's Working
- Complete game flow from login to results
- Four scenario options:
  - **Now** - Real-time trading (shows "Coming Soon" message)
  - March 12, 2020 - COVID Black Thursday (24h)
  - May 19, 2021 - China FUD crash (24h)
  - 2013 - Bitcoin's first bull run (full year)
- Simulation speed selection (Regular/Double speed) for historical scenarios
- "Coming Soon" message displayed for "Now" scenario
- Back button navigation on all screens
- Money change animations (cyan/pink flashes)
- Clean UI with no text overlaps
- Modular scenario system supporting various timeframes
- Historical accuracy (cryptos that didn't exist are grayed out)
- GitHub Pages deployment configured and ready

### Supabase Integration Progress (NEW)
- ✅ Auth module created with sign up/sign in functions
- ✅ Database migrations prepared (profiles, game data tables)
- ✅ Edge function for price fetching ready
- ✅ Environment configuration set up
- ⏳ Awaiting API keys from dashboard
- ⏳ Need to run migrations
- ⏳ Need to deploy edge function

### Recent Changes
- Created comprehensive Supabase integration foundation
- Prepared all SQL migrations and edge functions locally
- Set up auth.js module for frontend integration
- Added SUPABASE_SETUP_STATUS.md with clear next steps

### Next Manual Steps Required
1. Get API keys from Supabase dashboard
2. Run SQL migrations (001_auth_profiles.sql, 002_core_tables.sql)
3. Deploy fetch-prices edge function
4. Set up cron schedule for price updates
5. Test authentication flow

### Deployment Status
- ✅ GitHub Actions workflow created
- ✅ Deployment documentation complete
- ⏳ Waiting for GitHub Pages to be enabled
- 🔗 Will be live at: https://ryanmosz.github.io/crypto-trading-sim/

### Current Focus
Testing and refinement of the speed selection system. User is evaluating the flow and may want additional speed options or timing adjustments.

### Next Steps
1. Consider adding more speed options (e.g., "Slow Motion" for educational play)
2. Add more historical scenarios as discussed
3. Consider showing simulation time remaining during play
4. Add educational overlays for historical context

### Technical Details
- Using Phaser 3.90.0
- Simple file structure: `crypto-trader/public/`
- Serving with Python http.server on port 8000
- All game logic in single `game.js` file
- Modular scenario system allows easy addition of new time periods 