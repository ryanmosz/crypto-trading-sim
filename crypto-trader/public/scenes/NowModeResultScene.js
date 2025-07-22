// Import dependencies
import { Auth } from '../auth.js';
import { GAME_CONFIG } from '../shared/constants.js';
import { createNowGame, joinNowGame } from '../services/nowGameApi.js';
import { formatGameCode } from '../utils/slug.js';

// Now Mode Result Scene
export default class NowModeResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'NowModeResultScene' });
        this.auth = new Auth();
        this.gameCode = null;
        this.isLoading = false;
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
                // Use the API to join the game
                try {
                    const result = await joinNowGame({
                        gameId: this.multiplayerGame.id,
                        allocations: this.allocations
                    });
                    console.log('Successfully joined multiplayer game:', result);
                } catch (error) {
                    console.error('Error joining game:', error);
                    // Show error to user
                    this.showError(error.message);
                }
            } else if (this.isMultiplayer) {
                // Use the API to create a multiplayer game
                try {
                    const result = await createNowGame({
                        duration: this.durationDays,
                        allocations: this.allocations
                    });
                    console.log('Multiplayer game created successfully:', result);
                    this.gameCode = result.game_code;
                    this.showGameCode();
                } catch (error) {
                    console.error('Error creating multiplayer game:', error);
                    this.showError(error.message);
                }
            } else {
                // Single player game - save directly
                const endsAt = new Date();
                endsAt.setDate(endsAt.getDate() + this.durationDays);
                
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
                    console.log('Single player game saved successfully', gameData);
                }
            }
        } catch (error) {
            console.error('Error in saveActiveGame:', error);
        }
    }
    
    showGameCode() {
        if (!this.gameCode) return;
        
        // Add game code section
        const codeContainer = this.add.rectangle(450, 350, 300, 100, 0x111111)
            .setStrokeStyle(2, 0x00ffff);
            
        this.add.text(450, 330, 'GAME CODE', {
            fontSize: '16px',
            color: '#999999'
        }).setOrigin(0.5);
        
        const formattedCode = formatGameCode(this.gameCode);
        const codeText = this.add.text(450, 355, formattedCode, {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Copy button
        const copyBtn = this.add.rectangle(450, 395, 100, 30, 0x00ffff)
            .setInteractive({ useHandCursor: true });
            
        const copyText = this.add.text(450, 395, 'COPY', {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        
        copyBtn
            .on('pointerover', () => {
                copyBtn.setFillStyle(0x00cccc);
            })
            .on('pointerout', () => {
                copyBtn.setFillStyle(0x00ffff);
            })
            .on('pointerdown', () => {
                // Copy to clipboard
                navigator.clipboard.writeText(this.gameCode).then(() => {
                    copyText.setText('COPIED!');
                    this.time.delayedCall(1500, () => {
                        copyText.setText('COPY');
                    });
                }).catch(err => {
                    console.error('Failed to copy:', err);
                });
            });
            
        // Share instruction
        this.add.text(450, 435, 'Share this code with others to join!', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
    }
    
    showError(message) {
        // Flash and show error
        this.cameras.main.flash(500, 255, 0, 0);
        
        const errorBg = this.add.rectangle(450, 300, 400, 100, 0x111111)
            .setStrokeStyle(2, 0xff0000);
            
        const errorText = this.add.text(450, 300, message, {
            fontSize: '18px',
            color: '#ff0000',
            wordWrap: { width: 380 }
        }).setOrigin(0.5);
        
        // Remove after 3 seconds
        this.time.delayedCall(3000, () => {
            errorBg.destroy();
            errorText.destroy();
        });
    }
} 