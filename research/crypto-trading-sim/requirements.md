# MVP Requirements - Crypto Trading Simulation

## Functional Requirements

### User Management
- **FR1.1**: Users can register with email and password
- **FR1.2**: Users can log in to access their account
- **FR1.3**: Each user has a unique profile with trading history
- **FR1.4**: Users can view their current and past game results

### Game Mechanics
- **FR2.1**: Each user starts with $10,000,000 virtual currency
- **FR2.2**: Users allocate percentages across exactly 5 cryptocurrencies
- **FR2.3**: Total allocation must equal 100%
- **FR2.4**: Investments are locked once confirmed (no trading during game)
- **FR2.5**: Game runs for a predetermined time period
- **FR2.6**: Winner determined by highest portfolio value at end

### Portfolio Interface
- **FR3.1**: Slider interface for each cryptocurrency (0-100%)
- **FR3.2**: Real-time percentage display as sliders move
- **FR3.3**: Visual feedback showing remaining allocation
- **FR3.4**: Confirmation step before locking investments
- **FR3.5**: Display current prices at time of investment

### Data & Scoring
- **FR4.1**: Real-time price data for BTC, ETH, BNB, SOL, XRP
- **FR4.2**: Calculate portfolio value based on current prices
- **FR4.3**: Show percentage gain/loss for each player
- **FR4.4**: Leaderboard showing top performers
- **FR4.5**: Historical game results stored

## Non-Functional Requirements

### Performance
- **NFR1.1**: Price updates at least every 60 seconds
- **NFR1.2**: Support minimum 100 concurrent users
- **NFR1.3**: Page load time under 3 seconds

### Security
- **NFR2.1**: Secure password storage (hashing)
- **NFR2.2**: Session management for logged-in users
- **NFR2.3**: Input validation on all forms

### Usability
- **NFR3.1**: Mobile-responsive design
- **NFR3.2**: Intuitive slider interface
- **NFR3.3**: Clear visual feedback for all actions

### Scalability
- **NFR4.1**: Modular architecture for future features
- **NFR4.2**: Database design supports multiple game modes
- **NFR4.3**: API structure allows additional cryptocurrencies

## Time Period Options

### Option 1: Quick Game (1 Hour)
- Good for testing and engagement
- Enough volatility to create winners
- Multiple games per day possible

### Option 2: Daily Game (24 Hours)
- More realistic market movements
- Players check once per day
- Better for casual players

### Option 3: Weekly Game (7 Days)
- Significant price movements
- Less frequent engagement needed
- More strategic planning

**Recommendation**: Start with 24-hour games for MVP

## Data Requirements

### Cryptocurrency Price API
- Need reliable source (CoinGecko, CoinMarketCap, Binance)
- Real-time or near real-time updates
- Historical data for backtesting

### Database Schema (Simplified)
- Users table (id, email, password_hash, created_at)
- Games table (id, start_time, end_time, duration)
- Portfolios table (user_id, game_id, allocations, initial_value, final_value)
- Price_snapshots table (coin, price, timestamp) 