# Crypto Trading Simulation Game - Research & Planning

## 📌 Start Here: [MASTER PLAN](./MASTER-PLAN.md) 

The **[Master Plan](./MASTER-PLAN.md)** contains the complete, organized blueprint for building this game. It links to all documentation in the correct order.

---

## Overview

This folder contains all research and planning documentation for the Crypto Trading Simulation game - a competitive investment game built with Unity for WebGL deployment where players allocate virtual portfolios across the top 5 cryptocurrencies.

## 🎯 Final Design Direction

- **Platform**: Unity LTS (current in 2025) → WebGL build
- **Visual Style**: Cyan-to-pink gradient theme with black background
- **Competition**: Single global game - all players compete together
- **Identity**: Optional username system for leaderboards
- **Data**: Real prices from CoinGecko API with mock fallback
- **Results**: Universal format - "Congratulations! You finished #X out of Y"

## 🎨 Color Palette
![Color Scheme](https://via.placeholder.com/600x100/00FFFF/000000?text=+)
![Color Scheme](https://via.placeholder.com/600x100/B0FFFF/000000?text=+)
![Color Scheme](https://via.placeholder.com/600x100/FFFFFF/000000?text=+)
![Color Scheme](https://via.placeholder.com/600x100/FFB0FF/000000?text=+)
![Color Scheme](https://via.placeholder.com/600x100/FF00FF/000000?text=+)

- Background: #000000 (Pure Black)
- Primary: #00FFFF (Cyan) → #FF00FF (Magenta) gradient
- Supporting: #B0FFFF, #FFFFFF, #FFB0FF

## 📚 Documentation Structure

### Essential Documents

1. **[MASTER PLAN](./MASTER-PLAN.md)** ⭐⭐⭐ **READ FIRST**
   - Complete project blueprint
   - Links to all docs in order
   - Implementation timeline
   - Success metrics

2. **[Complete Screen Designs](./complete-screen-designs.md)** ⭐ 
   - All 4 screens fully mocked up
   - Color specifications for each element
   - Screen flow diagram
   - UI element details

3. **[Screen-by-Screen Build Guide](./screen-by-screen-build-guide.md)** ⭐ 
   - Step-by-step Unity implementation
   - Complete code for each screen
   - Prefab structures
   - Build checklist

### Additional Documentation

4. **[Quick Start Guide](./quick-start-guide.md)**
   - Day 1 implementation guide
   - Real CoinGecko integration
   - Code examples ready to copy

5. **[Design Decisions](./DESIGN-DECISIONS.md)**
   - All confirmed choices documented
   - Visual style details
   - Implementation implications

6. **[Global Game Concept](./global-game-concept.md)**
   - How the single shared game works
   - Leaderboard structure
   - Scaling considerations

### Unity Development

7. **[Unity Game Design](./unity-game-design.md)**
   - Original two-screen concept
   - UI components breakdown
   - Scoring metrics

8. **[Unity Implementation Plan](./unity-implementation-plan.md)**
   - 4-week development roadmap
   - Project structure
   - Technical details

9. **[Backend API Design](./backend-api-design.md)**
   - Lightweight serverless API
   - Price data endpoints
   - Deployment options

### Planning Documents

10. **[Final Questions & Decisions](./final-questions-and-decisions.md)**
    - Decision checklist
    - Development priorities
    - Success metrics

11. **[Project Overview](./project-overview.md)**
    - Original concept
    - Future expansions

12. **[Requirements](./requirements.md)**
    - Functional/non-functional requirements
    - MVP vs future features

### Reference (Original Web App)

13. **[Technical Architecture](./architecture.md)** *(Web app version)*
14. **[Database Schema](./database-schema.md)** *(For future reference)*
15. **[UI Design](./ui-design.md)** *(Web-based mockups)*
16. **[Implementation Roadmap](./implementation-roadmap.md)** *(Original plan)*

## 🎮 Screen Flow Summary

We have **4 screens** total:

1. **Welcome/Login** → Optional username entry
2. **Portfolio Allocation** → 100-point distribution across 5 cryptos
3. **Performance Dashboard** → Live tracking with leaderboard
4. **Results Screen** → Universal "You finished #X out of Y" message

Each screen uses the cyan-to-pink gradient theme with black backgrounds.

## 🏃‍♂️ Quick Implementation Path

1. **Read the [MASTER PLAN](./MASTER-PLAN.md)** for complete overview
2. **Review [Complete Screen Designs](./complete-screen-designs.md)** to visualize the game
3. **Follow [Screen-by-Screen Build Guide](./screen-by-screen-build-guide.md)** to build it

## 🛠️ Tech Stack Summary

- **Frontend**: Unity LTS (2023.3 or newer) with WebGL build
- **Visuals**: Cyan-pink gradient theme with particle effects
- **Backend**: Serverless API (Vercel recommended)
- **Price Data**: CoinGecko free API
- **Storage**: LocalStorage for device persistence

## ⚠️ Unity Version Note (July 2025)

Unity 2022.3 LTS support ended in May 2025. When setting up:
1. Open Unity Hub
2. Install the latest LTS version available
3. All code in this documentation works with Unity 2023.x and newer
4. The principles remain the same regardless of version

Ready to build something beautiful! 🚀✨ 