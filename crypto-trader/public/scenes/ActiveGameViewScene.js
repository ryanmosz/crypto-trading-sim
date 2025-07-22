// Import dependencies
import { Auth } from '../auth.js';
import { getGameParticipants } from '../services/nowGameApi.js';
import { calculateTimeRemaining, formatTimeRemaining, getTimeRemainingColor } from '../utils/countdown.js';
import { formatGameCode } from '../utils/slug.js';

// Active Game View Scene
export default class ActiveGameViewScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ActiveGameViewScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.gameData = data.gameData;
    }
    
    async create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Initialize auth
        this.auth = new Auth();
        
        // Fetch fresh game data and latest price update time
        try {
            // Get fresh game data
            const { data: freshGameData, error } = await this.auth.supabase
                .from('active_games')
                .select('*')
                .eq('id', this.gameData.id)
                .single();
                
            if (!error && freshGameData) {
                // Update gameData with fresh data
                this.gameData = freshGameData;
            }
            
            // Get the latest price update time from price cache
            const { data: priceData, error: priceError } = await this.auth.supabase
                .from('prices_cache')
                .select('fetched_at')
                .order('fetched_at', { ascending: false })
                .limit(1)
                .single();
                
            if (!priceError && priceData) {
                // Use the actual price cache update time instead of game's last_updated
                this.gameData.last_updated = priceData.fetched_at;
            }
        } catch (err) {
            console.error('Error fetching fresh data:', err);
            // Continue with existing data if fetch fails
        }
        
        // Check if this is a multiplayer game
        if (this.gameData.is_multiplayer && this.gameData.participant_count > 1) {
            await this.showMultiplayerView();
        } else {
            this.showSinglePlayerView();
        }
    }
    
    showSinglePlayerView() {
        // View state management
        let currentView = 'main';
        const mainViewElements = [];
        const detailsViewElements = [];
        
        // Function to show main view
        const showMainView = () => {
            detailsViewElements.forEach(el => el.setVisible(false));
            mainViewElements.forEach(el => el.setVisible(true));
            currentView = 'main';
        };
        
        // Function to show details view
        const showDetailsView = () => {
            mainViewElements.forEach(el => el.setVisible(false));
            detailsViewElements.forEach(el => el.setVisible(true));
            currentView = 'details';
        };
        
        // ===== SHARED HEADER =====
        this.add.text(450, 40, 'ACTIVE GAME', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // ===== MAIN VIEW CONTENT =====
        // Game info
        const daysRemaining = Math.ceil((new Date(this.gameData.ends_at) - new Date()) / (1000 * 60 * 60 * 24));
        const startedDate = new Date(this.gameData.started_at).toLocaleDateString();
        const endsDate = new Date(this.gameData.ends_at).toLocaleDateString();
        
        // Time remaining with color coding
        const timeColor = daysRemaining <= 7 ? '#ff1493' : 
                         daysRemaining <= 14 ? '#ffff00' : '#00ff00';
        
        // Create a container to hold both text parts centered
        const challengeContainer = this.add.container(450, 90);
        
        // First part (white)
        const challengePart1 = this.add.text(0, 0, `${this.gameData.duration_days}-Day Challenge / `, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Second part with color
        const challengePart2 = this.add.text(challengePart1.width, 0, `${daysRemaining} days remaining`, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: timeColor
        }).setOrigin(0, 0.5);
        
        // Add both to container
        challengeContainer.add([challengePart1, challengePart2]);
        
        // Center the container by offsetting it
        const totalWidth = challengePart1.width + challengePart2.width;
        challengeContainer.x = 450 - totalWidth / 2;
        
        mainViewElements.push(challengeContainer);
        
        // Calculate minutes ago for prices update
        let pricesText = '';
        if (this.gameData.last_updated) {
            const lastUpdated = new Date(this.gameData.last_updated);
            const minutesAgo = Math.floor((new Date() - lastUpdated) / 60000);
            pricesText = ` | Prices updated ${minutesAgo} minutes ago`;
        }
        
        const datesText = this.add.text(450, 120, `Started: ${startedDate} | Ends: ${endsDate}${pricesText}`, {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(datesText);
        
        // Performance summary
        const startValue = this.gameData.starting_money || 10000000;
        const currentValue = this.gameData.current_value || startValue;
        const profit = currentValue - startValue;
        const profitPercent = (profit / startValue) * 100;
        const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
        
        // Current value
        const currentLabel = this.add.text(450, 170, 'Current Portfolio Value', {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        mainViewElements.push(currentLabel);
        
                        const currentValueText = this.add.text(450, 200, `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '36px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0.5);
                mainViewElements.push(currentValueText);
        
        const profitPercentText = this.add.text(450, 240, `${profit >= 0 ? '+' : ''}${profitPercent.toFixed(2)}%`, {
            fontSize: '28px',
            fontFamily: 'Arial Black',
            color: profitColor
        }).setOrigin(0.5);
        mainViewElements.push(profitPercentText);
        
        // Quick allocation summary on main view
        const allocLabel = this.add.text(450, 290, 'Portfolio:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(allocLabel);
        
        let yPos = 330;
        const allocations = this.gameData.allocations;
        const currentPrices = this.gameData.current_prices || this.gameData.starting_prices;
        
        // Show just crypto names and percentages on main view
        Object.entries(allocations).forEach(([crypto, amount]) => {
            if (amount > 0) {
                const allocText = this.add.text(450, yPos, `${crypto}: ${amount * 10}%`, {
                    fontSize: '18px',
                    color: '#00ffff'
                }).setOrigin(0.5);
                mainViewElements.push(allocText);
                yPos += 25;
            }
        });
        
        // Buttons for main view - keep at same position
        const mainButtonY = 480;
        
        // Details button
        const detailsBtn = this.add.rectangle(350, mainButtonY, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x00ffff)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(detailsBtn);
            
        const detailsBtnText = this.add.text(350, mainButtonY, 'DETAILS', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        mainViewElements.push(detailsBtnText);
        
        detailsBtn
            .on('pointerover', () => {
                detailsBtn.setFillStyle(0x00ffff);
                detailsBtnText.setColor('#000000');
            })
            .on('pointerout', () => {
                detailsBtn.setFillStyle(0x333333);
                detailsBtnText.setColor('#00ffff');
            })
            .on('pointerdown', () => {
                showDetailsView();
            });
        
        // Back button for main view
        const backButton = this.add.rectangle(550, mainButtonY, 120, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
        mainViewElements.push(backButton);
            
        const backText = this.add.text(550, mainButtonY, 'BACK', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        mainViewElements.push(backText);
        
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
                this.scene.start('DashboardScene', { user: this.user });
            });
        
        // ===== DETAILS VIEW CONTENT =====
        const detailsTitle = this.add.text(450, 90, 'Detailed Portfolio Analysis', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(detailsTitle);
        
        // Detailed allocations breakdown with prices
        const detailsAllocLabel = this.add.text(450, 130, 'Holdings & Performance:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(detailsAllocLabel);
        
        // Column headers
        const colHeaders = [
            { text: 'Crypto', x: 100 },
            { text: 'Invested', x: 220 },
            { text: 'Coins', x: 340 },
            { text: 'Start Price', x: 440 },
            { text: 'Current Price', x: 560 },
            { text: 'Value', x: 680 },
            { text: 'Gain/Loss', x: 780 }
        ];
        
        colHeaders.forEach(header => {
            const headerText = this.add.text(header.x, 160, header.text, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(headerText);
        });
        
        let detailsYPos = 190;
        const startingPrices = this.gameData.starting_prices;
        
        Object.entries(allocations).forEach(([crypto, amount]) => {
            if (amount > 0) {
                const invested = amount * 1000000;
                const startPrice = startingPrices[crypto];
                const currentPrice = currentPrices[crypto];
                const coins = invested / startPrice;
                const currentCryptoValue = coins * currentPrice;
                const cryptoProfit = currentCryptoValue - invested;
                const cryptoProfitPercent = (cryptoProfit / invested) * 100;
                const cryptoProfitColor = cryptoProfit >= 0 ? '#00ff00' : '#ff0066';
                
                // Crypto name
                const cryptoName = this.add.text(100, detailsYPos, crypto, {
                    fontSize: '16px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0.5);
                detailsViewElements.push(cryptoName);
                
                // Original investment
                const investedText = this.add.text(220, detailsYPos, `$${invested.toLocaleString()}`, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                detailsViewElements.push(investedText);
                
                // Number of coins
                const coinsText = this.add.text(340, detailsYPos, coins.toFixed(2), {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                detailsViewElements.push(coinsText);
                
                // Starting price
                const startPriceText = this.add.text(440, detailsYPos, `$${Number(startPrice).toFixed(2)}`, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                detailsViewElements.push(startPriceText);
                
                // Current price
                const currentPriceText = this.add.text(560, detailsYPos, `$${Number(currentPrice).toFixed(2)}`, {
                    fontSize: '14px',
                    color: '#00ffff'
                }).setOrigin(0.5);
                detailsViewElements.push(currentPriceText);
                
                // Current value
                const valueText = this.add.text(680, detailsYPos, `$${currentCryptoValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                detailsViewElements.push(valueText);
                
                // Profit/Loss
                const profitText = this.add.text(780, detailsYPos, `${cryptoProfitPercent >= 0 ? '+' : ''}${cryptoProfitPercent.toFixed(1)}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: cryptoProfitColor
                }).setOrigin(0.5);
                detailsViewElements.push(profitText);
                
                detailsYPos += 25;
            }
        });
        
        // Cash if any
        const totalInvested = Object.values(allocations).reduce((sum, val) => sum + (val * 1000000), 0);
        const cash = 10000000 - totalInvested;
        if (cash > 0) {
            const cashName = this.add.text(100, detailsYPos, 'Cash', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashName);
            
            const cashAmount = this.add.text(220, detailsYPos, `$${cash.toLocaleString()}`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashAmount);
            
            const cashValue = this.add.text(680, detailsYPos, `$${cash.toLocaleString()}`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashValue);
            
            const cashProfit = this.add.text(780, detailsYPos, '+0.0%', {
                fontSize: '14px',
                fontFamily: 'Arial Black',
                color: '#666666'
            }).setOrigin(0.5);
            detailsViewElements.push(cashProfit);
            
            detailsYPos += 25;
        }
        
        // Performance History Chart
        this.createPerformanceChart(detailsYPos + 30, detailsViewElements);
        
        // Back to main button for details view
        const detailsBackBtn = this.add.rectangle(450, 530, 200, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
        detailsViewElements.push(detailsBackBtn);
            
        const detailsBackText = this.add.text(450, 530, 'BACK TO SUMMARY', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(detailsBackText);
        
        detailsBackBtn
            .on('pointerover', () => {
                detailsBackBtn.setStrokeStyle(2, 0x00ffff);
                detailsBackText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                detailsBackBtn.setStrokeStyle(2, 0x666666);
                detailsBackText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                showMainView();
            });
        
        // Initially hide details view
        detailsViewElements.forEach(el => el.setVisible(false));
    }
    
    async showMultiplayerView() {
        // Clean the game code - remove any spaces
        const cleanGameCode = this.gameData.game_code ? this.gameData.game_code.replace(/\s/g, '') : '';
        
        // Title at x=450, y=120 - move it up
        const titleText = cleanGameCode + ' - Multiplayer Leaderboard';
        this.add.text(450, 100, titleText, {
            fontSize: '28px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Countdown timer at y=130 - separated from title
        const timeRemaining = calculateTimeRemaining(this.gameData.created_at, this.gameData.duration_days || 30);
        const timeColor = getTimeRemainingColor(timeRemaining.totalSeconds, this.gameData.duration_days || 30);
        
        // Show "LEADERBOARD" text with countdown below it
        this.add.text(450, 140, 'LEADERBOARD', {
            fontSize: '36px',
            color: '#ffff00',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        this.countdownText = this.add.text(450, 175, formatTimeRemaining(timeRemaining), {
            fontSize: '18px',
            color: timeColor,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Start countdown timer
        this.countdownTimer = this.time.addEvent({
            delay: 1000,
            callback: () => {
                const newTimeRemaining = calculateTimeRemaining(this.gameData.created_at, this.gameData.duration_days || 30);
                const newTimeColor = getTimeRemainingColor(newTimeRemaining.totalSeconds, this.gameData.duration_days || 30);
                this.countdownText.setText(formatTimeRemaining(newTimeRemaining));
                this.countdownText.setColor(newTimeColor);
            },
            loop: true
        });
        
        // Column headers - push to edges
        const headerY = 220;
        const lineY = headerY + 20;
        
        // Headers pushed to edges
        this.add.text(100, headerY, 'Rank', {
            fontSize: '18px',
            color: '#999999',
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        
        this.add.text(250, headerY, 'Player', {
            fontSize: '18px',
            color: '#999999',
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        
        this.add.text(550, headerY, 'Value', {
            fontSize: '18px',
            color: '#999999',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        this.add.text(750, headerY, 'Profit/Loss', {
            fontSize: '18px',
            color: '#999999',
            fontFamily: 'Arial Black'
        }).setOrigin(1, 0.5);
        
        // Horizontal line
        this.add.rectangle(450, lineY, 700, 2, 0x333333);
        
        // Get participants
        const participants = await getGameParticipants(this.gameData.id);
        if (!participants || participants.length === 0) {
            this.add.text(450, 300, 'No participants yet', {
                fontSize: '20px',
                color: '#666666'
            }).setOrigin(0.5);
            return;
        }
        
        // Display participants
        let yPos = lineY + 30;
        const startValue = this.gameData.starting_money || 10000000;
        
        participants.forEach((participant, index) => {
            const rank = index + 1;
            const profit = participant.current_value - startValue;
            const profitPercent = (profit / startValue) * 100;
            const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
            const isCurrentUser = participant.user_id === this.user.id;
            
            // Highlight current user's row
            if (isCurrentUser) {
                const highlight = this.add.rectangle(450, yPos, 700, 35, 0x00ffff, 0.1)
                    .setStrokeStyle(2, 0x00ffff);
            }
            
            // Rank with medal for top 3 - far left
            let rankDisplay = rank.toString();
            
            this.add.text(100, yPos, rankDisplay, {
                fontSize: '20px',
                color: '#ffffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            
            // Player name - left aligned
            const displayName = isCurrentUser ? 'You' : (participant.username || 'Anonymous');
            const nameText = this.add.text(250, yPos, displayName, {
                fontSize: '18px',
                color: isCurrentUser ? '#00ffff' : '#ffffff',
                fontFamily: isCurrentUser ? 'Arial Black' : 'Arial'
            }).setOrigin(0, 0.5);
            
            // Make clickable
            if (!isCurrentUser) {
                nameText.setInteractive({ useHandCursor: true })
                    .on('pointerover', () => nameText.setColor('#ffff00'))
                    .on('pointerout', () => nameText.setColor('#ffffff'))
                    .on('pointerdown', () => this.showPlayerDetails(participant));
            } else {
                nameText.setInteractive({ useHandCursor: true })
                    .on('pointerdown', () => this.showPlayerDetails(participant));
            }
            
            // Current value - centered with breathing room
            this.add.text(550, yPos, `$${participant.current_value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                fontSize: '18px',
                color: '#ffffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0.5);
            
            // Profit/Loss percentage - far right
            this.add.text(750, yPos, `${profitPercent >= 0 ? '+' : ''}${profitPercent.toFixed(1)}%`, {
                fontSize: '18px',
                color: profitColor,
                fontFamily: 'Arial Black'
            }).setOrigin(1, 0.5);
            
            yPos += 40;
        });
        
        // Player count
        this.add.text(450, yPos + 20, `${participants.length} players competing`, {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Back button
        const backButton = this.add.rectangle(450, 500, 200, 40, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(450, 500, 'BACK', {
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
                this.scene.start('DashboardScene', { user: this.user });
            });
        
        // Update info
        this.add.text(450, 530, 'Updates every minute', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Set up auto-refresh
        this.time.addEvent({
            delay: 60000, // 1 minute
            callback: () => {
                this.scene.restart();
            },
            loop: true
        });
    }
    
    async showPlayerDetails(participant) {
        // Store player details for chart generation
        this.playerDetails = participant;
        
        // Clear current display
        this.children.removeAll();
        
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Back button
        const backButton = this.add.text(50, 50, '← Back', {
            fontSize: '18px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', () => backButton.setColor('#ffffff'))
        .on('pointerout', () => backButton.setColor('#00ffff'))
        .on('pointerdown', () => {
            // Restart scene to go back to leaderboard
            this.scene.restart();
        });
        
        // Header
        const isCurrentUser = participant.user_id === this.user.id;
        const playerName = isCurrentUser ? 'YOUR PORTFOLIO' : 
            `${(participant.username || 'PLAYER').toUpperCase()}'S PORTFOLIO`;
            
        this.add.text(450, 40, playerName, {
            fontSize: '36px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Game info
        const gameCode = formatGameCode(this.gameData.game_code);
        const timeRemaining = calculateTimeRemaining(this.gameData.created_at, this.gameData.duration_days || 30);
        const timeColor = getTimeRemainingColor(timeRemaining.totalSeconds, this.gameData.duration_days || 30);
        
        this.add.text(450, 90, `Game ${gameCode} • ${this.gameData.duration_days}-Day Challenge`, {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        this.add.text(450, 120, formatTimeRemaining(timeRemaining), {
            fontSize: '18px',
            color: timeColor,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Performance summary box
        const summaryBg = this.add.rectangle(450, 200, 700, 100, 0x111111)
            .setStrokeStyle(2, 0x00ffff);
            
        const currentValue = participant.current_value || this.gameData.starting_money;
        const startValue = this.gameData.starting_money || 10000000;
        const profit = currentValue - startValue;
        const profitPercent = ((profit / startValue) * 100).toFixed(2);
        const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
        
        // Current value label
        this.add.text(300, 180, 'CURRENT VALUE', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        
        this.add.text(300, 205, `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
            fontSize: '28px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Profit/Loss label
        this.add.text(600, 180, profit >= 0 ? 'PROFIT' : 'LOSS', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0.5);
        
        this.add.text(600, 205, `${profit >= 0 ? '+' : ''}${profitPercent}%`, {
            fontSize: '28px',
            color: profitColor,
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Get rank
        let rank = 1;
        let totalPlayers = 1;
        try {
            const { data: allParticipants } = await this.auth.supabase
                .from('game_participants')
                .select('user_id, current_value')
                .eq('game_id', this.gameData.id)
                .order('current_value', { ascending: false });
                
            if (allParticipants) {
                totalPlayers = allParticipants.length;
                rank = allParticipants.findIndex(p => p.user_id === participant.user_id) + 1;
            }
        } catch (err) {
            console.error('Error fetching rank:', err);
        }
        
        // Rank display
        let rankDisplay = `RANK ${rank} OF ${totalPlayers}`;
        if (rank === 1) rankDisplay = '🥇 1ST PLACE';
        else if (rank === 2) rankDisplay = '🥈 2ND PLACE';
        else if (rank === 3) rankDisplay = '🥉 3RD PLACE';
        
        this.add.text(450, 235, rankDisplay, {
            fontSize: '16px',
            color: rank <= 3 ? '#ffd700' : '#999999',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Allocations section
        this.add.text(450, 290, 'PORTFOLIO ALLOCATION', {
            fontSize: '20px',
            color: '#ffff00',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Allocation headers
        this.add.text(200, 320, 'CRYPTO', {
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Arial Black'
        }).setOrigin(0, 0.5);
        
        this.add.text(350, 320, 'ALLOCATION', {
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        this.add.text(500, 320, 'VALUE', {
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        this.add.text(650, 320, 'CHANGE', {
            fontSize: '14px',
            color: '#666666',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Draw allocation rows
        const allocations = participant.allocations || {};
        let yPos = 350;
        
        // Get current prices from the game data
        const currentPrices = this.gameData.current_prices || this.gameData.starting_prices;
        const startingPrices = this.gameData.starting_prices;
        
        Object.entries(allocations).forEach(([crypto, allocation]) => {
            if (allocation > 0) {
                // Calculate values
                const cryptoValue = (currentValue * allocation) / 100;
                const startPrice = startingPrices[crypto] || 1;
                const currentPrice = currentPrices[crypto] || startPrice;
                const priceChange = ((currentPrice - startPrice) / startPrice) * 100;
                const changeColor = priceChange >= 0 ? '#00ff00' : '#ff0066';
                
                // Row background
                const rowBg = this.add.rectangle(450, yPos, 700, 35, 0x111111, 0.3);
                
                // Crypto name
                this.add.text(200, yPos, crypto, {
                    fontSize: '20px',
                    color: '#00ffff',
                    fontFamily: 'Arial Black'
                }).setOrigin(0, 0.5);
                
                // Allocation percentage
                this.add.text(350, yPos, `${allocation}%`, {
                    fontSize: '18px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Current value
                this.add.text(500, yPos, `$${cryptoValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontFamily: 'Arial Black'
                }).setOrigin(0.5);
                
                // Price change
                this.add.text(650, yPos, `${priceChange >= 0 ? '+' : ''}${priceChange.toFixed(1)}%`, {
                    fontSize: '18px',
                    color: changeColor,
                    fontFamily: 'Arial Black'
                }).setOrigin(0.5);
                
                yPos += 40;
            }
        });
        
        // Add performance chart after allocations
        this.createPerformanceChart(yPos + 20);
        
        // Last updated info - move down to make room for chart
        if (this.gameData.last_updated) {
            const lastUpdated = new Date(this.gameData.last_updated);
            const now = new Date();
            const minutesAgo = Math.floor((now - lastUpdated) / 60000);
            
            this.add.text(450, 570, `Prices updated ${minutesAgo} minute${minutesAgo !== 1 ? 's' : ''} ago`, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
        }
    }
    
    createPerformanceChart(startY) {
        // Chart title
        this.add.text(450, startY, 'Performance Trend', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Chart area
        const chartX = 200;
        const chartY = startY + 30;
        const chartWidth = 500;
        const chartHeight = 80;
        
        // Chart background
        this.add.rectangle(chartX + chartWidth/2, chartY + chartHeight/2, chartWidth, chartHeight, 0x111111)
            .setStrokeStyle(1, 0x333333);
        
        // Generate sample data points (in real app, this would come from price_history table)
        const dataPoints = this.generateSampleData();
        
        // Draw the line chart
        const graphics = this.add.graphics();
        graphics.lineStyle(2, 0x00ffff);
        
        // Scale the data to fit the chart
        const minValue = Math.min(...dataPoints);
        const maxValue = Math.max(...dataPoints);
        const valueRange = maxValue - minValue || 1;
        
        // Draw the line
        graphics.beginPath();
        dataPoints.forEach((value, index) => {
            const x = chartX + (index / (dataPoints.length - 1)) * chartWidth;
            const y = chartY + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
            
            // Add dots at data points
            graphics.fillStyle(0x00ffff);
            graphics.fillCircle(x, y, 3);
        });
        graphics.strokePath();
        
        // Add value labels
        const startValue = dataPoints[0];
        const endValue = dataPoints[dataPoints.length - 1];
        const percentChange = ((endValue - startValue) / startValue) * 100;
        const changeColor = percentChange >= 0 ? '#00ff00' : '#ff0066';
        
        // Start value
        this.add.text(chartX - 10, chartY + chartHeight/2, `$${(startValue/1000000).toFixed(1)}M`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 0.5);
        
        // End value
        this.add.text(chartX + chartWidth + 10, chartY + chartHeight/2, `$${(endValue/1000000).toFixed(1)}M`, {
            fontSize: '12px',
            color: changeColor
        }).setOrigin(0, 0.5);
        
        // Performance indicator
        this.add.text(450, chartY + chartHeight + 15, `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}% since start`, {
            fontSize: '14px',
            color: changeColor
        }).setOrigin(0.5);
    }
    
    generateSampleData() {
        // Generate sample performance data
        // In real app, this would fetch from price_history table
        const startValue = this.gameData.starting_money || 10000000;
        const currentValue = this.playerDetails?.current_value || this.gameData.current_value || startValue;
        const numPoints = 10;
        const data = [startValue];
        
        // Generate smooth curve towards current value
        for (let i = 1; i < numPoints - 1; i++) {
            const progress = i / (numPoints - 1);
            const noise = (Math.random() - 0.5) * 0.1; // ±5% variation
            const value = startValue + (currentValue - startValue) * progress * (1 + noise);
            data.push(value);
        }
        data.push(currentValue);
        
        return data;
    }
} 