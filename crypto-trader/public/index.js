// Import scenes
import LoginScene from './scenes/LoginScene.js';
import DashboardScene from './scenes/DashboardScene.js';
import ScenarioSelectScene from './scenes/ScenarioSelectScene.js';
import SimulationSpeedScene from './scenes/SimulationSpeedScene.js';
import AllocationScene from './scenes/AllocationScene.js';
import SimulationScene from './scenes/SimulationScene.js';
import ResultsScene from './scenes/ResultsScene.js';
import NowModeSetupScene from './scenes/NowModeSetupScene.js';
import NowModeResultScene from './scenes/NowModeResultScene.js';
import ActiveGameViewScene from './scenes/ActiveGameViewScene.js';
import JoinGameScene from './scenes/JoinGameScene.js';
import LeaderboardScene from './scenes/LeaderboardScene.js';

// Import shared components
import { TutorialManager } from './shared/TutorialManager.js';

// Initialize tutorial manager globally
window.tutorialManager = new TutorialManager();

// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 900,
    height: 600,
    scene: [
        LoginScene, 
        DashboardScene, 
        ScenarioSelectScene, 
        SimulationSpeedScene, 
        AllocationScene, 
        SimulationScene, 
        ResultsScene, 
        NowModeSetupScene, 
        NowModeResultScene, 
        ActiveGameViewScene, 
        JoinGameScene, 
        LeaderboardScene
    ],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Start the game
const game = new Phaser.Game(config); 