# Phase 4: Multiplayer Backend Guide

## Overview
**Duration**: 2 days (10 hours)  
**Goal**: Deploy backend API for multiplayer competition and leaderboards

## Prerequisites
- [x] Phase 3 complete (dashboard with live prices)
- [x] Node.js installed
- [x] Vercel account (free tier)
- [x] Basic understanding of REST APIs

## Milestone 5: Backend Foundation (6 hours)

### Step 1: Initialize Backend Project (30 min)

```bash
# In project root
mkdir backend && cd backend
npm init -y
npm install express cors body-parser
npm install -D @vercel/node nodemon

# Create folder structure
mkdir api data utils
```

### Step 2: Create API Endpoints (1.5 hours)

Create `backend/api/index.js`:
```javascript
const express = require('express');
const cors = require('cors');
const app = express();

// Enable CORS for Unity WebGL
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

// Join game
app.post('/api/game/join', (req, res) => {
  const { username, allocations } = req.body;
  // Create game session
  // Return gameId and startPrices
});

// Get leaderboard
app.get('/api/game/leaderboard', (req, res) => {
  // Return top 100 players
});

// Submit final score
app.post('/api/game/complete', (req, res) => {
  const { gameId, finalValue } = req.body;
  // Calculate rank
  // Store result
});

module.exports = app;
```

### Step 3: Data Storage (1 hour)

For MVP, use simple JSON file storage:

Create `backend/data/storage.js`:
```javascript
const fs = require('fs').promises;
const path = require('path');

class Storage {
  constructor() {
    this.dataFile = path.join(__dirname, 'games.json');
    this.leaderboardFile = path.join(__dirname, 'leaderboard.json');
  }
  
  async saveGame(gameData) {
    // Save to JSON file
  }
  
  async getLeaderboard() {
    // Return sorted leaderboard
  }
}

module.exports = new Storage();
```

### Step 4: Deploy to Vercel (1 hour)

1. Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "api/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "/api/index.js"
    }
  ]
}
```

2. Deploy:
```bash
npm install -g vercel
vercel --prod
```

### Step 5: Unity Integration (2 hours)

Create `Assets/Scripts/Managers/BackendAPI.cs`:
```csharp
using UnityEngine;
using UnityEngine.Networking;
using System.Collections;
using System.Text;

public class BackendAPI : MonoBehaviour
{
    private string baseUrl = "https://your-app.vercel.app/api";
    
    public IEnumerator JoinGame(string username, Dictionary<string, float> allocations)
    {
        var data = new {
            username = username,
            allocations = allocations,
            timestamp = System.DateTime.UtcNow
        };
        
        string json = JsonUtility.ToJson(data);
        
        using (UnityWebRequest request = new UnityWebRequest($"{baseUrl}/game/join", "POST"))
        {
            byte[] bodyRaw = Encoding.UTF8.GetBytes(json);
            request.uploadHandler = new UploadHandlerRaw(bodyRaw);
            request.downloadHandler = new DownloadHandlerBuffer();
            request.SetRequestHeader("Content-Type", "application/json");
            
            yield return request.SendWebRequest();
            
            if (request.result == UnityWebRequest.Result.Success)
            {
                // Process response
                Debug.Log("Game joined successfully");
            }
        }
    }
}
```

### Milestone 5 Complete! ✅
Backend deployed and Unity can communicate with it.

---

## Milestone 6: Multiplayer Results (4 hours)

### Step 1: Results Screen UI (1 hour)

Update Results scene:
```
Canvas
├── Header
│   └── Title ("GAME COMPLETE")
├── YourResult
│   ├── Rank ("#15")
│   ├── Username ("Player123")
│   └── FinalValue ("$10,250,000")
├── Leaderboard
│   └── ScrollView
│       └── [Top 10 Players]
└── PlayAgainButton
```

### Step 2: Leaderboard Manager (1 hour)

Create `Assets/Scripts/Managers/LeaderboardManager.cs`:
- Fetch leaderboard from API
- Display top players
- Highlight current player
- Show celebration for top 3

### Step 3: Game Completion Flow (1 hour)

Update DashboardManager:
- When timer reaches 0, calculate final value
- Submit to backend
- Navigate to results
- Show loading during API calls

### Step 4: Polish & Testing (1 hour)

- Add loading states
- Error handling for API failures
- Celebration animations
- Test with multiple players

### Milestone 6 Complete! ✅
Full multiplayer experience working!

---

## API Documentation

### POST /api/game/join
Request:
```json
{
  "username": "Player123",
  "allocations": {
    "BTC": 40,
    "ETH": 30,
    "BNB": 15,
    "SOL": 10,
    "XRP": 5
  }
}
```

Response:
```json
{
  "gameId": "abc-123",
  "startPrices": {
    "BTC": 45000,
    "ETH": 3200,
    "BNB": 420,
    "SOL": 120,
    "XRP": 0.65
  }
}
```

### GET /api/game/leaderboard
Response:
```json
{
  "leaderboard": [
    {
      "rank": 1,
      "username": "CryptoKing",
      "finalValue": 12500000,
      "profitPercent": 25.0
    }
  ]
}
```

### POST /api/game/complete
Request:
```json
{
  "gameId": "abc-123",
  "finalValue": 10250000
}
```

## Testing Checklist

- [ ] Backend API responds correctly
- [ ] Unity can join games
- [ ] Leaderboard updates in real-time
- [ ] Multiple players see each other
- [ ] Results screen shows correct rank
- [ ] Play again flow works
- [ ] API handles errors gracefully

## Security Considerations

- Validate all inputs
- Rate limit API endpoints
- Don't trust client-side calculations
- Use HTTPS only
- Consider adding API keys

## Next Phase

Ready for Phase 5? Open [phase5-polish.md](phase5-polish.md) to add the final polish. 