# Phase 3: Live Data Integration Guide

## Overview
**Duration**: 1-2 days (8 hours)  
**Goal**: Live dashboard with real-time price updates and portfolio tracking

## Prerequisites
- [x] Phase 2 complete (allocation system working)
- [x] Portfolio data saved in PlayerPrefs
- [x] Basic understanding of coroutines

## Milestone 3: Mock Data Dashboard (4 hours)

### Step 1: Dashboard Layout (45 min)

Create dashboard scene structure:
```
Canvas
├── Header
│   ├── Title ("PORTFOLIO PERFORMANCE")
│   └── TimeRemaining ("23h 45m remaining")
├── TotalValuePanel
│   ├── TotalValue ("$10,000,000")
│   └── ProfitLoss ("+$125,000 (+1.25%)")
├── ScrollView
│   └── Content
│       └── [Portfolio Cards]
└── EndGameButton (temporary)
```

### Step 2: Mock Price Provider (45 min)

Create `Assets/Scripts/Managers/MockPriceProvider.cs` to simulate price movements:
- Base prices for each crypto
- Random walk algorithm (-2% to +2% per update)
- Update every 2 seconds
- Broadcast changes via events

### Step 3: Dashboard Manager (1 hour)

Create `Assets/Scripts/Managers/DashboardManager.cs`:
- Load saved allocations
- Calculate initial quantities based on $10M
- Track portfolio performance
- Update UI with price changes
- Handle game timer (24 hours)

### Step 4: Portfolio Cards (45 min)

Create reusable portfolio card UI:
- Show crypto symbol and name
- Display current value
- Show profit/loss percentage
- Animate price changes
- Color coding (green/red)

### Milestone 3 Complete! ✅
Test with mock data updating in real-time.

---

## Milestone 4: Real API Integration (4 hours)

### Step 1: CoinGecko Integration (1.5 hours)

Create `Assets/Scripts/Managers/CoinGeckoAPI.cs`:
```csharp
// API endpoint: https://api.coingecko.com/api/v3/simple/price
// Parameters: ids=bitcoin,ethereum,binancecoin,solana,ripple&vs_currencies=usd
// Rate limit: 50 calls/minute (update every 30 seconds)
```

Key features:
- UnityWebRequest for API calls
- JSON parsing with Newtonsoft
- Error handling and retries
- Respect rate limits

### Step 2: Price Provider Interface (30 min)

Create swappable price providers:
- `IPriceProvider` interface
- Mock implementation
- CoinGecko implementation
- Easy switching between them

### Step 3: Fallback System (45 min)

Implement graceful degradation:
- Check internet connectivity
- Try CoinGecko first
- Fall back to mock on failure
- Show "Live" indicator when using real data

### Step 4: Testing & Polish (1.5 hours)

- Test with real API
- Handle edge cases
- Add loading states
- Smooth animations
- Cache last known prices

### Milestone 4 Complete! ✅
Real-time crypto prices in your game!

---

## Implementation Details

### Portfolio Value Calculation
```
Initial Investment = $10,000,000
BTC Allocation = 40% = $4,000,000
BTC Start Price = $45,000
BTC Quantity = $4,000,000 / $45,000 = 88.89 BTC

Current Value = Quantity × Current Price
Profit/Loss = (Current Value - Initial Investment) / Initial Investment × 100
```

### API Response Format
```json
{
  "bitcoin": { "usd": 45123.50 },
  "ethereum": { "usd": 3245.80 },
  "binancecoin": { "usd": 425.30 },
  "solana": { "usd": 125.60 },
  "ripple": { "usd": 0.68 }
}
```

### Performance Optimization
- Update UI only when prices change
- Use object pooling for price animations
- Batch API requests
- Cache sprites and materials

## Testing Checklist

- [ ] Mock prices update smoothly
- [ ] Portfolio calculations correct
- [ ] Timer counts down properly
- [ ] API integration works
- [ ] Fallback handles failures
- [ ] No memory leaks
- [ ] 60 FPS maintained

## Next Phase

Ready for Phase 4? Open [phase4-multiplayer.md](phase4-multiplayer.md) to build the backend. 