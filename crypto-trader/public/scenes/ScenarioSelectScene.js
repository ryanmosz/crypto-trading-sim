// Import dependencies
import { SCENARIOS } from '../shared/constants.js';

// Scenario Selection Scene
export default class ScenarioSelectScene extends Phaser.Scene {
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