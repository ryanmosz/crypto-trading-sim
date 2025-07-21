// Tutorial Overlay System
export class TutorialOverlay {
    constructor(scene) {
        this.scene = scene;
        this.elements = [];
    }
    
    show(x, y, width, height, text, position = 'bottom', options = {}) {
        console.log('TutorialOverlay.show called:', {x, y, width, height, text, position});
        
        // Clean up any existing overlay
        this.hide();
        
        // Create dark overlay
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(0x000000, 0.7);
        
        // Fill entire screen
        this.overlay.fillRect(0, 0, 900, 600);
        console.log('Overlay created:', this.overlay);
        
        // Create "hole" in overlay for spotlight effect (unless disabled)
        let highlight = null;
        if (!options.hideSpotlight) {
            this.overlay.setBlendMode(Phaser.BlendModes.MULTIPLY);
            
            // Add highlight rectangle
            highlight = this.scene.add.rectangle(x, y, width + 20, height + 20, 0x00ffff, 0)
                .setStrokeStyle(3, 0x00ffff);
        }
        
        // Tutorial text box position
        let textY;
        if (position === 'center') {
            textY = y;
        } else if (position === 'top') {
            textY = y - height/2 - 70;
        } else {
            textY = y + height/2 + 60;
        }
        
        // Background for text - make it thinner and wider
        const textBg = this.scene.add.rectangle(450, textY, 700, 60, 0x1a1a1a)
            .setStrokeStyle(2, 0x00ffff);
            
        // Tutorial text
        const tutorialText = this.scene.add.text(450, textY - 5, text, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 680 }
        }).setOrigin(0.5);
        
        // Next button
        const nextBtn = this.scene.add.text(750, textY + 20, 'NEXT →', {
            fontSize: '14px',
            color: '#00ffff'
        }).setOrigin(1, 0.5)
        .setInteractive({ useHandCursor: true });
        
        // Skip button
        const skipBtn = this.scene.add.text(150, textY + 20, 'Skip Tutorial', {
            fontSize: '14px',
            color: '#666666'
        }).setOrigin(0, 0.5)
        .setInteractive({ useHandCursor: true });
        
        // Store elements
        this.elements = [this.overlay, textBg, tutorialText, nextBtn, skipBtn];
        if (highlight) {
            this.elements.push(highlight);
        }
        
        console.log('Tutorial overlay elements created:', this.elements.length);
        
        // Set depth to be on top
        this.elements.forEach(el => el.setDepth(1000));
        
        return { nextBtn, skipBtn };
    }
    
    hide() {
        this.elements.forEach(el => {
            if (el && el.destroy) {
                el.destroy();
            }
        });
        this.elements = [];
    }
} 