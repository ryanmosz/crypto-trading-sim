# Project Brief - Crypto Trading Simulator

## Core Requirements

**Project Type**: Phaser.js cryptocurrency trading game  
**Duration**: 7-day MVP development  
**Platform**: Web browser  
**Framework**: Phaser 3  

## Game Concept

Players start with $10 million virtual money and compete to build the best cryptocurrency portfolio over a 24-hour period. The game tracks real-time performance using actual crypto prices and ranks players on a global leaderboard.

## Key Features

1. **Portfolio Allocation**: Distribute 100 points across BTC, ETH, BNB, SOL, and XRP
2. **Real-time Tracking**: Live price updates from CoinGecko API
3. **Multiplayer Competition**: Global leaderboard system
4. **24-hour Cycles**: Each game runs for exactly 24 hours
5. **Simple Onboarding**: Optional username, immediate gameplay

## Technical Stack

- **Frontend**: Phaser 3 (JavaScript game framework)
- **Backend**: Node.js on Vercel (serverless)
- **API**: CoinGecko free tier for price data
- **Database**: Simple JSON storage (upgradeable)
- **Hosting**: Static site hosting (Vercel/Netlify/GitHub Pages)

## Success Criteria

- Load time < 10 seconds
- 60 FPS on average hardware
- Mobile browser compatible
- Zero critical bugs at launch
- Fun and engaging gameplay

## Project Philosophy

"Ship something playable every single day" - Each development milestone produces a working web build that can be tested immediately in a browser. 