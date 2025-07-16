# Final Design Decisions - Crypto Trading Sim

## Confirmed Design Choices

### 1. Visual Style: Gamified Experience ✨
- Neon color schemes
- Particle effects for gains/losses
- Animated transitions
- Sound effects for actions
- Glowing effects on UI elements

### 2. Competition Format: Single Global Game 🌍
- **One shared game** for all players
- All users who join are competing in the same pool
- 24-hour duration (to be confirmed)
- Real-time leaderboard updates
- No separate rooms or leagues initially

### 3. Player Identity: Optional Username System 👤
- Start playing immediately (no forced registration)
- Optional username for leaderboard display
- LocalStorage for device history
- Can change username anytime
- Future: optional email for cross-device

### 4. Tech Stack: Unity LTS (Current in 2025)
- Use the latest Unity LTS version available in July 2025
- Likely Unity 2023.3 LTS or 2024.3 LTS
- Check Unity Hub for the current LTS with active support
- Modern features for effects and WebGL optimization

### 5. Development Approach: Quick + Real Data
- Start with mock data for rapid testing
- Integrate real prices early (Week 1)
- Use free CoinGecko API
- Fallback to mock data if API fails

## Implementation Implications

### For Single Global Game:
```csharp
public class GameManager : MonoBehaviour {
    // Single game instance for all players
    private GlobalGame currentGame;
    private DateTime gameStartTime;
    private const float GAME_DURATION_HOURS = 24f;
    
    public void JoinCurrentGame(string username = "Anonymous") {
        // Everyone joins the same game
        currentGame.AddPlayer(username);
    }
}
```

### For Gamified Visuals:
- Neon color palette: #00FFFF (cyan), #FF00FF (magenta), #FFFF00 (yellow)
- Particle systems for:
  - Portfolio value increases
  - New personal best
  - Ranking improvements
- Glow shaders for UI elements
- Screen shake for dramatic moments

### For Optional Username:
```csharp
public class PlayerIdentity {
    private string username;
    private string deviceId;
    
    public void SetUsername(string name) {
        username = string.IsNullOrEmpty(name) ? GenerateGuestName() : name;
        PlayerPrefs.SetString("username", username);
    }
}
```

## Next Development Steps

1. **Install latest Unity LTS** (check Unity Hub for 2023.3 LTS or newer)
2. **Create neon-themed UI assets**
3. **Build allocation screen with effects**
4. **Integrate CoinGecko API early**
5. **Add particle systems for feedback**

## MVP Feature List (Updated)

### Week 1 Must-Haves:
- ✅ Neon-styled allocation screen
- ✅ Point allocation with visual feedback
- ✅ Real price display (CoinGecko)
- ✅ Lock-in with animation
- ✅ Optional username input

### Week 2 Goals:
- ✅ Performance dashboard
- ✅ Global leaderboard
- ✅ Particle effects for gains
- ✅ Sound effects
- ✅ Real-time updates

### Week 3-4 Polish:
- ✅ More visual effects
- ✅ Smooth animations
- ✅ Mobile responsiveness
- ✅ Performance optimization
- ✅ Deploy to web 