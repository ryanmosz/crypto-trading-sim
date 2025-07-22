# Multiplayer API Documentation

This document describes how to use the multiplayer API in Phaser scenes.

## Import the API

```javascript
import { createNowGame, joinNowGame, findGameByCode, getGameParticipants } from '../services/nowGameApi.js';
```

## Core Functions

### createNowGame(options)

Creates a new multiplayer game with a unique 4-character code.

**Parameters:**
- `duration` (number): Game duration in days (30, 60, or 90)
- `allocations` (object): Crypto allocations, must sum to 10
  - Example: `{ BTC: 4, ETH: 3, SOL: 3 }`

**Returns:**
```javascript
{
  game_id: "uuid",
  game_code: "ABC1",
  starting_prices: { BTC: 50000, ETH: 3000, SOL: 150 },
  duration_days: 30,
  ends_at: "2025-08-21T00:00:00Z"
}
```

**Example Usage:**
```javascript
try {
    const gameData = await createNowGame({
        duration: 60,
        allocations: { BTC: 5, ETH: 3, SOL: 2 }
    });
    
    // Display game code to user
    this.add.text(450, 300, `Game Code: ${gameData.game_code}`, {
        fontSize: '32px',
        color: '#00ff00'
    }).setOrigin(0.5);
    
} catch (error) {
    console.error('Failed to create game:', error);
    // Show error to user
}
```

### joinNowGame(options)

Join an existing multiplayer game.

**Parameters:**
- `gameId` (string): The UUID of the game to join
- `allocations` (object): Your crypto allocations, must sum to 10

**Returns:**
```javascript
{
  game_id: "uuid",
  game_code: "ABC1",
  participant_id: "uuid",
  starting_prices: { BTC: 50000, ETH: 3000, SOL: 150 },
  duration_days: 30,
  ends_at: "2025-08-21T00:00:00Z",
  participant_count: 2
}
```

### findGameByCode(gameCode)

Find a game by its 4-character code.

**Parameters:**
- `gameCode` (string): The 4-character game code (case-insensitive)

**Returns:** Game object with all details

**Example:**
```javascript
const game = await findGameByCode('ABC1');
if (game) {
    // Check if user can join
    const hasJoined = await hasUserJoinedGame(game.id, userId);
    if (!hasJoined) {
        // Show join button
    }
}
```

### getGameParticipants(gameId)

Get all participants in a game with their current values.

**Parameters:**
- `gameId` (string): The game UUID

**Returns:** Array of participant objects sorted by current value

## Utility Functions

Import from `utils/slug.js`:

```javascript
import { 
    formatGameCode,
    validateGameCode,
    isGameActive,
    getTimeRemaining 
} from '../utils/slug.js';
```

### formatGameCode(code)
Formats a game code for display: "ABC1" → "AB C1"

### validateGameCode(code)
Returns true if code is valid (4 alphanumeric chars)

### isGameActive(endsAt)
Returns true if game hasn't ended yet

### getTimeRemaining(endsAt)
Returns human-readable time: "15 days 3h"

## Integration Example

```javascript
// In NowModeSetupScene
export default class NowModeSetupScene extends Phaser.Scene {
    async createGame() {
        try {
            // Show loading state
            this.loadingText.setVisible(true);
            
            // Create game
            const gameData = await createNowGame({
                duration: this.selectedDuration,
                allocations: this.allocations
            });
            
            // Store game data
            this.gameData = gameData;
            
            // Transition to result scene
            this.scene.start('NowModeResultScene', {
                user: this.user,
                gameCode: gameData.game_code,
                gameId: gameData.game_id
            });
            
        } catch (error) {
            // Show error
            this.errorText.setText(error.message);
            this.errorText.setVisible(true);
        }
    }
}
```

## Error Handling

All API functions throw errors that should be caught:

```javascript
try {
    const result = await createNowGame(options);
} catch (error) {
    if (error.message.includes('No active session')) {
        // User needs to login
        this.scene.start('LoginScene');
    } else {
        // Show error to user
        this.showError(error.message);
    }
}
```

## Common Error Messages

- "No active session" - User needs to login
- "Allocations must sum to 10" - Invalid allocation
- "Game not found or no longer active" - Invalid game code
- "You have already joined this game" - Duplicate join attempt
- "Failed to generate unique game code" - Rare server error 