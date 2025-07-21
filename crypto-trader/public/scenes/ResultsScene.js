// Import dependencies
import { Auth } from '../auth.js';
import { GAME_CONFIG, SCENARIOS } from '../shared/constants.js';

// Results Scene
export default class ResultsScene extends Phaser.Scene {
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