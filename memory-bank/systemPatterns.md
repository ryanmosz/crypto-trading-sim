# System Patterns - Architecture & Design

## Architecture Overview

```
Unity WebGL Client
    ↓
Vercel Serverless API
    ↓
CoinGecko Price API
```

## Core Design Patterns

### 1. Singleton Pattern (Unity)
- **SceneManager**: Controls navigation between screens
- **GameManager**: Holds game state across scenes
- **APIManager**: Handles all external API calls
- **AudioManager**: Manages sound effects and music

### 2. Module Pattern
Each feature is self-contained:
```
Modules/
├── Navigation/
├── Allocation/
├── PriceData/
├── GameState/
└── UI/
```

### 3. Observer Pattern
- Price updates notify UI components
- Allocation changes update total counter
- Game state changes trigger scene transitions

## Data Flow

### Allocation Flow
1. User adjusts sliders → AllocationManager updates
2. Total recalculated → UI reflects changes
3. Lock button enabled/disabled based on total
4. On lock → Save to PlayerPrefs & GameState

### Price Update Flow
1. Timer triggers API call (every 30 seconds)
2. CoinGecko returns prices or timeout
3. Fall back to mock data if needed
4. Update all portfolio cards
5. Recalculate total value
6. Animate changes

### Game State Management
```csharp
GameState {
    playerId: string
    username: string (optional)
    allocation: Dictionary<string, float>
    startTime: DateTime
    startPrices: Dictionary<string, float>
    currentPrices: Dictionary<string, float>
    isComplete: bool
}
```

## API Design

### Endpoints
- `POST /game/join` - Start new game
- `GET /game/status/{gameId}` - Get current state
- `GET /game/leaderboard` - Get rankings
- `POST /game/complete` - Submit final score

### Error Handling
- All API calls have timeout (10 seconds)
- Retry logic with exponential backoff
- Graceful degradation to offline mode
- User-friendly error messages

## UI Component Architecture

### Base Components
- `GradientBackground` - Animated gradient effect
- `NeonButton` - Consistent button styling
- `CryptoCard` - Reusable crypto display
- `LoadingOverlay` - Consistent loading states

### Screen Components
- `WelcomeScreen` - Entry point
- `AllocationScreen` - Portfolio setup
- `DashboardScreen` - Live tracking
- `ResultsScreen` - Final rankings

## Test User Pattern (MVP)

For rapid prototyping and demos, we use hardcoded test users:

```csharp
public static class UserManager {
    public static string CurrentUser;
    public static float StartingValue = 10000000f;
    public static float CurrentValue;
    
    // Hardcoded test scenarios
    public static void LoginAsAlice() {
        CurrentUser = "Alice";
        CurrentValue = 12000000f; // +20%
    }
    
    public static void LoginAsBob() {
        CurrentUser = "Bob";
        CurrentValue = 8000000f; // -20%
    }
}
```

This pattern allows:
- No backend dependencies
- Instant user switching for demos
- Clear demonstration of outcomes
- Easy extension to real auth later

## Performance Optimizations

1. **Texture Atlas**: All UI sprites in one atlas
2. **Object Pooling**: Reuse UI elements
3. **Coroutine Management**: Careful timing of updates
4. **LOD Settings**: Simplified shaders for WebGL
5. **Compressed Textures**: DXT5 for all images 