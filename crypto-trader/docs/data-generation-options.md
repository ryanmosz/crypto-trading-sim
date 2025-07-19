# Historical Crypto Data Generation Options

## Current Implementation
- Manually hardcoded price arrays in game.js
- Based on real historical events but entered by hand
- Limited to 3 scenarios

## Recommended Improvements

### 1. API Integration (Best for Production)
```javascript
// Example using CoinGecko API (free tier available)
async function fetchHistoricalData(coinId, date, hours = 24) {
    const endDate = new Date(date);
    const startDate = new Date(endDate - hours * 60 * 60 * 1000);
    
    const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?` +
        `vs_currency=usd&from=${startDate.getTime()/1000}&to=${endDate.getTime()/1000}`
    );
    
    const data = await response.json();
    return data.prices.map(([timestamp, price]) => price);
}
```

### 2. Pre-fetched JSON Files
```javascript
// Store historical data in separate JSON files
// crypto-trader/data/scenarios/march_2020.json
{
    "date": "2020-03-12",
    "description": "COVID-19 Black Thursday",
    "prices": {
        "BTC": { "hourly": [...], "source": "coingecko" },
        "ETH": { "hourly": [...], "source": "coingecko" }
    }
}
```

### 3. CSV Import with Processing
```javascript
// Import from CSV files with historical data
// Allows easy updates from financial data sources
function parseCSV(csvData) {
    const lines = csvData.split('\n');
    const headers = lines[0].split(',');
    return lines.slice(1).map(line => {
        const values = line.split(',');
        return headers.reduce((obj, header, i) => {
            obj[header] = parseFloat(values[i]);
            return obj;
        }, {});
    });
}
```

### 4. Algorithmic Generation (for testing/demo)
```javascript
// Generate realistic price movements algorithmically
function generateCrashScenario(startPrice, volatility, hours) {
    const prices = [startPrice];
    let currentPrice = startPrice;
    
    for (let i = 1; i < hours; i++) {
        // Simulate crash with recovery pattern
        const crashPhase = i < hours / 3;
        const recoveryPhase = i > hours * 2/3;
        
        let change;
        if (crashPhase) {
            change = -Math.random() * volatility * 0.15; // Steep decline
        } else if (recoveryPhase) {
            change = Math.random() * volatility * 0.05; // Slight recovery
        } else {
            change = (Math.random() - 0.5) * volatility * 0.02; // Stabilization
        }
        
        currentPrice *= (1 + change);
        prices.push(Math.round(currentPrice * 100) / 100);
    }
    
    return prices;
}
```

## Implementation Priority

1. **Quick Win**: Move data to separate JSON files
2. **Medium Term**: Add CSV import capability
3. **Long Term**: Integrate with crypto APIs for live data
4. **Optional**: Add algorithmic generation for "what-if" scenarios

## API Options

### Free Tier APIs:
- **CoinGecko**: 10-50 calls/minute, historical data available
- **CryptoCompare**: 100k calls/month free
- **Messari**: Limited free tier

### Paid Options:
- **CoinMarketCap**: More reliable, better rate limits
- **Nomics**: High-quality historical data
- **Kaiko**: Professional-grade data

## Data Storage Considerations

For production, consider:
1. **Cache API responses** to avoid rate limits
2. **Pre-fetch popular scenarios** at build time
3. **Store in database** for faster access
4. **Compress data** for large date ranges 