// Import dependencies
import { Auth } from '../auth.js';

// Login Scene
export default class LoginScene extends Phaser.Scene {
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