// Import dependencies
import { Auth } from '../auth.js';

// Join Game Scene - allows users to join multiplayer games
export default class JoinGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'JoinGameScene' });
    }
    
    init(data) {
        this.user = data.user;
        this.game = data.game;
        // Initialize auth if not already available
        if (!window.gameAuth) {
            window.gameAuth = new Auth();
        }
        this.auth = window.gameAuth;
    }
    
    create() {
        // Background
        this.add.rectangle(450, 300, 900, 600, 0x000000);
        
        // Title
        this.add.text(450, 50, 'JOIN MULTIPLAYER GAME', {
            fontSize: '32px',
            color: '#00ff00',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Game info
        this.add.text(450, 120, `${this.game.duration_days}-Day Challenge`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Calculate days remaining
        const now = new Date();
        const endsAt = new Date(this.game.ends_at);
        const daysRemaining = Math.ceil((endsAt - now) / (1000 * 60 * 60 * 24));
        
        this.add.text(450, 160, `${daysRemaining} days remaining`, {
            fontSize: '18px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Current participants
        this.add.text(450, 200, 'CURRENT PARTICIPANTS', {
            fontSize: '18px',
            color: '#ffffff',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        // Loading text for participants
        const loadingText = this.add.text(450, 250, 'Loading participants...', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5);
        
        // Load and display participants
        this.loadParticipants(loadingText);
        
        // Join button
        const joinBtn = this.add.rectangle(450, 450, 200, 50, 0x00ff00)
            .setInteractive({ useHandCursor: true });
            
        const joinText = this.add.text(450, 450, 'JOIN GAME', {
            fontSize: '20px',
            color: '#000000',
            fontFamily: 'Arial Black'
        }).setOrigin(0.5);
        
        joinBtn.on('pointerover', () => {
            joinBtn.setFillStyle(0x00dd00);
        })
        .on('pointerout', () => {
            joinBtn.setFillStyle(0x00ff00);
        })
        .on('pointerdown', () => {
            // Go to allocation scene with multiplayer context
            this.scene.start('AllocationScene', { 
                user: this.user,
                scenario: 'now',
                multiplayerGame: this.game
            });
        });
        
        // Back button
        const backBtn = this.add.text(450, 520, 'BACK TO DASHBOARD', {
            fontSize: '16px',
            color: '#666666'
        }).setOrigin(0.5)
        .setInteractive({ useHandCursor: true })
        .on('pointerover', function() { this.setColor('#00ffff'); })
        .on('pointerout', function() { this.setColor('#666666'); })
        .on('pointerdown', () => {
            this.scene.start('DashboardScene', { user: this.user });
        });
    }
    
    async loadParticipants(loadingText) {
        try {
            // Get game participants with usernames
            // First get participants
            const { data: participants, error: participantsError } = await this.auth.supabase
                .from('game_participants')
                .select('*')
                .eq('game_id', this.game.id)
                .order('current_value', { ascending: false });
                
            if (participantsError) throw participantsError;
            
            // Then get usernames for all participants
            if (participants && participants.length > 0) {
                const userIds = participants.map(p => p.user_id);
                const { data: profiles, error: profilesError } = await this.auth.supabase
                    .from('profiles')
                    .select('id, username')
                    .in('id', userIds);
                    
                if (profilesError) throw profilesError;
                
                // Merge username data with participants
                participants.forEach((participant, index) => {
                    const profile = profiles?.find(p => p.id === participant.user_id);
                    // Use a more friendly default name if no username is set
                    participant.username = profile?.username || `Player ${index + 1}`;
                });
            }
            
            loadingText.destroy();
            
            if (!participants || participants.length === 0) {
                // Show the game creator
                this.add.text(450, 250, '1. Game Creator', {
                    fontSize: '16px',
                    color: '#ffffff'
                }).setOrigin(0.5);
                
                this.add.text(450, 280, 'Be the first to join!', {
                    fontSize: '14px',
                    color: '#666666'
                }).setOrigin(0.5);
            } else {
                // Display participants
                let yPos = 250;
                participants.forEach((participant, index) => {
                    const isMe = participant.user_id === this.user.id;
                    const username = participant.username || `Player ${index + 1}`;
                    const value = participant.current_value || 10000000;
                    const profit = ((value - 10000000) / 10000000) * 100;
                    
                    // Rank and username
                    this.add.text(250, yPos, `${index + 1}. ${username}`, {
                        fontSize: '16px',
                        color: '#ffffff'
                    }).setOrigin(0, 0.5);
                    
                    // Value - right aligned
                    this.add.text(550, yPos, `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`, {
                        fontSize: '16px',
                        color: '#ffffff'
                    }).setOrigin(1, 0.5);  // Right align
                    
                    // Profit - with more spacing
                    const profitColor = profit >= 0 ? '#00ff00' : '#ff0066';
                    this.add.text(560, yPos, `${profit >= 0 ? '+' : ''}${profit.toFixed(1)}%`, {
                        fontSize: '16px',
                        color: profitColor
                    }).setOrigin(0, 0.5);
                    
                    yPos += 30;
                });
            }
            
            // Also show the original game creator if not in participants
            if (!participants || !participants.find(p => p.is_original_creator)) {
                // Get creator info
                const { data: creator } = await this.auth.supabase
                    .from('profiles')
                    .select('email')
                    .eq('id', this.game.user_id)
                    .single();
                    
                if (creator) {
                    const yPos = 250 + (participants ? participants.length * 30 : 30);
                    this.add.text(450, yPos, `Game created by: ${creator.email}`, {
                        fontSize: '14px',
                        color: '#666666',
                        fontStyle: 'italic'
                    }).setOrigin(0.5);
                }
            }
            
        } catch (error) {
            console.error('Error loading participants:', error);
            loadingText.setText('Error loading participants');
            loadingText.setColor('#ff0000');
        }
    }
} 