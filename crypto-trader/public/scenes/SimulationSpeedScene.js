// Import dependencies
import { SCENARIOS } from '../shared/constants.js';

// Simulation Speed Selection Scene
export default class SimulationSpeedScene extends Phaser.Scene {
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