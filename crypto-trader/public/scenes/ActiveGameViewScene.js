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
        
        // Restore view state if provided
        this.viewState = data.viewState || { view: 'leaderboard', playerId: null };
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
                const startPriceText = this.add.text(440, detailsYPos, `$${Number(startPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                detailsViewElements.push(startPriceText);
                
                // Current price
                const currentPriceText = this.add.text(560, detailsYPos, `$${Number(currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
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
        // Check if we should restore to details view
        if (this.viewState.view === 'details' && this.viewState.playerId) {
            // Fetch the participant data first
            const participants = await getGameParticipants(this.gameData.id);
            const participant = participants.find(p => p.user_id === this.viewState.playerId);
            if (participant) {
                // Show details view directly
                await this.showPlayerDetails(participant);
                return;
            }
        }
        
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
        // Use ends_at for accurate countdown (works for both regular and 6-minute games)
        const timeRemaining = calculateTimeRemainingFromEndDate(this.gameData.ends_at);
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
                const newTimeRemaining = calculateTimeRemainingFromEndDate(this.gameData.ends_at);
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
        const startingPrices = this.gameData.starting_prices;
        const currentPrices = this.gameData.current_prices || startingPrices;
        
        participants.forEach((participant, index) => {
            const rank = index + 1;
            
            // Use database value directly (now that it's fixed)
            const currentValue = parseFloat(participant.current_value);
            const profit = currentValue - startValue;
            const profitPercent = (profit / startValue) * 100;
            const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
            const isCurrentUser = participant.user_id === this.user.id;
            
            // Create invisible clickable area for entire row
            const rowHitArea = this.add.rectangle(450, yPos, 700, 35, 0x000000, 0)
                .setInteractive({ useHandCursor: true });
            
            // Highlight current user's row
            let rowHighlight = null;
            if (isCurrentUser) {
                rowHighlight = this.add.rectangle(450, yPos, 700, 35, 0x00ffff, 0.1)
                    .setStrokeStyle(2, 0x00ffff);
            }
            
            // Hover highlight for non-current users
            let hoverHighlight = null;
            if (!isCurrentUser) {
                hoverHighlight = this.add.rectangle(450, yPos, 700, 35, 0xffffff, 0)
                    .setVisible(false);
            }
            
            // Rank with medal for top 3 - far left
            let rankDisplay = rank.toString();
            
            this.add.text(100, yPos, rankDisplay, {
                fontSize: '20px',
                color: '#ffffff',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            
            // Player name - always show username, not "You"
            const displayName = participant.username || 'Anonymous';
            const nameColor = isCurrentUser ? '#00ffff' : '#ffffff';
            const nameWeight = isCurrentUser ? 'bold' : 'normal';
            const nameText = this.add.text(250, yPos, displayName, {
                fontSize: '16px',
                color: nameColor,
                fontFamily: 'Arial Black',
                fontStyle: nameWeight
            }).setOrigin(0, 0.5);
            
            // Current value - centered with breathing room
            this.add.text(550, yPos, `$${currentValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
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
            
            // Row interaction - apply to entire row hit area
            rowHitArea
                .on('pointerover', () => {
                    if (!isCurrentUser) {
                        hoverHighlight.setVisible(true).setFillStyle(0xffffff, 0.05);
                        nameText.setColor('#ffff00');
                    }
                })
                .on('pointerout', () => {
                    if (!isCurrentUser) {
                        hoverHighlight.setVisible(false);
                        nameText.setColor('#ffffff');
                    }
                })
                .on('pointerdown', () => {
                    // Store view state
                    this.viewState = { view: 'details', playerId: participant.user_id };
                    this.showPlayerDetails(participant);
                });
            
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
                // Restart scene but preserve view state
                this.scene.restart({ 
                    user: this.user, 
                    gameData: this.gameData,
                    viewState: this.viewState 
                });
            },
            loop: true
        });
    }
    
    async showPlayerDetails(participant) {
        // Clear current display
        this.children.removeAll();
        
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // ACTIVE GAME title in cyan - exactly like the screenshot
        this.add.text(450, 40, 'ACTIVE GAME', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Add game code and username
        const cleanCode = this.gameData.game_code ? this.gameData.game_code.replace(/\s/g, '') : '';
        this.add.text(450, 85, `Game: ${cleanCode} - ${participant.username || 'Anonymous'}`, {
            fontSize: '20px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Holdings & Performance label
        this.add.text(450, 120, 'Holdings & Performance:', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Column headers - exact positions from single-player view
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
            this.add.text(header.x, 150, header.text, {
                fontSize: '14px',
                color: '#666666'
            }).setOrigin(0.5);
        });
        
        // Get data
        const allocations = participant.allocations || {};
        const startingPrices = this.gameData.starting_prices;
        const currentPrices = this.gameData.current_prices || startingPrices;
        const startValue = this.gameData.starting_money || 10000000;
        
        // Rows for each crypto
        let yPos = 180;
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
                this.add.text(100, yPos, crypto, {
                    fontSize: '16px',
                    fontFamily: 'Arial Black',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Original investment
                this.add.text(220, yPos, `$${invested.toLocaleString()}`, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Number of coins
                this.add.text(340, yPos, coins.toFixed(2), {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                // Starting price
                this.add.text(440, yPos, `$${Number(startPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
                
                // Current price
                this.add.text(560, yPos, `$${Number(currentPrice).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '14px',
                    color: '#00ffff'
                }).setOrigin(0.5);
                
                // Current value
                this.add.text(680, yPos, `$${currentCryptoValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Profit/Loss
                this.add.text(780, yPos, `${cryptoProfitPercent >= 0 ? '+' : ''}${cryptoProfitPercent.toFixed(1)}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: cryptoProfitColor
                }).setOrigin(0.5);
                
                yPos += 25;
            }
        });
        
        // Add separator line
        this.add.rectangle(450, yPos + 10, 700, 1, 0x333333);
        
        // Add total row
        yPos += 30;
        
        // Use database value directly (now that it's fixed)
        const currentTotal = parseFloat(participant.current_value);
        const totalProfit = currentTotal - startValue;
        const totalProfitPercent = (totalProfit / startValue) * 100;
        const totalProfitColor = totalProfit >= 0 ? '#00ff00' : '#ff0066';
        
        // Total label
        this.add.text(100, yPos, 'TOTAL', {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Total current value
        this.add.text(680, yPos, `$${currentTotal.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Total profit/loss percentage
        this.add.text(780, yPos, `${totalProfitPercent >= 0 ? '+' : ''}${totalProfitPercent.toFixed(1)}%`, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: totalProfitColor
        }).setOrigin(0.5);
        
        // Store player details for chart BEFORE creating it
        this.playerDetails = participant;
        
        // Performance chart exactly like the original
        this.createPerformanceChart(yPos + 50);
        
        // BACK TO SUMMARY button at bottom
        const backBg = this.add.rectangle(450, 520, 250, 50, 0x333333)
            .setInteractive({ useHandCursor: true })
            .setStrokeStyle(2, 0x666666);
            
        const backText = this.add.text(450, 520, 'BACK TO SUMMARY', {
            fontSize: '18px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backBg.on('pointerover', () => {
            backBg.setFillStyle(0x555555);
            backText.setColor('#00ffff');
        })
        .on('pointerout', () => {
            backBg.setFillStyle(0x333333);
            backText.setColor('#ffffff');
        })
        .on('pointerdown', () => {
            // Reset view state to leaderboard
            this.viewState = { view: 'leaderboard', playerId: null };
            // Restart scene to go back to leaderboard
            this.scene.restart({
                user: this.user,
                gameData: this.gameData,
                viewState: this.viewState
            });
        });
        
        // Add auto-refresh for details view
        this.time.addEvent({
            delay: 60000, // 1 minute
            callback: () => {
                // Restart scene but preserve view state
                this.scene.restart({ 
                    user: this.user, 
                    gameData: this.gameData,
                    viewState: this.viewState 
                });
            },
            loop: true
        });
    }
    
    createPerformanceChart(startY) {
        // Chart title
        this.add.text(450, startY, 'Performance Trend', {
            fontSize: '16px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Chart area
        const chartX = 200;
        const chartY = startY + 25;
        const chartWidth = 500;
        const chartHeight = 80;
        
        // Chart background
        this.add.rectangle(chartX + chartWidth/2, chartY + chartHeight/2, chartWidth, chartHeight, 0x111111)
            .setStrokeStyle(1, 0x333333);
        
        // Generate sample data points (in real app, this would come from price_history table)
        const dataPoints = this.generateSampleData();
        
        // Draw the line chart
        const graphics = this.add.graphics();
        
        // Scale the data to fit the chart
        const minValue = Math.min(...dataPoints);
        const maxValue = Math.max(...dataPoints);
        const valueRange = maxValue - minValue || 1;
        
        // Draw the line first
        graphics.lineStyle(2, 0x00ffff);
        graphics.beginPath();
        dataPoints.forEach((value, index) => {
            const x = chartX + (index / (dataPoints.length - 1)) * chartWidth;
            const y = chartY + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            
            if (index === 0) {
                graphics.moveTo(x, y);
            } else {
                graphics.lineTo(x, y);
            }
        });
        graphics.strokePath();
        
        // Then draw dots on top
        graphics.fillStyle(0x00ffff);
        dataPoints.forEach((value, index) => {
            const x = chartX + (index / (dataPoints.length - 1)) * chartWidth;
            const y = chartY + chartHeight - ((value - minValue) / valueRange) * chartHeight;
            graphics.fillCircle(x, y, 3);
        });
        
        // Add value labels
        const startValue = dataPoints[0];
        const endValue = dataPoints[dataPoints.length - 1];
        const percentChange = ((endValue - startValue) / startValue) * 100;
        const changeColor = percentChange >= 0 ? '#00ff00' : '#ff0066';
        
        // Start value
        this.add.text(chartX - 10, chartY + chartHeight/2, `$${(startValue/1000000).toFixed(1)}M`, {
            fontSize: '11px',
            color: '#666666'
        }).setOrigin(1, 0.5);
        
        // End value
        this.add.text(chartX + chartWidth + 10, chartY + chartHeight/2, `$${(endValue/1000000).toFixed(1)}M`, {
            fontSize: '11px',
            color: changeColor
        }).setOrigin(0, 0.5);
        
        // Performance indicator with start date
        const startDate = new Date(this.gameData.created_at).toLocaleDateString('en-US', { 
            month: 'short', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit' 
        });
        this.add.text(450, chartY + chartHeight + 10, `${percentChange >= 0 ? '+' : ''}${percentChange.toFixed(1)}% since start: ${startDate}`, {
            fontSize: '12px',
            color: changeColor
        }).setOrigin(0.5);
    }
    
    generateSampleData() {
        // Generate sample performance data
        // In real app, this would fetch from price_history table
        const startValue = this.gameData.starting_money || 10000000;
        // Use calculated value if available, otherwise fall back to current_value
        const currentValue = this.playerDetails?.current_value || 
                           this.gameData.current_value || 
                           startValue;
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