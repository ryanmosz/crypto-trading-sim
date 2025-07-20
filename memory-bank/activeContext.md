# Active Context - Crypto Trader Development

## Current State (July 19, 2025)

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

### Supabase Integration Progress (COMPLETE!)
- ✅ Auth module created with sign up/sign in functions
- ✅ Database migrations executed (profiles, game data tables)
- ✅ Edge function deployed and fetching prices
- ✅ Environment configuration with all keys
- ✅ MCP tools connected and working
- ✅ Cron job scheduled (updates every 5 minutes)
- ✅ Price cache populated with 30 cryptocurrencies
- ✅ Test page working at /public/test-auth.html

### Recent Changes (July 19, 2025)
- Successfully connected MCP tools to Supabase project
- Executed all database migrations via MCP
- Deployed edge function for real-time price fetching
- Scheduled automatic price updates every 5 minutes
- Standardized UI hover effects across all screens
- Created UI Consistency Guide documentation
- All backend infrastructure is now live and operational

### UI Improvements
- Consistent hover behavior: border + primary text change color
- Secondary text (subtitles, descriptions) stays gray
- No background fills or scaling on hover
- Clean, modern aesthetic throughout

### Deployment Status
- ✅ GitHub Actions workflow created
- ✅ Deployment documentation complete
- ⏳ Waiting for GitHub Pages to be enabled
- 🔗 Will be live at: https://ryanmosz.github.io/crypto-trading-sim/

### Current Focus
Backend integration complete - ready to integrate auth into the game UI and start saving user data.

### Immediate Next Steps
1. Replace fake users (Alice/Bob/Quick Play) with real auth
2. Add login/signup UI screens
3. Save game results to past_runs table after each game
4. Build leaderboard view showing top scores
5. Show user's personal history and stats

### Future Enhancements
1. Implement "Now" mode with live prices from price_cache
2. Add social features (share results, challenge friends)
3. Create user profiles with achievements
4. Add more historical scenarios

### Technical Details
- Using Phaser 3.90.0
- Supabase backend with PostgreSQL database
- MCP tools for programmatic Supabase management
- Edge Functions (Deno) for serverless compute
- Cron jobs for scheduled price updates
- Simple file structure: `crypto-trader/public/`
- Serving with Python http.server on port 8001
- All game logic in single `game.js` file
- Auth logic separated into `auth.js` module
- Modular scenario system allows easy addition of new time periods
- Live deployment at: https://ryanmosz.github.io/crypto-trading-sim/ 