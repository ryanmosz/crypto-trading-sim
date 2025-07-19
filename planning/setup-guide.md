# 📋 Complete Setup Guide

This guide covers the complete development environment setup for the Crypto Trading Simulator using Phaser 3.

## Prerequisites

### Required Software
- **Node.js** (v16+ recommended) - [Download](https://nodejs.org/)
- **Code Editor** - VS Code recommended - [Download](https://code.visualstudio.com/)
- **Git** - Version control - [Download](https://git-scm.com/)
- **Web Browser** - Chrome/Firefox with DevTools

### Recommended VS Code Extensions
- Live Server - For local development
- JavaScript (ES6) code snippets
- Prettier - Code formatter
- ESLint - JavaScript linter
- Phaser 3 Snippets (optional)

## Project Setup

### 1. Create Project Structure
```bash
# Create project directory
mkdir crypto-trading-sim
cd crypto-trading-sim

# Initialize git
git init

# Create initial structure
mkdir -p src/{scenes,assets/{images,audio},utils}
mkdir -p public
```

### 2. Initialize npm Project
```bash
# Initialize package.json
npm init -y

# Install Phaser
npm install phaser

# Install development dependencies
npm install --save-dev webpack webpack-cli webpack-dev-server
npm install --save-dev html-webpack-plugin copy-webpack-plugin
npm install --save-dev @babel/core @babel/preset-env babel-loader
```

### 3. Create Configuration Files

#### webpack.config.js
```javascript
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'src/assets', to: 'assets' }
      ]
    })
  ],
  devServer: {
    static: './dist',
    hot: true,
    open: true
  }
};
```

#### package.json scripts
```json
{
  "scripts": {
    "start": "webpack serve --mode development",
    "build": "webpack --mode production",
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

### 4. Create Initial Files

#### public/index.html
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crypto Trading Simulator</title>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #000;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }
        #game-container {
            width: 100%;
            max-width: 800px;
        }
    </style>
</head>
<body>
    <div id="game-container"></div>
</body>
</html>
```

#### src/index.js
```javascript
import Phaser from 'phaser';
import BootScene from './scenes/BootScene';
import MenuScene from './scenes/MenuScene';

const config = {
    type: Phaser.AUTO,
    parent: 'game-container',
    width: 800,
    height: 600,
    backgroundColor: '#000000',
    scene: [BootScene, MenuScene]
};

const game = new Phaser.Game(config);
```

### 5. Git Configuration

#### .gitignore
```
# Dependencies
node_modules/

# Build output
dist/

# Environment files
.env
.env.local

# IDE files
.vscode/
.idea/
*.sublime-*

# OS files
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*

# Testing
coverage/
```

## Development Workflow

### Starting Development
```bash
# Install dependencies
npm install

# Start dev server
npm start
# Opens browser at http://localhost:8080
```

### Building for Production
```bash
# Create production build
npm run build
# Output in dist/ folder
```

### Project Structure
```
crypto-trading-sim/
├── src/
│   ├── index.js          # Entry point
│   ├── scenes/           # Phaser scenes
│   │   ├── BootScene.js  # Asset loading
│   │   ├── MenuScene.js  # Main menu
│   │   └── GameScene.js  # Game logic
│   ├── assets/           # Images, audio
│   └── utils/            # Helper functions
├── public/
│   └── index.html        # HTML template
├── dist/                 # Build output
├── package.json
├── webpack.config.js
└── .gitignore
```

## API Integration

### CoinGecko Setup
```javascript
// src/utils/api.js
const COINGECKO_API = 'https://api.coingecko.com/api/v3';

export async function getCryptoPrices() {
    const ids = 'bitcoin,ethereum,binancecoin,solana,ripple';
    const url = `${COINGECKO_API}/simple/price?ids=${ids}&vs_currencies=usd`;
    
    try {
        const response = await fetch(url);
        return await response.json();
    } catch (error) {
        console.error('API Error:', error);
        return null;
    }
}
```

## Deployment Options

### 1. GitHub Pages
```bash
# Install gh-pages
npm install --save-dev gh-pages

# Add to package.json
"scripts": {
  "deploy": "npm run build && gh-pages -d dist"
}

# Deploy
npm run deploy
```

### 2. Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### 3. Netlify
- Drag and drop `dist/` folder to Netlify
- Or connect GitHub repo with auto-deploy

## Troubleshooting

### Common Issues

1. **Module not found errors**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

2. **Port already in use**
   - Change port in webpack.config.js
   - Or kill process using the port

3. **Assets not loading**
   - Check file paths are correct
   - Ensure CopyWebpackPlugin is configured

4. **CORS errors with API**
   - Use proxy in development
   - Ensure API allows origin in production

## Next Steps

1. ✅ Complete this setup
2. 📖 Read [phase1-foundation.md](phase1-foundation.md)
3. 🚀 Start building!

---

*For quick first screen setup, see [quick-start.md](quick-start.md)* 