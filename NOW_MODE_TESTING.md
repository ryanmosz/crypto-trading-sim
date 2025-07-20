# 🎮 Now Mode Testing Guide

## Quick Test Flow

1. **Start a Now Mode Game:**
   - Click "PLAY NEW GAME"
   - Select "Now" scenario
   - Choose duration (30, 60, or 90 days)
   - Allocate your $10M portfolio
   - Click "LOCK IN"

2. **View Your Active Game:**
   - Return to dashboard
   - Find your game in "ACTIVE GAMES" section
   - Click on it to see details

3. **Test Price Updates:**
   - On the dashboard, click `[Update Prices]` button (green text)
   - This simulates ±10% price changes
   - Your active game value will update
   - Click on the game again to see new performance

## What's Working

✅ **Game Creation**
- Select duration
- Make allocations with current prices
- Save to database

✅ **Dashboard Display**
- Shows active games with time remaining
- Displays current value and performance
- Updates when prices change

✅ **Detail View**
- Full allocation breakdown
- Per-crypto performance
- Time remaining with color coding
- Last update timestamp

✅ **Price Updates**
- Manual update button for testing
- Database functions to recalculate values
- Price history tracking

## What's Still Needed

⏳ **Automated Updates**
- Deploy edge function for hourly updates
- Real CoinGecko API integration
- Scheduled cron job

⏳ **Game Completion**
- Auto-complete when time expires
- Move to past games history
- Final results notification

⏳ **Charts**
- Price history visualization
- Performance over time graph

## Database Functions

Two key functions power the Now mode:

1. `update_active_game_values()` - Recalculates portfolio values based on current prices
2. `complete_expired_games()` - Marks games as complete when time runs out

## Testing Tips

- Create multiple games with different durations
- Try different allocation strategies
- Use the price update button to simulate market changes
- Check that performance calculations are accurate
- Verify time remaining updates correctly

## Known Limitations

- Prices are currently static (use update button)
- No real-time price feeds yet
- Games don't auto-complete (manual check needed)
- No notifications when games end