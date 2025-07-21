// Import auth module (v2 - fixed auth initialization)
import { Auth, auth } from './auth.js';

// Tutorial Overlay System
class TutorialOverlay {
    constructor(scene) {
        this.scene = scene;
        this.elements = [];
    }
    
    show(x, y, width, height, text, position = 'bottom', options = {}) {
        console.log('TutorialOverlay.show called:', {x, y, width, height, text, position});
        
        // Clean up any existing overlay
        this.hide();
        
        // Create dark overlay
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(0x000000, 0.7);
        
        // Fill entire screen
        this.overlay.fillRect(0, 0, 900, 600);
        console.log('Overlay created:', this.overlay);
        
        // Create "hole" in overlay for spotlight effect (unless disabled)
        let highlight = null;
        if (!options.hideSpotlight) {
            this.overlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
            
            // Add highlight rectangle
            highlight = this.scene.add.rectangle(x, y, width + 20, height + 20, 0x00ffff, 0)
                .setStrokeStyle(3, 0x00ffff);
        }
        
        // Tutorial text box position
        let textY;
        if (position === 'center') {
            textY = y;
        } else if (position === 'top') {
            textY = y - height/2 - 70;
        } else {
            textY = y + height/2 + 60;
        }
        
        // Background for text - make it thinner and wider
        const textBg = this.scene.add.rectangle(450, textY, 700, 60, 0x1a1a1a)
            .setStrokeStyle(2, 0x00ffff);
            
        // Tutorial text
        const tutorialText = this.scene.add.text(450, textY - 5, text, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 680 }
        }).setOrigin(0.5);
        
        // Next button
        const nextBtn = this.scene.add.text(750, textY + 20, 'NEXT →', {
            fontSize: '14px',
            color: '#00ffff'
        }).setOrigin(1, 0.5)
        .setInteractive({ useHandCursor: true });
        
        // Skip button
        const skipBtn = this.scene.add.text(150, textY + 20, 'Skip Tutorial', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });
        
        // Store elements
        this.elements = [this.overlay, textBg, tutorialText, nextBtn, skipBtn];
        if (highlight) {
            this.elements.push(highlight);
        }
        
        console.log('Tutorial overlay elements created:', this.elements.length);
        
        // Set depth to be on top
        this.elements.forEach(el => el.setDepth(1000));
        
        return { nextBtn, skipBtn };
    }
    
    hide() {
        this.elements.forEach(el => {
            if (el && el.destroy) {
                el.destroy();
            }
        });
        this.elements = [];
    }
}

// Tutorial Manager
class TutorialManager {
    constructor() {
        this.hasStarted = false; // Track if tutorial has been started
        this.shownTabTutorials = new Set(); // Track which tab tutorials have been shown
        this.steps = [
            {
                scene: 'DashboardScene',
                elementId: 'welcome',
                x: 450, y: 250, w: 700, h: 60,
                text: "Welcome to Crypto Trader Simulator! Let's take a quick tour of what you can do here.",
                waitForClick: true,
                position: 'center',
                hideSpotlight: true
            },
            {
                scene: 'DashboardScene',
                elementId: 'newGameTab',
                x: 230, y: 150, w: 200, h: 50,
                text: "NEW GAME: Start trading through historical crypto events. Test your strategies against real market data!",
                waitForClick: false, // Don't auto-advance on tab clicks
                position: 'bottom'
            },
            {
                scene: 'DashboardScene',
                elementId: 'activeGamesTab',
                x: 450, y: 150, w: 200, h: 50,
                text: "ACTIVE GAMES: Ongoing multiplayer investment challenges with data powered by CoinGecko.com. Challenge your friends! Or enemies!",
                waitForClick: false, // Don't auto-advance on tab clicks
                position: 'bottom'
            },
            {
                scene: 'DashboardScene',
                elementId: 'pastGamesTab',
                x: 670, y: 150, w: 200, h: 50,
                text: "PAST GAMES: Review your completed games and track your trading history!",
                waitForClick: false,
                position: 'bottom'
            },
            {
                scene: 'DashboardScene',
                elementId: 'leaderboard',
                x: 450, y: 530, w: 250, h: 50,
                text: "Check the LEADERBOARD to see top traders and compete with others!",
                waitForClick: false, // Don't auto-advance
                position: 'top'
            },
            {
                scene: 'DashboardScene',
                elementId: 'playNewGame',
                x: 450, y: 360, w: 400, h: 80,
                text: "Ready to start? Click 'START NEW GAME' to begin your trading journey!",
                waitForClick: true,
                position: 'top'
            },
            {
                scene: 'ScenarioSelectScene',
                elementId: 'scenarios',
                x: 450, y: 300, w: 700, h: 350,
                text: "Choose a historical crypto event to trade through. Each scenario presents unique market conditions!",
                position: 'top',
                hideSpotlight: false
            },
            {
                scene: 'AllocationScene',
                elementId: 'allocations',
                x: 450, y: 150, w: 600, h: 60,
                text: "Use the + and - buttons to allocate your $10,000,000 across different cryptocurrencies. Your goal is to maximize returns!",
                position: 'bottom'
            },
            {
                scene: 'SimulationScene',
                elementId: 'portfolio',
                x: 450, y: 110, w: 300, h: 60,
                text: "Watch your portfolio value change as the market moves. This shows real historical data!",
                autoAdvance: 3000
            },
            {
                scene: 'ResultsScene',
                elementId: 'breakdown',
                x: 450, y: 280, w: 400, h: 200,
                text: "See how each investment performed. Your games are automatically saved!"
            },
            {
                scene: 'DashboardScene',
                elementId: 'gameHistory',
                x: 450, y: 350, w: 800, h: 200,
                text: "Your completed games appear here. Try 'NOW MODE' for real-time trading challenges!",
                position: 'top'
            },
            {
                scene: 'DashboardScene',
                elementId: 'nowMode',
                x: 110, y: 260, w: 180, h: 120,
                text: "NOW MODE lets you invest at current prices and track performance over 30-90 days. Perfect for multiplayer competitions!"
            },
            {
                scene: 'DashboardScene',
                elementId: 'leaderboard',
                x: 740, y: 40, w: 120, h: 40,
                text: "Check the LEADERBOARD to see top traders and learn from their strategies!"
            },
            {
                scene: 'DashboardScene',
                elementId: 'newGameBtn',
                button: true,
                x: 450, y: 300, w: 250, h: 80,
                text: "Let's start a NEW GAME! Click this button to begin trading.",
                position: 'bottom',
                autoAdvance: true
            },
            {
                scene: 'DashboardScene',
                elementId: 'activeGamesContent',
                x: 450, y: 400, w: 800, h: 300,
                text: "View and join multiplayer games here. These use real-time crypto prices from CoinGecko!",
                position: 'top',
                waitForClick: false,
                checkActiveTab: 'active'
            },
            {
                scene: 'DashboardScene', 
                elementId: 'pastGamesContent',
                x: 450, y: 400, w: 800, h: 300,
                text: "Your completed games are saved here. Review your performance and learn from past trades!",
                position: 'top',
                waitForClick: false,
                checkActiveTab: 'past'
            },
            {
                scene: 'AllocationScene',
                elementId: 'allocations',
                x: 450, y: 250, w: 800, h: 250,
                text: "Allocate your $10M across different cryptocurrencies. Consider the risks!",
                position: 'top'
            }
        ];
        
        this.currentStep = 0;
        this.isActive = false;
        this.overlay = null;
        this.user = null;
        this.hasShownForSession = false;
    }
    
    async checkIfNeeded(user) {
        try {
            const auth = new Auth();
            const { data: profile } = await auth.supabase
                .from('profiles')
                .select('has_completed_tutorial, tutorial_step')
                .eq('id', user.id)
                .single();
                
            return profile && !profile.has_completed_tutorial;
        } catch (error) {
            console.error('Error checking tutorial status:', error);
            return false;
        }
    }
    
    async start(scene, user) {
        console.log('Tutorial start called for scene:', scene.constructor.name);
        
        // Don't restart if already active
        if (this.isActive) {
            console.log('Tutorial already active, checking scene');
            this.checkScene(scene);
            return false;
        }
        
        // For testing, show tutorial but don't reset if already started
        if (!this.hasStarted) {
            this.user = user;
            this.hasStarted = true;
            this.hasShownForSession = true;
            this.isActive = true;
            this.currentStep = 0;
            console.log('Tutorial starting at step:', this.currentStep);
            this.showStep(scene);
            return true;
        }
        
        return false;
    }
    
    showStep(scene) {
        console.log('ShowStep called:', {
            isActive: this.isActive,
            currentStep: this.currentStep,
            totalSteps: this.steps.length,
            sceneKey: scene.scene.key
        });
        
        if (!this.isActive || this.currentStep >= this.steps.length) return;
        
        const step = this.steps[this.currentStep];
        console.log('Current step:', step);
        
        // Check if we're on the right scene
        // Phaser uses the class name as the key if not explicitly set
        const sceneKey = scene.scene.key || scene.constructor.name;
        if (sceneKey !== step.scene) {
            console.log('Scene mismatch:', sceneKey, 'vs', step.scene);
            return;
        }
        
        // Check if this step requires a specific tab to be active
        if (step.checkActiveTab && scene.activeTab !== step.checkActiveTab) {
            console.log('Tab mismatch:', scene.activeTab, 'vs', step.checkActiveTab);
            return;
        }
        
        // Create overlay if needed
        if (!this.overlay) {
            this.overlay = new TutorialOverlay(scene);
        }
        
        // Show the overlay
        const { nextBtn, skipBtn } = this.overlay.show(
            step.x, step.y, step.w, step.h, 
            step.text, step.position,
            { hideSpotlight: step.hideSpotlight }
        );
        
        // Add button handlers
        nextBtn.on('pointerdown', () => this.nextStep(scene));
        skipBtn.on('pointerdown', () => this.skip());
        
        // Auto-advance if specified
        if (step.autoAdvance) {
            scene.time.delayedCall(step.autoAdvance, () => {
                if (this.isActive && this.currentStep === this.steps.indexOf(step)) {
                    this.nextStep(scene);
                }
            });
        }
        
        // Save progress
        this.saveProgress();
    }
    
    // Show tutorial for specific tabs regardless of current step
    showTabTutorial(scene, tabName) {
        console.log('showTabTutorial called for tab:', tabName);
        
        if (!this.isActive) {
            console.log('Tutorial not active, skipping tab tutorial');
            return;
        }
        
        // Don't show if already shown for this tab
        if (this.shownTabTutorials.has(tabName)) {
            console.log('Tab tutorial already shown for:', tabName);
            return;
        }
        
        // Find a step that matches this scene and tab
        const tabStep = this.steps.find(step => 
            step.scene === 'DashboardScene' && 
            step.checkActiveTab === tabName &&
            step.elementId && (step.elementId.includes('Content') || step.elementId.includes('Tab'))
        );
        
        if (tabStep) {
            this.shownTabTutorials.add(tabName);
            console.log('Showing tab tutorial for:', tabName, tabStep);
            
            // Create overlay if needed
            if (!this.overlay) {
                this.overlay = new TutorialOverlay(scene);
            }
            
            // Show the step
            const { nextBtn, skipBtn } = this.overlay.show(
                tabStep.x, tabStep.y, tabStep.w, tabStep.h, 
                tabStep.text, tabStep.position,
                { hideSpotlight: tabStep.hideSpotlight }
            );
            
            // Simple handlers - just hide on click
            nextBtn.on('pointerdown', () => {
                if (this.overlay) {
                    this.overlay.hide();
                }
            });
            skipBtn.on('pointerdown', () => {
                if (this.overlay) {
                    this.overlay.hide();
                }
            });
        }
    }
    
    nextStep(scene) {
        this.currentStep++;
        console.log('Tutorial advancing to step:', this.currentStep);
        
        if (this.currentStep >= this.steps.length) {
            this.complete();
        } else {
            // Check if next step is in current scene
            const nextStep = this.steps[this.currentStep];
            console.log('Next step:', nextStep);
            
            const sceneKey = scene.scene.key || scene.constructor.name;
            if (nextStep.scene === sceneKey) {
                // If tab-specific, check the tab
                if (nextStep.checkActiveTab) {
                    console.log('Next step requires tab:', nextStep.checkActiveTab, 'current:', scene.activeTab);
                }
                this.showStep(scene);
            } else {
                // Hide overlay and wait for scene change
                if (this.overlay) {
                    this.overlay.hide();
                }
            }
        }
    }
    
    checkScene(scene) {
        if (!this.isActive) return;
        
        // Don't interfere if we're already showing a step
        if (this.overlay && this.overlay.elements.length > 0) return;
        
        const currentStep = this.steps[this.currentStep];
        const sceneKey = scene.scene.key || scene.constructor.name;
        if (currentStep && currentStep.scene === sceneKey) {
            // Check if tab condition is met (if specified)
            if (currentStep.checkActiveTab && scene.activeTab !== currentStep.checkActiveTab) {
                return;
            }
            
            // Only show if we have valid text to display
            if (currentStep.text) {
                // Recreate overlay for new scene
                this.overlay = new TutorialOverlay(scene);
                this.showStep(scene);
            }
        }
    }
    
    async skip() {
        this.isActive = false;
        if (this.overlay) {
            this.overlay.hide();
        }
        
        // Mark as completed
        try {
            const auth = new Auth();
            await auth.supabase
                .from('profiles')
                .update({ 
                    has_completed_tutorial: true,
                    tutorial_step: 0 
                })
                .eq('id', this.user.id);
        } catch (error) {
            console.error('Error skipping tutorial:', error);
        }
    }
    
    async complete() {
        this.isActive = false;
        
        // Show completion message
        const scene = this.overlay.scene;
        this.overlay.hide();
        
        // Completion overlay
        const completionBg = scene.add.rectangle(450, 300, 500, 200, 0x1a1a1a)
            .setStrokeStyle(3, 0x00ffff)
            .setDepth(1001);
            
        const title = scene.add.text(450, 250, '🎉 Tutorial Complete!', {
            fontSize: '32px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5).setDepth(1002);
        
        const subtitle = scene.add.text(450, 300, 'You\'re ready to become a crypto trading legend!', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5).setDepth(1002);
        
        // Auto-hide after 3 seconds
        scene.time.delayedCall(3000, () => {
            completionBg.destroy();
            title.destroy();
            subtitle.destroy();
        });
        
        // Mark as completed in database
        try {
            const auth = new Auth();
            await auth.supabase
                .from('profiles')
                .update({ 
                    has_completed_tutorial: true,
                    tutorial_step: 0 
                })
                .eq('id', this.user.id);
        } catch (error) {
            console.error('Error completing tutorial:', error);
        }
    }
    
    async saveProgress() {
        if (!this.user) return;
        
        try {
            const auth = new Auth();
            await auth.supabase
                .from('profiles')
                .update({ tutorial_step: this.currentStep })
                .eq('id', this.user.id);
        } catch (error) {
            console.error('Error saving tutorial progress:', error);
        }
    }
}

// Global tutorial instance
window.tutorialManager = new TutorialManager();
console.log('Tutorial manager created:', window.tutorialManager);

// Game configuration
const GAME_CONFIG = {
    startingMoney: 10000000, // $10M
    blockSize: 1000000, // $1M per allocation
    cryptos: {
        BTC: { name: 'Bitcoin', startPrice: 65000, color: 0xf7931a },
        ETH: { name: 'Ethereum', startPrice: 3500, color: 0x627eea },
        BNB: { name: 'Binance Coin', startPrice: 400, color: 0xf3ba2f },
        SOL: { name: 'Solana', startPrice: 120, color: 0x00ffa3 },
        XRP: { name: 'Ripple', startPrice: 0.75, color: 0x23292f }
    }
};

// Enhanced scenario structure for modular time periods
const MARCH_2020_SCENARIO = {
    id: 'march_2020',
    date: "March 12, 2020",
    displayName: "March 12, 2020",
    subtitle: "(24 hours)",
    description: "COVID-19 Black Thursday",
    duration: "24 hours",
    defaultSimulationTime: 30, // seconds
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "hourly",
    timeLabels: Array.from({length: 24}, (_, i) => `Hour ${i+1}`),
    
    // All cryptos available in 2020
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: true },
        BNB: { available: true },
        SOL: { available: true },
        XRP: { available: true }
    },
    
