# 🎯 NEXT-STEPS: M2 - Now Mode Implementation

> **Current Status**: M1 Complete ✅ (Auth + Game Persistence Working)  
> **Current Issue**: Historical games not saving properly (debugging needed)
> **Next Milestone**: M2 - "Now" Mode with real-time tracking

---

## 🔧 Fix Current Save Issue First (30 min)

1. Debug why historical games aren't saving:
   - Check console logs in ResultsScene
   - Verify auth is initialized properly
   - Test with simplified save data
   - Check Supabase table permissions

---

## 📊 M2: Now Mode - Two Game Types Design

### Game Type 1: Historical Simulations (Current)
- Play through past market events
- Complete immediately with known data
- Save final results to `past_runs`

### Game Type 2: "Now" Mode (New)
- Start with current real-time prices
- Run for X days into the future
- Track performance over time
- View/compare while active

---

## 🗄️ Database Design - Separate Tables

### Keep Existing: `past_runs` Table
```sql
-- For completed historical simulations
CREATE TABLE past_runs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users,
    scenario_key TEXT,              -- 'march_2020', 'may_2021', etc
    allocations JSONB,              -- {BTC: 5, ETH: 3, ...}
    final_value NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### New: `active_games` Table
```sql
-- For ongoing "Now" mode games
CREATE TABLE active_games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users,
    
    -- Game timing
    started_at TIMESTAMPTZ DEFAULT NOW(),
    ends_at TIMESTAMPTZ NOT NULL,        -- started_at + duration
    duration_days INT NOT NULL,          -- 30, 60, 90 days
    
    -- Initial state (to recreate game)
    allocations JSONB NOT NULL,          -- {BTC: 5, ETH: 3, ...}
    starting_prices JSONB NOT NULL,      -- {BTC: 65000, ETH: 3500, ...}
    starting_money NUMERIC NOT NULL,     -- $10M
    
    -- Current state (updated periodically)
    current_prices JSONB,                -- Latest fetched prices
    current_value NUMERIC,               -- Current portfolio value
    last_updated TIMESTAMPTZ,            -- When prices last updated
    
    -- Completion
    is_complete BOOLEAN DEFAULT FALSE,
    final_value NUMERIC,                 -- Set when game ends
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_dates CHECK (ends_at > started_at)
);

-- Index for finding active games
CREATE INDEX idx_active_games_user_active 
ON active_games(user_id, is_complete) 
WHERE is_complete = FALSE;

-- Index for finding games to complete
CREATE INDEX idx_active_games_to_complete 
ON active_games(ends_at) 
WHERE is_complete = FALSE;
```

### New: `price_history` Table (Optional)
```sql
-- Track price history for charts
CREATE TABLE price_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES active_games,
    timestamp TIMESTAMPTZ DEFAULT NOW(),
    prices JSONB NOT NULL,               -- {BTC: 67000, ETH: 3600, ...}
    portfolio_value NUMERIC NOT NULL
);
```

---

## 🏗️ Implementation Steps

### Phase 1: Database Setup (1 hour)
1. Create new tables via Supabase dashboard
2. Set up RLS policies:
   - Users can only see their own games
   - Users can create new games
   - System can update all games (for price updates)
3. Create database functions for atomic updates

### Phase 2: Modify Game Flow (3 hours)
1. **Update ScenarioSelectScene**:
   ```javascript
   // Now scenario should behave differently
   if (scenarioKey === 'now') {
       this.scene.start('NowModeSetupScene', { user });
   } else {
       this.scene.start('SimulationSpeedScene', { user, scenario });
   }
   ```

2. **Create NowModeSetupScene**:
   - Select duration: 30, 60, or 90 days
   - Show current live prices
   - Explain how it works

3. **Modify AllocationScene for Now Mode**:
   - Fetch current prices from API
   - Show live prices while allocating
   - No simulation speed selection

4. **Create NowModeResultScene**:
   - Save to `active_games` instead of `past_runs`
   - Show "Game Started!" message
   - Explain when to check back

### Phase 3: Dashboard Updates (2 hours)
1. **Split Dashboard into sections**:
   - "Active Games" (from active_games table)
   - "Past Games" (from past_runs table)

2. **Active Games Display**:
   ```javascript
   // For each active game show:
   - Time remaining: "23 days left"
   - Current performance: "+12.5%" 
   - Current value: "$11.25M"
   - View button → ActiveGameView scene
   ```

3. **Create ActiveGameView Scene**:
   - Show current allocations
   - Display live performance per crypto
   - Performance chart (if implementing)
   - Time remaining

### Phase 4: Price Updates (2 hours)
1. **Create price fetching service**:
   ```javascript
   // crypto-price-api.js
   async function getCurrentPrices() {
       // Use CoinGecko or similar API
       return {
           BTC: 67500,
           ETH: 3600,
           // etc...
       };
   }
   ```

2. **Background job (serverless function)**:
   - Run every hour
   - Update all active games with latest prices
   - Mark games complete when time expires

### Phase 5: Completion Handler (1 hour)
1. **Auto-complete expired games**:
   - Check for games past `ends_at`
   - Calculate final value
   - Mark as complete
   - Optionally copy to `past_runs`

2. **Notification system** (optional):
   - Show badge on dashboard
   - "Your Bitcoin challenge completed!"

---

## 🎮 User Flow for Now Mode

1. **Start Game**:
   - Select "Now" scenario
   - Choose duration (30/60/90 days)
   - See current prices
   - Make allocations
   - Game saves and starts

2. **During Game**:
   - Check dashboard anytime
   - See current performance
   - Compare with other players (future feature)
   - Cannot modify allocations

3. **Game Ends**:
   - Automatic completion
   - Final results calculated
   - Moves to "Past Games"
   - Can start new game

---

## 🚀 Quick Start Plan

### Day 1: Foundation
- [ ] Fix current save bug
- [ ] Create database tables
- [ ] Update scenario selection logic

### Day 2: Core Implementation  
- [ ] Build Now mode setup flow
- [ ] Create active games save logic
- [ ] Update dashboard

### Day 3: Polish
- [ ] Add price fetching
- [ ] Test full flow
- [ ] Handle edge cases

---

## 📝 Testing Checklist

- [ ] Historical games still work and save
- [ ] Can start a Now mode game
- [ ] Active games show on dashboard
- [ ] Prices update (manual trigger for testing)
- [ ] Games complete after duration
- [ ] Can view active game details
- [ ] Multiple active games work

---

## 🔄 Migration Considerations

1. Existing `past_runs` data remains unchanged
2. Add `game_type` field to distinguish if needed
3. Consider unified view for all games later

---

**Time Estimate**: 2-3 days
**Complexity**: High (new game mode, real-time data, background jobs)
**Next After This**: M3 - Leaderboards & Social Features 