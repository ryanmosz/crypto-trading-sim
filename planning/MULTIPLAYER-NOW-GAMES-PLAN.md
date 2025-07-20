# 🎮 Multiplayer Now Games - Quick Implementation Plan

**Goal**: Allow multiple users to compete in the same Now game with minimal changes to existing code
**Time Estimate**: 3-4 hours

## 📋 Core Requirements
1. Users can join existing Now games started by others
2. Show all players and rankings in a new multiplayer view
3. Minimal changes to existing code - bolt-on approach
4. Works with current 30/60/90 day Now games

## 🗄️ Database Changes (30 min)

### Option 1: New Junction Table (Recommended - Cleanest)
```sql
-- Keep active_games as is, add junction table
CREATE TABLE game_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_id UUID REFERENCES active_games(id),
    user_id UUID REFERENCES auth.users(id),
    
    -- Player's allocation for this game
    allocations JSONB NOT NULL,
    starting_value NUMERIC DEFAULT 10000000,
    current_value NUMERIC,
    
    -- Join tracking
    joined_at TIMESTAMPTZ DEFAULT NOW(),
    is_original_creator BOOLEAN DEFAULT FALSE,
    
    -- Unique constraint: one entry per user per game
    UNIQUE(game_id, user_id)
);

-- Index for fast lookups
CREATE INDEX idx_game_participants_game ON game_participants(game_id);
CREATE INDEX idx_game_participants_user ON game_participants(user_id);

-- Update active_games to track multiplayer status
ALTER TABLE active_games ADD COLUMN is_multiplayer BOOLEAN DEFAULT FALSE;
ALTER TABLE active_games ADD COLUMN participant_count INT DEFAULT 1;
```

### RLS Policies
```sql
-- Users can see games they're in or public multiplayer games
CREATE POLICY "View multiplayer games" ON active_games
FOR SELECT USING (
    auth.uid() = user_id OR 
    (is_multiplayer = true AND is_complete = false)
);

-- Users can join games
CREATE POLICY "Join games" ON game_participants
FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 🎮 Frontend Changes (2-3 hours)

### 1. Dashboard Active Games List (30 min)
```javascript
// Modify showActiveGamesContent() in DashboardScene
// Add "JOIN" button for multiplayer games user hasn't joined

// Check if user is in game
const { data: myParticipation } = await window.supabase
    .from('game_participants')
    .select('*')
    .eq('game_id', game.id)
    .eq('user_id', this.user.id)
    .single();

if (!myParticipation && game.is_multiplayer && !game.is_complete) {
    // Show JOIN button instead of VIEW
    const joinBtn = this.add.text(750, y, 'JOIN', {
        fontSize: '16px',
        color: '#00ff00'
    }).setInteractive();
    
    joinBtn.on('pointerdown', () => {
        this.scene.start('JoinGameScene', { game, user: this.user });
    });
}
```

### 2. Join Game Scene (45 min)
```javascript
// New scene: JoinGameScene
class JoinGameScene extends Phaser.Scene {
    create() {
        // Show game details
        this.add.text(450, 100, `Join ${game.participant_count} other traders!`);
        this.add.text(450, 150, `Duration: ${game.duration_days} days`);
        this.add.text(450, 200, `Time Remaining: ${daysLeft} days`);
        
        // Show current leaderboard
        const participants = await this.loadParticipants(game.id);
        participants.forEach((p, i) => {
            this.add.text(300, 250 + i*30, `${i+1}. ${p.email}: $${p.current_value}`);
        });
        
        // Join button
        const joinBtn = this.add.rectangle(450, 400, 200, 50, 0x00ff00)
            .setInteractive();
        
        joinBtn.on('pointerdown', () => {
            // Go to allocation scene with multiplayer context
            this.scene.start('AllocationScene', { 
                user: this.user,
                scenario: 'now',
                multiplayerGame: game
            });
        });
    }
}
```

### 3. Modify AllocationScene (30 min)
```javascript
// In AllocationScene.create()
if (this.multiplayerGame) {
    // Joining existing game - use same starting prices
    this.prices = this.multiplayerGame.starting_prices;
    this.gameId = this.multiplayerGame.id;
    this.isJoining = true;
}