    prices: {
        BTC: { 
            start: 7911, 
            hourly: [7911, 7650, 7200, 6800, 6200, 5800, 5400, 5200, 5000, 4900, 4857, 4900, 
                     5100, 5300, 5200, 5100, 5000, 4950, 4900, 4880, 4860, 4857, 4850, 4857],
            end: 4857 
        },
        ETH: { 
            start: 194, 
            hourly: [194, 185, 170, 155, 140, 125, 115, 110, 108, 109, 110, 112,
                     115, 118, 116, 114, 112, 111, 110, 109, 110, 111, 110, 110],
            end: 110 
        },
        BNB: { 
            start: 13.50, 
            hourly: [13.50, 13.00, 12.20, 11.50, 10.80, 10.20, 9.80, 9.50, 9.30, 9.20, 9.15, 9.20,
                     9.40, 9.60, 9.50, 9.40, 9.30, 9.25, 9.20, 9.18, 9.16, 9.15, 9.14, 9.15],
            end: 9.15 
        },
        SOL: { 
            start: 0.85, // SOL didn't exist yet, using similar volatility
            hourly: [0.85, 0.82, 0.77, 0.72, 0.66, 0.61, 0.57, 0.54, 0.52, 0.51, 0.50, 0.51,
                     0.53, 0.55, 0.54, 0.53, 0.52, 0.51, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50],
            end: 0.50 
        },
        XRP: { 
            start: 0.20, 
            hourly: [0.20, 0.19, 0.17, 0.16, 0.14, 0.13, 0.12, 0.115, 0.11, 0.11, 0.11, 0.112,
                     0.115, 0.118, 0.116, 0.114, 0.112, 0.111, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11],
            end: 0.11 
        }
    }
};

// May 19, 2021 China FUD crash
const MAY_2021_SCENARIO = {
    id: 'may_2021',
    date: "May 19, 2021",
    displayName: "May 19, 2021",
    subtitle: "(24 hours)",
    description: "Crypto Market Crash",
    duration: "24 hours",
    defaultSimulationTime: 30,
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "hourly",
    timeLabels: Array.from({length: 24}, (_, i) => `Hour ${i+1}`),
    
    // All cryptos available in 2021
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: true },
        BNB: { available: true },
        SOL: { available: true },
        XRP: { available: true }
    },
    
    prices: {
        BTC: { 
            start: 43000, 
            hourly: [43000, 42000, 40500, 38000, 35000, 33000, 31500, 30000, 29500, 30000, 30500, 31000,
                     31500, 32000, 31800, 31600, 31400, 31200, 31000, 30800, 30600, 30500, 30400, 30000],
            end: 30000 
        },
        ETH: { 
            start: 3400, 
            hourly: [3400, 3200, 3000, 2800, 2500, 2200, 2000, 1900, 1850, 1900, 1950, 2000,
                     2050, 2100, 2080, 2060, 2040, 2020, 2000, 1980, 1960, 1950, 1940, 1900],
            end: 1900 
        },
        BNB: { 
            start: 600, 
            hourly: [600, 570, 530, 480, 430, 380, 340, 310, 300, 305, 310, 315,
                     320, 325, 322, 320, 318, 315, 312, 310, 308, 305, 303, 300],
            end: 300 
        },
        SOL: { 
            start: 55, 
            hourly: [55, 52, 48, 44, 40, 36, 33, 30, 29, 29.5, 30, 30.5,
                     31, 31.5, 31.3, 31.1, 30.9, 30.7, 30.5, 30.3, 30.1, 30, 29.9, 30],
            end: 30 
        },
        XRP: { 
            start: 1.50, 
            hourly: [1.50, 1.42, 1.32, 1.20, 1.08, 0.98, 0.92, 0.90, 0.88, 0.89, 0.90, 0.91,
                     0.92, 0.93, 0.925, 0.92, 0.915, 0.91, 0.905, 0.90, 0.895, 0.89, 0.885, 0.90],
            end: 0.90 
        }
    }
};

// 2013 Bitcoin's first major bull run
const YEAR_2013_SCENARIO = {
    id: 'year_2013',
    date: "2013",
    displayName: "2013",
    subtitle: "(Full Year)",
    description: "Bitcoin's First Bull Run",
    duration: "1 year",
    defaultSimulationTime: 30,
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "monthly",
    timeLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    // Only early cryptos existed
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: false, reason: "Not created until 2015" },
        BNB: { available: false, reason: "Not created until 2017" },
        SOL: { available: false, reason: "Not created until 2020" },
        XRP: { available: true }
    },
    
    prices: {
        BTC: {
            start: 13,
            monthly: [13, 20, 35, 100, 140, 110, 95, 120, 140, 180, 450, 1100],
            end: 1100
        },
        XRP: {
            start: 0.005,
            monthly: [0.005, 0.006, 0.008, 0.015, 0.020, 0.014, 0.013, 0.015, 0.018, 0.025, 0.040, 0.06],
            end: 0.06
        },
        // Unavailable cryptos still need price data structure
        ETH: { start: 0, monthly: Array(12).fill(0), end: 0 },
        BNB: { start: 0, monthly: Array(12).fill(0), end: 0 },
        SOL: { start: 0, monthly: Array(12).fill(0), end: 0 }
    }
};

// "Now" scenario - placeholder for real-time trading
const NOW_SCENARIO = {
    id: 'now',
    date: "Live Trading",
    displayName: "Now",
    subtitle: "(Real-time)",
    description: "Trade with current prices",
    duration: "Real-time",
    defaultSimulationTime: 30,
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "realtime",
    timeLabels: ["Real-time"],
    
    // All current cryptos available
    availableCryptos: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'],
    
    // Placeholder data - will be replaced with real-time data later
    prices: {
        BTC: { 
            start: 65000,
            hourly: [65000], // Placeholder
            end: 65000
        },
        ETH: { 
            start: 3500,
            hourly: [3500], // Placeholder
            end: 3500
        },
        BNB: { 
            start: 400,
            hourly: [400], // Placeholder
            end: 400
        },
        SOL: { 
            start: 120,
            hourly: [120], // Placeholder
            end: 120
        },
        XRP: { 
            start: 0.75,
            hourly: [0.75], // Placeholder
            end: 0.75
        }
    }
};

// Store available scenarios
const SCENARIOS = {
    'now': NOW_SCENARIO,
    'march_2020': MARCH_2020_SCENARIO,
    'may_2021': MAY_2021_SCENARIO,
    'year_2013': YEAR_2013_SCENARIO
};

// Global auth instance
window.gameAuth = null;

// Helper function to create back/dashboard button
function createBackButton(scene, x = 50, y = 550, text = 'BACK', destination = 'DashboardScene') {
    const btn = scene.add.rectangle(x, y, 100, 40, 0x000000, 1)
        .setStrokeStyle(2, 0x666666)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);
        
    const btnText = scene.add.text(x, y, text, {
        fontSize: '16px',
        fontFamily: 'Arial Black',
        color: '#ffffff'
    }).setOrigin(0.5);
    
    btn.on('pointerover', () => {
        btn.setStrokeStyle(2, 0x00ffff);
        btnText.setColor('#00ffff');
    })
    .on('pointerout', () => {
        btn.setStrokeStyle(2, 0x666666);
        btnText.setColor('#ffffff');
    })
    .on('pointerdown', () => {
        scene.scene.start(destination, { user: scene.user });
    });
    
    return { btn, btnText };
}

// Helper function to create dashboard button
function createDashboardButton(scene, x = 850, y = 40) {
    return createBackButton(scene, x, y, 'DASHBOARD', 'DashboardScene');
}

