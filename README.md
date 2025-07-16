# 🎮 Crypto Trading Simulator

A Unity WebGL game where players compete to build the best cryptocurrency portfolio.

## 🎯 Game Overview

- Start with $10 million virtual money
- Allocate across BTC, ETH, BNB, SOL, and XRP
- Track real-time performance
- Compete on global leaderboard
- 24-hour game cycles

## 🚀 Quick Start

### Requirements
- Unity Hub
- Unity 2022.3 LTS with WebGL support
- Docker Desktop (optional)
- Git

### Local Development
```bash
# 1. Clone the repository
git clone [your-repo-url]
cd crypto-trading-sim

# 2. Open in Unity Hub
# Click "Open" and select this folder

# 3. Switch to WebGL platform
# File → Build Settings → WebGL → Switch Platform

# 4. Press Play to test
# Or Build & Run to test in browser
```

### Docker Build
```bash
# Build with Docker
docker-compose up

# Access game at
http://localhost:8080
```

## 📁 Project Structure

```
├── Assets/           # Unity game assets
│   ├── Scripts/      # C# game logic
│   ├── Scenes/       # Game screens
│   ├── UI/           # UI components
│   └── Materials/    # Visual assets
├── builds/           # WebGL output
├── planning/         # Development plans
├── research/         # Design documents
└── backend/          # API server (future)
```

## 🎨 Game Screens

1. **Welcome Screen** - Entry point with optional username
2. **Allocation Screen** - Distribute 100 points across cryptos
3. **Dashboard** - Live portfolio tracking
4. **Results** - Final rankings and play again

## 🛠️ Development

See `/planning/` folder for:
- Quick start guide
- Daily sprint plan
- Technical setup
- Troubleshooting

## 📝 Documentation

- **Planning**: `/planning/00-START-HERE.md`
- **Design**: `/research/crypto-trading-sim/MASTER-PLAN.md`
- **API**: Coming in v2

## 🎯 Roadmap

### ✅ MVP (Week 1)
- [x] Planning documents
- [ ] Unity project setup
- [ ] Basic navigation
- [ ] Allocation system
- [ ] Live dashboard
- [ ] Multiplayer backend
- [ ] Deploy to production

### 🔮 Future Features
- Social login
- Tournament mode
- More cryptocurrencies
- Mobile apps
- NFT rewards

## 🤝 Contributing

1. Follow the planning documents
2. Test all changes locally
3. Build with Docker before committing
4. Update documentation

## 📄 License

[Your License Here]

---

Built with Unity 💙 | Powered by real crypto data 📈 