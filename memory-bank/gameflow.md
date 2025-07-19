# Game Flow & Architecture

## Scene Flow
1. **LoginScene** → Select user (Alice, Bob, Charlie)
2. **ScenarioSelectScene** → Choose historical scenario
3. **SimulationSpeedScene** → Choose simulation speed (Regular/Double)
4. **AllocationScene** → Allocate $10M portfolio in $1M blocks
5. **SimulationScene** → Watch market unfold
6. **ResultsScene** → View performance metrics

## Modular Scenario System

Each scenario is defined with:
- **Date & Description**: Historical context
- **Duration**: How long the period covers (24 hours, 1 year, etc)
- **Simulation Speeds**: 
  - Regular Speed: Default timing
  - Double Speed: Half the time
- **Data Granularity**: Hourly or monthly data points
- **Available Cryptos**: Which cryptos existed at that time
- **Price Data**: Historical price movements

### Current Scenarios:
1. **March 12, 2020** - COVID-19 Black Thursday (24 hours)
   - Regular: 30 seconds, Double: 15 seconds
2. **May 19, 2021** - China FUD Crash (24 hours)
   - Regular: 30 seconds, Double: 15 seconds
3. **2013** - Bitcoin's First Bull Run (Full Year)
   - Regular: 30 seconds, Double: 15 seconds

## Navigation
- Back buttons on every screen (except login)
- Consistent bottom-left placement
- Returns to previous screen with context preserved

## UI Features
- Color flash animations on money changes:
  - Cyan flash for adding money
  - Pink flash for removing money
- 60-second timer on allocation screen
- Lock button highlights cyan when fully allocated
- Clean, minimal UI with no text overlaps 