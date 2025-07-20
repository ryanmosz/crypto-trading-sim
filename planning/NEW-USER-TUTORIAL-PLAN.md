# 🎓 New User Tutorial - Implementation Plan

**Goal**: Guide first-time users through game functionality with an interactive tutorial
**Time Estimate**: 2 hours
**Priority**: Implement after multiplayer feature

## 📋 Core Requirements
1. Detect first-time users on login
2. Interactive tutorial that guides through key features
3. Can be skipped/dismissed
4. Covers main game modes and functionality

## 🗄️ Database Changes (15 min)

### Add Tutorial Tracking
```sql
-- Track tutorial completion in profiles
ALTER TABLE profiles ADD COLUMN has_completed_tutorial BOOLEAN DEFAULT FALSE;
ALTER TABLE profiles ADD COLUMN tutorial_step INT DEFAULT 0;
```

## 🎮 Frontend Implementation (1.5 hours)

### 1. Tutorial Overlay System (30 min)
```javascript
// New class: TutorialOverlay
class TutorialOverlay {
    constructor(scene) {
        this.scene = scene;
        this.currentStep = 0;
        this.overlay = null;
        this.spotlight = null;
    }
    
    show(x, y, width, height, text, position = 'bottom') {
        // Darken everything except spotlight area
        this.overlay = this.scene.add.graphics();
        this.overlay.fillStyle(0x000000, 0.7);
        this.overlay.fillRect(0, 0, 900, 600);
        
        // Create spotlight hole
        this.overlay.fillStyle(0x000000, 0);
        this.overlay.fillRect(x - 10, y - 10, width + 20, height + 20);
        
        // Tutorial text box
        const textY = position === 'top' ? y - 100 : y + height + 20;
        const textBg = this.scene.add.rectangle(450, textY, 600, 80, 0x1a1a1a)
            .setStrokeStyle(2, 0x00ffff);
            
        const tutorialText = this.scene.add.text(450, textY, text, {
            fontSize: '16px',
            color: '#ffffff',
            align: 'center',
            wordWrap: { width: 580 }
        }).setOrigin(0.5);
        
        // Next button
        const nextBtn = this.scene.add.text(750, textY + 30, 'NEXT →', {
            fontSize: '14px',
            color: '#00ffff'
        }).setInteractive();
        
        nextBtn.on('pointerdown', () => this.nextStep());
        
        // Skip button
        const skipBtn = this.scene.add.text(150, textY + 30, 'Skip Tutorial', {
            fontSize: '14px',
            color: '#666666'
        }).setInteractive();
        
        skipBtn.on('pointerdown', () => this.skipTutorial());
        
        this.elements = [this.overlay, textBg, tutorialText, nextBtn, skipBtn];
        this.overlay.setDepth(1000);
        this.elements.forEach(el => el.setDepth(1001));
    }
    
    hide() {
        if (this.elements) {
            this.elements.forEach(el => el.destroy());
        }
    }
}
```

