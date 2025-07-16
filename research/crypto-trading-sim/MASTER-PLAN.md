# Master Plan - Crypto Trading Simulation Game

## Project Overview

A Unity WebGL-based cryptocurrency trading simulation where players compete in a single global game by allocating 100 points across 5 major cryptocurrencies (BTC, ETH, BNB, SOL, XRP). Features a beautiful cyan-to-pink gradient color scheme on black backgrounds.

## Game Flow Summary

```
1. Welcome Screen (Optional Username)
         ↓
2. Allocation Screen (100 Points Distribution)
         ↓
3. Performance Dashboard (Live Tracking)
         ↓
4. Results Screen (Universal Format: "#X out of Y")
```

## Complete Documentation Index

### 🎨 Visual Design & Implementation

1. **[Complete Screen Designs](./complete-screen-designs.md)** ⭐ START HERE
   - All 4 screens with exact visual mockups
   - Color specifications (#00FFFF → #FF00FF gradient)
   - UI element positioning
   - Screen flow diagram

2. **[Screen-by-Screen Build Guide](./screen-by-screen-build-guide.md)** ⭐ BUILD WITH THIS
   - Step-by-step Unity implementation
   - Complete code for every component
   - Prefab structures
   - Build checklist

### 🚀 Quick Implementation

3. **[Quick Start Guide](./quick-start-guide.md)**
   - Day 1 setup instructions
   - CoinGecko API integration
   - Basic Unity configuration
   - Testing procedures

### 🎯 Design Decisions

4. **[Design Decisions](./DESIGN-DECISIONS.md)**
   - Visual style: Cyan-pink gradients
   - Competition: Single global game
   - Identity: Optional usernames
   - Tech stack: Unity LTS + Serverless

5. **[Global Game Concept](./global-game-concept.md)**
   - How the shared competition works
   - Everyone competes together
   - 24-hour game cycles
   - Unified leaderboard

### 💻 Technical Architecture

6. **[Backend API Design](./backend-api-design.md)**
   - Lightweight serverless endpoints
   - Price data fetching
   - Game state management
   - Leaderboard calculations

7. **[Unity Implementation Plan](./unity-implementation-plan.md)**
   - 4-week development timeline
   - Unity project structure
   - Code organization
   - Performance optimization

### 📋 Requirements & Planning

8. **[Requirements](./requirements.md)**
   - Functional requirements
   - Non-functional requirements
   - MVP scope definition

9. **[Project Overview](./project-overview.md)**
   - Original concept
   - Future expansion ideas
   - Market positioning

10. **[Final Questions & Decisions](./final-questions-and-decisions.md)**
    - Development priorities
    - Unity version selection
    - First day action plan

### 📚 Reference Documents

11. **[Unity Game Design](./unity-game-design.md)** - Original two-screen concept
12. **[Technical Architecture](./architecture.md)** - Web app version (reference)
13. **[Database Schema](./database-schema.md)** - For future backend expansion
14. **[UI Design](./ui-design.md)** - Original web mockups
15. **[Implementation Roadmap](./implementation-roadmap.md)** - Original timeline

## Key Features Summary

### Screen 1: Welcome
- Gradient title (Cyan → Pink)
- Optional username input
- Light cyan input background
- Magenta gradient "ENTER" button
- Live game stats

### Screen 2: Allocation
- 5 crypto sliders
- Each with unique color from palette
- 100-point validation
- Real-time price display
- Pulsing "LOCK IN" button

### Screen 3: Performance
- Live portfolio value
- Gradient border header
- Individual asset tracking
- Global leaderboard
- Countdown timer

### Screen 4: Results
- Universal message format
- "Congratulations! You finished #X out of Y"
- Performance breakdown
- Play again option
- View full leaderboard

## Implementation Priority

### Week 1: Core Systems
1. Unity project setup
2. Color palette system
3. Welcome & Allocation screens
4. Basic API integration

### Week 2: Game Logic
1. Performance tracking
2. Leaderboard system
3. Real-time updates
4. Results screen

### Week 3: Polish
1. Particle effects
2. Smooth animations
3. Sound effects
4. Error handling

### Week 4: Testing & Deploy
1. Cross-browser testing
2. Performance optimization
3. WebGL deployment
4. Launch preparation

## Color Palette Reference

```
Background: #000000 (Pure Black)
Cyan:       #00FFFF (Bright Cyan)
Light Cyan: #B0FFFF (Soft Cyan)  
White:      #FFFFFF (Pure White)
Light Pink: #FFB0FF (Soft Pink)
Magenta:    #FF00FF (Bright Magenta)
```

## Success Metrics

- Players can allocate and lock portfolios
- Real-time price updates work
- Leaderboard updates correctly
- Results screen shows proper ranking
- Smooth 60 FPS performance
- < 5 second load time

## Next Steps

1. **Review [Complete Screen Designs](./complete-screen-designs.md)**
2. **Set up Unity project with latest LTS**
3. **Follow [Screen-by-Screen Build Guide](./screen-by-screen-build-guide.md)**
4. **Implement screens in order: Welcome → Allocation → Performance → Results**

This streamlined 4-screen game with universal results messaging creates a clean, competitive experience that's easy to understand and engaging to play! 