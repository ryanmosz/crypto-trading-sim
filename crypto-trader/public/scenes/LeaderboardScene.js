// Import dependencies
import { Auth } from '../auth.js';

// Leaderboard Scene
export default class LeaderboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LeaderboardScene' });
        this.auth = new Auth();
    }
    
    init(data) {
        this.user = data.user;
    }
    
    async create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Header
        this.add.text(450, 40, '🏆 LEADERBOARD 🏆', {
            fontSize: '36px',
            fontFamily: 'Arial Black',
            color: '#ffff00'
        }).setOrigin(0.5);
        
        // Subtitle
        this.add.text(450, 80, 'Top Traders of All Time', {
            fontSize: '18px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Loading text
        this.loadingText = this.add.text(450, 300, 'Loading leaderboard...', {
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
            .on('pointerdown', () => {
                this.scene.start('DashboardScene', { user: this.user });
            });
        
        // Load leaderboard data
        this.loadLeaderboard();
    }
    
    async loadLeaderboard() {
        try {
            const { data, error } = await this.auth.supabase
                .from('leaderboard')
                .select('*')
                .limit(10);
            
            if (error) throw error;
            
            this.loadingText.destroy();
            
            if (!data || data.length === 0) {
                this.add.text(450, 300, 'No leaderboard data yet. Play more games!', {
                    fontSize: '16px',
                    color: '#666666'
                }).setOrigin(0.5);
                return;
            }
            
            // Headers
            const headerY = 140;
            this.add.text(80, headerY, 'Rank', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            
            this.add.text(160, headerY, 'Player', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0, 0.5);
            
            this.add.text(400, headerY, 'Games', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(500, headerY, 'Win Rate', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(620, headerY, 'Avg Profit', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            this.add.text(760, headerY, 'Best Game', {
                fontSize: '16px',
                fontFamily: 'Arial Black',
                color: '#ffffff'
            }).setOrigin(0.5);
            
            // Display leaderboard entries
            let yPos = 180;
            data.forEach((entry, index) => {
                const isCurrentUser = entry.username === this.user.email;
                const bgColor = isCurrentUser ? 0x1a1a2e : 0x111111;
                const strokeColor = isCurrentUser ? 0x00ffff : 0x333333;
                
                // Background
                const bg = this.add.rectangle(450, yPos, 780, 35, bgColor)
                    .setStrokeStyle(1, strokeColor);
                
                // Rank with medals for top 3
                let rankDisplay = entry.rank.toString();
                if (entry.rank === 1) rankDisplay = '🥇';
                else if (entry.rank === 2) rankDisplay = '🥈';
                else if (entry.rank === 3) rankDisplay = '🥉';
                
                this.add.text(80, yPos, rankDisplay, {
                    fontSize: entry.rank <= 3 ? '20px' : '16px',
                    fontFamily: 'Arial Black',
                    color: entry.rank === 1 ? '#ffd700' : 
                           entry.rank === 2 ? '#c0c0c0' :
                           entry.rank === 3 ? '#cd7f32' : '#ffffff'
                }).setOrigin(0, 0.5);
                
                // Username (truncate if too long)
                let displayName = entry.username;
                if (displayName.length > 15) {
                    displayName = displayName.substring(0, 12) + '...';
                }
                if (isCurrentUser) {
                    displayName += ' (You)';
                }
                
                this.add.text(160, yPos, displayName, {
                    fontSize: '14px',
                    color: isCurrentUser ? '#00ffff' : '#ffffff'
                }).setOrigin(0, 0.5);
                
                // Games played
                this.add.text(400, yPos, entry.total_games.toString(), {
                    fontSize: '14px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                // Win rate
                const winRate = (entry.winning_games / entry.total_games * 100).toFixed(0);
                const winRateColor = winRate >= 50 ? '#00ff00' : '#ff0066';
                this.add.text(500, yPos, `${winRate}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: winRateColor
                }).setOrigin(0.5);
                
                // Average profit
                const avgProfitColor = entry.avg_profit_percent >= 0 ? '#00ff00' : '#ff0066';
                this.add.text(620, yPos, `${entry.avg_profit_percent >= 0 ? '+' : ''}${entry.avg_profit_percent}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: avgProfitColor
                }).setOrigin(0.5);
                
                // Best game
                const bestColor = entry.best_game >= 0 ? '#00ff00' : '#ff0066';
                this.add.text(760, yPos, `${entry.best_game >= 0 ? '+' : ''}${entry.best_game}%`, {
                    fontSize: '14px',
                    fontFamily: 'Arial Black',
                    color: bestColor
                }).setOrigin(0.5);
                
                yPos += 40;
            });
            
            // Your stats summary if not in top 10
            const userInTop10 = data.some(entry => entry.username === this.user.email);
            if (!userInTop10) {
                // Note: Can't query individual stats from the leaderboard view
                // because it's pre-aggregated. Would need a separate function/view.
                
                // Separator
                this.add.text(450, yPos + 20, '···', {
                    fontSize: '20px',
                    color: '#666666'
                }).setOrigin(0.5);
            }
            
        } catch (error) {
            console.error('Error loading leaderboard:', error);
            this.loadingText.setText('Error loading leaderboard');
            this.loadingText.setColor('#ff0000');
        }
    }
    
    displayLeaderboardEntry(entry, yPos, highlight = false) {
        const bgColor = highlight ? 0x1a1a2e : 0x111111;
        const strokeColor = highlight ? 0x00ffff : 0x333333;
        
        // Background
        this.add.rectangle(450, yPos, 780, 35, bgColor)
            .setStrokeStyle(2, strokeColor);
        
        // Rank
        this.add.text(80, yPos, `#${entry.rank}`, {
            fontSize: '16px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(0, 0.5);
        
        // Username
        let displayName = entry.username;
        if (displayName.length > 15) {
            displayName = displayName.substring(0, 12) + '...';
        }
        displayName += ' (You)';
        
        this.add.text(160, yPos, displayName, {
            fontSize: '14px',
            color: '#00ffff'
        }).setOrigin(0, 0.5);
        
        // Games played
        this.add.text(400, yPos, entry.total_games.toString(), {
            fontSize: '14px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Win rate
        const winRate = (entry.winning_games / entry.total_games * 100).toFixed(0);
        const winRateColor = winRate >= 50 ? '#00ff00' : '#ff0066';
        this.add.text(500, yPos, `${winRate}%`, {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: winRateColor
        }).setOrigin(0.5);
        
        // Average profit
        const avgProfitColor = entry.avg_profit_percent >= 0 ? '#00ff00' : '#ff0066';
        this.add.text(620, yPos, `${entry.avg_profit_percent >= 0 ? '+' : ''}${entry.avg_profit_percent}%`, {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: avgProfitColor
        }).setOrigin(0.5);
        
        // Best game
        const bestColor = entry.best_game >= 0 ? '#00ff00' : '#ff0066';
        this.add.text(760, yPos, `${entry.best_game >= 0 ? '+' : ''}${entry.best_game}%`, {
            fontSize: '14px',
            fontFamily: 'Arial Black',
            color: bestColor
        }).setOrigin(0.5);
    }
} 