// In saveNowModeGame()
if (this.isJoining) {
    // Add to game_participants instead of creating new game
    await window.supabase
        .from('game_participants')
        .insert({
            game_id: this.gameId,
            user_id: this.user.id,
            allocations: this.allocations,
            current_value: 10000000
        });
        
    // Update participant count
    await window.supabase
        .from('active_games')
        .update({ 
            participant_count: this.multiplayerGame.participant_count + 1 
        })
        .eq('id', this.gameId);
}
```

### 4. Multiplayer Game View (1 hour)
```javascript
// Modify ActiveGameViewScene to detect multiplayer
class ActiveGameViewScene extends Phaser.Scene {
    async create() {
        // Check participant count
        if (this.gameData.participant_count > 1) {
            this.showMultiplayerView();
        } else {
            this.showSinglePlayerView(); // Current implementation
        }
    }
    
    async showMultiplayerView() {
        // Title
        this.add.text(450, 50, 'MULTIPLAYER CHALLENGE', {
            fontSize: '32px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Game info
        this.add.text(450, 100, `${this.gameData.duration_days}-Day Challenge`);
        this.add.text(450, 130, `${daysRemaining} days remaining`);
        
        // Leaderboard
        this.add.text(450, 180, 'CURRENT STANDINGS', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const participants = await this.loadAllParticipants();
        participants.sort((a, b) => b.current_value - a.current_value);
        
        participants.forEach((p, index) => {
            const isMe = p.user_id === this.user.id;
            const y = 230 + index * 40;
            
            // Rank
            this.add.text(250, y, `${index + 1}.`, {
                fontSize: '20px',
                color: isMe ? '#00ffff' : '#ffffff'
            });
            
            // Player
            this.add.text(300, y, p.email, {
                fontSize: '20px',
                color: isMe ? '#00ffff' : '#ffffff'
            });
            
            // Value
            this.add.text(500, y, `$${p.current_value.toLocaleString()}`, {
                fontSize: '20px',
                color: isMe ? '#00ffff' : '#ffffff'
            });
            
            // Gain/Loss
            const profit = ((p.current_value - 10000000) / 10000000) * 100;
            this.add.text(650, y, `${profit >= 0 ? '+' : ''}${profit.toFixed(2)}%`, {
                fontSize: '20px',
                color: profit >= 0 ? '#00ff00' : '#ff0000'
            });
        });
        
        // View My Portfolio button
        const myPortfolioBtn = this.add.rectangle(450, 500, 250, 50, 0x333333)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive();
            
        this.add.text(450, 500, 'VIEW MY PORTFOLIO', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        myPortfolioBtn.on('pointerdown', () => {
            this.showDetailView(); // Existing detail view
        });
    }
    
    async loadAllParticipants() {
        const { data } = await window.supabase
            .from('game_participants')
            .select('*, profiles(email)')
            .eq('game_id', this.gameData.id);
        return data;
    }
}
```

## 🔄 Backend Updates (30 min)

### Update Edge Function
```javascript
// In fetch-prices function, update game_participants too
async function updateGameValues(supabase, prices) {
    // Update active_games as before...
    
    // Also update all participants
    const { data: participants } = await supabase
        .from('game_participants')
        .select('*')
        .eq('game_id', game.id);
        
    for (const participant of participants) {
        const portfolioValue = calculatePortfolioValue(
            participant.allocations, 
            prices
        );
        
        await supabase
            .from('game_participants')
            .update({ current_value: portfolioValue })
            .eq('id', participant.id);
    }
}
```

## 🚀 Implementation Order

1. **Database changes** (30 min)
   - Create game_participants table
   - Add columns to active_games
   - Set up RLS policies

2. **Backend updates** (30 min)
   - Update edge function to handle participants

3. **Join flow** (1 hour)
   - Update dashboard to show JOIN buttons
   - Create JoinGameScene
   - Modify AllocationScene for joining

4. **Multiplayer view** (1.5 hours)
   - Detect multiplayer games
   - Show leaderboard view
   - Link to portfolio details

## ✅ Testing Checklist
- [ ] User can see which games they can join
- [ ] Join flow works smoothly
- [ ] Multiple users show in leaderboard
- [ ] Rankings update correctly
- [ ] Original single-player games still work
- [ ] Portfolio values update for all players

## 🎯 Quick Wins
- Reuse existing UI components
- Minimal changes to existing tables
- Leverage existing allocation/portfolio logic
- Keep single-player games working as-is

---

**Ready to implement!** This approach adds multiplayer with minimal disruption to existing code. 