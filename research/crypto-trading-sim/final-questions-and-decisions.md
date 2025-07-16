# Final Questions & Key Decisions

## Remaining Questions Before Development

### 1. Game Timing & Competition

**Current Assumption**: 24-hour games with continuous entry
- **Alternative**: Fixed daily games (e.g., starts at 12:00 UTC daily)
- **Question**: Should all players compete in the same 24-hour window, or can they start their own 24-hour period anytime?

**Recommendation**: Start with rolling 24-hour periods for MVP, add scheduled tournaments later.

### 2. Player Identity

**Current Assumption**: Guest mode with optional username
- **Question**: Should we track any persistent data without accounts?
- **Options**:
  - Pure anonymous (new player each game)
  - Browser localStorage for repeat plays
  - Optional email for leaderboard persistence

**Recommendation**: Use localStorage for device-specific history, no accounts for MVP.

### 3. Visual Style in Unity

**Question**: What aesthetic are you envisioning?
- **Option A**: Clean, professional trading interface (Bloomberg-style)
- **Option B**: Gamified with effects and animations (neon, particles)
- **Option C**: Minimalist modern (Apple-style clean)

**Recommendation**: Start with Option C for faster development, add effects in polish phase.

### 4. Competitive Scope

**Current Assumption**: Global competition pool
- **Question**: Should we have different leagues or rooms?
- **Options**:
  - Single global leaderboard
  - Regional servers
  - Skill-based matchmaking
  - Friend groups/private games

**Recommendation**: Single global pool for MVP, add features based on user feedback.

### 5. Price Update Frequency

**Question**: How often should the portfolio value update?
- **Current Plan**: Every 30 seconds
- **Alternatives**: 
  - Real-time (every 5 seconds)
  - Every minute
  - On-demand refresh button

**Recommendation**: 30-second auto-refresh with manual refresh button.

## Key Technical Decisions

### Unity Configuration

```csharp
// Recommended Project Settings
- Rendering: URP (Universal Render Pipeline) for WebGL
- UI: UI Toolkit or Canvas (Canvas simpler for MVP)
- Input: New Input System
- WebGL Template: Minimal for faster loading
```

### Backend Architecture

**Decision**: Serverless for MVP
- Vercel for easiest deployment
- CoinGecko free tier (10,000 calls/month)
- No database initially (calculate rankings on-demand)
- Add Redis cache when scaling

### Performance Targets

- Initial load: < 5 seconds on 4G
- Build size: < 20MB compressed
- Memory usage: < 256MB
- Frame rate: Stable 30 FPS (UI-only game)

## Development Priorities

### Must Have (Week 1-2)
1. ✅ Point allocation system
2. ✅ Lock investment function
3. ✅ Display current portfolio value
4. ✅ Show individual asset performance
5. ✅ Basic ranking (your return %)

### Should Have (Week 3)
1. ⭐ Percentile ranking
2. ⭐ Smooth value animations
3. ⭐ Color-coded performance
4. ⭐ Time remaining display
5. ⭐ Price change indicators

### Nice to Have (Week 4+)
1. 🎯 Top 100 leaderboard
2. 🎯 Historical performance graph
3. 🎯 Sound effects
4. 🎯 Particle effects for gains
5. 🎯 Achievement system

## Quick Decision Checklist

Before starting development, confirm:

- [ ] **Unity Version**: 2021.3 LTS or 2022.3 LTS?
- [ ] **Visual Style**: Clean minimal or game-like?
- [ ] **Competition**: Rolling 24h or fixed daily?
- [ ] **Updates**: 30-second refresh acceptable?
- [ ] **Backend**: Vercel serverless good to start?

## First Day Action Plan

1. **Hour 1-2**: Install Unity, create project
2. **Hour 3-4**: Design basic UI layout in Unity
3. **Hour 5-6**: Implement point allocation logic
4. **Hour 7-8**: Create mock price data system

## Success Metrics for MVP

- Players can allocate points and lock investment
- Portfolio updates with mock/real prices
- See their return percentage
- Basic ranking against other players
- Runs smoothly in Chrome/Firefox/Safari

## Next Steps

Once you've reviewed these questions:
1. Make final decisions on style and competition format
2. Set up Unity project
3. Start with the allocation screen
4. Use mock data until backend is ready
5. Deploy early and iterate

The simplified two-screen design makes this very achievable. The Unity WebGL approach will give you great learning experience while creating something visually appealing and smooth. 