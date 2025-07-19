# 📱 Phase 1: Foundation - Phaser Setup & Navigation

Phase 1 establishes the core Phaser project with basic screens and navigation. This phase prioritizes shipping something visible quickly.

## Phase Overview

**Duration**: 1 day (8 hours)  
**Goal**: Create a working Phaser game with login and navigation  
**Minimum Viable**: Just a login screen with 2 test users

## Milestones

### Milestone 0: Login Screen (2 hours) ⭐ SHIPPABLE
**The absolute minimum** - Just ship this and call it v0.1!

#### Implementation
```javascript
// src/scenes/LoginScene.js
export default class LoginScene extends Phaser.Scene {
    constructor() {
        super({ key: 'LoginScene' });
    }

    create() {
        // Black background
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        const title = this.add.text(400, 100, 'Crypto Trading Simulator', {
            fontSize: '48px',
            fontFamily: 'Arial',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Test users
        this.createUserButton('Alice (+20%)', 250, () => {
            this.scene.start('DashboardScene', { user: 'alice', result: 1.2 });
        });
        
        this.createUserButton('Bob (-20%)', 350, () => {
            this.scene.start('DashboardScene', { user: 'bob', result: 0.8 });
        });
    }
    
    createUserButton(text, y, callback) {
        const button = this.add.rectangle(400, y, 300, 60, 0x00ffff, 0.2)
            .setInteractive()
            .on('pointerover', () => button.setFillStyle(0x00ffff, 0.4))
            .on('pointerout', () => button.setFillStyle(0x00ffff, 0.2))
            .on('pointerdown', callback);
            
        this.add.text(400, y, text, {
            fontSize: '24px',
            fontFamily: 'Arial',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}
```

#### Quick Dashboard for Demo
```javascript
// src/scenes/DashboardScene.js
export default class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
    }
    
    create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        
        const result = data.result || 1;
        const profit = ((result - 1) * 100).toFixed(1);
        const color = result >= 1 ? '#00ff00' : '#ff0000';
        
        this.add.text(400, 200, `Welcome ${data.user}!`, {
            fontSize: '36px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        this.add.text(400, 300, `Your Result: ${profit}%`, {
            fontSize: '48px',
            color: color
        }).setOrigin(0.5);
        
        // Back button
        const backBtn = this.add.rectangle(400, 450, 200, 50, 0xff1493, 0.2)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('LoginScene'));
            
        this.add.text(400, 450, 'Back to Login', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}
```

### Milestone 1: Screen Navigation (2 hours)
Builds on Milestone 0 by adding proper game flow.

#### Screen Structure
1. **Boot Scene** - Asset loading
2. **Menu Scene** - Main menu (was Login)
3. **Allocation Scene** - Choose investments
4. **Dashboard Scene** - View results
5. **Results Scene** - Final leaderboard

#### Navigation Implementation
```javascript
// src/scenes/BootScene.js
export default class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }
    
    preload() {
        // Create loading bar
        const progressBar = this.add.graphics();
        const progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        this.load.on('progress', (value) => {
            progressBar.clear();
            progressBar.fillStyle(0x00ffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        // Load assets here
        // this.load.image('logo', 'assets/images/logo.png');
    }
    
    create() {
        this.scene.start('MenuScene');
    }
}
```

## Implementation Steps

### Step 1: Project Setup (30 min)
```bash
# Create project
mkdir crypto-trading-sim
cd crypto-trading-sim
npm init -y

# Install dependencies
npm install phaser
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin copy-webpack-plugin

# Create structure
mkdir -p src/scenes
mkdir -p src/assets/images
mkdir -p public
```

### Step 2: Core Files (30 min)

#### src/config.js
```javascript
export default {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
```

#### src/index.js
```javascript
import Phaser from 'phaser';
import config from './config';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';
import DashboardScene from './scenes/DashboardScene';

config.scene = [BootScene, MenuScene, DashboardScene];

const game = new Phaser.Game(config);
```

### Step 3: Visual Style (30 min)

#### Gradient Background
```javascript
// In any scene's create method
createGradientBackground() {
    const gradient = this.add.graphics();
    const height = this.cameras.main.height;
    
    for (let i = 0; i < height; i++) {
        const color = Phaser.Display.Color.Interpolate.ColorWithColor(
            { r: 0, g: 255, b: 255 },  // Cyan
            { r: 255, g: 20, b: 147 }, // Pink
            height,
            i
        );
        gradient.fillStyle(Phaser.Display.Color.GetColor(color.r, color.g, color.b));
        gradient.fillRect(0, i, 800, 1);
    }
}
```

#### Consistent Button Style
```javascript
createStyledButton(x, y, text, callback) {
    const button = this.add.container(x, y);
    
    const bg = this.add.rectangle(0, 0, 250, 60, 0x00ffff, 0.2)
        .setInteractive()
        .on('pointerover', () => {
            bg.setFillStyle(0x00ffff, 0.4);
            bg.setScale(1.05);
        })
        .on('pointerout', () => {
            bg.setFillStyle(0x00ffff, 0.2);
            bg.setScale(1);
        })
        .on('pointerdown', callback);
    
    const label = this.add.text(0, 0, text, {
        fontSize: '24px',
        fontFamily: 'Arial',
        color: '#ffffff'
    }).setOrigin(0.5);
    
    button.add([bg, label]);
    return button;
}
```

### Step 4: Build & Deploy (30 min)

#### Development Server
```bash
npm start
# Opens at http://localhost:8080
```

#### Production Build
```bash
npm run build
# Creates dist/ folder
```

#### Quick Deploy to GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"homepage": "https://yourusername.github.io/crypto-trading-sim",
"scripts": {
    "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

## Testing Checklist

### Milestone 0 (Minimum)
- [ ] Login screen loads
- [ ] Two test user buttons visible
- [ ] Clicking users shows different results
- [ ] Basic styling applied

### Milestone 1 (Full)
- [ ] All 4 screens created
- [ ] Navigation flows correctly
- [ ] Back buttons work
- [ ] Visual style consistent
- [ ] No console errors
- [ ] Runs on mobile browsers

## Common Issues & Solutions

### Issue: Blank screen
```javascript
// Check console for errors
// Ensure scene key matches
// Verify index.html has game-container div
```

### Issue: Scenes not switching
```javascript
// Use exact scene keys
this.scene.start('SceneName'); // Not 'scenename'

// Pass data correctly
this.scene.start('NextScene', { data: value });
```

### Issue: Text blurry
```javascript
// Use even font sizes
fontSize: '24px' // Not '23px'

// Enable smoothing
text.setResolution(2);
```

## Deliverables Checklist

### Minimum (2 hours)
- [x] Phaser project created
- [x] Login screen with 2 users
- [x] Basic result display
- [x] Deployed to web

### Complete (4 hours)
- [ ] All 4 game screens
- [ ] Scene navigation system
- [ ] Consistent visual style
- [ ] Loading screen
- [ ] Mobile responsive
- [ ] Error handling

## Next Steps

### After Milestone 0
1. Deploy immediately - you have a game!
2. Share link for feedback
3. Plan Milestone 1 improvements

### After Milestone 1
1. Move to [phase2-mechanics.md](phase2-mechanics.md)
2. Or continue polishing Phase 1
3. Add more visual effects

## Success Metrics

- **Load Time**: < 5 seconds
- **FPS**: Consistent 60
- **Mobile**: Works on iPhone/Android
- **Errors**: Zero in console
- **Fun**: Test users smile

---

Remember: **Ship Milestone 0 first!** Everything else is bonus. A working login screen is better than an unfinished complete game. 