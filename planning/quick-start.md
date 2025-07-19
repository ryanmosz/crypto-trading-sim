# 🚀 5-Minute Quick Start Guide

Get your first Phaser screen running in 5 minutes!

## Prerequisites
- Node.js installed
- Text editor (VS Code recommended)
- Web browser

## Step 1: Setup (2 min)
```bash
# Create project
mkdir crypto-sim && cd crypto-sim
npm init -y
npm install phaser

# Create files
mkdir src
touch src/index.js
touch index.html
```

## Step 2: HTML File (1 min)
Create `index.html`:
```html
<!DOCTYPE html>
<html>
<head>
    <title>Crypto Sim</title>
    <style>
        body { margin: 0; background: #000; }
    </style>
</head>
<body>
    <script src="node_modules/phaser/dist/phaser.min.js"></script>
    <script src="src/index.js"></script>
</body>
</html>
```

## Step 3: Game Code (1 min)
Create `src/index.js`:
```javascript
class GameScene extends Phaser.Scene {
    create() {
        // Gradient background
        const graphics = this.add.graphics();
        graphics.fillGradientStyle(0x00ffff, 0x00ffff, 0xff1493, 0xff1493);
        graphics.fillRect(0, 0, 800, 600);
        
        // Title
        this.add.text(400, 200, 'CRYPTO TRADING SIM', {
            fontSize: '48px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Start button
        const button = this.add.rectangle(400, 400, 200, 60, 0x00ffff)
            .setInteractive()
            .on('pointerdown', () => {
                this.cameras.main.flash(500);
            });
            
        this.add.text(400, 400, 'START', {
            fontSize: '32px',
            color: '#000000'
        }).setOrigin(0.5);
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: GameScene
};

new Phaser.Game(config);
```

## Step 4: Run It! (1 min)
```bash
# Simple way - open HTML file
open index.html  # Mac
# Or drag index.html to your browser

# Better way - use local server
npx http-server -o
# Opens at http://localhost:8080
```

## 🎉 Done!

You now have:
- Working Phaser game
- Gradient background
- Interactive button
- Ready to expand

## Next Steps
1. Add more scenes
2. Read [phase1-foundation.md](phase1-foundation.md)
3. Build the full game!

---

*Need the 2-hour bare minimum version? Check [BARE-MINIMUM-PLAN.md](BARE-MINIMUM-PLAN.md)* 