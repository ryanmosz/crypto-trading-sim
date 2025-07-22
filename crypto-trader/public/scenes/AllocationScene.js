// Import dependencies
import { Auth } from '../auth.js';
import { GAME_CONFIG, SCENARIOS } from '../shared/constants.js';

// Allocation Scene
export default class AllocationScene extends Phaser.Scene {
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
        if (this.isNowMode && this.durationDays !== null && this.durationDays !== undefined) {
            const durationText = this.durationDays === 0 ? 'Duration: 6 minutes' : `Duration: ${this.durationDays} days`;
            this.add.text(450, 68, durationText, {
                fontSize: '16px',
                color: '#00ff00'
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