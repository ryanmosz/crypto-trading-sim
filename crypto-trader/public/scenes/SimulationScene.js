// Import dependencies
import { GAME_CONFIG, SCENARIOS } from '../shared/constants.js';

// Simulation Scene
export default class SimulationScene extends Phaser.Scene {
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