# 🚨 BARE MINIMUM PLAN - Ship in 2 Hours

This is the absolute fastest path to shipping something playable. Cut everything non-essential.

## What We're Building
A login screen with 2 test users that shows different results. That's it. Ship it.

## Stack (Simplified)
- **Frontend**: Phaser 3 (just one HTML file if needed!)
- **Data**: Hardcoded
- **Backend**: None
- **Deployment**: GitHub Pages (free, instant)

## Hour 1: Build It

### 0-15 min: Setup
```bash
mkdir crypto-sim && cd crypto-sim
npm init -y
npm install phaser
mkdir src
```

### 15-45 min: Create Game
```javascript
// src/game.js
class LoginScene extends Phaser.Scene {
    create() {
        this.cameras.main.setBackgroundColor('#000000');
        
        // Title
        this.add.text(400, 100, 'Crypto Trading Sim', {
            fontSize: '48px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        // Alice button
        this.createButton(400, 250, 'Alice (+20%)', () => {
            this.showResult('Alice', 12000000, '#00ff00');
        });
        
        // Bob button
        this.createButton(400, 350, 'Bob (-20%)', () => {
            this.showResult('Bob', 8000000, '#ff0000');
        });
    }
    
    createButton(x, y, text, callback) {
        const btn = this.add.rectangle(x, y, 250, 60, 0x00ffff, 0.3)
            .setInteractive()
            .on('pointerdown', callback);
            
        this.add.text(x, y, text, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
    
    showResult(user, value, color) {
        this.scene.start('ResultScene', { user, value, color });
    }
}

class ResultScene extends Phaser.Scene {
    create(data) {
        this.cameras.main.setBackgroundColor('#000000');
        
        const profit = ((data.value / 10000000) - 1) * 100;
        
        this.add.text(400, 200, `${data.user}'s Portfolio`, {
            fontSize: '36px',
            color: '#00ffff'
        }).setOrigin(0.5);
        
        this.add.text(400, 300, `$${(data.value/1000000).toFixed(1)}M`, {
            fontSize: '64px',
            color: data.color
        }).setOrigin(0.5);
        
        this.add.text(400, 380, `${profit > 0 ? '+' : ''}${profit}%`, {
            fontSize: '32px',
            color: data.color
        }).setOrigin(0.5);
        
        // Back button
        const backBtn = this.add.rectangle(400, 500, 150, 40, 0xff1493, 0.3)
            .setInteractive()
            .on('pointerdown', () => this.scene.start('LoginScene'));
            
        this.add.text(400, 500, 'Back', {
            fontSize: '20px',
            color: '#ffffff'
        }).setOrigin(0.5);
    }
}

// Initialize game
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: [LoginScene, ResultScene]
};

new Phaser.Game(config);
```

### 45-60 min: Create HTML
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
    <title>Crypto Trading Simulator</title>
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <style>
        body {
            margin: 0;
            padding: 0;
            background: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        #game-container {
            max-width: 800px;
            width: 100%;
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
    <script src="https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js"></script>
    <script src="src/game.js"></script>
</body>
</html>
```

## Hour 2: Ship It

### 0-15 min: Test
```bash
# Quick test locally
npx http-server -o
# Or just open index.html in browser
```

### 15-45 min: Deploy to GitHub Pages
```bash
# Initialize git
git init
git add .
git commit -m "Initial game"

# Create GitHub repo (use GitHub UI or CLI)
gh repo create crypto-sim --public --source=.
git push -u origin main

# Enable GitHub Pages
# Go to Settings → Pages → Source: main branch
# Your game is live at: https://[username].github.io/crypto-sim
```

### 45-60 min: Polish (If Time)
- Add hover effects
- Add sound on click
- Add transition animation
- Update README

## What You've Shipped

✅ Working game at public URL  
✅ Two different user experiences  
✅ Visual feedback (colors for profit/loss)  
✅ Playable on mobile  
✅ Zero backend complexity  

## What We Cut (Add Later)

❌ Real crypto allocation  
❌ Actual price data  
❌ Multiple screens  
❌ User accounts  
❌ Multiplayer  
❌ Backend API  

## One-Line Deploy Options

### Option 1: Surge.sh
```bash
npm install -g surge
surge . crypto-trading-sim.surge.sh
```

### Option 2: Netlify Drop
1. Zip your folder
2. Drag to https://app.netlify.com/drop
3. Instant URL

### Option 3: Vercel
```bash
npm i -g vercel
vercel --prod
```

## Success Metrics

- **Build Time**: < 1 hour
- **Deploy Time**: < 15 minutes  
- **Code Lines**: < 100
- **Features**: Just enough
- **Fun**: Surprisingly yes

## Next Steps After Shipping

1. Share the link
2. Get feedback
3. Add ONE feature
4. Ship again
5. Repeat

---

**Remember**: Perfect is the enemy of shipped. This plan gets you from zero to playable game URL in 2 hours. Everything else can wait. 