// Login Scene
class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
        this.auth = new Auth();
        this.isSignUp = false;
    }

    async create() {
        // Hide loading div
        document.getElementById('loading').style.display = 'none';
        
        // Check for existing session
        const currentUser = await this.auth.getCurrentUser();
        if (currentUser) {
            try {
                // Fetch user profile with username
                const profile = await this.auth.getUserProfile(currentUser.id);
                const fullUser = {
                    ...currentUser,
                    username: profile?.username || currentUser.email?.split('@')[0] || 'Unknown'
                };
                // Already logged in, go to dashboard
                this.scene.start('DashboardScene', { user: fullUser });
                return;
            } catch (error) {
                console.error('Error fetching profile:', error);
                // Continue to login screen if profile fetch fails
            }
        }
        
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title - white with cyan accent
        this.add.text(450, 100, 'CRYPTO TRADER SIMULATOR', {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Subtitle - white text
        this.add.text(450, 150, 'Like Fantasy Football For Crypto!!', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Mode text
        this.modeText = this.add.text(450, 220, 'Sign In', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Create auth form
        this.createAuthForm();
        
        // Toggle link
        this.toggleText = this.add.text(450, 480, "Don't have an account? Sign Up", {
            fontSize: '16px',
            color: '#00ffff'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#ff1493'); })
        .on('pointerout', function() { this.setColor('#00ffff'); })
        .on('pointerdown', () => this.toggleMode());
        
        // Error text (hidden initially)
        this.errorText = this.add.text(450, 510, '', {
            fontSize: '16px',
            color: '#ff1493'
        }).setOrigin(0.5);
        
        // Test login buttons (temporary for testing)
        this.add.text(450, 560, 'TEST LOGINS:', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Adam test button
        const adamBtn = this.add.text(350, 580, '[Login as Adam]', {
            fontSize: '14px',
            color: '#00ff00'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#ffffff'); })
        .on('pointerout', function() { this.setColor('#00ff00'); })
        .on('pointerdown', () => {
            this.isSignUp = false; // Make sure we're in sign-in mode
            this.modeText.setText('Sign In');
            this.toggleText.setText("Don't have an account? Sign Up");
            this.authButton.textContent = 'SIGN IN';
            this.emailInput.value = 'adam@test.com';
            this.passwordInput.value = 'test12';
            this.handleTestAuth('adam@test.com', 'test12');
        });
        
        // Beth test button
        const bethBtn = this.add.text(550, 580, '[Login as Beth]', {
            fontSize: '14px',
            color: '#00ff00'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#ffffff'); })
        .on('pointerout', function() { this.setColor('#00ff00'); })
        .on('pointerdown', () => {
            this.isSignUp = false; // Make sure we're in sign-in mode
            this.modeText.setText('Sign In');
            this.toggleText.setText("Don't have an account? Sign Up");
            this.authButton.textContent = 'SIGN IN';
            this.emailInput.value = 'beth@test.com';
            this.passwordInput.value = 'test12';
            this.handleTestAuth('beth@test.com', 'test12');
        });
    }
    
    createAuthForm() {
        // Create HTML form overlay
        const formHtml = `
            <div id="auth-form" style="position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%); text-align: center;">
                <input type="email" id="email-input" placeholder="Email" style="
                    width: 300px;
                    padding: 12px;
                    margin: 10px;
                    background: #111;
                    border: 2px solid #666;
                    color: white;
                    font-size: 16px;
                    border-radius: 4px;
                ">
                <br>
                <input type="password" id="password-input" placeholder="Password" style="
                    width: 300px;
                    padding: 12px;
                    margin: 10px;
                    background: #111;
                    border: 2px solid #666;
                    color: white;
                    font-size: 16px;
                    border-radius: 4px;
                ">
                <br>
                <button id="auth-button" style="
                    width: 200px;
                    padding: 12px;
                    margin: 20px;
                    background: #00ffff;
                    border: none;
                    color: black;
                    font-size: 18px;
                    font-weight: bold;
                    border-radius: 4px;
                    cursor: pointer;
                ">SIGN IN</button>
            </div>
        `;
        
        // Add form to page
        const formContainer = document.createElement('div');
        formContainer.innerHTML = formHtml;
        document.body.appendChild(formContainer);
        
        // Store references
        this.emailInput = document.getElementById('email-input');
        this.passwordInput = document.getElementById('password-input');
        this.authButton = document.getElementById('auth-button');
        this.formContainer = formContainer;
        
        // Add event listeners
        this.authButton.onclick = () => this.handleAuth();
        
        // Focus email input
        this.emailInput.focus();
        
        // Allow Enter key to submit
        this.passwordInput.onkeydown = (e) => {
            if (e.key === 'Enter') this.handleAuth();
        };
    }
    
    toggleMode() {
        this.isSignUp = !this.isSignUp;
        this.modeText.setText(this.isSignUp ? 'Sign Up' : 'Sign In');
        this.toggleText.setText(this.isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up");
        this.authButton.textContent = this.isSignUp ? 'SIGN UP' : 'SIGN IN';
        this.errorText.setText('');
    }
    
    async handleAuth() {
        const email = this.emailInput.value.trim();
        const password = this.passwordInput.value;
        
        if (!email || !password) {
            this.showError('Please enter email and password');
            return;
        }
        
        // Disable button during auth
        this.authButton.disabled = true;
        this.authButton.style.opacity = '0.5';
        
        try {
            let result;
            if (this.isSignUp) {
                // Use email prefix as default username
                const defaultUsername = email.split('@')[0];
                result = await this.auth.signUp(email, password, defaultUsername);
            } else {
                result = await this.auth.signIn(email, password);
            }
            
            if (result.error) {
                throw result.error;
            }
            
            const user = result.data?.user || result.data?.session?.user;
            
            if (user && user.id) {
                // Fetch user profile with username
                const profile = await this.auth.getUserProfile(user.id);
                const fullUser = {
                    ...user,
                    username: profile?.username || user.email?.split('@')[0] || 'Unknown'
                };
                
                // Clean up form
                this.formContainer.remove();
                // Go to dashboard
                this.scene.start('DashboardScene', { user: fullUser });
            } else {
                throw new Error('Authentication failed - no user returned');
            }
        } catch (error) {
            this.showError(error.message || 'Authentication failed');
            this.authButton.disabled = false;
            this.authButton.style.opacity = '1';
        }
    }
    
    showError(message) {
        this.errorText.setText(message);
        // Clear error after 3 seconds
        this.time.delayedCall(3000, () => {
            this.errorText.setText('');
        });
    }
    
    async handleTestAuth(email, password) {
        // Disable button during auth
        this.authButton.disabled = true;
        this.authButton.style.opacity = '0.5';
        
        try {
            // First try to sign in
            let result = await this.auth.signIn(email, password);
            
            if (result.error) {
                // If sign in fails, try to sign up
                console.log('Sign in failed, attempting sign up...');
                // Use email prefix as default username
                const defaultUsername = email.split('@')[0];
                result = await this.auth.signUp(email, password, defaultUsername);
                
                if (result.error) {
                    throw result.error;
                }
            }
            
            const user = result.data?.user || result.data?.session?.user;
            
            if (user && user.id) {
                // Fetch user profile with username
                const profile = await this.auth.getUserProfile(user.id);
                const fullUser = {
                    ...user,
                    username: profile?.username || user.email?.split('@')[0] || 'Unknown'
                };
                
                // Clean up form
                this.formContainer.remove();
                // Go to dashboard
                this.scene.start('DashboardScene', { user: fullUser });
            } else {
                throw new Error('Authentication failed - no user returned');
            }
        } catch (error) {
            this.showError(error.message || 'Authentication failed');
            this.authButton.disabled = false;
            this.authButton.style.opacity = '1';
        }
    }
    
    shutdown() {
        // Clean up form when scene shuts down
        if (this.formContainer) {
            this.formContainer.remove();
        }
    }
}

// Scenario Selection Scene
class ScenarioSelectScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ScenarioSelectScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
    }
    
    create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        this.add.text(450, 100, 'SELECT TIME PERIOD', {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Continue tutorial if active
        if (window.tutorialManager) {
            window.tutorialManager.checkScene(this);
        }
        
        // Subtitle
        this.add.text(450, 150, 'Choose a time period to trade through', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Now - Real-time option
        this.createScenarioButton(
            SCENARIOS.now.displayName,
            SCENARIOS.now.subtitle,
            230,
            'now'
        );
        
        // 2013 Full Year option
        this.createScenarioButton(
            SCENARIOS.year_2013.displayName,
            SCENARIOS.year_2013.subtitle,
            310,
            'year_2013'
        );
        
        // March 12, 2020 option
        this.createScenarioButton(
            SCENARIOS.march_2020.displayName,
            SCENARIOS.march_2020.subtitle,
            390,
            'march_2020'
        );
        
        // May 19, 2021 option
        this.createScenarioButton(
            SCENARIOS.may_2021.displayName,
            SCENARIOS.may_2021.subtitle,
            470,
            'may_2021'
        );
        
        // Back button
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(100, 550, 'BACK', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton
            .on('pointerover', () => {
                backButton.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                if (this.user && this.user.id) {
                    this.scene.start('DashboardScene', { user: this.user });
                } else {
                    this.scene.start('LoginScene');
                }
            });
    }
    
    createScenarioButton(dateText, subtitleText, y, scenarioKey) {
        const button = this.add.rectangle(450, y, 400, 70, 0x111111)
            .setStrokeStyle(2, 0x333333)
            .setInteractive({ useHandCursor: true })
            .on('pointerover', () => {
                button.setStrokeStyle(2, 0x00ffff);
                dateDisplay.setColor('#00ffff');
            })
            .on('pointerout', () => {
                button.setStrokeStyle(2, 0x333333);
                dateDisplay.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                if (scenarioKey === 'now') {
                    // Go to Now mode setup
                    this.scene.start('NowModeSetupScene', { 
                        user: this.user
                    });
                } else {
                    this.scene.start('SimulationSpeedScene', { 
                        user: this.user,
                        scenario: scenarioKey
                    });
                }
            });
            
        const dateDisplay = this.add.text(450, y - 10, dateText, {
            fontSize: '26px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const subtitleDisplay = this.add.text(450, y + 15, subtitleText, {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
    }
}

// Simulation Speed Selection Scene
class SimulationSpeedScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimulationSpeedScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
        this.scenarioKey = data.scenario;
        this.scenario = SCENARIOS[this.scenarioKey];
    }
    
    create() {
        // Background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        this.add.text(450, 50, 'SIMULATION SPEED', {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Scenario info
        this.add.text(450, 100, `${this.scenario.displayName} - ${this.scenario.description}`, {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        this.add.text(450, 130, 'Select how fast the simulation should play', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Check if this is the "Now" scenario
        if (this.scenarioKey === 'now') {
            // Coming Soon message for "Now" scenario
            const comingSoonBox = this.add.rectangle(450, 300, 600, 200, 0x111111)
                .setStrokeStyle(2, 0x333333);
                
            this.add.text(450, 280, 'COMING SOON', {
                fontSize: '36px',
                fontFamily: 'Arial Black',
                color: '#666666'
            }).setOrigin(0.5);
            
            this.add.text(450, 320, 'Real-time trading will be available in a future update', {
                fontSize: '18px',
                color: '#666666'
            }).setOrigin(0.5);
        } else {
            // Speed options for other scenarios
            let yPos = 220;
            Object.entries(this.scenario.speeds).forEach(([speedKey, speedConfig]) => {
                this.createSpeedButton(speedKey, speedConfig, yPos);
                yPos += 100;
            });
        }
        
        // Back button
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(100, 550, 'BACK', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton
            .on('pointerover', () => {
                backButton.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => this.scene.start('ScenarioSelectScene', { user: this.user }));
    }
    
    createSpeedButton(speedKey, speedConfig, y) {
        const button = this.add.rectangle(450, y, 400, 70, 0x111111)
            .setStrokeStyle(2, 0x333333)
            .setInteractive({ useHandCursor: true });
            
        const labelText = this.add.text(450, y - 10, speedConfig.label, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const timeText = this.add.text(450, y + 15, `${speedConfig.time} seconds total`, {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        button
            .on('pointerover', () => {
                button.setStrokeStyle(2, 0x00ffff);
                labelText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                button.setStrokeStyle(2, 0x333333);
                labelText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                this.scene.start('AllocationScene', {
                    user: this.user,
                    scenario: this.scenarioKey,
                    speed: speedKey,
                    simulationTime: speedConfig.time
                });
            });
    }
}

// Allocation Scene
class AllocationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'AllocationScene' });
        this.auth = new Auth(); // Add Auth instance for Supabase access
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
        this.scenarioKey = data.scenario || 'march_2020';
        
        // Now mode specific data
        this.isNowMode = data.isNowMode || false;
        this.durationDays = data.durationDays || null;
        this.currentPrices = null;
        this.isMultiplayer = data.isMultiplayer || false;
        
        // Multiplayer game data
        this.multiplayerGame = data.multiplayerGame || null;
        this.isJoiningMultiplayer = !!this.multiplayerGame;
        
        // For Now mode, don't try to look up a scenario
        if (this.scenarioKey === 'now' || this.isNowMode || this.isJoiningMultiplayer) {
            this.scenario = null;
            this.isNowMode = true; // Force Now mode for multiplayer
        } else {
            this.scenario = SCENARIOS[this.scenarioKey];
        }
        
        // If joining multiplayer, use game's duration
        if (this.isJoiningMultiplayer) {
            this.durationDays = this.multiplayerGame.duration_days;
        }
        
        this.speed = data.speed || 'regular';
        this.simulationTime = data.simulationTime || (this.scenario ? this.scenario.defaultSimulationTime : 60);
        this.allocations = {};
        this.totalAllocated = 0;
        
        // Initialize all cryptos to 0
        Object.keys(GAME_CONFIG.cryptos).forEach(symbol => {
            this.allocations[symbol] = 0;
        });
    }
    
    async create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Header - white text
        this.add.text(450, 40, `${this.userName}'s Portfolio Allocation`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Continue tutorial if active
        if (window.tutorialManager) {
            window.tutorialManager.checkScene(this);
        }
        
        // Display duration for Now mode
        if (this.isNowMode && this.durationDays) {
            this.add.text(450, 68, `Duration: ${this.durationDays} days`, {
                fontSize: '18px',
                color: '#00ffff'
            }).setOrigin(0.5);
        }
        
        // Fetch current prices if in Now mode
        if (this.isNowMode) {
            if (this.isJoiningMultiplayer) {
                // Use the game's starting prices for multiplayer
                this.currentPrices = this.multiplayerGame.starting_prices;
                console.log('Using multiplayer game starting prices:', this.currentPrices);
            } else {
                // Show loading text
                const loadingText = this.add.text(450, 300, 'Loading current prices...', {
                    fontSize: '24px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                await this.fetchCurrentPrices();
                
                // Remove loading text
                loadingText.destroy();
            }
        }
        
        // Money remaining - white text
        this.moneyText = this.add.text(450, 90, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.updateMoneyDisplay();
        
        // Timer (60 seconds)
        this.timeLeft = 60;
        this.timerText = this.add.text(800, 550, '1:00', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(1, 0.5);
        
        this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });
        
        // Crypto allocation buttons
        let yPos = 140;
        Object.entries(GAME_CONFIG.cryptos).forEach(([symbol, crypto]) => {
            this.createCryptoRow(symbol, crypto, yPos);
            yPos += 80;
        });
        
        // Lock in button - cyan accent when ready
        this.lockButton = this.add.rectangle(450, 520, 200, 50, 0x333333, 1)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true })
            .on('pointerdown', () => this.lockInAllocations());
            
        this.lockButtonText = this.add.text(450, 520, 'LOCK IN', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#999999'
        }).setOrigin(0.5);
        
        // Instructions - gray text
        this.add.text(450, 560, 'Click [+] to allocate $1M blocks to each crypto', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Back button
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(100, 550, 'BACK', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton
            .on('pointerover', () => {
                backButton.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => this.scene.start('ScenarioSelectScene', { user: this.user }));
        

    }
    
    createCryptoRow(symbol, crypto, y) {
        // For Now mode, all cryptos are available
        let isAvailable = true;
        let reason = '';
        
        // For historical scenarios, check availability
        if (!this.isNowMode && this.scenario.availableCryptos) {
            isAvailable = this.scenario.availableCryptos[symbol].available;
            reason = this.scenario.availableCryptos[symbol].reason;
        }
        
        // Crypto icon placeholder - moved left
        const iconBg = this.add.circle(100, y, 25, isAvailable ? crypto.color : 0x333333);
        this.add.text(100, y, symbol, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: isAvailable ? '#ffffff' : '#666666'
        }).setOrigin(0.5);
        
        // Crypto name - adjusted position
        this.add.text(150, y, crypto.name, {
            fontSize: '20px',
            color: isAvailable ? '#ffffff' : '#666666'
        }).setOrigin(0, 0.5);
        
        // If not available, show reason instead of price and controls
        if (!isAvailable) {
            this.add.text(320, y, reason, {
                fontSize: '16px',
                color: '#444444',
                fontStyle: 'italic'
            }).setOrigin(0, 0.5);
            return;
        }
        
        // Current price - with more space
        let displayPrice = 0;
        if (this.isNowMode && this.currentPrices && this.currentPrices[symbol]) {
            displayPrice = this.currentPrices[symbol];
        } else if (this.scenario && this.scenario.prices && this.scenario.prices[symbol]) {
            displayPrice = this.scenario.prices[symbol].start;
        } else {
            // Fallback to a default if no price available
            displayPrice = 0;
        }
        
                    const priceText = this.add.text(320, y, displayPrice > 0 ? `$${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Loading...', {
                fontSize: '18px',
                color: '#666666'
            }).setOrigin(0, 0.5);
        
        // Store price text for updates
        this[`${symbol}_priceText`] = priceText;
        
        // Minus button - with more space
        const minusBtn = this.add.text(470, y, '[-]', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#666666'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => minusBtn.setColor('#ff1493'))
        .on('pointerout', () => minusBtn.setColor('#666666'))
        .on('pointerdown', () => {
            if (this.allocations[symbol] > 0) {
                this.allocations[symbol]--;
                this.totalAllocated--;
                this.updateAllocationDisplay(symbol, allocationText, false);
            }
        });
        
        // Plus button
        const plusBtn = this.add.text(530, y, '[+]', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#666666'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => plusBtn.setColor('#00ffff'))
        .on('pointerout', () => plusBtn.setColor('#666666'))
        .on('pointerdown', () => {
            if (this.totalAllocated < 10) {
                this.allocations[symbol]++;
                this.totalAllocated++;
                this.updateAllocationDisplay(symbol, allocationText, true);
            }
        });
        
        // Allocation display
        const allocationText = this.add.text(660, y, '$0', {
            fontSize: '22px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Counter
        const counterText = this.add.text(780, y, '0/10', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Store references
        this[`${symbol}_allocationText`] = allocationText;
        this[`${symbol}_counterText`] = counterText;
    }
    
    updateAllocationDisplay(symbol, text, isAdding = null) {
        const amount = this.allocations[symbol];
        // Show actual USD value
        const usdValue = amount * GAME_CONFIG.blockSize;
        text.setText(`$${usdValue.toLocaleString()}`);
        
        // Flash the allocation text too
        if (isAdding !== null) {
            const flashColor = isAdding ? '#00ffff' : '#ff1493';
            text.setColor(flashColor);
            this.time.delayedCall(300, () => {
                text.setColor('#ffffff');
            });
        }
        
        this[`${symbol}_counterText`].setText(`${amount}/10`);
        this.updateMoneyDisplay(isAdding);
        
        // Update lock button appearance when fully allocated
        if (this.totalAllocated === 10) {
            this.lockButton.setFillStyle(0x00ffff, 0.8);
            this.lockButton.setStrokeStyle(2, 0x00ffff);
            this.lockButtonText.setColor('#000000');
        } else {
            this.lockButton.setFillStyle(0x333333, 1);
            this.lockButton.setStrokeStyle(2, 0x666666);
            this.lockButtonText.setColor('#999999');
        }
    }
    
    updateMoneyDisplay(isAdding = null) {
        const remaining = 10 - this.totalAllocated;
        const remainingUSD = remaining * GAME_CONFIG.blockSize;
        this.moneyText.setText(`$${remainingUSD.toLocaleString()} remaining to allocate`);
        
        // Flash animation based on action
        if (isAdding !== null) {
            const flashColor = isAdding ? '#00ffff' : '#ff1493';
            this.moneyText.setColor(flashColor);
            
            // Tween back to appropriate color
            this.time.delayedCall(300, () => {
                if (remaining === 0) {
                    this.moneyText.setColor('#00ffff');
                } else {
                    this.moneyText.setColor('#ffffff');
                }
            });
        } else {
            // No animation, just set the color
            if (remaining === 0) {
                this.moneyText.setColor('#00ffff');
            } else {
                this.moneyText.setColor('#ffffff');
            }
        }
    }
    
    updateTimer() {
        this.timeLeft--;
        const minutes = Math.floor(this.timeLeft / 60);
        const seconds = this.timeLeft % 60;
        this.timerText.setText(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        if (this.timeLeft <= 10) {
            this.timerText.setColor('#ff1493');
        }
        
        if (this.timeLeft <= 0) {
            this.lockInAllocations();
        }
    }
    
    lockInAllocations() {
        if (this.totalAllocated !== 10) {
            // Flash warning
            this.cameras.main.flash(500, 255, 20, 147);
            return;
        }
        
        if (this.isNowMode) {
            // For Now mode, go to NowModeResultScene
            // Ensure we have current prices
            const prices = this.currentPrices || {};
            
            // If any prices are missing, add defaults
            Object.keys(GAME_CONFIG.cryptos).forEach(symbol => {
                if (!prices[symbol]) {
                    console.warn(`Missing price for ${symbol}, using default`);
                    prices[symbol] = 0;
                }
            });
            
            this.scene.start('NowModeResultScene', {
                user: this.user,
                allocations: this.allocations,
                durationDays: this.durationDays,
                startingPrices: prices,
                totalInvested: this.totalAllocated * 1000000,
                isJoiningMultiplayer: this.isJoiningMultiplayer,
                multiplayerGame: this.multiplayerGame,
                isMultiplayer: this.isMultiplayer
            });
        } else {
            // Start the simulation for historical scenarios
            this.scene.start('SimulationScene', {
                user: this.user,
                allocations: this.allocations,
                scenario: this.scenarioKey,
                speed: this.speed,
                simulationTime: this.simulationTime
            });
        }
    }
    
    async fetchCurrentPrices() {
        try {
            // Ensure Auth is initialized
            if (!this.auth.supabase) {
                await this.auth.init();
            }
            
            // Check if we have cached prices first
            const { data: cachedPrices, error: cacheError } = await this.auth.supabase
                .from('prices_cache')
                .select('*');
                
            if (!cacheError && cachedPrices && cachedPrices.length > 0) {
                // Convert array to object
                this.currentPrices = {};
                cachedPrices.forEach(row => {
                    this.currentPrices[row.symbol] = row.price;
                });
                console.log('Loaded prices from cache:', this.currentPrices);
                
                // Ensure we have all required cryptos
                const requiredCryptos = Object.keys(GAME_CONFIG.cryptos);
                for (const symbol of requiredCryptos) {
                    if (!this.currentPrices[symbol]) {
                        console.warn(`Missing price for ${symbol}, using default`);
                        const defaults = this.getDefaultPrices();
                        this.currentPrices[symbol] = defaults[symbol] || 0;
                    }
                }
            } else {
                // Use default prices if no cache available
                console.log('No cached prices available, using defaults');
                this.currentPrices = this.getDefaultPrices();
            }
        } catch (error) {
            console.error('Error fetching prices:', error);
            this.currentPrices = this.getDefaultPrices();
        }
    }
    
    getDefaultPrices() {
        // Default current prices (can be updated with real API later)
        return {
            BTC: 98500,
            ETH: 3850,
            BNB: 725,
            SOL: 180,
            XRP: 2.40
        };
    }
}

// Simulation Scene
class SimulationScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SimulationScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
        this.allocations = data.allocations;
        this.scenarioKey = data.scenario || 'march_2020';
        this.scenario = SCENARIOS[this.scenarioKey];
        this.speed = data.speed || 'regular';
        this.simulationTime = data.simulationTime || this.scenario.defaultSimulationTime;
        this.prices = {};
        this.startingPrices = {};
        this.dataIndex = 0;
        this.maxDataPoints = this.scenario.dataGranularity === 'hourly' ? 24 : 12;
        
        // Initialize with historical starting prices
        Object.entries(this.scenario.prices).forEach(([symbol, data]) => {
            this.prices[symbol] = data.start;
            this.startingPrices[symbol] = data.start;
        });
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Header - white
        this.add.text(450, 40, `${this.scenario.date} - Market Replay`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Time progress
        const initialTimeLabel = this.scenario.timeLabels[0];
        this.timeText = this.add.text(450, 70, initialTimeLabel, {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Portfolio value - white
        this.portfolioValueText = this.add.text(450, 110, '', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.profitText = this.add.text(450, 150, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Continue tutorial if active
        if (window.tutorialManager) {
            window.tutorialManager.checkScene(this);
        }
        
        // Create crypto displays
        let yPos = 200;
        this.cryptoDisplays = {};
        
        Object.entries(GAME_CONFIG.cryptos).forEach(([symbol, crypto]) => {
            if (this.allocations[symbol] > 0) {
                this.createCryptoDisplay(symbol, crypto, yPos);
                yPos += 60;
            }
        });
        
        // Skip button - gray
        this.add.text(800, 550, '[Skip >>]', {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(1, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#00ffff'); })
        .on('pointerout', function() { this.setColor('#666666'); })
        .on('pointerdown', () => this.showResults());
        
        // Start price updates using historical data
        this.time.addEvent({
            delay: (this.simulationTime * 1000) / this.maxDataPoints,
            callback: this.updatePrices,
            callbackScope: this,
            loop: true
        });
        
        this.updatePortfolioValue();
    }
    
    createCryptoDisplay(symbol, crypto, y) {
        const container = this.add.container(450, y);
        
        // Background
        const bg = this.add.rectangle(0, 0, 700, 50, 0x111111)
            .setStrokeStyle(1, crypto.color);
        
        // Symbol - white
        const symbolText = this.add.text(-320, 0, symbol, {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Allocation - gray
        const allocationUSD = this.allocations[symbol] * GAME_CONFIG.blockSize;
        const allocationText = this.add.text(-200, 0, `$${(allocationUSD/1000000).toFixed(1)}M`, {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0, 0.5);
        
        // Current price - white
                        const priceText = this.add.text(0, 0, `$${this.scenario.prices[symbol].start.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Change percentage - starts gray
        const changeText = this.add.text(200, 0, '+0.00%', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#666666'
        }).setOrigin(0.5);
        
        container.add([bg, symbolText, allocationText, priceText, changeText]);
        
        this.cryptoDisplays[symbol] = {
            container,
            priceText,
            changeText,
            allocationText,
            bg,
            initialAllocation: allocationUSD
        };
    }
    
    updatePrices() {
        this.dataIndex++;
        
        if (this.dataIndex >= this.maxDataPoints) {
            this.showResults();
            return;
        }
        
        // Update time display
        this.timeText.setText(this.scenario.timeLabels[this.dataIndex]);
        
        // Update prices from historical data
        Object.keys(this.prices).forEach(symbol => {
            // Check if crypto is available
            if (!this.scenario.availableCryptos[symbol].available) {
                return;
            }
            
            // Get the right data array (hourly or monthly)
            const dataArray = this.scenario.dataGranularity === 'hourly' 
                ? this.scenario.prices[symbol].hourly 
                : this.scenario.prices[symbol].monthly;
            const historicalPrice = dataArray[this.dataIndex];
            this.prices[symbol] = historicalPrice;
            
            // Update display if allocated
            if (this.allocations[symbol] > 0) {
                const display = this.cryptoDisplays[symbol];
                const percentChange = ((this.prices[symbol] / this.startingPrices[symbol]) - 1) * 100;
                
                display.priceText.setText(`$${this.prices[symbol].toLocaleString()}`);
                display.changeText.setText(`${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(2)}%`);
                
                // Update current value in first column
                const currentValue = display.initialAllocation * (this.prices[symbol] / this.startingPrices[symbol]);
                display.allocationText.setText(`$${(currentValue/1000000).toFixed(1)}M`);
                
                // Use accent colors only for profit/loss
                if (percentChange > 0) {
                    display.changeText.setColor('#00ffff');
                    display.allocationText.setColor('#00ffff');
                    display.bg.setStrokeStyle(2, 0x00ffff);
                } else if (percentChange < 0) {
                    display.changeText.setColor('#ff1493');
                    display.allocationText.setColor('#ff1493');
                    display.bg.setStrokeStyle(2, 0xff1493);
                } else {
                    display.allocationText.setColor('#666666');
                }
            }
        });
        
        this.updatePortfolioValue();
    }
    
    updatePortfolioValue() {
        let totalValue = 0;
        
        Object.entries(this.allocations).forEach(([symbol, blocks]) => {
            if (blocks > 0) {
                const invested = blocks * GAME_CONFIG.blockSize;
                const units = invested / this.startingPrices[symbol];
                const currentValue = units * this.prices[symbol];
                totalValue += currentValue;
            }
        });
        
                                this.portfolioValueText.setText(`$${totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            
            const profit = totalValue - GAME_CONFIG.startingMoney;
        const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
        
        this.profitText.setText(`${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`);
        // Use accent colors for profit/loss
        this.profitText.setColor(profit >= 0 ? '#00ffff' : '#ff1493');
    }
    
    showResults() {
        // Calculate final value
        let totalValue = 0;
        const results = {};
        
        Object.entries(this.allocations).forEach(([symbol, blocks]) => {
            if (blocks > 0) {
                const invested = blocks * GAME_CONFIG.blockSize;
                const units = invested / this.startingPrices[symbol];
                const currentValue = units * this.prices[symbol];
                totalValue += currentValue;
                
                results[symbol] = {
                    invested,
                    currentValue,
                    change: ((currentValue / invested) - 1) * 100
                };
            }
        });
        
        this.scene.start('ResultsScene', {
            user: this.user,
            totalValue,
            results,
            allocations: this.allocations,
            scenario: this.scenarioKey,
            speed: this.speed
        });
    }
}

// Results Scene
class ResultsScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultsScene' });
        this.auth = new Auth();
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
        this.totalValue = data.totalValue;
        this.results = data.results;
        this.allocations = data.allocations;
        this.scenarioKey = data.scenario || 'march_2020';
        this.scenario = SCENARIOS[this.scenarioKey];
        this.speed = data.speed || 'regular';
    }
    
    async create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Auth is already initialized in constructor, no need to call initialize
        
        // Save the game result if user is logged in
        if (this.user && this.user.id) {
            console.log('User is logged in, attempting to save game...');
            await this.savePastRun();
        } else {
            console.log('No user logged in, skipping save');
        }
        
        // Results header - white
        const profit = this.totalValue - GAME_CONFIG.startingMoney;
        const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
        const isWinner = profit > 0;
        
        this.add.text(450, 40, `${this.userName}'s Results - ${this.scenario.date}`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(450, 70, this.scenario.description, {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Final value label - gray
        this.add.text(450, 120, `Final Portfolio Value`, {
            fontSize: '20px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Value - white with accent
        this.add.text(450, 160, `$${this.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
            fontSize: '48px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Percentage - accent color only
        this.add.text(450, 210, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: isWinner ? '#00ffff' : '#ff1493'
        }).setOrigin(0.5);
        
        // Continue tutorial if active
        if (window.tutorialManager) {
            window.tutorialManager.checkScene(this);
        }
        
        // Performance breakdown - white header
        let yPos = 280;
        this.add.text(450, yPos, 'Performance Breakdown:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 40;
        Object.entries(this.results).forEach(([symbol, data]) => {
            const text = `${symbol}: $${(data.invested).toLocaleString()} → $${data.currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} (${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}%)`;
            this.add.text(450, yPos, text, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
            yPos += 25;
        });
        
        // Fun message - blue/teal color
        const messages = isWinner ? 
            ['You survived Black Thursday!', 'Better than most traders!', 'Risk management pro!'] :
            ['Black Thursday got you!', 'Welcome to crypto volatility!', 'Try a defensive strategy!'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.add.text(450, yPos + 10, message, {
            fontSize: '24px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Back to Dashboard button
        const dashboardBtn = this.add.rectangle(450, 500, 250, 50, 0x000000, 1)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const dashboardText = this.add.text(450, 500, 'BACK TO DASHBOARD', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        dashboardBtn
            .on('pointerover', () => {
                dashboardBtn.setStrokeStyle(2, 0x00ffff);
                dashboardText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                dashboardBtn.setStrokeStyle(2, 0x666666);
                dashboardText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                if (this.user && this.user.id) {
                    this.scene.start('DashboardScene', { user: this.user });
                } else {
                    this.scene.start('LoginScene');
                }
            });
    }
    
    async savePastRun() {
        try {
            // Get scenario details for better data
            const scenario = SCENARIOS[this.scenarioKey];
            const profit = this.totalValue - GAME_CONFIG.startingMoney;
            const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
            
            const saveData = {
                user_id: this.user.id,
                scenario_key: this.scenarioKey,
                allocations: this.allocations,
                final_value: this.totalValue
            };
            
            // Log additional context for debugging
            console.log('Game context:', {
                scenario: scenario.displayName,
                date: scenario.date,
                speed: this.speed,
                profit: `$${profit.toLocaleString()} (${profitPercent.toFixed(1)}%)`,
                startingMoney: GAME_CONFIG.startingMoney
            });
            
            console.log('Attempting to save game with enhanced data:', saveData);
            
            // Initialize auth if needed
            if (!this.auth.supabase) {
                console.error('Auth not initialized, initializing now...');
                await this.auth.initialize();
            }
            
            const { data, error } = await this.auth.supabase
                .from('past_runs')
                .insert(saveData)
                .select();
            
            if (error) {
                console.error('Supabase error:', error);
                throw error;
            }
            
            console.log('Game saved successfully!', data);
            
            // Show visual confirmation
            const savedText = this.add.text(450, 550, '✓ Game Saved', {
                fontSize: '16px',
                color: '#00ff00'
            }).setOrigin(0.5);
            
            // Fade out after 2 seconds
            this.tweens.add({
                targets: savedText,
                alpha: 0,
                duration: 2000,
                delay: 1000
            });
            
        } catch (error) {
            console.error('Error saving game:', error);
            console.error('Error details:', error.message, error.code);
            
            // Show error message
            this.add.text(450, 550, '⚠ Save Failed', {
                fontSize: '16px',
                color: '#ff0000'
            }).setOrigin(0.5);
        }
    }
}

// Dashboard Scene
class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
        this.auth = new Auth();
        this.currentPage = 0;
        this.gamesPerPage = 4;
        this.allGames = [];
        this.activeTab = 'new'; // 'new', 'active', or 'past'
    }
    
    init(data) {
        this.user = data.user;
    }
    
    async create() {
        console.log('DashboardScene create() called with user:', this.user);
        
        // Initialize auth if needed
        try {
            if (this.auth && this.auth.init) {
                console.log('Initializing auth...');
                await this.auth.init();
                console.log('Auth initialized successfully');
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
        
        // Make sure we have a valid user
        if (!this.user || !this.user.email) {
            console.error('No valid user for dashboard:', this.user);
            this.scene.start('LoginScene');
            return;
        }
        
        try {
            // Black background
            this.cameras.main.setBackgroundColor('#000000');
            
            // Header
            this.add.text(450, 40, 'CRYPTO TRADER SIMULATOR', {
                fontSize: '36px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // Welcome message
            this.add.text(450, 90, `Welcome, ${this.user.email}!`, {
                fontSize: '20px',
                color: '#00ffff'
            }).setOrigin(0.5);
            
            console.log('Creating tabs...');
            // Create tabs
            this.createTabs();
            
            console.log('Initializing content group...');
            // Initialize content group
            this.contentGroup = this.add.group();
            this.contentY = 280; // Starting Y position for content
            
            // Check and start tutorial for new users
            console.log('DashboardScene - Checking tutorial manager:', window.tutorialManager);
            if (window.tutorialManager) {
                console.log('Starting tutorial from DashboardScene');
                window.tutorialManager.start(this, this.user);
            } else {
                console.log('Tutorial manager not found!');
            }
            
            console.log('Showing tab content...');
            // Show content based on active tab
            this.showTabContent();
            
            console.log('Creating sign out button...');
            // Create Sign Out button after content to ensure it's on top
            this.createSignOutButton();
            
            console.log('DashboardScene create() completed successfully');
        } catch (error) {
            console.error('Error in DashboardScene create():', error);
            console.error('Stack trace:', error.stack);
        }
        
        // Test buttons (temporary for debugging) - hide them in corner
        const testSaveBtn = this.add.text(50, 20, '[Test Save]', {
            fontSize: '12px',
            color: '#003300'
        }).setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#00ff00'); })
        .on('pointerout', function() { this.setColor('#003300'); })
        .on('pointerdown', async () => {
            console.log('Testing save with user:', this.user);
            try {
                const testData = {
                    user_id: this.user.id,
                    scenario_key: 'march_2020',
                    allocations: {BTC: 5, ETH: 3, BNB: 2},
                    final_value: 12500000  // NOTE: This is fake test data! March 2020 was a crash
                };
                
                const { data, error } = await this.auth.supabase
                    .from('past_runs')
                    .insert(testData)
                    .select();
                    
                if (error) {
                    console.error('Test save error:', error);
                } else {
                    console.log('Test save successful:', data);
                }
            } catch (e) {
                console.error('Test save exception:', e);
            }
        });

    }
    
    createSignOutButton() {
        // Remove existing sign out button if any
        if (this.signOutButton) {
            this.signOutButton.destroy();
        }
        
        // Create sign out button
        this.signOutButton = this.add.text(800, 550, 'Sign Out', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(1, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#ff1493'); })
        .on('pointerout', function() { this.setColor('#666666'); })
        .on('pointerdown', async () => {
            await this.auth.signOut();
            this.scene.start('LoginScene');
        });
    }
    
    createTabs() {
        // Clear existing tabs if any
        if (this.tabGroup) {
            this.tabGroup.clear(true, true);
        } else {
            this.tabGroup = this.add.group();
        }
        
        const tabY = 150;
        const tabWidth = 200;
        const tabHeight = 50;
        const tabSpacing = 20;
        // Fix centering: 3 tabs total width = 3*200 + 2*20 = 640
        const totalWidth = (tabWidth * 3) + (tabSpacing * 2);
        const startX = 450 - (totalWidth / 2); // Center properly
        
        // Tab data
        const tabs = [
            { key: 'new', label: 'NEW GAME', x: startX + (tabWidth / 2) },
            { key: 'active', label: 'ACTIVE', x: startX + tabWidth + tabSpacing + (tabWidth / 2) },
            { key: 'past', label: 'PAST', x: startX + (tabWidth + tabSpacing) * 2 + (tabWidth / 2) }
        ];
        
        // Create tab buttons
        tabs.forEach(tab => {
            const isActive = this.activeTab === tab.key;
            
            // Tab background - use x as center
            const tabBg = this.add.rectangle(tab.x, tabY, tabWidth, tabHeight, 
                isActive ? 0x00ffff : 0x111111)
                .setStrokeStyle(2, isActive ? 0x00ffff : 0x333333)
                .setInteractive({ useHandCursor: true });
            
            // Tab text - centered on tab
            const tabText = this.add.text(tab.x, tabY, tab.label, {
                fontSize: '20px',
                fontFamily: 'Arial Black',
                color: isActive ? '#000000' : '#ffffff'
            }).setOrigin(0.5);
            
            // Add to tab group for cleanup
            this.tabGroup.add(tabBg);
            this.tabGroup.add(tabText);
            
            // Tab interactions
            if (!isActive) {
                tabBg.on('pointerover', () => {
                    tabBg.setStrokeStyle(2, 0x00ffff);
                    tabText.setColor('#00ffff');
                })
                .on('pointerout', () => {
                    tabBg.setStrokeStyle(2, 0x333333);
                    tabText.setColor('#ffffff');
                })
                .on('pointerdown', () => {
                    this.activeTab = tab.key;
                    // Clear and redraw tabs without restarting scene
                    this.createTabs();
                    this.showTabContent();
                    this.createSignOutButton(); // Recreate sign out button
                });
            }
        });
        
        console.log('Tabs created successfully');
    }
    
    showTabContent() {
        console.log('showTabContent() called, activeTab:', this.activeTab);
        
        // Clear existing content more thoroughly
        if (this.pageDisplayGroup) {
            this.pageDisplayGroup.clear(true, true);
            this.pageDisplayGroup.destroy(true);
            this.pageDisplayGroup = null;
        }
        
        // Clear all children from contentGroup
        this.contentGroup.getChildren().forEach(child => {
            child.destroy();
        });
        this.contentGroup.clear(true, true);
        
        switch (this.activeTab) {
            case 'new':
                this.showNewGameContent();
                break;
            case 'active':
                this.showActiveGamesContent();
                break;
            case 'past':
                this.showPastGamesContent();
                break;
        }
        
        // Check if tutorial should show for this tab
        if (window.tutorialManager && window.tutorialManager.isActive) {
            // Show tab-specific tutorial if user hasn't seen it yet
            if (this.activeTab === 'active' || this.activeTab === 'past') {
                window.tutorialManager.showTabTutorial(this, this.activeTab);
            } else {
                window.tutorialManager.checkScene(this);
            }
        }
    }
    
    showNewGameContent() {
        // Ensure contentGroup exists
        if (!this.contentGroup) {
            this.contentGroup = this.add.group();
        }
        
        // Create a background to cover any previous content
        const contentBg = this.add.rectangle(450, this.contentY + 150, 800, 350, 0x000000, 1);
        this.contentGroup.add(contentBg);
        
        // Large play button
        const playButton = this.add.rectangle(450, this.contentY + 80, 400, 80, 0x00ffff)
            .setInteractive({ useHandCursor: true });
            
        const playText = this.add.text(450, this.contentY + 80, 'START NEW GAME', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        
        this.contentGroup.addMultiple([playButton, playText]);
        
        playButton
            .on('pointerover', () => {
                playButton.setFillStyle(0xff1493);
            })
            .on('pointerout', () => {
                playButton.setFillStyle(0x00ffff);
            })
            .on('pointerdown', () => {
                this.scene.start('ScenarioSelectScene', { user: this.user });
            });
        
        // Instructions
        const instructions = this.add.text(450, this.contentY + 180, 
            'Choose from historical scenarios or trade in real-time with "Now" mode', {
            fontSize: '16px',
            color: '#666666',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        
        this.contentGroup.add(instructions);
        
        // Leaderboard button
        const leaderboardBtn = this.add.rectangle(450, this.contentY + 250, 250, 50, 0x111111)
            .setStrokeStyle(2, 0xffff00)
            .setInteractive({ useHandCursor: true });
            
        const leaderboardText = this.add.text(450, this.contentY + 250, '🏆 VIEW LEADERBOARD', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        this.contentGroup.addMultiple([leaderboardBtn, leaderboardText]);
        
        leaderboardBtn
            .on('pointerover', () => {
                leaderboardBtn.setFillStyle(0x222222);
            })
            .on('pointerout', () => {
                leaderboardBtn.setFillStyle(0x111111);
            })
            .on('pointerdown', () => {
                if (window.FEATURES && window.FEATURES.LEADERBOARD) {
                    this.scene.start('LeaderboardScene', { user: this.user });
                } else {
                    alert('Leaderboard coming soon!');
                }
            });
    }
    
    async showActiveGamesContent() {
        // Ensure contentGroup exists
        if (!this.contentGroup) {
            this.contentGroup = this.add.group();
        }
        
        // Create a background to cover any previous content
        const contentBg = this.add.rectangle(450, this.contentY + 150, 800, 350, 0x000000, 1);
        this.contentGroup.add(contentBg);
        
        // Loading text
        const loadingText = this.add.text(450, this.contentY + 40, 'Loading active games...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        this.contentGroup.add(loadingText);
        
        try {
            // Check if auth is still valid
            const { data: { session }, error: sessionError } = await this.auth.supabase.auth.getSession();
            
            if (sessionError || !session) {
                console.error('Session expired or invalid:', sessionError);
                loadingText.setText('Session expired. Please log in again.');
                loadingText.setColor('#ff0000');
                
                // Redirect to login after a delay
                this.time.delayedCall(2000, () => {
                    this.scene.start('LoginScene');
                });
                return;
            }
            
            // Query ALL active games (both single player and multiplayer)
            const { data: allGames, error: gamesError } = await this.auth.supabase
                .from('active_games')
                .select('*')
                .eq('is_complete', false)
                .order('created_at', { ascending: false });
            
            if (gamesError) throw gamesError;
            
            // All games are multiplayer and joinable
            const allMultiplayerGames = allGames || [];
            
            // Check which games the user has already joined
            const gameIds = allMultiplayerGames.map(g => g.id);
            let userParticipations = {};
            
            if (gameIds.length > 0) {
                const { data: participations } = await this.auth.supabase
                    .from('game_participants')
                    .select('game_id')
                    .eq('user_id', this.user.id)
                    .in('game_id', gameIds);
                    
                if (participations) {
                    participations.forEach(p => {
                        userParticipations[p.game_id] = true;
                    });
                }
            }
            
            // Get the latest price update time from price cache
            const { data: priceData, error: priceError } = await this.auth.supabase
                .from('prices_cache')
                .select('fetched_at')
                .order('fetched_at', { ascending: false })
                .limit(1)
                .single();
                
            // Update all games with the actual price cache update time
            if (!priceError && priceData) {
                if (allGames) {
                    allGames.forEach(game => {
                        game.last_updated = priceData.fetched_at;
                    });
                }
            }
            
            this.contentGroup.remove(loadingText);
            loadingText.destroy();
            
            const totalGames = allMultiplayerGames.length;
            
            if (totalGames === 0) {
                const noGamesText = this.add.text(450, this.contentY + 60, 
                    'No active games', {
                    fontSize: '20px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                const hintText = this.add.text(450, this.contentY + 100, 
                    'Start a new "Now" mode game to trade with real-time prices!', {
                    fontSize: '16px',
                    color: '#444444',
                    align: 'center',
                    wordWrap: { width: 500 }
                }).setOrigin(0.5);
                
                this.contentGroup.addMultiple([noGamesText, hintText]);
                return;
            }
            
            let yPos = this.contentY + 40;
            
            // Display ALL games as multiplayer
            const gamesHeader = this.add.text(450, yPos, 'ACTIVE MULTIPLAYER GAMES', {
                fontSize: '14px',
                color: '#00ff00',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            this.contentGroup.add(gamesHeader);
            yPos += 30;
            
            allMultiplayerGames.forEach(game => {
                // Check if user has already joined this game
                const hasJoined = userParticipations[game.id] || false;
                const isCreator = game.user_id === this.user.id;
                const isJoinable = !hasJoined && !isCreator;
                this.createActiveGameDisplay(game, yPos, isJoinable, true); // all are multiplayer
                yPos += 70;
            });
            
        } catch (error) {
            console.error('Error loading active games:', error);
            
            // Check if it's an auth error
            if (error.message && error.message.includes('JWT') || error.message.includes('token')) {
                loadingText.setText('Session expired. Please log in again.');
                loadingText.setColor('#ff0000');
                
                // Redirect to login after delay
                this.time.delayedCall(2000, () => {
                    this.scene.start('LoginScene');
                });
            } else {
                loadingText.setText('Error loading active games. Please try refreshing.');
                loadingText.setColor('#ff0000');
            }
        }
    }
    
    async showPastGamesContent() {
        // Ensure contentGroup exists
        if (!this.contentGroup) {
            this.contentGroup = this.add.group();
        }
        
        // Create a background to cover any previous content
        const contentBg = this.add.rectangle(450, this.contentY + 150, 800, 350, 0x000000, 1);
        this.contentGroup.add(contentBg);
        
        // Loading text
        const loadingText = this.add.text(450, this.contentY + 40, 'Loading past games...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        this.contentGroup.add(loadingText);
        
        try {
            // Query past runs
            const { data, error } = await this.auth.supabase
                .from('past_runs')
                .select('*')
                .eq('user_id', this.user.id)
                .order('created_at', { ascending: false })
                .limit(20); // Get more for paging
            
            if (error) throw error;
            
            this.contentGroup.remove(loadingText);
            loadingText.destroy();
            
            if (!data || data.length === 0) {
                const noGamesText = this.add.text(450, this.contentY + 60, 
                    'No games played yet', {
                    fontSize: '20px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                const hintText = this.add.text(450, this.contentY + 100, 
                    'Complete your first game to see it here!', {
                    fontSize: '16px',
                    color: '#444444'
                }).setOrigin(0.5);
                
                this.contentGroup.addMultiple([noGamesText, hintText]);
                return;
            }
            
            // Store all games for paging
            this.allGames = data;
            this.currentPage = 0; // Reset to first page
            
            // Display current page
            this.displayCurrentPage();
            
        } catch (error) {
            console.error('Error loading past runs:', error);
            loadingText.setText('Error loading game history');
            loadingText.setColor('#ff0000');
        }
    }
    
    createActiveGameDisplay(game, y, isJoinable = false, isMultiplayer = false) {
        // Calculate days remaining
        const now = new Date();
        const endsAt = new Date(game.ends_at);
        const daysRemaining = Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24));
        
        // Determine urgency colors
        const isExpiringSoon = daysRemaining <= 7;
        const isExpiring = daysRemaining <= 3;
        const borderColor = isJoinable ? 0x00ff00 : (isExpiring ? 0xff1493 : (isExpiringSoon ? 0xffff00 : 0x00ffff));
        const timeColor = isExpiring ? '#ff1493' : (isExpiringSoon ? '#ffff00' : '#00ffff');
        
        // Background with urgency-based border
        const bg = this.add.rectangle(450, y, 720, 50, 0x111111)
            .setStrokeStyle(isJoinable ? 2 : (isExpiring ? 2 : 1), borderColor)
            .setInteractive({ useHandCursor: true });
        
        // Add to content group
        this.contentGroup.add(bg);
        
        // Calculate performance
        const startValue = game.starting_money || 10000000;
        const currentValue = game.current_value || startValue;
        const profit = currentValue - startValue;
        const profitPercent = (profit / startValue) * 100;
        const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
        
        // Game duration
        const durationText = `${game.duration_days || 30} day game`;
        const durationDisplay = this.add.text(150, y, durationText, {
            fontSize: '16px',
            color: timeColor
        }).setOrigin(0, 0.5);
        
        this.contentGroup.add(durationDisplay);
        
        // Days remaining
        const remainingText = daysRemaining <= 0 ? 'EXPIRED' : `${daysRemaining} days left`;
        const remainingDisplay = this.add.text(300, y, remainingText, {
            fontSize: '14px',
            color: timeColor,
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        
        this.contentGroup.add(remainingDisplay);
        
        // Show creator for multiplayer games
        // Disabled for now - need to fix profile join
        /*
        if (isMultiplayer && game.profiles?.username) {
            const creatorText = this.add.text(430, y, `by ${game.profiles.username}`, {
                fontSize: '12px',
                color: '#888888'
            }).setOrigin(0, 0.5);
            this.contentGroup.add(creatorText);
        }
        */
        
        if (isJoinable) {
            // For joinable games, show participant count
            const participantText = `${game.participant_count || 1} player${(game.participant_count || 1) > 1 ? 's' : ''}`;
            const participantDisplay = this.add.text(600, y, participantText, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
            this.contentGroup.add(participantDisplay);
            
            // Show JOIN button
            const joinBtn = this.add.text(750, y, 'JOIN', {
                fontSize: '16px',
                color: '#00ff00',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(joinBtn);
            
            // Hover effects
            bg.on('pointerover', () => {
                bg.setFillStyle(0x222222);
                joinBtn.setColor('#ffffff');
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x111111);
                joinBtn.setColor('#00ff00');
            })
            .on('pointerdown', () => {
                this.scene.start('JoinGameScene', { 
                    user: this.user,
                    game: game
                });
            });
        } else {
            // Current value
            const valueText = this.add.text(500, y, `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(valueText);
            
            // Profit/Loss
            const profitText = this.add.text(650, y, `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
                fontSize: '16px',
                color: profitColor,
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(profitText);
            
            // View button
            const viewBtn = this.add.text(750, y, 'VIEW', {
                fontSize: '14px',
                color: '#00ffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(viewBtn);
            
            // Hover effects
            bg.on('pointerover', () => {
                bg.setFillStyle(0x222222);
                viewBtn.setColor('#ffffff');
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x111111);
                viewBtn.setColor('#00ffff');
            })
            .on('pointerdown', () => {
                this.scene.start('ActiveGameViewScene', { 
                    user: this.user,
                    gameData: game
                });
            });
        }
    }
    
    displayCurrentPage() {
        // Remove old page display group from content group before destroying
        if (this.pageDisplayGroup) {
            if (this.contentGroup) {
                this.contentGroup.remove(this.pageDisplayGroup);
            }
            // Destroy all children individually first
            this.pageDisplayGroup.getChildren().forEach(child => {
                child.destroy();
            });
            this.pageDisplayGroup.clear(true, true);
            this.pageDisplayGroup.destroy(true);
        }
        this.pageDisplayGroup = this.add.group();
        
        // Calculate page info
        const totalPages = Math.ceil(this.allGames.length / this.gamesPerPage);
        const startIndex = this.currentPage * this.gamesPerPage;
        const endIndex = Math.min(startIndex + this.gamesPerPage, this.allGames.length);
        const gamesToShow = this.allGames.slice(startIndex, endIndex);
        
        // Display games
        let yPos = this.contentY + 40;
        gamesToShow.forEach((run, index) => {
            this.createPastRunDisplay(run, yPos);
            yPos += 60;
        });
        
        // Show paging controls if there are multiple pages
        if (totalPages > 1) {
            // Position paging controls at fixed position
            const pagingY = this.contentY + 300;  // Fixed position for paging
            
            // Page indicator in center
            const pageText = this.add.text(450, pagingY, `Page ${this.currentPage + 1} of ${totalPages}`, {
                fontSize: '13px',
                color: '#666666'
            }).setOrigin(0.5);
            this.pageDisplayGroup.add(pageText);
            
            // Up arrow (previous page) - positioned left with proper spacing
            if (this.currentPage > 0) {
                const upArrow = this.add.text(350, pagingY, '▲', {
                    fontSize: '18px',
                    color: '#00ffff'
                }).setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', function() { this.setScale(1.2); })
                .on('pointerout', function() { this.setScale(1); })
                .on('pointerdown', () => {
                    this.currentPage--;
                    this.displayCurrentPage(); // Just update display
                });
                this.pageDisplayGroup.add(upArrow);
            }
            
            // Down arrow (next page) - positioned right with proper spacing
            if (this.currentPage < totalPages - 1) {
                const downArrow = this.add.text(550, pagingY, '▼', {
                    fontSize: '18px',
                    color: '#00ffff'
                }).setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', function() { this.setScale(1.2); })
                .on('pointerout', function() { this.setScale(1); })
                .on('pointerdown', () => {
                    this.currentPage++;
                    this.displayCurrentPage(); // Just update display
                });
                this.pageDisplayGroup.add(downArrow);
            }
        }
        
        // Add page display group to content group
        if (this.contentGroup) {
            this.contentGroup.add(this.pageDisplayGroup);
        }
    }
    
    createPastRunDisplay(run, y) {
        // Background
        const bg = this.add.rectangle(450, y, 720, 50, 0x111111)
            .setStrokeStyle(1, 0x333333)
            .setInteractive({ useHandCursor: true });
        this.pageDisplayGroup.add(bg);
        
        // Scenario name - handle both old and new data formats
        let scenarioName = SCENARIOS[run.scenario_key]?.displayName;
        
        if (!scenarioName) {
            // Handle old data that might have saved displayName as scenario_key
            for (const [key, scen] of Object.entries(SCENARIOS)) {
                if (scen.displayName === run.scenario_key) {
                    scenarioName = scen.displayName;
                    break;
                }
            }
            // If still not found, use the raw value
            if (!scenarioName) {
                scenarioName = run.scenario_key;
            }
        }
        
        const scenarioText = this.add.text(120, y, scenarioName, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        this.pageDisplayGroup.add(scenarioText);
        
        // Final value
        const profit = run.final_value - GAME_CONFIG.startingMoney;
        const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
        const profitColor = profit >= 0 ? '#00ffff' : '#ff1493';
        
        // Position dollar amount further left
        const valueText = this.add.text(480, y, `$${run.final_value.toLocaleString()}`, {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(1, 0.5);  // Right-align the dollar amount
        this.pageDisplayGroup.add(valueText);
        
        // Position percentage with more space
        const percentText = this.add.text(530, y, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0, 0.5);  // Left-align the percentage
        this.pageDisplayGroup.add(percentText);
        
        // Date - moved to far right edge
        const date = new Date(run.created_at);
        const dateText = this.add.text(780, y, date.toLocaleDateString(), {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(1, 0.5);
        this.pageDisplayGroup.add(dateText);
        
        // Hover effect
        bg.on('pointerover', () => {
            bg.setStrokeStyle(2, 0x00ffff);
        })
        .on('pointerout', () => {
            bg.setStrokeStyle(1, 0x333333);
        })
        .on('pointerdown', () => {
            // Show game details
            this.showGameDetails(run);
        });
    }
    
    showGameDetails(run) {
        // Store modal elements for cleanup
        const modalElements = [];
        let currentView = 'main'; // Track current view
        
        // Create overlay background
        const overlay = this.add.rectangle(450, 300, 900, 600, 0x000000, 0.9)
            .setInteractive(); // Block clicks underneath
        modalElements.push(overlay);
        
        // Modal container - fixed size for both views
        const modal = this.add.rectangle(450, 300, 600, 450, 0x111111)
            .setStrokeStyle(2, 0x00ffff);
        modalElements.push(modal);
        
        // Create containers for each view
        const mainViewElements = [];
        const detailsViewElements = [];
        
        // Function to show main view
        const showMainView = () => {
            // Hide details view
            detailsViewElements.forEach(el => el.setVisible(false));
            
            // Show main view
            mainViewElements.forEach(el => el.setVisible(true));
            currentView = 'main';
        };
        
        // Function to show details view
        const showDetailsView = () => {
            // Hide main view
            mainViewElements.forEach(el => el.setVisible(false));
            
            // Show details view
            detailsViewElements.forEach(el => el.setVisible(true));
            currentView = 'details';
        };
        
        // ===== MAIN VIEW CONTENT =====
        const scenario = SCENARIOS[run.scenario_key];
        
        // Title
        const mainTitle = this.add.text(450, 130, `Game Details`, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(mainTitle);
        modalElements.push(mainTitle);
        
        // Scenario info
        const scenarioText = this.add.text(450, 170, scenario ? scenario.displayName : run.scenario_key, {
            fontSize: '20px',
            color: '#00ffff'
        }).setOrigin(0.5);
        mainViewElements.push(scenarioText);
        modalElements.push(scenarioText);
        
        const scenarioDesc = this.add.text(450, 195, scenario ? scenario.description : '', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(scenarioDesc);
        modalElements.push(scenarioDesc);
        
        // Results - Note: We keep using saved value on main view for consistency
        // Details view will show recalculated values if different
        const profit = run.final_value - GAME_CONFIG.startingMoney;
        const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
        const profitColor = profit >= 0 ? '#00ffff' : '#ff1493';
        
        const finalLabel = this.add.text(450, 240, 'Final Value:', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(finalLabel);
        modalElements.push(finalLabel);
        
        const finalValue = this.add.text(450, 270, `$${run.final_value.toLocaleString()}`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(finalValue);
        modalElements.push(finalValue);
        
        const profitText = this.add.text(450, 305, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0.5);
        mainViewElements.push(profitText);
        modalElements.push(profitText);
        
        // Date played
        const date = new Date(run.created_at);
        const dateText = this.add.text(450, 350, date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(dateText);
        modalElements.push(dateText);
        
        // Main view buttons
        const mainButtonY = 445;
        
        // Close button
        const closeBtn = this.add.rectangle(320, mainButtonY, 100, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(closeBtn);
        modalElements.push(closeBtn);
            
        const closeText = this.add.text(320, mainButtonY, 'CLOSE', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(closeText);
        modalElements.push(closeText);
        
        closeBtn
            .on('pointerover', () => {
                closeBtn.setStrokeStyle(2, 0x00ffff);
                closeText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                closeBtn.setStrokeStyle(2, 0x666666);
                closeText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                // Remove all modal elements
                modalElements.forEach(element => element.destroy());
            });
            
        // Details button
        const detailsBtn = this.add.rectangle(450, mainButtonY, 100, 40, 0x333333)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(detailsBtn);
        modalElements.push(detailsBtn);
            
        const detailsBtnText = this.add.text(450, mainButtonY, 'DETAILS', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        mainViewElements.push(detailsBtnText);
        modalElements.push(detailsBtnText);
        
        detailsBtn
            .on('pointerover', () => {
                detailsBtn.setFillStyle(0x333333);
                detailsBtnText.setColor('#ffffff');
            })
            .on('pointerout', () => {
                detailsBtn.setFillStyle(0x000000);
                detailsBtnText.setColor('#00ffff');
            })
            .on('pointerdown', () => {
                showDetailsView();
            });
            
        // Play Again button
        const playAgainBtn = this.add.rectangle(580, mainButtonY, 120, 40, 0x00ffff)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(playAgainBtn);
        modalElements.push(playAgainBtn);
            
        const playAgainText = this.add.text(580, mainButtonY, 'PLAY AGAIN', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        mainViewElements.push(playAgainText);
        modalElements.push(playAgainText);
        
        playAgainBtn
            .on('pointerover', () => {
                playAgainBtn.setFillStyle(0xff1493);
            })
            .on('pointerout', () => {
                playAgainBtn.setFillStyle(0x00ffff);
            })
            .on('pointerdown', () => {
                this.scene.start('SimulationSpeedScene', {
                    user: this.user,
                    scenario: run.scenario_key
                });
            });
            
        // ===== DETAILS VIEW CONTENT =====
        
        // Title
        const detailsTitle = this.add.text(450, 130, `Allocation Details`, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);
        detailsViewElements.push(detailsTitle);
        modalElements.push(detailsTitle);
        
        // Allocations
        let yPos = 170;
        const allocHeader = this.add.text(450, yPos, 'Investment Performance:', {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0.5).setVisible(false);
        detailsViewElements.push(allocHeader);
        modalElements.push(allocHeader);
        
        // Remove column headers since we're using a more compact inline layout
        
        yPos += 30;  // Reduced spacing since no column headers
        if (run.allocations) {
            // Calculate individual crypto performance
            const cryptoResults = {};
            const scenarioData = SCENARIOS[run.scenario_key];
            let recalculatedTotal = 0;
            
            // Calculate each crypto's final value
            Object.entries(run.allocations).forEach(([symbol, blocks]) => {
                if (blocks > 0) {
                    const initialInvestment = blocks * 1000000;
                    const startPrice = scenarioData.prices[symbol].start;
                    const endPrice = scenarioData.prices[symbol].end;
                    const units = initialInvestment / startPrice;
                    const finalValue = units * endPrice;
                    const change = ((finalValue / initialInvestment) - 1) * 100;
                    
                    cryptoResults[symbol] = {
                        blocks,
                        initialInvestment,
                        finalValue,
                        change
                    };
                    
                    recalculatedTotal += finalValue;
                }
            });
            
            // Use recalculated total for accuracy
            const actualFinalValue = recalculatedTotal;
            const actualProfit = actualFinalValue - GAME_CONFIG.startingMoney;
            const actualProfitPercent = (actualProfit / GAME_CONFIG.startingMoney) * 100;
            
            // Calculate dynamic spacing based on number of cryptos
            const numCryptos = Object.keys(cryptoResults).length;
            const startY = yPos;
            const endY = 470; // Leave space for back button at 495
            const availableHeight = endY - startY;
            const cryptoSpacing = Math.floor(availableHeight / (numCryptos + 2)); // +2 for total row and padding
            
            // Display each crypto's performance
            Object.entries(cryptoResults).forEach(([symbol, data]) => {
                const cryptoInfo = GAME_CONFIG.cryptos[symbol];
                
                // Crypto name and initial investment on same line
                const allocText = this.add.text(260, yPos, `${symbol}:`, {
                    fontSize: '16px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(allocText);
                modalElements.push(allocText);
                
                const initialText = this.add.text(350, yPos, `$${data.initialInvestment.toLocaleString()}`, {
                    fontSize: '15px',
                    color: '#999999'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(initialText);
                modalElements.push(initialText);
                
                // Arrow pointing right
                const arrowText = this.add.text(450, yPos, `→`, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5).setVisible(false);
                detailsViewElements.push(arrowText);
                modalElements.push(arrowText);
                
                // Final value and percentage on same line
                const finalText = this.add.text(505, yPos, `$${Math.round(data.finalValue).toLocaleString()}`, {
                    fontSize: '15px',
                    fontFamily: 'Arial Black',
                    color: data.change >= 0 ? '#00ffff' : '#ff1493'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(finalText);
                modalElements.push(finalText);
                
                const changeText = this.add.text(635, yPos, `${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}%`, {
                    fontSize: '13px',
                    fontFamily: 'Arial Black',
                    color: data.change >= 0 ? '#00ffff' : '#ff1493'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(changeText);
                modalElements.push(changeText);
                
                yPos += cryptoSpacing;
            });
            
            // Add total summary
            yPos += 15;
            
            // Divider line
            const divider = this.add.rectangle(450, yPos, 380, 1, 0x666666)
                .setVisible(false);
            detailsViewElements.push(divider);
            modalElements.push(divider);
            
            yPos += 15;
            
            // Total label
            const totalLabel = this.add.text(260, yPos, 'TOTAL:', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalLabel);
            modalElements.push(totalLabel);
            
            // Total initial
            const totalInitial = this.add.text(350, yPos, `$${GAME_CONFIG.startingMoney.toLocaleString()}`, {
                fontSize: '15px',
                fontFamily: 'Arial Black',
                color: '#999999'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalInitial);
            modalElements.push(totalInitial);
            
            // Total arrow
            const totalArrow = this.add.text(450, yPos, `→`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5).setVisible(false);
            detailsViewElements.push(totalArrow);
            modalElements.push(totalArrow);
            
            // Total final
            const totalFinal = this.add.text(505, yPos, `$${Math.round(actualFinalValue).toLocaleString()}`, {
                fontSize: '15px',
                fontFamily: 'Arial Black',
                color: actualProfit >= 0 ? '#00ffff' : '#ff1493'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalFinal);
            modalElements.push(totalFinal);
            
            // Total percentage
            const totalPercent = this.add.text(635, yPos, `${actualProfit >= 0 ? '+' : ''}${actualProfitPercent.toFixed(1)}%`, {
                fontSize: '13px',
                fontFamily: 'Arial Black',
                color: actualProfit >= 0 ? '#00ffff' : '#ff1493'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalPercent);
            modalElements.push(totalPercent);
            
            // Show warning if saved value doesn't match recalculated value
            if (Math.abs(run.final_value - actualFinalValue) > 1000) {
                const warningText = this.add.text(450, yPos + 25, '⚠ Note: Values recalculated from historical data', {
                    fontSize: '11px',
                    color: '#ff9900',
                    fontStyle: 'italic'
                }).setOrigin(0.5).setVisible(false);
                detailsViewElements.push(warningText);
                modalElements.push(warningText);
            }
        }
        
        // Back button (details view)
        const backBtn = this.add.rectangle(450, 495, 100, 35, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);
        detailsViewElements.push(backBtn);
        modalElements.push(backBtn);
            
        const backText = this.add.text(450, 495, 'BACK', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);
        detailsViewElements.push(backText);
        modalElements.push(backText);
        
        backBtn
            .on('pointerover', () => {
                backBtn.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backBtn.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                showMainView();
            });
            
        // Show main view by default
        showMainView();
    }
    
    refreshCryptoRows() {
        // Update price displays for all cryptos
        Object.keys(GAME_CONFIG.cryptos).forEach(symbol => {
            if (this[`${symbol}_priceText`] && this.currentPrices && this.currentPrices[symbol]) {
                const displayPrice = this.currentPrices[symbol];
                                    this[`${symbol}_priceText`].setText(`$${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            }
        });
    }
    
    shutdown() {
        // Clean up when leaving dashboard
        console.log('DashboardScene shutdown called');
        
        // Clear all groups
        if (this.tabGroup) {
            this.tabGroup.clear(true, true);
            this.tabGroup = null;
        }
        if (this.contentGroup) {
            this.contentGroup.clear(true, true);
            this.contentGroup = null;
        }
        if (this.pageDisplayGroup) {
            this.pageDisplayGroup.clear(true, true);
            this.pageDisplayGroup = null;
        }
        
        // Clear sign out button
        if (this.signOutButton) {
            this.signOutButton.destroy();
            this.signOutButton = null;
        }
        
        // Reset state
        this.currentPage = 0;
        this.allGames = [];
    }
}

// Now Mode Setup Scene
class NowModeSetupScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NowModeSetupScene' });
        this.auth = new Auth(); // Add Auth instance
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
    }
    
    create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        this.add.text(450, 100, 'NOW MODE', {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(450, 150, 'Trade with real-time crypto prices', {
            fontSize: '20px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Update Prices button
        const updatePricesBtn = this.add.rectangle(750, 50, 130, 30, 0x333333)
            .setStrokeStyle(2, 0x00ff00)
            .setInteractive({ useHandCursor: true });
            
        const updatePricesText = this.add.text(750, 50, 'UPDATE PRICES', {
            fontSize: '12px',
            fontFamily: 'Arial Black',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        // Last update text
        const lastUpdateText = this.add.text(750, 75, '', {
            fontSize: '14px',
            color: '#999999'
        }).setOrigin(0.5);
        
        // Check for last update time
        const lastUpdate = localStorage.getItem('lastPriceUpdate');
        if (lastUpdate) {
            const date = new Date(lastUpdate);
            const dateStr = date.toLocaleDateString();
            const timeStr = date.toLocaleTimeString();
            lastUpdateText.setText(`Last updated: ${dateStr} ${timeStr}`);
        }
        
        updatePricesBtn
            .on('pointerover', () => {
                updatePricesBtn.setStrokeStyle(2, 0xffffff);
                updatePricesBtn.setFillStyle(0x00ff00);
                updatePricesText.setColor('#000000');
            })
            .on('pointerout', () => {
                updatePricesBtn.setStrokeStyle(2, 0x00ff00);
                updatePricesBtn.setFillStyle(0x333333);
                updatePricesText.setColor('#00ff00');
            })
            .on('pointerdown', async () => {
                updatePricesText.setText('UPDATING...');
                console.log('Fetching latest prices from CoinGecko...');
                try {
                    // Use CryptoAPI with the auth's supabase client
                    if (!this.auth.supabase) {
                        await this.auth.init();
                    }
                    
                    if (window.CryptoAPI && window.CryptoAPI.updatePricesInCache) {
                        await window.CryptoAPI.updatePricesInCache(this.auth.supabase);
                        console.log('Prices updated successfully!');
                        updatePricesText.setText('UPDATED!');
                        
                        // Store last update time
                        const now = new Date().toISOString();
                        localStorage.setItem('lastPriceUpdate', now);
                        const date = new Date(now);
                        const dateStr = date.toLocaleDateString();
                        const timeStr = date.toLocaleTimeString();
                        lastUpdateText.setText(`Last updated: ${dateStr} ${timeStr}`);
                    } else {
                        console.error('CryptoAPI not available');
                        updatePricesText.setText('ERROR');
                    }
                    
                    // Reset button text after a moment
                    this.time.delayedCall(1500, () => {
                        updatePricesText.setText('UPDATE PRICES');
                    });
                } catch (e) {
                    console.error('Price update exception:', e);
                    updatePricesText.setText('ERROR');
                    this.time.delayedCall(1500, () => {
                        updatePricesText.setText('UPDATE PRICES');
                    });
                }
            });
        
        // Explanation
        const explanationText = [
            'Start with $10M today and track your performance over time.',
            'Your allocations are locked in once you start.',
            'Check back anytime to see how you\'re doing!'
        ];
        
        let yPos = 220;
        explanationText.forEach(line => {
            this.add.text(450, yPos, line, {
                fontSize: '16px',
                color: '#666666'
            }).setOrigin(0.5);
            yPos += 25;
        });
        
        // Multiplayer toggle
        this.isMultiplayer = false;
        
        const multiplayerToggle = this.add.rectangle(450, 310, 300, 40, 0x111111)
            .setStrokeStyle(2, 0x333333)
            .setInteractive({ useHandCursor: true });
            
        this.multiplayerText = this.add.text(450, 310, '🎮 ENABLE MULTIPLAYER', {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        
        multiplayerToggle.on('pointerdown', () => {
            this.isMultiplayer = !this.isMultiplayer;
            if (this.isMultiplayer) {
                multiplayerToggle.setFillStyle(0x00ff00);
                multiplayerToggle.setStrokeStyle(2, 0x00ff00);
                this.multiplayerText.setText('🎮 MULTIPLAYER ENABLED');
                this.multiplayerText.setColor('#000000');
            } else {
                multiplayerToggle.setFillStyle(0x111111);
                multiplayerToggle.setStrokeStyle(2, 0x333333);
                this.multiplayerText.setText('🎮 ENABLE MULTIPLAYER');
                this.multiplayerText.setColor('#666666');
            }
        });
        
        // Duration selection header
        this.add.text(450, 360, 'Choose Game Duration:', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Duration options
        this.createDurationButton('30 DAYS', 'One month challenge', 420, 30);
        this.createDurationButton('60 DAYS', 'Two month challenge', 480, 60);
        this.createDurationButton('90 DAYS', 'Three month challenge', 540, 90);
        
        // Back button
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(100, 550, 'BACK', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton
            .on('pointerover', () => {
                backButton.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                this.scene.start('ScenarioSelectScene', { user: this.user });
            });
    }
    
    createDurationButton(text, subtitle, y, days) {
        const button = this.add.rectangle(450, y, 300, 50, 0x111111)
            .setStrokeStyle(2, 0x333333)
            .setInteractive({ useHandCursor: true });
            
        const buttonText = this.add.text(450, y - 5, text, {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        const subtitleText = this.add.text(450, y + 15, subtitle, {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        
        button
            .on('pointerover', () => {
                button.setStrokeStyle(2, 0x00ffff);
                buttonText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                button.setStrokeStyle(2, 0x333333);
                buttonText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                // Go to allocation scene with Now mode data
                this.scene.start('AllocationScene', {
                    user: this.user,
                    scenario: 'now',
                    durationDays: days,
                    isNowMode: true,
                    isMultiplayer: this.isMultiplayer
                });
            });
    }
}

// Now Mode Result Scene
class NowModeResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NowModeResultScene' });
        this.auth = new Auth();
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
        this.allocations = data.allocations;
        this.durationDays = data.durationDays;
        this.startingPrices = data.startingPrices;
        this.totalInvested = data.totalInvested;
        this.isJoiningMultiplayer = data.isJoiningMultiplayer || false;
        this.multiplayerGame = data.multiplayerGame || null;
        this.isMultiplayer = data.isMultiplayer || false;
    }
    
    create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        const titleText = this.isJoiningMultiplayer ? 'JOINED GAME!' : 'GAME STARTED!';
        this.add.text(450, 100, titleText, {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Duration info
        const endDate = new Date();
        if (this.isJoiningMultiplayer) {
            // Use the game's end date
            endDate.setTime(new Date(this.multiplayerGame.ends_at).getTime());
        } else {
            endDate.setDate(endDate.getDate() + this.durationDays);
        }
        
        const challengeText = this.isJoiningMultiplayer ? 
            `You've joined the ${this.durationDays}-day multiplayer challenge!` :
            `Your ${this.durationDays}-day challenge has begun!`;
            
        this.add.text(450, 160, challengeText, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Your allocations header
        this.add.text(450, 250, 'Your Allocations:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Show allocations
        let yPos = 290;
        Object.entries(this.allocations).forEach(([crypto, amount]) => {
            if (amount > 0) {
                const price = this.startingPrices[crypto];
                const invested = amount * 1000000;
                const priceDisplay = price > 0 ? `$${price.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : 'Price unavailable';
                this.add.text(450, yPos, 
                    `${crypto}: $${invested.toLocaleString()} at ${priceDisplay}/coin`, 
                    {
                        fontSize: '16px',
                        color: '#ffffff'
                    }
                ).setOrigin(0.5);
                yPos += 25;
            }
        });
        
        // Cash remaining if any
        const cashRemaining = 10000000 - this.totalInvested;
        if (cashRemaining > 0) {
            this.add.text(450, yPos, 
                `Cash: $${cashRemaining.toLocaleString()}`, 
                {
                    fontSize: '16px',
                    color: '#666666'
                }
            ).setOrigin(0.5);
        }
        
        // Instructions
        this.add.text(450, 420, 'Check your dashboard anytime to track performance!', {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Dashboard button
        const dashboardBtn = this.add.rectangle(450, 480, 250, 50, 0x00ffff)
            .setInteractive({ useHandCursor: true });
            
        const dashboardText = this.add.text(450, 480, 'GO TO DASHBOARD', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        
        dashboardBtn
            .on('pointerover', () => {
                dashboardBtn.setFillStyle(0x00cccc);
            })
            .on('pointerout', () => {
                dashboardBtn.setFillStyle(0x00ffff);
            })
            .on('pointerdown', () => {
                this.scene.start('DashboardScene', { user: this.user });
            });
        
        // Save the game after a short delay
        this.time.delayedCall(500, () => {
            this.saveActiveGame();
        });
    }
    
    async saveActiveGame() {
        try {
            const { data: { user } } = await this.auth.supabase.auth.getUser();
            if (!user) {
                console.error('No authenticated user');
                return;
            }
            
            if (this.isJoiningMultiplayer) {
                // Join existing multiplayer game
                const { data, error } = await this.auth.supabase
                    .from('game_participants')
                    .insert({
                        game_id: this.multiplayerGame.id,
                        user_id: user.id,
                        allocations: this.allocations,
                        starting_value: 10000000,
                        current_value: 10000000,
                        is_original_creator: false
                    });
                    
                if (error) {
                    console.error('Error joining game:', error);
                    return;
                }
                
                // Update participant count
                const { error: updateError } = await this.auth.supabase
                    .from('active_games')
                    .update({ 
                        participant_count: (this.multiplayerGame.participant_count || 1) + 1 
                    })
                    .eq('id', this.multiplayerGame.id);
                    
                if (updateError) {
                    console.error('Error updating participant count:', updateError);
                }
                
                console.log('Successfully joined multiplayer game');
            } else {
                // Calculate ends_at
                const endsAt = new Date();
                endsAt.setDate(endsAt.getDate() + this.durationDays);
                
                // Save to active_games table
                const { data: gameData, error } = await this.auth.supabase
                    .from('active_games')
                    .insert({
                        user_id: user.id,
                        duration_days: this.durationDays,
                        ends_at: endsAt.toISOString(),
                        allocations: this.allocations,
                        starting_prices: this.startingPrices,
                        starting_money: GAME_CONFIG.startingMoney,
                        current_prices: this.startingPrices,
                        current_value: GAME_CONFIG.startingMoney,
                        last_updated: new Date().toISOString(),
                        is_multiplayer: this.isMultiplayer,
                        participant_count: 1
                    })
                    .select()
                    .single();
                    
                if (error) {
                    console.error('Error saving active game:', error);
                } else {
                    console.log('Active game saved successfully', gameData);
                    
                    // If multiplayer, also add creator to game_participants
                    if (this.isMultiplayer && gameData) {
                        const { error: participantError } = await this.auth.supabase
                            .from('game_participants')
                            .insert({
                                game_id: gameData.id,
                                user_id: user.id,
                                allocations: this.allocations,
                                starting_value: 10000000,
                                current_value: 10000000,
                                is_original_creator: true
                            });
                            
                        if (participantError) {
                            console.error('Error adding creator to participants:', participantError);
                        }
                    }
                }
            }
        } catch (error) {
            console.error('Error in saveActiveGame:', error);
        }
    }
}

// Active Game View Scene
class ActiveGameViewScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ActiveGameViewScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.gameData = data.gameData;
    }
    
    async create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Initialize auth
        this.auth = new Auth();
        
        // Fetch fresh game data and latest price update time
        try {
            // Get fresh game data
            const { data: freshGameData, error } = await this.auth.supabase
                .from('active_games')
                .select('*')
                .eq('id', this.gameData.id)
                .single();
                
            if (!error && freshGameData) {
                // Update gameData with fresh data
                this.gameData = freshGameData;
            }
            
            // Get the latest price update time from price cache
            const { data: priceData, error: priceError } = await this.auth.supabase
                .from('prices_cache')
                .select('fetched_at')
                .order('fetched_at', { ascending: false })
                .limit(1)
                .single();
                
            if (!priceError && priceData) {
                // Use the actual price cache update time instead of game's last_updated
                this.gameData.last_updated = priceData.fetched_at;
            }
        } catch (err) {
            console.error('Error fetching fresh data:', err);
            // Continue with existing data if fetch fails
        }
        
        // Check if this is a multiplayer game
        if (this.gameData.is_multiplayer && this.gameData.participant_count > 1) {
            await this.showMultiplayerView();
        } else {
            this.showSinglePlayerView();
        }
    }
    
    showSinglePlayerView() {
        // View state management
        let currentView = 'main';
        const mainViewElements = [];
        const detailsViewElements = [];
        
        // Function to show main view
        const showMainView = () => {
            detailsViewElements.forEach(el => el.setVisible(false));
            mainViewElements.forEach(el => el.setVisible(true));
            currentView = 'main';
        };
        
        // Function to show details view
        const showDetailsView = () => {
            mainViewElements.forEach(el => el.setVisible(false));
            detailsViewElements.forEach(el => el.setVisible(true));
            currentView = 'details';
        };
        
        // ===== SHARED HEADER =====
        this.add.text(450, 40, 'ACTIVE GAME', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // ===== MAIN VIEW CONTENT =====
        // Game info
        const daysRemaining = Math.ceil((new Date(this.gameData.ends_at) - new Date()) / (1000 * 60 * 60 * 24));
        const startedDate = new Date(this.gameData.started_at).toLocaleDateString();
        const endsDate = new Date(this.gameData.ends_at).toLocaleDateString();
        
        // Time remaining with color coding
        const timeColor = daysRemaining <= 7 ? '#ff1493' : 
                         daysRemaining <= 14 ? '#ffff00' : '#00ff00';
        
        // Create a container to hold both text parts centered
        const challengeContainer = this.add.container(450, 90);
        
        // First part (white)
        const challengePart1 = this.add.text(0, 0, `${this.gameData.duration_days}-Day Challenge / `, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Second part with color
        const challengePart2 = this.add.text(challengePart1.width, 0, `${daysRemaining} days remaining`, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: timeColor
        }).setOrigin(0, 0.5);
        
        // Add both to container
        challengeContainer.add([challengePart1, challengePart2]);
        
        // Center the container by offsetting it
        const totalWidth = challengePart1.width + challengePart2.width;
        challengeContainer.x = 450 - totalWidth / 2;
        
        mainViewElements.push(challengeContainer);
        
        // Calculate minutes ago for prices update
        let pricesText = '';
        if (this.gameData.last_updated) {
            const lastUpdated = new Date(this.gameData.last_updated);
            const minutesAgo = Math.floor((new Date() - lastUpdated) / 60000);
            pricesText = ` | Prices updated ${minutesAgo} minutes ago`;
        }
        
        const datesText = this.add.text(450, 120, `Started: ${startedDate} | Ends: ${endsDate}${pricesText}`, {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(datesText);
        
        // Performance summary
        const startValue = this.gameData.starting_money || 10000000;
        const currentValue = this.gameData.current_value || startValue;
        const profit = currentValue - startValue;
        const profitPercent = (profit / startValue) * 100;
        const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
        
        // Current value
        const currentLabel = this.add.text(450, 170, 'Current Portfolio Value', {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(currentLabel);
        
                        const currentValueText = this.add.text(450, 200, `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '36px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0.5);
                mainViewElements.push(currentValueText);
        
        const profitPercentText = this.add.text(450, 240, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0.5);
        mainViewElements.push(profitPercentText);
        
        // Quick allocation summary on main view
        const allocLabel = this.add.text(450, 290, 'Portfolio:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(allocLabel);
        
        let yPos = 330;
        const allocations = this.gameData.allocations;
        const currentPrices = this.gameData.current_prices || this.gameData.starting_prices;
        
        // Show just crypto names and percentages on main view
        Object.entries(allocations).forEach(([crypto, amount]) => {
            if (amount > 0) {
                const allocText = this.add.text(450, yPos, `${crypto}: ${amount * 10}%`, {
                    fontSize: '18px',
                    color: '#00ffff'
                }).setOrigin(0.5);
                mainViewElements.push(allocText);
                yPos += 25;
            }
        });
        
        // Buttons for main view - keep at same position
        const mainButtonY = 480;
        
        // Details button
        const detailsBtn = this.add.rectangle(350, mainButtonY, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(detailsBtn);
            
        const detailsBtnText = this.add.text(350, mainButtonY, 'DETAILS', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        mainViewElements.push(detailsBtnText);
        
        detailsBtn
            .on('pointerover', () => {
                detailsBtn.setFillStyle(0x00ffff);
                detailsBtnText.setColor('#000000');
            })
            .on('pointerout', () => {
                detailsBtn.setFillStyle(0x333333);
                detailsBtnText.setColor('#00ffff');
            })
            .on('pointerdown', () => {
                showDetailsView();
            });
        
        // Back button for main view
        const backButton = this.add.rectangle(550, mainButtonY, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(backButton);
            
        const backText = this.add.text(550, mainButtonY, 'BACK', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(backText);
        
        backButton
            .on('pointerover', () => {
                backButton.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                this.scene.start('DashboardScene', { user: this.user });
            });
        
        // ===== DETAILS VIEW CONTENT =====
        const detailsTitle = this.add.text(450, 90, 'Detailed Portfolio Analysis', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(detailsTitle);
        
        // Detailed allocations breakdown with prices
        const detailsAllocLabel = this.add.text(450, 130, 'Holdings & Performance:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(detailsAllocLabel);
        
        // Column headers
        const colHeaders = [
            { text: 'Crypto', x: 100 },
            { text: 'Invested', x: 220 },
            { text: 'Coins', x: 340 },
            { text: 'Start Price', x: 440 },
            { text: 'Current Price', x: 560 },
            { text: 'Value', x: 680 },
            { text: 'Gain/Loss', x: 780 }
        ];
        
        colHeaders.forEach(header => {
            const headerText = this.add.text(header.x, 160, header.text, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(headerText);
        });
        
        let detailsYPos = 190;
        const startingPrices = this.gameData.starting_prices;
        
        Object.entries(allocations).forEach(([crypto, amount]) => {
            if (amount > 0) {
                const invested = amount * 1000000;
                const startPrice = startingPrices[crypto];
                const currentPrice = currentPrices[crypto];
                const coins = invested / startPrice;
                const currentCryptoValue = coins * currentPrice;
                const cryptoProfit = currentCryptoValue - invested;
                const cryptoProfitPercent = (cryptoProfit / invested) * 100;
                const cryptoProfitColor = cryptoProfit >= 0 ? '#00ff00' : '#ff0066';
                
                // Crypto name
                const cryptoName = this.add.text(100, detailsYPos, crypto, {
                    fontSize: '16px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0.5);
                detailsViewElements.push(cryptoName);
                
                // Original investment
                const investedText = this.add.text(220, detailsYPos, `$${invested.toLocaleString()}`, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                detailsViewElements.push(investedText);
                
                // Number of coins
                const coinsText = this.add.text(340, detailsYPos, coins.toFixed(2), {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                detailsViewElements.push(coinsText);
                
                // Starting price
                const startPriceText = this.add.text(440, detailsYPos, `$${Number(startPrice).toFixed(2)}`, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                detailsViewElements.push(startPriceText);
                
                // Current price
                const currentPriceText = this.add.text(560, detailsYPos, `$${Number(currentPrice).toFixed(2)}`, {
                    fontSize: '14px',
                    color: '#00ffff'
                }).setOrigin(0.5);
                detailsViewElements.push(currentPriceText);
                
                // Current value
                const valueText = this.add.text(680, detailsYPos, `$${currentCryptoValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                detailsViewElements.push(valueText);
                
                // Profit/Loss
                const profitText = this.add.text(780, detailsYPos, `${cryptoProfitPercent >= 0 ? '+' : ''}${cryptoProfitPercent.toFixed(1)}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: cryptoProfitColor
                }).setOrigin(0.5);
                detailsViewElements.push(profitText);
                
                detailsYPos += 25;
            }
        });
        
        // Cash if any
        const totalInvested = Object.values(allocations).reduce((sum, val) => sum + (val * 1000000), 0);
        const cash = 10000000 - totalInvested;
        if (cash > 0) {
            const cashName = this.add.text(100, detailsYPos, 'Cash', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashName);
            
            const cashAmount = this.add.text(220, detailsYPos, `$${cash.toLocaleString()}`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashAmount);
            
            const cashValue = this.add.text(680, detailsYPos, `$${cash.toLocaleString()}`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashValue);
            
            const cashProfit = this.add.text(780, detailsYPos, '+0.0%', {
                fontSize: '14px',
                fontFamily: 'Arial Black',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashProfit);
            
            detailsYPos += 25;
        }
        
        // Performance History Chart
        this.createPerformanceChart(detailsYPos + 30, detailsViewElements);
        
        // Back to main button for details view
        const detailsBackBtn = this.add.rectangle(450, 530, 200, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
        detailsViewElements.push(detailsBackBtn);
            
        const detailsBackText = this.add.text(450, 530, 'BACK TO SUMMARY', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(detailsBackText);
        
        detailsBackBtn
            .on('pointerover', () => {
                detailsBackBtn.setStrokeStyle(2, 0x00ffff);
                detailsBackText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                detailsBackBtn.setStrokeStyle(2, 0x666666);
                detailsBackText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                showMainView();
            });
        
        // Initially hide details view
        detailsViewElements.forEach(el => el.setVisible(false));
    }
    
    async showMultiplayerView() {
        // Title
        this.add.text(450, 50, 'MULTIPLAYER CHALLENGE', {
            fontSize: '32px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Calculate days remaining
        const now = new Date();
        const endsAt = new Date(this.gameData.ends_at);
        const daysRemaining = Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24));
        
        // Game info
        this.add.text(450, 100, `${this.gameData.duration_days}-Day Challenge`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(450, 130, `${daysRemaining} days remaining`, {
            fontSize: '18px',
            color: daysRemaining <= 3 ? '#ff1493' : (daysRemaining <= 7 ? '#ffff00' : '#00ffff')
        }).setOrigin(0.5);
        
        // Price update time
        if (this.gameData.last_updated) {
            const lastUpdated = new Date(this.gameData.last_updated);
            const timeSince = Math.floor((Date.now() - lastUpdated) / 60000); // minutes
            const updateText = timeSince < 60 ? 
                `Prices updated ${timeSince} minutes ago` : 
                `Prices updated ${Math.floor(timeSince / 60)} hours ago`;
            
            this.add.text(450, 160, updateText, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
        }
        
        // Leaderboard header
        this.add.text(450, 200, 'CURRENT STANDINGS', {
            fontSize: '24px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Loading text
        const loadingText = this.add.text(450, 250, 'Loading leaderboard...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        try {
            // Load all participants with their usernames
            // First get participants
            const { data: participants, error: participantsError } = await this.auth.supabase
                .from('game_participants')
                .select('*')
                .eq('game_id', this.gameData.id)
                .order('current_value', { ascending: false });
                
            if (participantsError) throw participantsError;
            
            // Then get usernames for all participants
            if (participants && participants.length > 0) {
                const userIds = participants.map(p => p.user_id);
                const { data: profiles, error: profilesError } = await this.auth.supabase
                    .from('profiles')
                    .select('id, username')
                    .in('id', userIds);
                    
                if (profilesError) throw profilesError;
                
                // Merge username data with participants
                participants.forEach((participant, index) => {
                    const profile = profiles?.find(p => p.id === participant.user_id);
                    // All users should have usernames set at signup
                    participant.username = profile?.username || `Player ${index + 1}`;
                });
            }
            
            loadingText.destroy();
            
            // Display participants
            let yPos = 250;
            participants.forEach((participant, index) => {
                const isMe = participant.user_id === this.user.id;
                // All users should have usernames from profiles
                const username = participant.username || `Player ${index + 1}`;
                const value = participant.current_value || 10000000;
                const profit = ((value - 10000000) / 10000000) * 100;
                
                // Highlight current user
                if (isMe) {
                    this.add.rectangle(450, yPos, 700, 35, 0x111111)
                        .setStrokeStyle(2, 0x00ffff);
                }
                
                // Rank
                this.add.text(200, yPos, `${index + 1}.`, {
                    fontSize: '20px',
                    color: isMe ? '#00ffff' : '#ffffff',
                    fontFamily: 'Arial Black'
                }).setOrigin(0, 0.5);
                
                // Player name
                this.add.text(250, yPos, username, {
                    fontSize: '18px',
                    color: isMe ? '#00ffff' : '#ffffff'
                }).setOrigin(0, 0.5);
                
                // Value - right aligned to avoid overlap
                this.add.text(600, yPos, `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '18px',
                    color: isMe ? '#00ffff' : '#ffffff',
                    fontFamily: 'Arial Black'
                }).setOrigin(1, 0.5);  // Right align
                
                // Gain/Loss - with spacing after value
                const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
                this.add.text(620, yPos, `${profit >= 0 ? '+' : ''}${profit.toFixed(2)}%`, {
                    fontSize: '18px',
                    color: isMe ? '#00ffff' : profitColor,
                    fontFamily: 'Arial Black'
                }).setOrigin(0, 0.5);
                
                yPos += 40;
            });
            
            // View My Portfolio button
            const myPortfolioBtn = this.add.rectangle(450, 480, 250, 50, 0x333333)
                .setStrokeStyle(2, 0x00ffff)
                .setInteractive({ useHandCursor: true });
                
            this.add.text(450, 480, 'VIEW MY PORTFOLIO', {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            myPortfolioBtn.on('pointerover', () => {
                myPortfolioBtn.setFillStyle(0x444444);
            })
            .on('pointerout', () => {
                myPortfolioBtn.setFillStyle(0x333333);
            })
            .on('pointerdown', () => {
                // Find user's participation data
                const myParticipation = participants.find(p => p.user_id === this.user.id);
                if (myParticipation) {
                    // Show portfolio detail
                    this.showPortfolioDetail(myParticipation);
                }
            });
            
        } catch (error) {
            console.error('Error loading participants:', error);
            loadingText.setText('Error loading leaderboard');
            loadingText.setColor('#ff0000');
        }
        
        // Back button
        const backBtn = this.add.text(450, 540, 'BACK TO DASHBOARD', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#00ffff'); })
        .on('pointerout', function() { this.setColor('#666666'); })
        .on('pointerdown', () => {
            this.scene.start('DashboardScene', { user: this.user });
        });
    }
    
    showPortfolioDetail(participantData) {
        // Clear the scene
        this.children.removeAll();
        
        // Show detailed portfolio view for multiplayer participant
        this.add.text(450, 50, 'MY PORTFOLIO', {
            fontSize: '32px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Add more details about the participant's portfolio
        // ...
    }
    
    createPerformanceChart(startY, detailsViewElements) {
        // Chart title
        const chartTitle = this.add.text(450, startY, 'Performance Trend', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(chartTitle);
        
        // Chart area
        const chartX = 200;
        const chartY = startY + 30;
        const chartWidth = 500;
        const chartHeight = 100;
        
        // Chart background
        const chartBg = this.add.rectangle(chartX + chartWidth/2, chartY + chartHeight/2, chartWidth, chartHeight, 0x111111)
            .setStrokeStyle(1, 0x333333);
        detailsViewElements.push(chartBg);
        
        // Generate sample data points (in real app, this would come from price_history table)
        const dataPoints = this.generateSampleData();
        
        // Draw the line chart
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00ffff);
        
        // Scale the data to fit the chart
        const minValue = Math.min(...dataPoints);
        const maxValue = Math.max(...dataPoints);
        const valueRange = maxValue - minValue || 1;
        
        // Draw the line
        graphics.beginPath();
        dataPoints.forEach((value, index) => {
            const x = chartX + (index / (dataPoints.length - 1)) * chartWidth;
            const y = chartY + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
            
            // Add dots at data points
            graphics.fillStyle(0x00ffff);
            graphics.fillCircle(x, y, 3);
        });
        graphics.strokePath();
        
        detailsViewElements.push(graphics);
        
        // Add axis labels
        const startDateTime = new Date(this.gameData.started_at);
        const startDate = startDateTime.toLocaleDateString();
        const startTime = startDateTime.toLocaleTimeString();
        const startLabel = this.add.text(chartX, chartY + chartHeight + 10, `Start: ${startDate} ${startTime}`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(0, 0);
        detailsViewElements.push(startLabel);
        
        const endLabel = this.add.text(chartX + chartWidth, chartY + chartHeight + 10, 'Now', {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 0);
        detailsViewElements.push(endLabel);
        
        // Value labels
        const maxLabel = this.add.text(chartX - 10, chartY, `$${maxValue.toLocaleString()}`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 0);
        detailsViewElements.push(maxLabel);
        
        const minLabel = this.add.text(chartX - 10, chartY + chartHeight, `$${minValue.toLocaleString()}`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 1);
        detailsViewElements.push(minLabel);
    }
    
    generateSampleData() {
        // Generate sample performance data
        // In real app, this would fetch from price_history table
        const startValue = this.gameData.starting_money || 10000000;
        const currentValue = this.gameData.current_value || startValue;
        const numPoints = 10;
        const data = [startValue];
        
        // Generate smooth curve towards current value
        for (let i = 1; i < numPoints - 1; i++) {
            const progress = i / (numPoints - 1);
            const noise = (Math.random() - 0.5) * 0.1; // ±5% variation
            const value = startValue + (currentValue - startValue) * progress * (1 + noise);
            data.push(value);
        }
        data.push(currentValue);
        
        return data;
    }
}

// Join Game Scene - allows users to join multiplayer games
class JoinGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JoinGameScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.game = data.game;
        // Initialize auth if not already available
        if (!window.gameAuth) {
            window.gameAuth = new Auth();
        }
        this.auth = window.gameAuth;
    }
    
    create() {
        // Background
        this.add.rectangle(450, 300, 900, 600, 0x000000);
        
        // Title
        this.add.text(450, 50, 'JOIN MULTIPLAYER GAME', {
            fontSize: '32px',
            color: '#00ff00',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Game info
        this.add.text(450, 120, `${this.game.duration_days}-Day Challenge`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Calculate days remaining
        const now = new Date();
        const endsAt = new Date(this.game.ends_at);
        const daysRemaining = Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24));
        
        this.add.text(450, 160, `${daysRemaining} days remaining`, {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Current participants
        this.add.text(450, 200, 'CURRENT PARTICIPANTS', {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Loading text for participants
        const loadingText = this.add.text(450, 250, 'Loading participants...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Load and display participants
        this.loadParticipants(loadingText);
        
        // Join button
        const joinBtn = this.add.rectangle(450, 450, 200, 50, 0x00ff00)
            .setInteractive({ useHandCursor: true });
            
        const joinText = this.add.text(450, 450, 'JOIN GAME', {
            fontSize: '20px',
            color: '#000000',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        joinBtn.on('pointerover', () => {
            joinBtn.setFillStyle(0x00dd00);
        })
        .on('pointerout', () => {
            joinBtn.setFillStyle(0x00ff00);
        })
        .on('pointerdown', () => {
            // Go to allocation scene with multiplayer context
            this.scene.start('AllocationScene', { 
                user: this.user,
                scenario: 'now',
                multiplayerGame: this.game
            });
        });
        
        // Back button
        const backBtn = this.add.text(450, 520, 'BACK TO DASHBOARD', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#00ffff'); })
        .on('pointerout', function() { this.setColor('#666666'); })
        .on('pointerdown', () => {
            this.scene.start('DashboardScene', { user: this.user });
        });
    }
    
    async loadParticipants(loadingText) {
        try {
            // Get game participants with usernames
            // First get participants
            const { data: participants, error: participantsError } = await this.auth.supabase
                .from('game_participants')
                .select('*')
                .eq('game_id', this.game.id)
                .order('current_value', { ascending: false });
                
            if (participantsError) throw participantsError;
            
            // Then get usernames for all participants
            if (participants && participants.length > 0) {
                const userIds = participants.map(p => p.user_id);
                const { data: profiles, error: profilesError } = await this.auth.supabase
                    .from('profiles')
                    .select('id, username')
                    .in('id', userIds);
                    
                if (profilesError) throw profilesError;
                
                // Merge username data with participants
                participants.forEach((participant, index) => {
                    const profile = profiles?.find(p => p.id === participant.user_id);
                    // Use a more friendly default name if no username is set
                    participant.username = profile?.username || `Player ${index + 1}`;
                });
            }
            
            loadingText.destroy();
            
            if (!participants || participants.length === 0) {
                // Show the game creator
                this.add.text(450, 250, '1. Game Creator', {
                    fontSize: '16px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                this.add.text(450, 280, 'Be the first to join!', {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
            } else {
                // Display participants
                let yPos = 250;
                participants.forEach((participant, index) => {
                    const isMe = participant.user_id === this.user.id;
                    const username = participant.username || `Player ${index + 1}`;
                    const value = participant.current_value || 10000000;
                    const profit = ((value - 10000000) / 10000000) * 100;
                    
                    // Rank and username
                    this.add.text(250, yPos, `${index + 1}. ${username}`, {
                        fontSize: '16px',
                        color: '#ffffff'
                    }).setOrigin(0, 0.5);
                    
                    // Value - right aligned
                    this.add.text(550, yPos, `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                        fontSize: '16px',
                        color: '#ffffff'
                    }).setOrigin(1, 0.5);  // Right align
                    
                    // Profit - with more spacing
                    const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
                    this.add.text(560, yPos, `${profit >= 0 ? '+' : ''}${profit.toFixed(1)}%`, {
                        fontSize: '16px',
                        color: profitColor
                    }).setOrigin(0, 0.5);
                    
                    yPos += 30;
                });
            }
            
            // Also show the original game creator if not in participants
            if (!participants || !participants.find(p => p.is_original_creator)) {
                // Get creator info
                const { data: creator } = await this.auth.supabase
                    .from('profiles')
                    .select('email')
                    .eq('id', this.game.user_id)
                    .single();
                    
                if (creator) {
                    const yPos = 250 + (participants ? participants.length * 30 : 30);
                    this.add.text(450, yPos, `Game created by: ${creator.email}`, {
                        fontSize: '14px',
                        color: '#666666',
                        fontStyle: 'italic'
                    }).setOrigin(0.5);
                }
            }
            
        } catch (error) {
            console.error('Error loading participants:', error);
            loadingText.setText('Error loading participants');
            loadingText.setColor('#ff0000');
        }
    }
}

// Leaderboard Scene
class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
        this.auth = new Auth();
    }
    
    init(data) {
        this.user = data.user;
    }
    
    async create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Header
        this.add.text(450, 40, '🏆 LEADERBOARD 🏆', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(450, 80, 'Top Traders of All Time', {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Loading text
        this.loadingText = this.add.text(450, 300, 'Loading leaderboard...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Back button
        const backButton = this.add.rectangle(100, 550, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(100, 550, 'BACK', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backButton
            .on('pointerover', () => {
                backButton.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backButton.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                this.scene.start('DashboardScene', { user: this.user });
            });
        
        // Load leaderboard data
        this.loadLeaderboard();
    }
    
    async loadLeaderboard() {
        try {
            const { data, error } = await this.auth.supabase
                .from('leaderboard')
                .select('*')
                .limit(10);
            
            if (error) throw error;
            
            this.loadingText.destroy();
            
            if (!data || data.length === 0) {
                this.add.text(450, 300, 'No leaderboard data yet. Play more games!', {
                    fontSize: '16px',
                    color: '#666666'
                }).setOrigin(0.5);
                return;
            }
            
            // Headers
            const headerY = 140;
            this.add.text(80, headerY, 'Rank', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            
            this.add.text(160, headerY, 'Player', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            
            this.add.text(400, headerY, 'Games', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(500, headerY, 'Win Rate', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(620, headerY, 'Avg Profit', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(760, headerY, 'Best Game', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // Display leaderboard entries
            let yPos = 180;
            data.forEach((entry, index) => {
                const isCurrentUser = entry.username === this.user.email;
                const bgColor = isCurrentUser ? 0x1a1a2e : 0x111111;
                const strokeColor = isCurrentUser ? 0x00ffff : 0x333333;
                
                // Background
                const bg = this.add.rectangle(450, yPos, 780, 35, bgColor)
                    .setStrokeStyle(1, strokeColor);
                
                // Rank with medals for top 3
                let rankDisplay = entry.rank.toString();
                if (entry.rank === 1) rankDisplay = '🥇';
                else if (entry.rank === 2) rankDisplay = '🥈';
                else if (entry.rank === 3) rankDisplay = '🥉';
                
                this.add.text(80, yPos, rankDisplay, {
                    fontSize: entry.rank <= 3 ? '20px' : '16px',
                    fontFamily: 'Arial Black',
                    color: entry.rank === 1 ? '#ffd700' : 
                           entry.rank === 2 ? '#c0c0c0' :
                           entry.rank === 3 ? '#cd7f32' : '#ffffff'
                }).setOrigin(0, 0.5);
                
                // Username (truncate if too long)
                let displayName = entry.username;
                if (displayName.length > 15) {
                    displayName = displayName.substring(0, 12) + '...';
                }
                if (isCurrentUser) {
                    displayName += ' (You)';
                }
                
                this.add.text(160, yPos, displayName, {
                    fontSize: '14px',
                    color: isCurrentUser ? '#00ffff' : '#ffffff'
                }).setOrigin(0, 0.5);
                
                // Games played
                this.add.text(400, yPos, entry.total_games.toString(), {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Win rate
                const winRate = (entry.winning_games / entry.total_games * 100).toFixed(0);
                const winRateColor = winRate >= 50 ? '#00ff00' : '#ff0066';
                this.add.text(500, yPos, `${winRate}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: winRateColor
                }).setOrigin(0.5);
                
                // Average profit
                const avgProfitColor = entry.avg_profit_percent >= 0 ? '#00ff00' : '#ff0066';
                this.add.text(620, yPos, `${entry.avg_profit_percent >= 0 ? '+' : ''}${entry.avg_profit_percent}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: avgProfitColor
                }).setOrigin(0.5);
                
                // Best game
                const bestColor = entry.best_game >= 0 ? '#00ff00' : '#ff0066';
                this.add.text(760, yPos, `${entry.best_game >= 0 ? '+' : ''}${entry.best_game}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: bestColor
                }).setOrigin(0.5);
                
                yPos += 40;
            });
            
            // Your stats summary if not in top 10
            const userInTop10 = data.some(entry => entry.username === this.user.email);
            if (!userInTop10) {
                // Note: Can't query individual stats from the leaderboard view
                // because it's pre-aggregated. Would need a separate function/view.
                
                // Separator
                this.add.text(450, yPos + 20, '···', {
                    fontSize: '20px',
                    color: '#666666'
                }).setOrigin(0.5);
            }
            
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.loadingText.setText('Error loading leaderboard');
            this.loadingText.setColor('#ff0000');
        }
    }
    
    displayLeaderboardEntry(entry, yPos, highlight = false) {
        const bgColor = highlight ? 0x1a1a2e : 0x111111;
        const strokeColor = highlight ? 0x00ffff : 0x333333;
        
        // Background
        this.add.rectangle(450, yPos, 780, 35, bgColor)
            .setStrokeStyle(2, strokeColor);
        
        // Rank
        this.add.text(80, yPos, `#${entry.rank}`, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Username
        let displayName = entry.username;
        if (displayName.length > 15) {
            displayName = displayName.substring(0, 12) + '...';
        }
        displayName += ' (You)';
        
        this.add.text(160, yPos, displayName, {
            fontSize: '14px',
            color: '#00ffff'
        }).setOrigin(0, 0.5);
        
        // Games played
        this.add.text(400, yPos, entry.total_games.toString(), {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Win rate
        const winRate = (entry.winning_games / entry.total_games * 100).toFixed(0);
        const winRateColor = winRate >= 50 ? '#00ff00' : '#ff0066';
        this.add.text(500, yPos, `${winRate}%`, {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: winRateColor
        }).setOrigin(0.5);
        
        // Average profit
        const avgProfitColor = entry.avg_profit_percent >= 0 ? '#00ff00' : '#ff0066';
        this.add.text(620, yPos, `${entry.avg_profit_percent >= 0 ? '+' : ''}${entry.avg_profit_percent}%`, {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: avgProfitColor
        }).setOrigin(0.5);
        
        // Best game
        const bestColor = entry.best_game >= 0 ? '#00ff00' : '#ff0066';
        this.add.text(760, yPos, `${entry.best_game >= 0 ? '+' : ''}${entry.best_game}%`, {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: bestColor
        }).setOrigin(0.5);
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 900,
    height: 600,
    scene: [LoginScene, DashboardScene, ScenarioSelectScene, SimulationSpeedScene, AllocationScene, SimulationScene, ResultsScene, NowModeSetupScene, NowModeResultScene, ActiveGameViewScene, JoinGameScene, LeaderboardScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Start the game
const game = new Phaser.Game(config);


