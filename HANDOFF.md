# Handoff: Crypto Trading Sim MVP

## Current State

You have a working Unity WebGL crypto trading simulator with:
- Login screen (Alice & Bob, both $10M)
- Main screen showing portfolio
- All visual effects working
- Clean git history on `feat/day1-bare-minimum` branch

## Quick Start

1. **Open in Unity**:
   ```bash
   # Project is already open, or:
   /Applications/Unity/Hub/Editor/2022.3.62f1/Unity.app/Contents/MacOS/Unity -projectPath "$(pwd)" &
   ```

2. **Test in Editor**:
   - Open `Assets/Scenes/Login.unity`
   - Click Play
   - Click Alice or Bob
   - See portfolio screen

3. **Build for Web**:
   - Tools > Build WebGL Now
   - Wait for build
   - Run `./serve-webgl.sh`
   - Open http://localhost:8080

## What Works

✅ Complete login flow
✅ User state management  
✅ Visual effects (glows, shadows)
✅ Scene transitions
✅ Automated build tools

## Known Issues

None! All compiler errors fixed, scenes have cameras, values show correctly.

## If You Want to Continue

Next phase would add:
```
Phase 2: Core Mechanics
- 100-point allocation system
- Slider UI for each crypto
- Save allocations to UserManager

Phase 3: Live Data  
- CoinGecko API integration
- Real-time price updates
- Portfolio calculation
```

## Files to Know

- `UserManager.cs` - Central user state
- `AutoSceneBuilder.cs` - Scene creation via Tools menu
- `memory-bank/` - Project documentation
- `planning/PHASES.md` - Full roadmap

## Ship It?

This MVP is ready! Shows the concept, looks good, works reliably. Perfect for a demo or as foundation for the full game.

Good luck! 🚀 