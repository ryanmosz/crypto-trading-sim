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

### Recent Changes
- Added SimulationSpeedScene between scenario and allocation selection
- Each scenario now supports multiple speed options:
  - Regular Speed: Default timing
  - Double Speed: Half the time
- Enhanced scenario structure with `speeds` configuration
- Updated scene flow to include speed selection
- Passed speed data through entire scene chain

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