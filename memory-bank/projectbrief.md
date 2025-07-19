# Project Brief: Crypto Trading Simulator

## Overview
A web-based cryptocurrency trading simulation game where players start with $10M virtual dollars and compete to maximize returns through strategic allocation across major cryptocurrencies.

## Core Concept
Players experience the volatility and excitement of crypto markets through:
- Historical market simulations based on real data
- Strategic portfolio allocation decisions
- Time-pressured trading environments
- Performance tracking and competition

## Two-Mode Vision

### Historical Mode - "Learn from the Past"
- Travel to pivotal moments in crypto history
- Experience authentic market movements with real data
- Test strategies against actual market conditions
- Learn without risking real money
- Ultimate goal: Select ANY time period from crypto history

### Live Mode - "Compete in Real-Time" (Future)
- Create custom trading competitions
- Invite friends to join games
- Games run persistently on servers with unique IDs
- Track progress and standings anytime
- Social features: taunts, victories, rivalries
- Flexible durations from 24-hour sprints to open-ended marathons

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