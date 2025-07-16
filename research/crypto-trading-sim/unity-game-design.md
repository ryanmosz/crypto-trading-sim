# Unity WebGL Crypto Trading Simulation - Game Design

## Overview
A streamlined cryptocurrency trading simulation built in Unity for WebGL deployment. Players allocate 100 points (representing percentage of capital) across 5 cryptocurrencies and watch their performance in real-time.

## Core Game Flow

### Screen 1: Investment Allocation
```
┌─────────────────────────────────────────────────────────┐
│                 CRYPTO INVESTMENT SIMULATOR              │
│                                                         │
│              Allocate Your 100 Points                   │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │  Bitcoin (BTC)         [▼ 35 ▲]      35 points  │  │
│  │  ████████████████░░░░░░░░░░░░░░      $43,567    │  │
│  │                                                  │  │
│  │  Ethereum (ETH)        [▼ 30 ▲]      30 points  │  │
│  │  ███████████████░░░░░░░░░░░░░░░      $2,234     │  │
│  │                                                  │  │
│  │  BNB                   [▼ 20 ▲]      20 points  │  │
│  │  ██████████░░░░░░░░░░░░░░░░░░░░      $312       │  │
│  │                                                  │  │
│  │  Solana (SOL)          [▼ 10 ▲]      10 points  │  │
│  │  █████░░░░░░░░░░░░░░░░░░░░░░░░░      $98        │  │
│  │                                                  │  │
│  │  XRP                   [▼ 5 ▲]       5 points   │  │
│  │  ██░░░░░░░░░░░░░░░░░░░░░░░░░░░░      $0.54      │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│           Points Remaining: 0 / 100                     │
│                                                         │
│              [ LOCK IN INVESTMENT ]                     │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

### Screen 2: Performance Dashboard
```
┌─────────────────────────────────────────────────────────┐
│                  YOUR INVESTMENT PERFORMANCE             │
│                                                         │
│  Portfolio Value: $10,234,567  ▲ +2.35%                │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │     YOUR ASSETS              PERFORMANCE         │  │
│  │                                                  │  │
│  │  BTC (35%)  $3,584,348      ▲ +2.41%           │  │
│  │  ETH (30%)  $3,098,223      ▲ +3.26%           │  │
│  │  BNB (20%)  $1,956,445      ▼ -2.18%           │  │
│  │  SOL (10%)  $1,054,234      ▲ +5.42%           │  │
│  │  XRP (5%)   $541,317        ▼ -0.67%           │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
│  ┌─────────────────────────────────────────────────┐  │
│  │              RANKINGS & METRICS                  │  │
│  │                                                  │  │
│  │  Your Return:        +2.35%                     │  │
│  │  Your Rank:          #127 of 1,000              │  │
│  │  Percentile:         87.3% (Top 12.7%)          │  │
│  │                                                  │  │
│  │  Time Elapsed:       4h 23m                     │  │
│  │  Game Ends In:       19h 37m                    │  │
│  └─────────────────────────────────────────────────┘  │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Unity Implementation Details

### UI Components

1. **Point Allocation System**
   - Increment/decrement buttons (±1, ±5, ±10)
   - Visual progress bars that fill as points are allocated
   - Real-time validation (can't exceed 100 total)
   - Current price display for context

2. **Performance Indicators**
   - Green up arrows / Red down arrows
   - Color-coded percentage changes
   - Animated transitions for value changes
   - Pulsing effects for significant movements

3. **Ranking Metrics**
   - Absolute rank (#127 of 1,000)
   - Percentile calculation
   - Visual percentile bar
   - Comparative performance indicators

### Visual Design in Unity

1. **Color Palette**
   - Background: Dark grey (#1a1a1a)
   - Primary: Blue (#2196F3)
   - Success: Green (#4CAF50)
   - Danger: Red (#F44336)
   - Text: White (#FFFFFF) with opacity variations

2. **Animations**
   - Smooth transitions between screens
   - Number counters that animate when values change
   - Subtle particle effects for positive performance
   - Pulsing glow on "Lock In" button when ready

3. **Responsive Design**
   - Canvas scaler for different screen sizes
   - Anchor presets for UI elements
   - Aspect ratio handling for various browsers

### Data Architecture

```csharp
// Core Data Structures
public class Portfolio {
    public Dictionary<string, int> allocations;  // "BTC" -> 35
    public float initialValue = 10000000f;
    public float currentValue;
    public float returnPercentage;
}

public class CryptoAsset {
    public string symbol;
    public string name;
    public float currentPrice;
    public float priceChange24h;
    public float allocation;
    public float currentValue;
}

public class PlayerStats {
    public int rank;
    public int totalPlayers;
    public float percentile;
    public float returnRate;
}
```

### Technical Requirements

1. **Unity Setup**
   - Unity 2021.3 LTS or newer
   - WebGL build target
   - TextMeshPro for text rendering
   - DOTween for animations

2. **Backend Integration**
   - RESTful API for price data
   - WebSocket for real-time updates
   - JSON serialization for data exchange

3. **WebGL Optimization**
   - Compressed textures
   - Minimal draw calls
   - Efficient UI batching
   - Progressive loading

## Scoring Metrics

### Primary Metrics
1. **Return on Investment (ROI)**
   - Formula: `(Current Value - Initial Value) / Initial Value × 100`
   - Display with 2 decimal precision

2. **Percentile Ranking**
   - Formula: `(Total Players - Your Rank) / Total Players × 100`
   - Shows how you compare to others

3. **Individual Asset Performance**
   - Track each cryptocurrency's contribution
   - Show best/worst performers

### Secondary Metrics
- Peak portfolio value
- Time at #1 position
- Volatility score
- Consistency rating

## User Experience Flow

1. **First Load**
   - Brief loading screen with tips
   - Immediate presentation of allocation screen
   - No login required initially (guest mode)

2. **Making Investment**
   - Click/tap to adjust points
   - Visual feedback for every change
   - Clear indication when ready to lock in

3. **Watching Performance**
   - Auto-refresh every 30 seconds
   - Smooth animations for changes
   - Clear visual hierarchy of information

## Future Enhancements

1. **Phase 2**
   - User accounts and history
   - Multiple concurrent games
   - Different game durations

2. **Phase 3**
   - Leaderboards
   - Achievement system
   - Social features

3. **Phase 4**
   - Mobile app versions
   - Advanced trading options
   - Tournament modes 