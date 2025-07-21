// Import dependencies
import { TutorialOverlay } from './TutorialOverlay.js';
import { Auth } from '../auth.js';

// Tutorial Manager
export class TutorialManager {
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

// Create global tutorial instance
window.tutorialManager = new TutorialManager();
console.log('Tutorial manager created:', window.tutorialManager); 