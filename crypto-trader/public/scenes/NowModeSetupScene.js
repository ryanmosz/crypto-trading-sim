// Import dependencies
import { Auth } from '../auth.js';

// Now Mode Setup Scene
export default class NowModeSetupScene extends Phaser.Scene {
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
        
        // All Now games are multiplayer - no toggle needed
        
        // Duration selection header
        this.add.text(450, 350, 'SELECT DURATION', {
            fontSize: '20px',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        // Create duration option boxes
        const durations = [
            { days: 30, label: '30 DAYS', desc: 'One month challenge' },
            { days: 60, label: '60 DAYS', desc: 'Two month challenge' },
            { days: 90, label: '90 DAYS', desc: 'Three month challenge' }
        ];
        
        yPos = 400;
        durations.forEach(duration => {
            this.createDurationButton(duration.label, duration.desc, yPos, duration.days);
            yPos += 60; // Add some space between options
        });
        
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
                    isMultiplayer: true // All Now games are multiplayer
                });
            });
    }
} 