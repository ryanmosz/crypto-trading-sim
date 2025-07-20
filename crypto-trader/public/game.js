// Import auth module
import { Auth } from './auth.js';

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
            // Already logged in, go to dashboard
            this.scene.start('DashboardScene', { user: currentUser });
            return;
        }
        
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title - white with cyan accent
        this.add.text(450, 100, 'CRYPTO TRADER CHALLENGE', {
            fontSize: '42px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Subtitle - white text
        this.add.text(450, 150, 'Turn $10M into millions more!', {
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
        this.add.text(450, 560, 'TEST LOGINS (auto-creates if needed):', {
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
                result = await this.auth.signUp(email, password);
            } else {
                result = await this.auth.signIn(email, password);
            }
            
            if (result.error) {
                throw result.error;
            }
            
            const user = result.data?.user || result.data?.session?.user;
            
            if (user && user.id) {
                // Clean up form
                this.formContainer.remove();
                // Go to dashboard
                this.scene.start('DashboardScene', { user });
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
                result = await this.auth.signUp(email, password);
                
                if (result.error) {
                    throw result.error;
                }
            }
            
            const user = result.data?.user || result.data?.session?.user;
            
            if (user && user.id) {
                // Clean up form
                this.formContainer.remove();
                // Go to dashboard
                this.scene.start('DashboardScene', { user });
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
                this.scene.start('SimulationSpeedScene', { 
                    user: this.userName,
                    scenario: scenarioKey
                });
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
    }
    
    init(data) {
        this.user = data.user;
        this.userName = data.user?.email || data.user || 'Player';
        this.scenarioKey = data.scenario || 'march_2020';
        this.scenario = SCENARIOS[this.scenarioKey];
        this.speed = data.speed || 'regular';
        this.simulationTime = data.simulationTime || this.scenario.defaultSimulationTime;
        this.allocations = {};
        this.totalAllocated = 0;
        
        // Initialize all cryptos to 0
        Object.keys(GAME_CONFIG.cryptos).forEach(symbol => {
            this.allocations[symbol] = 0;
        });
    }
    
    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Header - white text
        this.add.text(450, 40, `${this.userName}'s Portfolio Allocation`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Money remaining - white text
        this.moneyText = this.add.text(450, 90, '', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        this.updateMoneyDisplay();
        
        // Timer (60 seconds)
        this.timeLeft = 60;
        this.timerText = this.add.text(800, 40, '', {
            fontSize: '20px',
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
        const isAvailable = this.scenario.availableCryptos[symbol].available;
        const reason = this.scenario.availableCryptos[symbol].reason;
        
        // Crypto icon placeholder
        const iconBg = this.add.circle(150, y, 25, isAvailable ? crypto.color : 0x333333);
        this.add.text(150, y, symbol, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: isAvailable ? '#ffffff' : '#666666'
        }).setOrigin(0.5);
        
        // Crypto name
        this.add.text(220, y, crypto.name, {
            fontSize: '20px',
            color: isAvailable ? '#ffffff' : '#666666'
        }).setOrigin(0, 0.5);
        
        // If not available, show reason instead of price and controls
        if (!isAvailable) {
            this.add.text(380, y, reason, {
                fontSize: '16px',
                color: '#444444',
                fontStyle: 'italic'
            }).setOrigin(0, 0.5);
            return;
        }
        
        // Current price - gray (using historical start price)
        const historicalPrice = this.scenario.prices[symbol].start;
        this.add.text(400, y, `$${historicalPrice.toLocaleString()}`, {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Minus button - moved left
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
        
        // Plus button - next to minus
        const plusBtn = this.add.text(520, y, '[+]', {
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
        
        // Allocation display - moved right of buttons
        const allocationText = this.add.text(630, y, '$0', {
            fontSize: '22px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Counter - gray
        const counterText = this.add.text(750, y, '0/10', {
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
        
        // Start the simulation
        this.scene.start('SimulationScene', {
            user: this.user,
            allocations: this.allocations,
            scenario: this.scenarioKey,
            speed: this.speed,
            simulationTime: this.simulationTime
        });
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
                        const priceText = this.add.text(0, 0, `$${this.scenario.prices[symbol].start.toLocaleString()}`, {
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
            bg
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
                
                // Use accent colors only for profit/loss
                if (percentChange > 0) {
                    display.changeText.setColor('#00ffff');
                    display.bg.setStrokeStyle(2, 0x00ffff);
                } else if (percentChange < 0) {
                    display.changeText.setColor('#ff1493');
                    display.bg.setStrokeStyle(2, 0xff1493);
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
        
        this.portfolioValueText.setText(`$${totalValue.toLocaleString()}`);
        
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
            scenario: this.scenarioKey
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
    }
    
    async create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Save the game result if user is logged in
        if (this.user && this.user.id) {
            await this.savePastRun();
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
        this.add.text(450, 160, `$${this.totalValue.toLocaleString()}`, {
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
        
        // Performance breakdown - white header
        let yPos = 280;
        this.add.text(450, yPos, 'Performance Breakdown:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 40;
        Object.entries(this.results).forEach(([symbol, data]) => {
            const text = `${symbol}: $${(data.invested).toLocaleString()} → $${data.currentValue.toLocaleString()} (${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}%)`;
            this.add.text(450, yPos, text, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
            yPos += 25;
        });
        
        // Historical note
        this.add.text(450, yPos + 20, "Historical data - this actually happened!", {
            fontSize: '14px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Play again button - cyan accent
        const playAgainBtn = this.add.rectangle(350, 500, 180, 50, 0x000000, 1)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const playAgainText = this.add.text(350, 500, 'PLAY AGAIN', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        playAgainBtn
            .on('pointerover', () => {
                playAgainBtn.setStrokeStyle(2, 0x00ffff);
                playAgainText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                playAgainBtn.setStrokeStyle(2, 0x666666);
                playAgainText.setColor('#ffffff');
            })
            .on('pointerdown', () => this.scene.start('ScenarioSelectScene', { user: this.user }));
        
        // New strategy button - pink accent
        const newStrategyBtn = this.add.rectangle(550, 500, 180, 50, 0x000000, 1)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const tryAgainText = this.add.text(550, 500, 'TRY AGAIN', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        newStrategyBtn
            .on('pointerover', () => {
                newStrategyBtn.setStrokeStyle(2, 0xff1493);
                tryAgainText.setColor('#ff1493');
            })
            .on('pointerout', () => {
                newStrategyBtn.setStrokeStyle(2, 0x666666);
                tryAgainText.setColor('#ffffff');
            })
            .on('pointerdown', () => this.scene.start('AllocationScene', { 
                user: this.user,
                scenario: this.scenarioKey,
                speed: 'regular',
                simulationTime: 30
            }));
        
        // Fun message - white
        const messages = isWinner ? 
            ['You survived Black Thursday!', 'Better than most traders!', 'Risk management pro!'] :
            ['Black Thursday got you!', 'Welcome to crypto volatility!', 'Try a defensive strategy!'];
        const message = messages[Math.floor(Math.random() * messages.length)];
        
        this.add.text(450, 440, message, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
    
    async savePastRun() {
        try {
            const profit = this.totalValue - GAME_CONFIG.startingMoney;
            const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
            
            const { data, error } = await this.auth.supabase
                .from('past_runs')
                .insert({
                    user_id: this.user.id,
                    scenario_key: this.scenarioKey,
                    allocations: this.allocations,
                    final_value: this.totalValue,
                    profit_amount: profit,
                    profit_percent: profitPercent
                })
                .select();
            
            if (error) throw error;
            
            console.log('Game saved successfully!');
        } catch (error) {
            console.error('Error saving game:', error);
        }
    }
}

// Dashboard Scene
class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
        this.auth = new Auth();
    }
    
    init(data) {
        this.user = data.user;
    }
    
    async create() {
        // Make sure we have a valid user
        if (!this.user || !this.user.email) {
            console.error('No valid user for dashboard');
            this.scene.start('LoginScene');
            return;
        }
        
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Header
        this.add.text(450, 40, 'CRYPTO TRADER DASHBOARD', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Welcome message
        this.add.text(450, 90, `Welcome, ${this.user.email}!`, {
            fontSize: '20px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Play button
        const playButton = this.add.rectangle(450, 160, 300, 60, 0x00ffff)
            .setInteractive({ useHandCursor: true });
            
        const playText = this.add.text(450, 160, 'PLAY NEW GAME', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        
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
        
        // Past runs header
        this.add.text(450, 250, 'YOUR PAST GAMES', {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Refresh button (for testing)
        const refreshBtn = this.add.text(750, 250, '[Refresh]', {
            fontSize: '16px',
            color: '#00ff00'
        }).setOrigin(1, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#ffffff'); })
        .on('pointerout', function() { this.setColor('#00ff00'); })
        .on('pointerdown', () => {
            // Reload the scene to refresh past runs
            this.scene.restart({ user: this.user });
        });
        
        // Loading text for past runs
        this.loadingText = this.add.text(450, 300, 'Loading your game history...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Sign out button
        const signOutButton = this.add.text(800, 550, 'Sign Out', {
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
        
        // Load past runs
        this.loadPastRuns();
    }
    
    async loadPastRuns() {
        try {
            // Make sure we have a valid user
            if (!this.user || !this.user.id) {
                console.error('No valid user in dashboard');
                this.scene.start('LoginScene');
                return;
            }
            
            // Query past runs from Supabase
            const { data, error } = await this.auth.supabase
                .from('past_runs')
                .select('*')
                .eq('user_id', this.user.id)
                .order('created_at', { ascending: false })
                .limit(10);
            
            if (error) throw error;
            
            this.loadingText.destroy();
            
            if (!data || data.length === 0) {
                this.add.text(450, 300, 'No games played yet. Start your first game!', {
                    fontSize: '16px',
                    color: '#666666'
                }).setOrigin(0.5);
                return;
            }
            
            // Display past runs
            let yPos = 300;
            data.forEach((run, index) => {
                this.createPastRunDisplay(run, yPos);
                yPos += 60;
            });
            
        } catch (error) {
            console.error('Error loading past runs:', error);
            this.loadingText.setText('Error loading game history');
        }
    }
    
    createPastRunDisplay(run, y) {
        // Background
        const bg = this.add.rectangle(450, y, 700, 50, 0x111111)
            .setStrokeStyle(1, 0x333333)
            .setInteractive({ useHandCursor: true });
        
        // Scenario name
        const scenarioName = SCENARIOS[run.scenario_key]?.displayName || run.scenario_key;
        this.add.text(200, y, scenarioName, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Final value
        const profit = run.final_value - 10000000;
        const profitPercent = (profit / 10000000) * 100;
        const profitColor = profit >= 0 ? '#00ffff' : '#ff1493';
        
        this.add.text(450, y, `$${run.final_value.toLocaleString()}`, {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(600, y, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0.5);
        
        // Date
        const date = new Date(run.created_at);
        this.add.text(700, y, date.toLocaleDateString(), {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(1, 0.5);
        
        // Hover effect
        bg.on('pointerover', () => {
            bg.setStrokeStyle(2, 0x00ffff);
        })
        .on('pointerout', () => {
            bg.setStrokeStyle(1, 0x333333);
        })
        .on('pointerdown', () => {
            // Could show detailed view or replay
            this.scene.start('AllocationScene', {
                user: this.user,
                scenario: run.scenario_key,
                speed: 'regular',
                simulationTime: 30
            });
        });
    }
}

// Game configuration
const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 900,
    height: 600,
    scene: [LoginScene, DashboardScene, ScenarioSelectScene, SimulationSpeedScene, AllocationScene, SimulationScene, ResultsScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};

// Start the game
const game = new Phaser.Game(config);