### 2. Tutorial Flow Manager (45 min)
```javascript
// TutorialManager.js
class TutorialManager {
    constructor() {
        this.steps = [
            // Dashboard intro
            {
                scene: 'DashboardScene',
                target: { x: 450, y: 150, w: 200, h: 50 },
                text: "Welcome to Crypto Trader! Click 'PLAY NEW GAME' to start your first trading challenge.",
                action: 'wait_click'
            },
            // Scenario selection
            {
                scene: 'ScenarioSelectScene',
                target: { x: 225, y: 200, w: 200, h: 280 },
                text: "Choose a historical event to trade through. Each scenario presents different market conditions!",
                highlight: 'scenario_cards'
            },
            // Allocation explanation
            {
                scene: 'AllocationScene',
                target: { x: 100, y: 150, w: 700, h: 300 },
                text: "Allocate your $10M across different cryptocurrencies. Click the + buttons to invest!",
                highlight: 'allocation_area'
            },
            // Simulation
            {
                scene: 'HistoricalSimulationScene',
                target: { x: 450, y: 110, w: 300, h: 60 },
                text: "Watch your portfolio value change as the market moves. This shows real historical data!",
                auto_advance: true
            },
            // Results
            {
                scene: 'ResultsScene',
                target: { x: 450, y: 280, w: 400, h: 200 },
                text: "See how each investment performed. Your games are automatically saved!",
                highlight: 'breakdown'
            },
            // Back to dashboard
            {
                scene: 'DashboardScene',
                target: { x: 450, y: 350, w: 800, h: 200 },
                text: "Your past games appear here. Try 'NOW MODE' for real-time challenges that last 30-90 days!",
                highlight: 'game_history'
            },
            // Now mode
            {
                scene: 'DashboardScene',
                target: { x: 110, y: 260, w: 180, h: 120 },
                text: "In NOW MODE, you invest at current prices and track performance over time. Compete on the leaderboard!",
                highlight: 'now_card'
            },
            // Leaderboard
            {
                scene: 'DashboardScene', 
                target: { x: 630, y: 30, w: 120, h: 40 },
                text: "Check the LEADERBOARD to see top traders. Click to view the best strategies!",
                action: 'complete'
            }
        ];
    }
    
    async start(scene, user) {
        // Check if tutorial needed
        const { data: profile } = await window.supabase
            .from('profiles')
            .select('has_completed_tutorial, tutorial_step')
            .eq('id', user.id)
            .single();
            
        if (profile?.has_completed_tutorial) {
            return false;
        }
        
        this.currentStep = profile?.tutorial_step || 0;
        this.overlay = new TutorialOverlay(scene);
        this.showStep();
        return true;
    }
    
    showStep() {
        const step = this.steps[this.currentStep];
        if (this.scene.scene.key !== step.scene) {
            // Wait for correct scene
            return;
        }
        
        this.overlay.show(
            step.target.x,
            step.target.y,
            step.target.w,
            step.target.h,
            step.text
        );
    }
    
    async nextStep() {
        this.currentStep++;
        
        // Save progress
        await window.supabase
            .from('profiles')
            .update({ tutorial_step: this.currentStep })
            .eq('id', this.user.id);
            
        if (this.currentStep >= this.steps.length) {
            this.complete();
        } else {
            this.overlay.hide();
            this.showStep();
        }
    }
    
    async complete() {
        await window.supabase
            .from('profiles')
            .update({ 
                has_completed_tutorial: true,
                tutorial_step: 0 
            })
            .eq('id', this.user.id);
            
        this.overlay.hide();
        
        // Show completion message
        const scene = this.scene;
        const successBg = scene.add.rectangle(450, 300, 500, 200, 0x1a1a1a)
            .setStrokeStyle(3, 0x00ffff);
            
        scene.add.text(450, 250, '🎉 Tutorial Complete!', {
            fontSize: '32px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        scene.add.text(450, 300, 'You\'re ready to become a crypto trading legend!', {
            fontSize: '18px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        setTimeout(() => {
            successBg.destroy();
        }, 3000);
    }
}

// Global tutorial manager
window.tutorialManager = new TutorialManager();
```

### 3. Integration Points (30 min)

#### In LoginScene after successful login:
```javascript
// After successful login
const needsTutorial = await window.tutorialManager.checkIfNeeded(user);
this.scene.start('DashboardScene', { user, startTutorial: needsTutorial });
```

#### In each scene's create method:
```javascript
create() {
    // ... existing code ...
    
    // Check if tutorial should show
    if (this.startTutorial || window.tutorialManager.isActive) {
        window.tutorialManager.checkScene(this);
    }
}
```

#### Tutorial-aware interactions:
```javascript
// In DashboardScene
playNewGameBtn.on('pointerdown', () => {
    if (window.tutorialManager.isActive && 
        window.tutorialManager.currentStep === 0) {
        window.tutorialManager.nextStep();
    }
    this.scene.start('ScenarioSelectScene', { user: this.user });
});
```

## 🎨 Visual Design

### Tutorial Overlay Style
- Semi-transparent black overlay (70% opacity)
- Spotlight on active element
- Cyan accent color for tutorial elements
- Clean, minimal text boxes
- Clear NEXT and SKIP options

### Step Indicators
```javascript
// Show progress dots
for (let i = 0; i < this.totalSteps; i++) {
    const dot = this.scene.add.circle(
        350 + i * 20, 
        textY + 50, 
        5, 
        i <= this.currentStep ? 0x00ffff : 0x333333
    );
}
```

## 🚀 Quick Implementation

1. **Database update** (15 min)
2. **Create overlay system** (30 min)
3. **Build tutorial flow** (45 min)
4. **Integrate with scenes** (30 min)

## ✅ Benefits
- New users understand the game immediately
- Reduces confusion and support requests
- Professional onboarding experience
- Can be expanded with more tips later

---

**Total time: ~2 hours** for a polished tutorial system! 