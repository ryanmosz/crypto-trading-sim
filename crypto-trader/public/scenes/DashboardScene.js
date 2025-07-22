// Import dependencies
import { Auth } from '../auth.js';
import { GAME_CONFIG, SCENARIOS } from '../shared/constants.js';

// Dashboard Scene
export default class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
        this.auth = new Auth();
        this.currentPage = 0;
        this.gamesPerPage = 4;
        this.allGames = [];
        this.activeTab = 'new'; // 'new', 'active', or 'past'
    }
    
    init(data) {
        this.user = data.user;
    }
    
    async create() {
        // Initialize auth if needed
        try {
            if (this.auth && this.auth.init) {
                await this.auth.init();
            }
        } catch (error) {
            console.error('Error initializing auth:', error);
        }
        
        // Make sure we have a valid user
        if (!this.user || !this.user.email) {
            console.error('No valid user for dashboard');
            this.scene.start('LoginScene');
            return;
        }
        
        try {
            // Black background
            this.cameras.main.setBackgroundColor('#000000');
            
            // Header
            this.add.text(450, 40, 'CRYPTO TRADER SIMULATOR', {
                fontSize: '36px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // Welcome message
            this.add.text(450, 90, `Welcome, ${this.user.email}!`, {
                fontSize: '20px',
                color: '#00ffff'
            }).setOrigin(0.5);
            
            // Create tabs
            this.createTabs();
            
            // Initialize content group
            this.contentGroup = this.add.group();
            this.contentY = 280; // Starting Y position for content
            
            // Check and start tutorial for new users
            if (window.tutorialManager) {
                window.tutorialManager.start(this, this.user);
            }
            
            // Show content based on active tab
            this.showTabContent();
            
            // Create Sign Out button after content to ensure it's on top
            this.createSignOutButton();
        } catch (error) {
            console.error('Error in DashboardScene create():', error);
            console.error('Stack trace:', error.stack);
        }
        
        // Test buttons (temporary for debugging) - hide them in corner
        const testSaveBtn = this.add.text(50, 20, '[Test Save]', {
            fontSize: '12px',
            color: '#003300'
        }).setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#00ff00'); })
        .on('pointerout', function() { this.setColor('#003300'); })
        .on('pointerdown', async () => {
            console.log('Testing save with user:', this.user);
            try {
                const testData = {
                    user_id: this.user.id,
                    scenario_key: 'march_2020',
                    allocations: {BTC: 5, ETH: 3, BNB: 2},
                    final_value: 12500000  // NOTE: This is fake test data! March 2020 was a crash
                };
                
                const { data, error } = await this.auth.supabase
                    .from('past_runs')
                    .insert(testData)
                    .select();
                    
                if (error) {
                    console.error('Test save error:', error);
                } else {
                    console.log('Test save successful:', data);
                }
            } catch (e) {
                console.error('Test save exception:', e);
            }
        });

    }
    
    createSignOutButton() {
        // Remove existing sign out button if any
        if (this.signOutButton) {
            this.signOutButton.destroy();
        }
        
        // Create sign out button
        this.signOutButton = this.add.text(800, 550, 'Sign Out', {
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
    }
    
    createTabs() {
        // Clear existing tabs if any
        if (this.tabGroup && this.tabGroup.children && this.tabGroup.children.size !== undefined) {
            try {
                this.tabGroup.clear(true, true);
            } catch (e) {
                console.warn('Error clearing tabGroup:', e);
                this.tabGroup = null;
            }
        }
        
        // Always create a new group to ensure clean state
        this.tabGroup = this.add.group();
        
        const tabY = 150;
        const tabWidth = 200;
        const tabHeight = 50;
        const tabSpacing = 20;
        // Fix centering: 3 tabs total width = 3*200 + 2*20 = 640
        const totalWidth = (tabWidth * 3) + (tabSpacing * 2);
        const startX = 450 - (totalWidth / 2); // Center properly
        
        // Tab data
        const tabs = [
            { key: 'new', label: 'NEW GAME', x: startX + (tabWidth / 2) },
            { key: 'active', label: 'ACTIVE', x: startX + tabWidth + tabSpacing + (tabWidth / 2) },
            { key: 'past', label: 'PAST', x: startX + (tabWidth + tabSpacing) * 2 + (tabWidth / 2) }
        ];
        
        // Create tab buttons
        tabs.forEach(tab => {
            const isActive = this.activeTab === tab.key;
            
            // Tab background - use x as center
            const tabBg = this.add.rectangle(tab.x, tabY, tabWidth, tabHeight, 
                isActive ? 0x00ffff : 0x111111)
                .setStrokeStyle(2, isActive ? 0x00ffff : 0x333333)
                .setInteractive({ useHandCursor: true });
            
            // Tab text - centered on tab
            const tabText = this.add.text(tab.x, tabY, tab.label, {
                fontSize: '20px',
                fontFamily: 'Arial Black',
                color: isActive ? '#000000' : '#ffffff'
            }).setOrigin(0.5);
            
            // Add to tab group for cleanup
            this.tabGroup.add(tabBg);
            this.tabGroup.add(tabText);
            
            // Tab interactions
            if (!isActive) {
                tabBg.on('pointerover', () => {
                    tabBg.setStrokeStyle(2, 0x00ffff);
                    tabText.setColor('#00ffff');
                })
                .on('pointerout', () => {
                    tabBg.setStrokeStyle(2, 0x333333);
                    tabText.setColor('#ffffff');
                })
                .on('pointerdown', () => {
                    this.activeTab = tab.key;
                    // Clear and redraw tabs without restarting scene
                    this.createTabs();
                    this.showTabContent();
                    this.createSignOutButton(); // Recreate sign out button
                });
            }
        });
    }
    
    showTabContent() {
        
        // Clear existing content more thoroughly
        if (this.pageDisplayGroup && this.pageDisplayGroup.children && this.pageDisplayGroup.children.size !== undefined) {
            try {
                this.pageDisplayGroup.clear(true, true);
                this.pageDisplayGroup.destroy(true);
            } catch (e) {
                console.warn('Error clearing pageDisplayGroup:', e);
            }
            this.pageDisplayGroup = null;
        }
        
        // Clear all children from contentGroup
        if (this.contentGroup && this.contentGroup.children && this.contentGroup.children.size !== undefined) {
            try {
                this.contentGroup.getChildren().forEach(child => {
                    if (child && child.destroy) {
                        child.destroy();
                    }
                });
                this.contentGroup.clear(true, true);
            } catch (e) {
                console.warn('Error clearing contentGroup:', e);
            }
        }
        
        switch (this.activeTab) {
            case 'new':
                this.showNewGameContent();
                break;
            case 'active':
                this.showActiveGamesContent();
                break;
            case 'past':
                this.showPastGamesContent();
                break;
        }
        
        // Check if tutorial should show for this tab
        if (window.tutorialManager && window.tutorialManager.isActive) {
            // Show tab-specific tutorial if user hasn't seen it yet
            if (this.activeTab === 'active' || this.activeTab === 'past') {
                window.tutorialManager.showTabTutorial(this, this.activeTab);
            } else {
                window.tutorialManager.checkScene(this);
            }
        }
    }
    
    showNewGameContent() {
        // Ensure contentGroup exists
        if (!this.contentGroup) {
            this.contentGroup = this.add.group();
        }
        
        // Create a background to cover any previous content
        const contentBg = this.add.rectangle(450, this.contentY + 150, 800, 350, 0x000000, 1);
        this.contentGroup.add(contentBg);
        
        // Large play button
        const playButton = this.add.rectangle(450, this.contentY + 80, 400, 80, 0x00ffff)
            .setInteractive({ useHandCursor: true });
            
        const playText = this.add.text(450, this.contentY + 80, 'START NEW GAME', {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        
        this.contentGroup.addMultiple([playButton, playText]);
        
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
        
        // Instructions
        const instructions = this.add.text(450, this.contentY + 180, 
            'Choose from historical scenarios or trade in real-time with "Now" mode', {
            fontSize: '16px',
            color: '#666666',
            align: 'center',
            wordWrap: { width: 600 }
        }).setOrigin(0.5);
        
        this.contentGroup.add(instructions);
        
        // Join Game button
        const joinGameBtn = this.add.rectangle(300, this.contentY + 250, 250, 50, 0x111111)
            .setStrokeStyle(2, 0x00ff00)
            .setInteractive({ useHandCursor: true });
            
        const joinGameText = this.add.text(300, this.contentY + 250, 'JOIN MULTIPLAYER', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        this.contentGroup.addMultiple([joinGameBtn, joinGameText]);
        
        joinGameBtn
            .on('pointerover', () => {
                joinGameBtn.setStrokeStyle(2, 0x00ffff);
                joinGameText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                joinGameBtn.setStrokeStyle(2, 0x00ff00);
                joinGameText.setColor('#00ff00');
            })
            .on('pointerdown', () => {
                this.scene.start('JoinGameScene', { user: this.user });
            });
        
        // Leaderboard button
        const leaderboardBtn = this.add.rectangle(600, this.contentY + 250, 250, 50, 0x111111)
            .setStrokeStyle(2, 0xffff00)
            .setInteractive({ useHandCursor: true });
            
        const leaderboardText = this.add.text(600, this.contentY + 250, '🏆 LEADERBOARD', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        this.contentGroup.addMultiple([leaderboardBtn, leaderboardText]);
        
        leaderboardBtn
            .on('pointerover', () => {
                leaderboardBtn.setFillStyle(0x222222);
            })
            .on('pointerout', () => {
                leaderboardBtn.setFillStyle(0x111111);
            })
            .on('pointerdown', () => {
                if (window.FEATURES && window.FEATURES.LEADERBOARD) {
                    this.scene.start('LeaderboardScene', { user: this.user });
                } else {
                    alert('Leaderboard coming soon!');
                }
            });
    }
    
    async showActiveGamesContent() {
        // Ensure contentGroup exists
        if (!this.contentGroup) {
            this.contentGroup = this.add.group();
        }
        
        // Create a background to cover any previous content
        const contentBg = this.add.rectangle(450, this.contentY + 150, 800, 350, 0x000000, 1);
        this.contentGroup.add(contentBg);
        
        // Loading text
        const loadingText = this.add.text(450, this.contentY + 40, 'Loading active games...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        this.contentGroup.add(loadingText);
        
        try {
            // Check if auth is still valid
            const { data: { session }, error: sessionError } = await this.auth.supabase.auth.getSession();
            
            if (sessionError || !session) {
                console.error('Session expired or invalid:', sessionError);
                loadingText.setText('Session expired. Please log in again.');
                loadingText.setColor('#ff0000');
                
                // Redirect to login after a delay
                this.time.delayedCall(2000, () => {
                    this.scene.start('LoginScene');
                });
                return;
            }
            
            // Query ALL active games (both single player and multiplayer)
            const { data: allGames, error: gamesError } = await this.auth.supabase
                .from('active_games')
                .select('*')
                .eq('is_complete', false)
                .order('created_at', { ascending: false });
            
            if (gamesError) throw gamesError;
            
            // All games are multiplayer and joinable
            const allMultiplayerGames = allGames || [];
            
            // Check which games the user has already joined
            const gameIds = allMultiplayerGames.map(g => g.id);
            let userParticipations = {};
            
            if (gameIds.length > 0) {
                const { data: participations } = await this.auth.supabase
                    .from('game_participants')
                    .select('game_id')
                    .eq('user_id', this.user.id)
                    .in('game_id', gameIds);
                    
                if (participations) {
                    participations.forEach(p => {
                        userParticipations[p.game_id] = true;
                    });
                }
            }
            
            // Get the latest price update time from price cache
            const { data: priceData, error: priceError } = await this.auth.supabase
                .from('prices_cache')
                .select('fetched_at')
                .order('fetched_at', { ascending: false })
                .limit(1)
                .single();
                
            // Update all games with the actual price cache update time
            if (!priceError && priceData) {
                if (allGames) {
                    allGames.forEach(game => {
                        game.last_updated = priceData.fetched_at;
                    });
                }
            }
            
            this.contentGroup.remove(loadingText);
            loadingText.destroy();
            
            const totalGames = allMultiplayerGames.length;
            
            if (totalGames === 0) {
                const noGamesText = this.add.text(450, this.contentY + 60, 
                    'No active games', {
                    fontSize: '20px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                const hintText = this.add.text(450, this.contentY + 100, 
                    'Start a new "Now" mode game to trade with real-time prices!', {
                    fontSize: '16px',
                    color: '#444444',
                    align: 'center',
                    wordWrap: { width: 500 }
                }).setOrigin(0.5);
                
                this.contentGroup.addMultiple([noGamesText, hintText]);
                return;
            }
            
            let yPos = this.contentY + 40;
            
            // Display ALL games as multiplayer
            const gamesHeader = this.add.text(450, yPos, 'ACTIVE MULTIPLAYER GAMES', {
                fontSize: '14px',
                color: '#00ff00',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            this.contentGroup.add(gamesHeader);
            yPos += 30;
            
            allMultiplayerGames.forEach(game => {
                // Check if user has already joined this game
                const hasJoined = userParticipations[game.id] || false;
                const isCreator = game.user_id === this.user.id;
                const isJoinable = !hasJoined && !isCreator;
                this.createActiveGameDisplay(game, yPos, isJoinable, true); // all are multiplayer
                yPos += 70;
            });
            
        } catch (error) {
            console.error('Error loading active games:', error);
            
            // Check if it's an auth error
            if (error.message && error.message.includes('JWT') || error.message.includes('token')) {
                loadingText.setText('Session expired. Please log in again.');
                loadingText.setColor('#ff0000');
                
                // Redirect to login after delay
                this.time.delayedCall(2000, () => {
                    this.scene.start('LoginScene');
                });
            } else {
                loadingText.setText('Error loading active games. Please try refreshing.');
                loadingText.setColor('#ff0000');
            }
        }
    }
    
    async showPastGamesContent() {
        // Ensure contentGroup exists
        if (!this.contentGroup) {
            this.contentGroup = this.add.group();
        }
        
        // Create a background to cover any previous content
        const contentBg = this.add.rectangle(450, this.contentY + 150, 800, 350, 0x000000, 1);
        this.contentGroup.add(contentBg);
        
        // Loading text
        const loadingText = this.add.text(450, this.contentY + 40, 'Loading past games...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        this.contentGroup.add(loadingText);
        
        try {
            // Query past runs
            const { data, error } = await this.auth.supabase
                .from('past_runs')
                .select('*')
                .eq('user_id', this.user.id)
                .order('created_at', { ascending: false })
                .limit(20); // Get more for paging
            
            if (error) throw error;
            
            this.contentGroup.remove(loadingText);
            loadingText.destroy();
            
            if (!data || data.length === 0) {
                const noGamesText = this.add.text(450, this.contentY + 60, 
                    'No games played yet', {
                    fontSize: '20px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                const hintText = this.add.text(450, this.contentY + 100, 
                    'Complete your first game to see it here!', {
                    fontSize: '16px',
                    color: '#444444'
                }).setOrigin(0.5);
                
                this.contentGroup.addMultiple([noGamesText, hintText]);
                return;
            }
            
            // Store all games for paging
            this.allGames = data;
            this.currentPage = 0; // Reset to first page
            
            // Display current page
            this.displayCurrentPage();
            
        } catch (error) {
            console.error('Error loading past runs:', error);
            loadingText.setText('Error loading game history');
            loadingText.setColor('#ff0000');
        }
    }
    
    createActiveGameDisplay(game, y, isJoinable = false, isMultiplayer = false) {
        // Calculate days remaining
        const now = new Date();
        const endsAt = new Date(game.ends_at);
        const daysRemaining = Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24));
        
        // Determine urgency colors
        const isExpiringSoon = daysRemaining <= 7;
        const isExpiring = daysRemaining <= 3;
        const borderColor = isJoinable ? 0x00ff00 : (isExpiring ? 0xff1493 : (isExpiringSoon ? 0xffff00 : 0x00ffff));
        const timeColor = isExpiring ? '#ff1493' : (isExpiringSoon ? '#ffff00' : '#00ffff');
        
        // Background with urgency-based border
        const bg = this.add.rectangle(450, y, 720, 50, 0x111111)
            .setStrokeStyle(isJoinable ? 2 : (isExpiring ? 2 : 1), borderColor)
            .setInteractive({ useHandCursor: true });
        
        // Add to content group
        this.contentGroup.add(bg);
        
        // Calculate performance
        const startValue = game.starting_money || 10000000;
        const currentValue = game.current_value || startValue;
        const profit = currentValue - startValue;
        const profitPercent = (profit / startValue) * 100;
        const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
        
        // Game duration
        const durationText = `${game.duration_days || 30} day game`;
        const durationDisplay = this.add.text(150, y, durationText, {
            fontSize: '16px',
            color: timeColor
        }).setOrigin(0, 0.5);
        
        this.contentGroup.add(durationDisplay);
        
        // Days remaining
        const remainingText = daysRemaining <= 0 ? 'EXPIRED' : `${daysRemaining} days left`;
        const remainingDisplay = this.add.text(300, y, remainingText, {
            fontSize: '14px',
            color: timeColor,
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        
        this.contentGroup.add(remainingDisplay);
        
        // Show game code for multiplayer games
        if (game.game_code) {
            const codeText = this.add.text(430, y, `Code: ${game.game_code}`, {
                fontSize: '14px',
                color: '#00ffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            this.contentGroup.add(codeText);
        }
        
        if (isJoinable) {
            // For joinable games, show participant count
            const participantText = `${game.participant_count || 1} player${(game.participant_count || 1) > 1 ? 's' : ''}`;
            const participantDisplay = this.add.text(600, y, participantText, {
                fontSize: '16px',
                color: '#ffffff'
            }).setOrigin(0.5);
            this.contentGroup.add(participantDisplay);
            
            // Show JOIN button
            const joinBtn = this.add.text(750, y, 'JOIN', {
                fontSize: '16px',
                color: '#00ff00',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(joinBtn);
            
            // Hover effects
            bg.on('pointerover', () => {
                bg.setFillStyle(0x222222);
                joinBtn.setColor('#ffffff');
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x111111);
                joinBtn.setColor('#00ff00');
            })
            .on('pointerdown', () => {
                this.scene.start('JoinGameScene', { 
                    user: this.user,
                    game: game
                });
            });
        } else {
            // Current value
            const valueText = this.add.text(500, y, `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(valueText);
            
            // Profit/Loss
            const profitText = this.add.text(650, y, `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
                fontSize: '16px',
                color: profitColor,
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(profitText);
            
            // View button
            const viewBtn = this.add.text(750, y, 'VIEW', {
                fontSize: '14px',
                color: '#00ffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            this.contentGroup.add(viewBtn);
            
            // Hover effects
            bg.on('pointerover', () => {
                bg.setFillStyle(0x222222);
                viewBtn.setColor('#ffffff');
            })
            .on('pointerout', () => {
                bg.setFillStyle(0x111111);
                viewBtn.setColor('#00ffff');
            })
            .on('pointerdown', () => {
                this.scene.start('ActiveGameViewScene', { 
                    user: this.user,
                    gameData: game
                });
            });
        }
    }
    
    displayCurrentPage() {
        // Remove old page display group from content group before destroying
        if (this.pageDisplayGroup) {
            if (this.contentGroup) {
                this.contentGroup.remove(this.pageDisplayGroup);
            }
            // Destroy all children individually first
            this.pageDisplayGroup.getChildren().forEach(child => {
                child.destroy();
            });
            this.pageDisplayGroup.clear(true, true);
            this.pageDisplayGroup.destroy(true);
        }
        this.pageDisplayGroup = this.add.group();
        
        // Calculate page info
        const totalPages = Math.ceil(this.allGames.length / this.gamesPerPage);
        const startIndex = this.currentPage * this.gamesPerPage;
        const endIndex = Math.min(startIndex + this.gamesPerPage, this.allGames.length);
        const gamesToShow = this.allGames.slice(startIndex, endIndex);
        
        // Display games
        let yPos = this.contentY + 40;
        gamesToShow.forEach((run, index) => {
            this.createPastRunDisplay(run, yPos);
            yPos += 60;
        });
        
        // Show paging controls if there are multiple pages
        if (totalPages > 1) {
            // Position paging controls at fixed position
            const pagingY = this.contentY + 300;  // Fixed position for paging
            
            // Page indicator in center
            const pageText = this.add.text(450, pagingY, `Page ${this.currentPage + 1} of ${totalPages}`, {
                fontSize: '13px',
                color: '#666666'
            }).setOrigin(0.5);
            this.pageDisplayGroup.add(pageText);
            
            // Up arrow (previous page) - positioned left with proper spacing
            if (this.currentPage > 0) {
                const upArrow = this.add.text(350, pagingY, '▲', {
                    fontSize: '18px',
                    color: '#00ffff'
                }).setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', function() { this.setScale(1.2); })
                .on('pointerout', function() { this.setScale(1); })
                .on('pointerdown', () => {
                    this.currentPage--;
                    this.displayCurrentPage(); // Just update display
                });
                this.pageDisplayGroup.add(upArrow);
            }
            
            // Down arrow (next page) - positioned right with proper spacing
            if (this.currentPage < totalPages - 1) {
                const downArrow = this.add.text(550, pagingY, '▼', {
                    fontSize: '18px',
                    color: '#00ffff'
                }).setOrigin(0.5)
                .setInteractive({ useHandCursor: true })
                .on('pointerover', function() { this.setScale(1.2); })
                .on('pointerout', function() { this.setScale(1); })
                .on('pointerdown', () => {
                    this.currentPage++;
                    this.displayCurrentPage(); // Just update display
                });
                this.pageDisplayGroup.add(downArrow);
            }
        }
        
        // Add page display group to content group
        if (this.contentGroup) {
            this.contentGroup.add(this.pageDisplayGroup);
        }
    }
    
    createPastRunDisplay(run, y) {
        // Background
        const bg = this.add.rectangle(450, y, 720, 50, 0x111111)
            .setStrokeStyle(1, 0x333333)
            .setInteractive({ useHandCursor: true });
        this.pageDisplayGroup.add(bg);
        
        // Scenario name - handle both old and new data formats
        let scenarioName = SCENARIOS[run.scenario_key]?.displayName;
        
        if (!scenarioName) {
            // Handle old data that might have saved displayName as scenario_key
            for (const [key, scen] of Object.entries(SCENARIOS)) {
                if (scen.displayName === run.scenario_key) {
                    scenarioName = scen.displayName;
                    break;
                }
            }
            // If still not found, use the raw value
            if (!scenarioName) {
                scenarioName = run.scenario_key;
            }
        }
        
        const scenarioText = this.add.text(120, y, scenarioName, {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        this.pageDisplayGroup.add(scenarioText);
        
        // Final value
        const profit = run.final_value - GAME_CONFIG.startingMoney;
        const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
        const profitColor = profit >= 0 ? '#00ffff' : '#ff1493';
        
        // Position dollar amount further left
        const valueText = this.add.text(480, y, `$${run.final_value.toLocaleString()}`, {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(1, 0.5);  // Right-align the dollar amount
        this.pageDisplayGroup.add(valueText);
        
        // Position percentage with more space
        const percentText = this.add.text(530, y, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0, 0.5);  // Left-align the percentage
        this.pageDisplayGroup.add(percentText);
        
        // Date - moved to far right edge
        const date = new Date(run.created_at);
        const dateText = this.add.text(780, y, date.toLocaleDateString(), {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(1, 0.5);
        this.pageDisplayGroup.add(dateText);
        
        // Hover effect
        bg.on('pointerover', () => {
            bg.setStrokeStyle(2, 0x00ffff);
        })
        .on('pointerout', () => {
            bg.setStrokeStyle(1, 0x333333);
        })
        .on('pointerdown', () => {
            // Show game details
            this.showGameDetails(run);
        });
    }
    
    showGameDetails(run) {
        // Store modal elements for cleanup
        const modalElements = [];
        let currentView = 'main'; // Track current view
        
        // Create overlay background
        const overlay = this.add.rectangle(450, 300, 900, 600, 0x000000, 0.9)
            .setInteractive(); // Block clicks underneath
        modalElements.push(overlay);
        
        // Modal container - fixed size for both views
        const modal = this.add.rectangle(450, 300, 600, 450, 0x111111)
            .setStrokeStyle(2, 0x00ffff);
        modalElements.push(modal);
        
        // Create containers for each view
        const mainViewElements = [];
        const detailsViewElements = [];
        
        // Function to show main view
        const showMainView = () => {
            // Hide details view
            detailsViewElements.forEach(el => el.setVisible(false));
            
            // Show main view
            mainViewElements.forEach(el => el.setVisible(true));
            currentView = 'main';
        };
        
        // Function to show details view
        const showDetailsView = () => {
            // Hide main view
            mainViewElements.forEach(el => el.setVisible(false));
            
            // Show details view
            detailsViewElements.forEach(el => el.setVisible(true));
            currentView = 'details';
        };
        
        // ===== MAIN VIEW CONTENT =====
        const scenario = SCENARIOS[run.scenario_key];
        
        // Title
        const mainTitle = this.add.text(450, 130, `Game Details`, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(mainTitle);
        modalElements.push(mainTitle);
        
        // Scenario info
        const scenarioText = this.add.text(450, 170, scenario ? scenario.displayName : run.scenario_key, {
            fontSize: '20px',
            color: '#00ffff'
        }).setOrigin(0.5);
        mainViewElements.push(scenarioText);
        modalElements.push(scenarioText);
        
        const scenarioDesc = this.add.text(450, 195, scenario ? scenario.description : '', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(scenarioDesc);
        modalElements.push(scenarioDesc);
        
        // Results - Note: We keep using saved value on main view for consistency
        // Details view will show recalculated values if different
        const profit = run.final_value - GAME_CONFIG.startingMoney;
        const profitPercent = (profit / GAME_CONFIG.startingMoney) * 100;
        const profitColor = profit >= 0 ? '#00ffff' : '#ff1493';
        
        const finalLabel = this.add.text(450, 240, 'Final Value:', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(finalLabel);
        modalElements.push(finalLabel);
        
        const finalValue = this.add.text(450, 270, `$${run.final_value.toLocaleString()}`, {
            fontSize: '32px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(finalValue);
        modalElements.push(finalValue);
        
        const profitText = this.add.text(450, 305, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0.5);
        mainViewElements.push(profitText);
        modalElements.push(profitText);
        
        // Date played
        const date = new Date(run.created_at);
        const dateText = this.add.text(450, 350, date.toLocaleDateString() + ' at ' + date.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}), {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(dateText);
        modalElements.push(dateText);
        
        // Main view buttons
        const mainButtonY = 445;
        
        // Close button
        const closeBtn = this.add.rectangle(320, mainButtonY, 100, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(closeBtn);
        modalElements.push(closeBtn);
            
        const closeText = this.add.text(320, mainButtonY, 'CLOSE', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(closeText);
        modalElements.push(closeText);
        
        closeBtn
            .on('pointerover', () => {
                closeBtn.setStrokeStyle(2, 0x00ffff);
                closeText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                closeBtn.setStrokeStyle(2, 0x666666);
                closeText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                // Remove all modal elements
                modalElements.forEach(element => element.destroy());
            });
            
        // Details button
        const detailsBtn = this.add.rectangle(450, mainButtonY, 100, 40, 0x333333)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(detailsBtn);
        modalElements.push(detailsBtn);
            
        const detailsBtnText = this.add.text(450, mainButtonY, 'DETAILS', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        mainViewElements.push(detailsBtnText);
        modalElements.push(detailsBtnText);
        
        detailsBtn
            .on('pointerover', () => {
                detailsBtn.setFillStyle(0x333333);
                detailsBtnText.setColor('#ffffff');
            })
            .on('pointerout', () => {
                detailsBtn.setFillStyle(0x000000);
                detailsBtnText.setColor('#00ffff');
            })
            .on('pointerdown', () => {
                showDetailsView();
            });
            
        // Play Again button
        const playAgainBtn = this.add.rectangle(580, mainButtonY, 120, 40, 0x00ffff)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(playAgainBtn);
        modalElements.push(playAgainBtn);
            
        const playAgainText = this.add.text(580, mainButtonY, 'PLAY AGAIN', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#000000'
        }).setOrigin(0.5);
        mainViewElements.push(playAgainText);
        modalElements.push(playAgainText);
        
        playAgainBtn
            .on('pointerover', () => {
                playAgainBtn.setFillStyle(0xff1493);
            })
            .on('pointerout', () => {
                playAgainBtn.setFillStyle(0x00ffff);
            })
            .on('pointerdown', () => {
                this.scene.start('SimulationSpeedScene', {
                    user: this.user,
                    scenario: run.scenario_key
                });
            });
            
        // ===== DETAILS VIEW CONTENT =====
        
        // Title
        const detailsTitle = this.add.text(450, 130, `Allocation Details`, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);
        detailsViewElements.push(detailsTitle);
        modalElements.push(detailsTitle);
        
        // Allocations
        let yPos = 170;
        const allocHeader = this.add.text(450, yPos, 'Investment Performance:', {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0.5).setVisible(false);
        detailsViewElements.push(allocHeader);
        modalElements.push(allocHeader);
        
        // Remove column headers since we're using a more compact inline layout
        
        yPos += 30;  // Reduced spacing since no column headers
        if (run.allocations) {
            // Calculate individual crypto performance
            const cryptoResults = {};
            const scenarioData = SCENARIOS[run.scenario_key];
            let recalculatedTotal = 0;
            
            // Calculate each crypto's final value
            Object.entries(run.allocations).forEach(([symbol, blocks]) => {
                if (blocks > 0) {
                    const initialInvestment = blocks * 1000000;
                    const startPrice = scenarioData.prices[symbol].start;
                    const endPrice = scenarioData.prices[symbol].end;
                    const units = initialInvestment / startPrice;
                    const finalValue = units * endPrice;
                    const change = ((finalValue / initialInvestment) - 1) * 100;
                    
                    cryptoResults[symbol] = {
                        blocks,
                        initialInvestment,
                        finalValue,
                        change
                    };
                    
                    recalculatedTotal += finalValue;
                }
            });
            
            // Use recalculated total for accuracy
            const actualFinalValue = recalculatedTotal;
            const actualProfit = actualFinalValue - GAME_CONFIG.startingMoney;
            const actualProfitPercent = (actualProfit / GAME_CONFIG.startingMoney) * 100;
            
            // Calculate dynamic spacing based on number of cryptos
            const numCryptos = Object.keys(cryptoResults).length;
            const startY = yPos;
            const endY = 470; // Leave space for back button at 495
            const availableHeight = endY - startY;
            const cryptoSpacing = Math.floor(availableHeight / (numCryptos + 2)); // +2 for total row and padding
            
            // Display each crypto's performance
            Object.entries(cryptoResults).forEach(([symbol, data]) => {
                const cryptoInfo = GAME_CONFIG.cryptos[symbol];
                
                // Crypto name and initial investment on same line
                const allocText = this.add.text(260, yPos, `${symbol}:`, {
                    fontSize: '16px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(allocText);
                modalElements.push(allocText);
                
                const initialText = this.add.text(350, yPos, `$${data.initialInvestment.toLocaleString()}`, {
                    fontSize: '15px',
                    color: '#999999'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(initialText);
                modalElements.push(initialText);
                
                // Arrow pointing right
                const arrowText = this.add.text(450, yPos, `→`, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5).setVisible(false);
                detailsViewElements.push(arrowText);
                modalElements.push(arrowText);
                
                // Final value and percentage on same line
                const finalText = this.add.text(505, yPos, `$${Math.round(data.finalValue).toLocaleString()}`, {
                    fontSize: '15px',
                    fontFamily: 'Arial Black',
                    color: data.change >= 0 ? '#00ffff' : '#ff1493'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(finalText);
                modalElements.push(finalText);
                
                const changeText = this.add.text(635, yPos, `${data.change >= 0 ? '+' : ''}${data.change.toFixed(1)}%`, {
                    fontSize: '13px',
                    fontFamily: 'Arial Black',
                    color: data.change >= 0 ? '#00ffff' : '#ff1493'
                }).setOrigin(0, 0.5).setVisible(false);
                detailsViewElements.push(changeText);
                modalElements.push(changeText);
                
                yPos += cryptoSpacing;
            });
            
            // Add total summary
            yPos += 15;
            
            // Divider line
            const divider = this.add.rectangle(450, yPos, 380, 1, 0x666666)
                .setVisible(false);
            detailsViewElements.push(divider);
            modalElements.push(divider);
            
            yPos += 15;
            
            // Total label
            const totalLabel = this.add.text(260, yPos, 'TOTAL:', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalLabel);
            modalElements.push(totalLabel);
            
            // Total initial
            const totalInitial = this.add.text(350, yPos, `$${GAME_CONFIG.startingMoney.toLocaleString()}`, {
                fontSize: '15px',
                fontFamily: 'Arial Black',
                color: '#999999'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalInitial);
            modalElements.push(totalInitial);
            
            // Total arrow
            const totalArrow = this.add.text(450, yPos, `→`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5).setVisible(false);
            detailsViewElements.push(totalArrow);
            modalElements.push(totalArrow);
            
            // Total final
            const totalFinal = this.add.text(505, yPos, `$${Math.round(actualFinalValue).toLocaleString()}`, {
                fontSize: '15px',
                fontFamily: 'Arial Black',
                color: actualProfit >= 0 ? '#00ffff' : '#ff1493'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalFinal);
            modalElements.push(totalFinal);
            
            // Total percentage
            const totalPercent = this.add.text(635, yPos, `${actualProfit >= 0 ? '+' : ''}${actualProfitPercent.toFixed(1)}%`, {
                fontSize: '13px',
                fontFamily: 'Arial Black',
                color: actualProfit >= 0 ? '#00ffff' : '#ff1493'
            }).setOrigin(0, 0.5).setVisible(false);
            detailsViewElements.push(totalPercent);
            modalElements.push(totalPercent);
            
            // Show warning if saved value doesn't match recalculated value
            if (Math.abs(run.final_value - actualFinalValue) > 1000) {
                const warningText = this.add.text(450, yPos + 25, '⚠ Note: Values recalculated from historical data', {
                    fontSize: '11px',
                    color: '#ff9900',
                    fontStyle: 'italic'
                }).setOrigin(0.5).setVisible(false);
                detailsViewElements.push(warningText);
                modalElements.push(warningText);
            }
        }
        
        // Back button (details view)
        const backBtn = this.add.rectangle(450, 495, 100, 35, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true })
            .setVisible(false);
        detailsViewElements.push(backBtn);
        modalElements.push(backBtn);
            
        const backText = this.add.text(450, 495, 'BACK', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5).setVisible(false);
        detailsViewElements.push(backText);
        modalElements.push(backText);
        
        backBtn
            .on('pointerover', () => {
                backBtn.setStrokeStyle(2, 0x00ffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backBtn.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                showMainView();
            });
            
        // Show main view by default
        showMainView();
    }
    
    refreshCryptoRows() {
        // Update price displays for all cryptos
        Object.keys(GAME_CONFIG.cryptos).forEach(symbol => {
            if (this[`${symbol}_priceText`] && this.currentPrices && this.currentPrices[symbol]) {
                const displayPrice = this.currentPrices[symbol];
                                    this[`${symbol}_priceText`].setText(`$${displayPrice.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`);
            }
        });
    }
    
    shutdown() {
        // Clean up when leaving dashboard
        // Clear all groups with error handling
        if (this.tabGroup && this.tabGroup.children && this.tabGroup.children.size !== undefined) {
            try {
                this.tabGroup.clear(true, true);
            } catch (e) {
                console.warn('Error clearing tabGroup in shutdown:', e);
            }
            this.tabGroup = null;
        }
        if (this.contentGroup && this.contentGroup.children && this.contentGroup.children.size !== undefined) {
            try {
                this.contentGroup.clear(true, true);
            } catch (e) {
                console.warn('Error clearing contentGroup in shutdown:', e);
            }
            this.contentGroup = null;
        }
        if (this.pageDisplayGroup && this.pageDisplayGroup.children && this.pageDisplayGroup.children.size !== undefined) {
            try {
                this.pageDisplayGroup.clear(true, true);
            } catch (e) {
                console.warn('Error clearing pageDisplayGroup in shutdown:', e);
            }
            this.pageDisplayGroup = null;
        }
        
        // Clear sign out button
        if (this.signOutButton) {
            this.signOutButton.destroy();
            this.signOutButton = null;
        }
        
        // Reset state
        this.currentPage = 0;
        this.allGames = [];
    }
} 