# Next Steps: Phase 0 - Scene Extraction Refactor

## Relevant Files

- `crypto-trader/public/game.js` - Main monolithic file containing all scenes (5,109 lines)
- `crypto-trader/public/scenes/LoginScene.js` - Extracted login scene
- `crypto-trader/public/scenes/DashboardScene.js` - Extracted dashboard scene  
- `crypto-trader/public/scenes/ScenarioSelectScene.js` - Extracted scenario selection scene
- `crypto-trader/public/scenes/SimulationSpeedScene.js` - Extracted speed selection scene
- `crypto-trader/public/scenes/AllocationScene.js` - Extracted allocation scene
- `crypto-trader/public/scenes/SimulationScene.js` - Extracted simulation scene
- `crypto-trader/public/scenes/ResultsScene.js` - Extracted results scene
- `crypto-trader/public/scenes/NowModeSetupScene.js` - Extracted now-mode setup scene
- `crypto-trader/public/scenes/NowModeResultScene.js` - Extracted now-mode result scene
- `crypto-trader/public/scenes/ActiveGameViewScene.js` - Extracted active game view scene
- `crypto-trader/public/scenes/JoinGameScene.js` - Extracted join game scene
- `crypto-trader/public/scenes/LeaderboardScene.js` - Extracted leaderboard scene
- `crypto-trader/public/shared/constants.js` - Shared constants (GAME_CONFIG, SCENARIOS, etc.)
- `crypto-trader/public/shared/TutorialOverlay.js` - Extracted tutorial overlay class
- `crypto-trader/public/index.js` - New main entry point for bootstrapping Phaser

### Notes

- Each scene file should be ≤1,000 LOC (ideally ≤500 LOC)
- The refactor is purely mechanical - no logic changes
- Import/export statements need to be added to maintain functionality
- Test the application after each scene extraction to ensure nothing breaks

## Tasks

- [ ] 1.0 Extract Shared Components and Constants
  - [ ] 1.1 Create directory structure: `crypto-trader/public/scenes/` and `crypto-trader/public/shared/`
  - [ ] 1.2 Extract `TutorialOverlay` class to `shared/TutorialOverlay.js` with proper export
  - [ ] 1.3 Extract constants (GAME_CONFIG, NOW_SCENARIO, SCENARIOS) to `shared/constants.js`
  - [ ] 1.4 Extract any shared utility functions to `shared/utils.js`
  - [ ] 1.5 Add proper ES6 module exports to all shared files

- [ ] 2.0 Extract Authentication-Related Scenes
  - [ ] 2.1 Extract `LoginScene` class (lines ~791-1090) to `scenes/LoginScene.js`
  - [ ] 2.2 Add necessary imports (Phaser, auth module, shared constants)
  - [ ] 2.3 Export LoginScene as default export
  - [ ] 2.4 Test login flow still works after extraction

- [ ] 3.0 Extract Game Setup Scenes
  - [ ] 3.1 Extract `ScenarioSelectScene` class (lines ~1091-1223) to `scenes/ScenarioSelectScene.js`
  - [ ] 3.2 Extract `SimulationSpeedScene` class (lines ~1224-1342) to `scenes/SimulationSpeedScene.js`
  - [ ] 3.3 Extract `AllocationScene` class (lines ~1343-1776) to `scenes/AllocationScene.js`
  - [ ] 3.4 Add imports for shared constants and utilities to each scene
  - [ ] 3.5 Export each scene as default export
  - [ ] 3.6 Verify scene transitions still work properly

- [ ] 4.0 Extract Gameplay and Results Scenes
  - [ ] 4.1 Extract `SimulationScene` class (lines ~1777-2022) to `scenes/SimulationScene.js`
  - [ ] 4.2 Extract `ResultsScene` class (lines ~2023-2222) to `scenes/ResultsScene.js`
  - [ ] 4.3 Extract `DashboardScene` class (lines ~2223-3490) to `scenes/DashboardScene.js`
  - [ ] 4.4 Add necessary imports (auth, API calls, shared constants)
  - [ ] 4.5 Export each scene as default export
  - [ ] 4.6 Test complete past-mode flow (login → dashboard → scenario → allocation → simulation → results)

- [ ] 5.0 Extract Multiplayer-Specific Scenes
  - [ ] 5.1 Extract `NowModeSetupScene` class (lines ~3491-3712) to `scenes/NowModeSetupScene.js`
  - [ ] 5.2 Extract `NowModeResultScene` class (lines ~3713-3923) to `scenes/NowModeResultScene.js`
  - [ ] 5.3 Extract `ActiveGameViewScene` class (lines ~3924-4620) to `scenes/ActiveGameViewScene.js`
  - [ ] 5.4 Extract `JoinGameScene` class (lines ~4621-4819) to `scenes/JoinGameScene.js`
  - [ ] 5.5 Extract `LeaderboardScene` class (lines ~4820-5089) to `scenes/LeaderboardScene.js`
  - [ ] 5.6 Add imports for auth, API, and shared components
  - [ ] 5.7 Export each scene and verify now-mode functionality

- [ ] 6.0 Update Bootstrap and Verify Build
  - [ ] 6.1 Create new `crypto-trader/public/index.js` as main entry point
  - [ ] 6.2 Import all scene classes and shared components in index.js
  - [ ] 6.3 Move Phaser game configuration and initialization to index.js
  - [ ] 6.4 Update any HTML files to reference index.js instead of game.js
  - [ ] 6.5 Run full application test suite (all game modes)
  - [ ] 6.6 Verify no functionality has been broken
  - [ ] 6.7 Delete or archive the original game.js file
