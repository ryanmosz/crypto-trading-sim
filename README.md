# Crypto Trading Sim

Unity WebGL game. Start with $10M, pick cryptos, compete.

## About

A cryptocurrency trading simulator where players invest virtual money across BTC, ETH, BNB, SOL, and XRP. Built with Unity 2022.3 for web browsers.

### The Vision

Players compete in 24-hour trading cycles:
- Start with $10 million virtual funds
- Allocate 100 points across 5 cryptocurrencies
- Watch real-time price movements affect portfolio value
- Compete on global leaderboard
- Top traders win each daily cycle

### Current State (MVP)

✅ **Working:**
- Login screen with two test users (Alice & Bob)
- Basic UI with visual effects (glowing buttons)
- Scene navigation to main portfolio screen
- WebGL build system

❌ **Not Yet Implemented:**
- Point allocation system
- Live crypto price data
- Portfolio calculations
- Leaderboard/multiplayer
- 24-hour game cycles

## Setup

1. Unity 2022.3.62f1
2. Open project
3. Play from `Login.unity`

## Build

```bash
# In Unity: Tools > Build WebGL Now
# Then:
./serve-webgl.sh
```

## Test Users

- Alice: Conservative strategy
- Bob: Risk taker

Both start at $10M. 