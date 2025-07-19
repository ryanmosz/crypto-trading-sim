# 🎮 Crypto Trading Simulator
Phaser.js web game. Start with $10M, pick cryptos, compete.

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Version](https://img.shields.io/badge/version-0.1.0-blue)

## About
A cryptocurrency trading simulator where players invest virtual money across BTC, ETH, BNB, SOL, and XRP. Built with Phaser 3 for web browsers.

## 🔮 Vision

Our vision is to create two distinct and compelling ways to experience cryptocurrency trading:

### 📚 Historical Mode - "Learn from the Past"
Travel back in time to pivotal moments in crypto history. Currently featuring key dates like the 2020 COVID crash and 2013's first Bitcoin bull run, we're building toward a comprehensive historical playground where you can:
- Select **any** time period from cryptocurrency's rich history
- Experience authentic market movements with real historical data
- Test strategies against actual market conditions
- Learn what worked (and what didn't) without risking real money

### 🎮 Live Mode - "Compete in Real-Time" *(Coming Soon)*
The future of social crypto gaming, where players create custom trading competitions:
- **Create Games**: Set your parameters - starting capital, available coins, game duration
- **Invite Friends**: Send game invitations to other players
- **Real Competition**: Once players join and lock in their portfolios, the game runs live on our servers
- **Track Progress**: Each game gets a unique ID - check standings anytime, anywhere
- **Social Features**: Send taunts, share victories, and build rivalries
- **Flexible Duration**: Create quick 24-hour sprints or open-ended marathons that run indefinitely

Whether you're learning from history or competing with friends in real-time, Crypto Trading Simulator makes the volatile world of cryptocurrency accessible, educational, and fun.

## 🎯 Game Features
- Start with $10,000,000 virtual dollars
- Allocate funds across 5 major cryptocurrencies
- Watch real historical market data replay
- Compete for the best returns
- Learn crypto trading risk-free

## 🚀 Quick Start

### Prerequisites
- Node.js 16+
- Web browser (Chrome/Firefox recommended)

### Installation
```bash
# Clone the repo
git clone [repository-url]
cd G2W5-BTC-SIM

# Navigate to game directory
cd crypto-trader

# Install dependencies
npm install

# Start development server
cd public && python3 -m http.server 8090
```

### Play the Game
1. Open http://localhost:8090 in your browser
2. Choose a player profile
3. Allocate your $10M across cryptos
4. Watch the market simulation
5. See your results!

## 📁 Project Structure
```
crypto-trader/
├── src/
│   └── game.js        # Main game code
├── public/
│   └── index.html     # Game HTML
├── package.json       # Dependencies
└── node_modules/      # Phaser library

memory-bank/           # Project documentation
planning/              # Development planning
research/              # Game design research
```

## 🛠 Tech Stack
- **Frontend**: Phaser 3 (JavaScript game framework)
- **API**: CoinGecko (cryptocurrency data)
- **Deployment**: GitHub Pages / Vercel
- **Backend**: Node.js (planned for Phase 4)

## 🎮 How to Play
1. **Select Player**: Choose between test profiles or jump right in
2. **Allocate Funds**: Use [+] and [-] buttons to invest $1M blocks
3. **Lock In**: Confirm your portfolio before timer runs out
4. **Watch Market**: See 24 hours of real historical data in 30 seconds
5. **View Results**: Check your performance and try new strategies!

## 📈 Current Status
- ✅ Phase 0: Planning Complete
- ✅ Phase 1: Core Game Working
- 🚧 Phase 2: Historical Mode - Adding more time periods
- 📅 Phase 3: Historical Mode - Any date selection
- 📅 Phase 4: Live Mode - Real-time competitions
- 📅 Phase 5: Social features & persistent leaderboards

## 🤝 Contributing
This is a learning project built during a development bootcamp. Feel free to fork and experiment!

## 📄 License
MIT

---

Built with ❤️ and ☕ during an intense development sprint. 