# Modular Scenario System Design

## Overview
The game now supports multiple historical time periods with a flexible scenario system that handles:
- Different time spans (24 hours, 1 year, etc.)
- Variable data granularity (hourly, monthly)
- Period-appropriate cryptocurrency availability
- Configurable simulation speeds
- **NEW**: "Now" placeholder for future real-time trading

## Scenario Structure

Each scenario contains:
```javascript
{
    id: 'scenario_key',
    date: "Display date",
    displayName: "March 12, 2020",
    subtitle: "(24 hours)",
    description: "Event description",
    duration: "24 hours", // or "1 year", etc.
    defaultSimulationTime: 30, // default seconds
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "hourly", // or "monthly"
    timeLabels: [...], // Array of labels for each data point
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: false, reason: "Not created until 2015" }
    },
    prices: {
        BTC: { start: X, hourly/monthly: [...], end: Y }
    }
}
```

## Simulation Speed Selection

After selecting a scenario, players choose their preferred simulation speed:
- **Regular Speed**: Default timing for comfortable viewing
- **Double Speed**: Half the time for faster gameplay

This allows players to:
- Choose their preferred pacing
- Replay scenarios quickly
- Accommodate different attention spans

## Time Display Logic

The simulation adapts its display based on scenario properties:

### Hourly Data (24-hour scenarios)
- Shows "Hour X/24" during simulation
- Updates every ~1.25 seconds (regular) or ~0.625 seconds (double)
- Suitable for day-long crash/rally events

### Monthly Data (Year-long scenarios)
- Shows "Month/Year" during simulation
- Updates every ~2.5 seconds (regular) or ~1.25 seconds (double)
- Suitable for long-term trend scenarios

## Handling Unavailable Cryptocurrencies

For historical accuracy, some cryptos may not exist in earlier scenarios:

### Allocation Screen
- Unavailable cryptos show grayed-out text
- Display reason: "Not created until [year]"
- Cannot be selected or allocated to
- Maintains historical authenticity

### Simulation Screen
- Only shows available cryptos
- Portfolio calculations exclude unavailable assets
- Results screen only displays traded cryptos

## Adding New Scenarios

To add a new scenario:

1. Define the scenario object with all required fields
2. Add appropriate speed options (can customize beyond regular/double)
3. Specify which cryptos were available
4. Provide historical price data
5. Add to SCENARIOS object with unique key

Example for a week-long scenario:
```javascript
speeds: {
    regular: { label: "Regular (60s)", multiplier: 1, time: 60 },
    fast: { label: "Fast (30s)", multiplier: 2, time: 30 },
    rapid: { label: "Rapid (15s)", multiplier: 4, time: 15 }
}
```

## Current Scenarios

1. **"Now" (Placeholder)**
   - Real-time trading stub
   - Shows current static prices
   - All cryptos available
   - Will connect to live price feeds in future

2. **March 12, 2020 - COVID Black Thursday**

## Future Enhancements

The modular system supports:
- Custom speed configurations per scenario
- Different numbers of speed options
- Variable simulation lengths based on content
- Educational overlays triggered at specific time points
- Dynamic event markers during simulation 