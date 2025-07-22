// Import dependencies
import { Auth } from '../auth.js';
import { getGameParticipants } from '../services/nowGameApi.js';

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
        // Title
        this.add.text(450, 40, 'MULTIPLAYER GAME', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        // Game code
        if (this.gameData.game_code) {
            const codeText = this.gameData.game_code.slice(0, 2) + ' ' + this.gameData.game_code.slice(2);
            this.add.text(450, 85, `Code: ${codeText}`, {
                fontSize: '28px',
                fontFamily: 'Arial Black',
                color: '#00ffff'
            }).setOrigin(0.5);
        }
        
        // Game info
        const daysRemaining = Math.ceil((new Date(this.gameData.ends_at) - new Date()) / (1000 * 60 * 60 * 24));
        const timeColor = daysRemaining <= 7 ? '#ff1493' : 
                         daysRemaining <= 14 ? '#ffff00' : '#00ff00';
        
        this.add.text(450, 120, `${this.gameData.duration_days}-Day Challenge | ${daysRemaining} days remaining`, {
            fontSize: '20px',
            color: timeColor
        }).setOrigin(0.5);
        
        // Loading indicator
        const loadingText = this.add.text(450, 300, 'Loading leaderboard...', {
            fontSize: '20px',
            color: '#666666'
        }).setOrigin(0.5);
        
        try {
            // Get all participants
            const participants = await getGameParticipants(this.gameData.id);
            
            // Hide loading text
            loadingText.destroy();
            
            // Sort by current value (highest first)
            participants.sort((a, b) => b.current_value - a.current_value);
            
            // Leaderboard title
            this.add.text(450, 170, '🏆 LEADERBOARD', {
                fontSize: '24px',
                fontFamily: 'Arial Black',
                color: '#ffff00'
            }).setOrigin(0.5);
            
            // Headers
            this.add.text(100, 210, 'Rank', {
                fontSize: '16px',
                color: '#999999',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            
            this.add.text(200, 210, 'Player', {
                fontSize: '16px',
                color: '#999999',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            
            this.add.text(500, 210, 'Value', {
                fontSize: '16px',
                color: '#999999',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            
            this.add.text(650, 210, 'Profit/Loss', {
                fontSize: '16px',
                color: '#999999',
                fontFamily: 'Arial Black'
            }).setOrigin(0, 0.5);
            
            this.add.text(800, 210, 'Alloc', {
                fontSize: '16px',
                color: '#999999',
                fontFamily: 'Arial Black'
            }).setOrigin(1, 0.5);
            
            // Draw header line
            this.add.rectangle(450, 230, 750, 2, 0x333333);
            
            // Display participants
            let yPos = 250;
            participants.forEach((participant, index) => {
                const rank = index + 1;
                const value = participant.current_value || 10000000;
                const startValue = participant.starting_value || 10000000;
                const profit = value - startValue;
                const profitPercent = (profit / startValue * 100).toFixed(2);
                const isCurrentUser = participant.user_id === this.user.id;
                
                // Highlight current user
                if (isCurrentUser) {
                    this.add.rectangle(450, yPos, 750, 40, 0x111111);
                    this.add.rectangle(450, yPos, 750, 40)
                        .setStrokeStyle(2, 0x00ffff);
                }
                
                // Rank with medal for top 3
                let rankDisplay = rank.toString();
                if (rank === 1) rankDisplay = '🥇';
                else if (rank === 2) rankDisplay = '🥈';
                else if (rank === 3) rankDisplay = '🥉';
                
                this.add.text(100, yPos, rankDisplay, {
                    fontSize: rank <= 3 ? '24px' : '18px',
                    color: '#ffffff',
                    fontFamily: 'Arial Black'
                }).setOrigin(0, 0.5);
                
                // Player name (email or "You")
                const playerName = isCurrentUser ? 'You' : 
                    (participant.username || 'Player ' + (index + 1));
                    
                this.add.text(200, yPos, playerName, {
                    fontSize: '18px',
                    color: isCurrentUser ? '#00ffff' : '#ffffff',
                    fontFamily: isCurrentUser ? 'Arial Black' : 'Arial'
                }).setOrigin(0, 0.5);
                
                // Current value
                this.add.text(500, yPos, `$${(value / 1000000).toFixed(2)}M`, {
                    fontSize: '18px',
                    color: '#ffffff',
                    fontFamily: 'Arial Black'
                }).setOrigin(0, 0.5);
                
                // Profit/Loss
                const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
                const profitSign = profit >= 0 ? '+' : '';
                
                this.add.text(650, yPos, `${profitSign}${profitPercent}%`, {
                    fontSize: '18px',
                    color: profitColor,
                    fontFamily: 'Arial Black'
                }).setOrigin(0, 0.5);
                
                // Allocations (compact)
                const allocText = Object.entries(participant.allocations || {})
                    .filter(([_, value]) => value > 0)
                    .map(([crypto, value]) => `${crypto}:${value}`)
                    .join(' ');
                    
                this.add.text(800, yPos, allocText, {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(1, 0.5);
                
                yPos += 45;
            });
            
            // Show participant count
            this.add.text(450, yPos + 20, `${participants.length} player${participants.length !== 1 ? 's' : ''} competing`, {
                fontSize: '16px',
                color: '#666666'
            }).setOrigin(0.5);
            
            // Auto-refresh notice
            this.add.text(450, 540, 'Updates every minute', {
                fontSize: '14px',
                color: '#444444'
            }).setOrigin(0.5);
            
            // Refresh timer
            this.time.addEvent({
                delay: 60000, // 60 seconds
                callback: () => {
                    this.scene.restart({ user: this.user, gameData: this.gameData });
                },
                loop: true
            });
            
        } catch (error) {
            console.error('Error loading participants:', error);
            loadingText.setText('Error loading leaderboard');
            loadingText.setColor('#ff0000');
        }
        
        // Back button
        const backBtn = this.add.rectangle(450, 500, 200, 50, 0x333333)
            .setStrokeStyle(2, 0x666666)
            .setInteractive({ useHandCursor: true });
            
        const backText = this.add.text(450, 500, 'BACK', {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        backBtn
            .on('pointerover', () => {
                backBtn.setStrokeStyle(2, 0xffffff);
                backText.setColor('#00ffff');
            })
            .on('pointerout', () => {
                backBtn.setStrokeStyle(2, 0x666666);
                backText.setColor('#ffffff');
            })
            .on('pointerdown', () => {
                this.scene.start('DashboardScene', { user: this.user });
            });
    }
    
    showPortfolioDetail(participantData) {
        // Clear the scene
        this.children.removeAll();
        
        // Show detailed portfolio view for multiplayer participant
        this.add.text(450, 50, 'MY PORTFOLIO', {
            fontSize: '32px',
            color: '#00ffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Add more details about the participant's portfolio
        // ...
    }
    
    createPerformanceChart(startY, detailsViewElements) {
        // Chart title
        const chartTitle = this.add.text(450, startY, 'Performance Trend', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        detailsViewElements.push(chartTitle);
        
        // Chart area
        const chartX = 200;
        const chartY = startY + 30;
        const chartWidth = 500;
        const chartHeight = 100;
        
        // Chart background
        const chartBg = this.add.rectangle(chartX + chartWidth/2, chartY + chartHeight/2, chartWidth, chartHeight, 0x111111)
            .setStrokeStyle(1, 0x333333);
        detailsViewElements.push(chartBg);
        
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
        
        detailsViewElements.push(graphics);
        
        // Add axis labels
        const startDateTime = new Date(this.gameData.started_at);
        const startDate = startDateTime.toLocaleDateString();
        const startTime = startDateTime.toLocaleTimeString();
        const startLabel = this.add.text(chartX, chartY + chartHeight + 10, `Start: ${startDate} ${startTime}`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(0, 0);
        detailsViewElements.push(startLabel);
        
        const endLabel = this.add.text(chartX + chartWidth, chartY + chartHeight + 10, 'Now', {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 0);
        detailsViewElements.push(endLabel);
        
        // Value labels
        const maxLabel = this.add.text(chartX - 10, chartY, `$${maxValue.toLocaleString()}`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 0);
        detailsViewElements.push(maxLabel);
        
        const minLabel = this.add.text(chartX - 10, chartY + chartHeight, `$${minValue.toLocaleString()}`, {
            fontSize: '12px',
            color: '#666666'
        }).setOrigin(1, 1);
        detailsViewElements.push(minLabel);
    }
    
    generateSampleData() {
        // Generate sample performance data
        // In real app, this would fetch from price_history table
        const startValue = this.gameData.starting_money || 10000000;
        const currentValue = this.gameData.current_value || startValue;
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