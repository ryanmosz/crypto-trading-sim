# Lightweight Backend API for Unity WebGL Client

## Overview
Minimal backend service to support the Unity WebGL crypto trading simulator. Focuses on price data delivery and competitive ranking without complex user authentication.

## API Endpoints

### 1. Price Data

#### GET /api/prices/current
Returns current prices for all supported cryptocurrencies.

**Response:**
```json
{
    "timestamp": "2024-01-15T10:30:00Z",
    "prices": {
        "BTC": 43567.23,
        "ETH": 2234.56,
        "BNB": 312.45,
        "SOL": 98.76,
        "XRP": 0.5432
    }
}
```

#### GET /api/prices/historical/{duration}
Returns price history for charting.

**Parameters:**
- `duration`: "1h", "24h", "7d"

**Response:**
```json
{
    "duration": "24h",
    "interval": "1h",
    "data": [
        {
            "timestamp": "2024-01-14T10:00:00Z",
            "prices": {
                "BTC": 43100.00,
                "ETH": 2200.00,
                "BNB": 310.00,
                "SOL": 95.00,
                "XRP": 0.5400
            }
        }
        // ... more data points
    ]
}
```

### 2. Game Sessions

#### POST /api/game/start
Starts a new game session for a player.

**Request:**
```json
{
    "playerName": "CryptoTrader123", // Optional guest name
    "allocations": {
        "BTC": 35,
        "ETH": 30,
        "BNB": 20,
        "SOL": 10,
        "XRP": 5
    }
}
```

**Response:**
```json
{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "startTime": "2024-01-15T10:30:00Z",
    "endTime": "2024-01-16T10:30:00Z",
    "initialPrices": {
        "BTC": 43567.23,
        "ETH": 2234.56,
        "BNB": 312.45,
        "SOL": 98.76,
        "XRP": 0.5432
    },
    "initialValue": 10000000
}
```

#### GET /api/game/status/{sessionId}
Gets current game status and player performance.

**Response:**
```json
{
    "sessionId": "550e8400-e29b-41d4-a716-446655440000",
    "currentValue": 10234567,
    "returnPercentage": 2.35,
    "rank": 127,
    "totalPlayers": 1000,
    "percentile": 87.3,
    "timeRemaining": 70337, // seconds
    "assetPerformance": [
        {
            "symbol": "BTC",
            "allocation": 35,
            "currentValue": 3584348,
            "returnPercentage": 2.41
        }
        // ... other assets
    ]
}
```

### 3. Rankings

#### GET /api/rankings/current
Gets current game rankings.

**Response:**
```json
{
    "gameEndTime": "2024-01-16T10:30:00Z",
    "totalPlayers": 1000,
    "topPlayers": [
        {
            "rank": 1,
            "playerName": "CryptoKing",
            "returnPercentage": 5.23,
            "finalValue": 10523000
        },
        {
            "rank": 2,
            "playerName": "MoonShot",
            "returnPercentage": 4.87,
            "finalValue": 10487000
        }
        // ... top 100
    ]
}
```

#### GET /api/rankings/percentiles
Gets percentile distribution for context.

**Response:**
```json
{
    "percentiles": {
        "99": 5.23,  // Top 1% achieved 5.23% or better
        "95": 3.45,
        "90": 2.78,
        "75": 1.56,
        "50": 0.23,  // Median return
        "25": -1.45,
        "10": -2.89,
        "5": -3.67
    }
}
```

## Implementation Options

### Option 1: Serverless (Recommended for MVP)
- **AWS Lambda** + API Gateway
- **DynamoDB** for session storage
- **CloudWatch** for scheduled price updates

```javascript
// Lambda function example
exports.getCurrentPrices = async (event) => {
    const prices = await fetchFromCoinGecko();
    await cachePrices(prices);
    
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            timestamp: new Date().toISOString(),
            prices: prices
        })
    };
};
```

### Option 2: Simple Node.js Server
```javascript
// Express server
const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Price cache updated every 30 seconds
let priceCache = {};
setInterval(updatePrices, 30000);

app.get('/api/prices/current', (req, res) => {
    res.json({
        timestamp: new Date().toISOString(),
        prices: priceCache
    });
});

app.listen(3000);
```

## Data Sources

### Primary: CoinGecko API (Free Tier)
```bash
GET https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd
```

### Backup: Binance API
```bash
GET https://api.binance.com/api/v3/ticker/price?symbols=["BTCUSDT","ETHUSDT","BNBUSDT","SOLUSDT","XRPUSDT"]
```

## Caching Strategy

1. **Price Data**: 30-second cache
2. **Rankings**: 1-minute cache
3. **Historical Data**: 5-minute cache

## Security Considerations

1. **CORS**: Configure for your game domain
2. **Rate Limiting**: 100 requests per minute per IP
3. **Input Validation**: Validate allocation percentages sum to 100
4. **No Authentication**: Guest mode only for MVP

## Deployment Quick Start

### Using Vercel (Simplest)
```json
// vercel.json
{
    "functions": {
        "api/*.js": {
            "runtime": "@vercel/node@2"
        }
    },
    "rewrites": [
        { "source": "/api/(.*)", "destination": "/api/$1" }
    ]
}
```

### Using AWS Lambda
```yaml
# serverless.yml
service: crypto-sim-api

provider:
  name: aws
  runtime: nodejs18.x
  region: us-east-1

functions:
  getPrices:
    handler: handlers/prices.getCurrent
    events:
      - http:
          path: /prices/current
          method: get
          cors: true
```

## Estimated Costs

- **Serverless**: ~$0-5/month for < 10,000 users
- **VPS**: ~$5-10/month for dedicated server
- **API Costs**: Free tier sufficient for MVP

## Unity Integration Example

```csharp
// In Unity APIClient.cs
public class APIClient : MonoBehaviour {
    private const string API_BASE = "https://your-api.vercel.app/api";
    
    public async Task<PriceData> GetCurrentPrices() {
        using (UnityWebRequest request = UnityWebRequest.Get($"{API_BASE}/prices/current")) {
            var operation = request.SendWebRequest();
            
            while (!operation.isDone) {
                await Task.Yield();
            }
            
            if (request.result == UnityWebRequest.Result.Success) {
                return JsonUtility.FromJson<PriceData>(request.downloadHandler.text);
            }
            
            throw new Exception($"Failed to fetch prices: {request.error}");
        }
    }
}
``` 