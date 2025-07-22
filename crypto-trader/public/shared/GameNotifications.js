// Game notification system for win/loss announcements

export class GameNotifications {
    constructor(scene) {
        this.scene = scene;
        this.notifications = [];
        this.notificationY = 100;
        this.notificationHeight = 80;
        this.notificationSpacing = 10;
    }
    
    /**
     * Show a game completion notification
     * @param {Object} data - Notification data
     * @param {boolean} data.isWinner - Whether the player won
     * @param {number} data.position - Final position (1st, 2nd, etc)
     * @param {number} data.totalPlayers - Total number of players
     * @param {number} data.finalValue - Final portfolio value
     * @param {number} data.profit - Profit/loss amount
     * @param {string} data.gameCode - Game code
     */
    showGameResult(data) {
        const { isWinner, position, totalPlayers, finalValue, profit, gameCode } = data;
        
        // Create notification container
        const notifY = this.notificationY + (this.notifications.length * (this.notificationHeight + this.notificationSpacing));
        const container = this.scene.add.container(450, notifY);
        
        // Background
        const bgColor = isWinner ? 0x00ff00 : position <= 2 ? 0xffcc00 : 0xff6600;
        const bg = this.scene.add.rectangle(0, 0, 700, this.notificationHeight, bgColor, 0.1);
        bg.setStrokeStyle(2, bgColor);
        
        // Icon
        const icon = isWinner ? '🏆' : position === 2 ? '🥈' : position === 3 ? '🥉' : '🎯';
        const iconText = this.scene.add.text(-320, 0, icon, {
            fontSize: '36px',
            fontFamily: 'Arial'
        }).setOrigin(0.5);
        
        // Title
        const titleText = isWinner ? 'WINNER!' : `${this.getOrdinal(position)} PLACE`;
        const title = this.scene.add.text(-250, -15, titleText, {
            fontSize: '24px',
            fontFamily: 'Arial Black',
            color: isWinner ? '#00ff00' : position <= 3 ? '#ffcc00' : '#ff6600'
        }).setOrigin(0, 0.5);
        
        // Game info
        const gameInfo = this.scene.add.text(-250, 15, `Game ${gameCode} • ${totalPlayers} players`, {
            fontSize: '14px',
            color: '#888888'
        }).setOrigin(0, 0.5);
        
        // Final value
        const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
        const profitText = profit >= 0 ? `+$${Math.abs(profit).toLocaleString()}` : `-$${Math.abs(profit).toLocaleString()}`;
        
        const valueText = this.scene.add.text(250, -15, `$${(finalValue/1000000).toFixed(2)}M`, {
            fontSize: '20px',
            fontFamily: 'Arial Black',
            color: '#ffffff'
        }).setOrigin(1, 0.5);
        
        const profitLabel = this.scene.add.text(250, 15, profitText, {
            fontSize: '16px',
            color: profitColor
        }).setOrigin(1, 0.5);
        
        // Close button
        const closeBtn = this.scene.add.text(320, 0, '✕', {
            fontSize: '24px',
            color: '#666666'
        }).setOrigin(0.5);
        closeBtn.setInteractive({ useHandCursor: true });
        
        // Add all elements to container
        container.add([bg, iconText, title, gameInfo, valueText, profitLabel, closeBtn]);
        
        // Animate in
        container.setAlpha(0);
        container.setScale(0.8);
        this.scene.tweens.add({
            targets: container,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Store notification
        const notification = {
            container,
            closeBtn,
            data
        };
        this.notifications.push(notification);
        
        // Close button handler
        closeBtn.on('pointerover', () => closeBtn.setColor('#ffffff'));
        closeBtn.on('pointerout', () => closeBtn.setColor('#666666'));
        closeBtn.on('pointerdown', () => this.removeNotification(notification));
        
        // Auto-remove after 10 seconds
        this.scene.time.delayedCall(10000, () => {
            if (this.notifications.includes(notification)) {
                this.removeNotification(notification);
            }
        });
        
        // Sound effect
        if (isWinner) {
            // Play win sound if available
            this.playSound('win');
        } else if (position <= 3) {
            // Play podium sound
            this.playSound('podium');
        }
    }
    
    removeNotification(notification) {
        const index = this.notifications.indexOf(notification);
        if (index === -1) return;
        
        // Fade out
        this.scene.tweens.add({
            targets: notification.container,
            alpha: 0,
            scale: 0.8,
            duration: 200,
            onComplete: () => {
                notification.container.destroy();
                this.notifications.splice(index, 1);
                
                // Reposition remaining notifications
                this.repositionNotifications();
            }
        });
    }
    
    repositionNotifications() {
        this.notifications.forEach((notif, index) => {
            const targetY = this.notificationY + (index * (this.notificationHeight + this.notificationSpacing));
            this.scene.tweens.add({
                targets: notif.container,
                y: targetY,
                duration: 200,
                ease: 'Sine.easeInOut'
            });
        });
    }
    
    getOrdinal(n) {
        const s = ["th", "st", "nd", "rd"];
        const v = n % 100;
        return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    
    playSound(type) {
        // Placeholder for sound effects
        // In a real implementation, you'd play actual sounds here
        console.log(`Playing ${type} sound`);
    }
    
    destroy() {
        // Clean up all notifications
        this.notifications.forEach(notif => {
            notif.container.destroy();
        });
        this.notifications = [];
    }
}

// Storage key for tracking shown notifications
const SHOWN_NOTIFICATIONS_KEY = 'crypto_trader_shown_notifications';

/**
 * Check for newly completed games and show notifications
 * @param {Object} auth - Auth instance with Supabase client
 * @param {string} userId - Current user ID
 * @param {GameNotifications} notificationSystem - Notification system instance
 */
export async function checkCompletedGames(auth, userId, notificationSystem) {
    try {
        // Get shown notifications from localStorage
        const shownNotifications = JSON.parse(localStorage.getItem(SHOWN_NOTIFICATIONS_KEY) || '[]');
        
        // Query completed games from the last hour
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
        
        // Get user's completed multiplayer games
        const { data: completedGames, error } = await auth.supabase
            .from('game_participants')
            .select(`
                game_id,
                current_value,
                allocations,
                game:active_games!inner(
                    id,
                    game_code,
                    is_complete,
                    completed_at,
                    participant_count,
                    starting_money
                )
            `)
            .eq('user_id', userId)
            .eq('game.is_complete', true)
            .gte('game.completed_at', oneHourAgo)
            .order('game.completed_at', { ascending: false });
            
        if (error) {
            console.error('Error checking completed games:', error);
            return;
        }
        
        if (!completedGames || completedGames.length === 0) return;
        
        // Process each completed game
        for (const gameData of completedGames) {
            const game = gameData.game;
            const gameId = game.id;
            
            // Skip if already shown
            if (shownNotifications.includes(gameId)) continue;
            
            // Get all participants for this game to determine position
            const { data: allParticipants } = await auth.supabase
                .from('game_participants')
                .select('user_id, current_value')
                .eq('game_id', gameId)
                .order('current_value', { ascending: false });
                
            if (!allParticipants) continue;
            
            // Find user's position
            const position = allParticipants.findIndex(p => p.user_id === userId) + 1;
            const isWinner = position === 1;
            const profit = gameData.current_value - (game.starting_money || 10000000);
            
            // Show notification
            notificationSystem.showGameResult({
                isWinner,
                position,
                totalPlayers: game.participant_count || allParticipants.length,
                finalValue: gameData.current_value,
                profit,
                gameCode: game.game_code
            });
            
            // Mark as shown
            shownNotifications.push(gameId);
        }
        
        // Update localStorage
        localStorage.setItem(SHOWN_NOTIFICATIONS_KEY, JSON.stringify(shownNotifications));
        
    } catch (error) {
        console.error('Error in checkCompletedGames:', error);
    }
}

// Export function to clear notification history (useful for testing)
export function clearNotificationHistory() {
    localStorage.removeItem(SHOWN_NOTIFICATIONS_KEY);
} 