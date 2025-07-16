# Technical Architecture - Crypto Trading Simulation

## System Architecture Overview

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │     │   Backend API   │     │   Database      │
│   (React/Vue)   │────▶│   (Node/Python) │────▶│   (PostgreSQL)  │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                         
         │                       ▼                         
         │              ┌─────────────────┐               
         └─────────────▶│  Price API      │               
                        │  (External)     │               
                        └─────────────────┘               
```

## Technology Stack Recommendations

### Frontend
- **Framework**: React or Vue.js for reactive UI
- **State Management**: Redux/Vuex for game state
- **UI Components**: Material-UI or Ant Design
- **Charts**: Chart.js or D3.js for portfolio visualization
- **Slider Component**: React-slider or custom implementation

### Backend
- **Framework**: Node.js with Express or Python with FastAPI
- **Authentication**: JWT tokens
- **Real-time Updates**: WebSockets or Server-Sent Events
- **Task Queue**: Bull (Node) or Celery (Python) for price updates

### Database
- **Primary**: PostgreSQL for relational data
- **Cache**: Redis for real-time price data
- **Sessions**: Redis for user sessions

### External Services
- **Price API**: CoinGecko API (free tier available)
- **Alternative**: Binance API or CoinMarketCap API

## Modular Design

### Core Modules

1. **Authentication Module**
   - User registration/login
   - Session management
   - Password reset

2. **Game Engine Module**
   - Game lifecycle management
   - Portfolio calculations
   - Winner determination

3. **Portfolio Module**
   - Allocation interface
   - Validation logic
   - Investment locking

4. **Price Service Module**
   - API integration
   - Price caching
   - Historical data storage

5. **Leaderboard Module**
   - Score calculation
   - Ranking algorithm
   - Historical results

### API Design

```
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/logout

GET    /api/games/current
POST   /api/games/join
GET    /api/games/history

POST   /api/portfolio/allocate
GET    /api/portfolio/current
GET    /api/portfolio/history

GET    /api/prices/current
GET    /api/prices/historical

GET    /api/leaderboard/current
GET    /api/leaderboard/all-time
```

## Data Flow

1. **Price Updates**
   ```
   External API → Price Service → Redis Cache → Database
                                      ↓
                              WebSocket → Frontend
   ```

2. **Portfolio Submission**
   ```
   Frontend → Validation → Database → Confirmation
                  ↓
            Redis Cache (for quick access)
   ```

3. **Game Results**
   ```
   Scheduler → Calculate Results → Update Database → Notify Users
                      ↓
              Update Leaderboard
   ```

## Security Considerations

- HTTPS for all communications
- Input validation on all endpoints
- Rate limiting on API calls
- Secure password hashing (bcrypt)
- CORS configuration for frontend

## Scalability Path

### Phase 1 (MVP)
- Single server deployment
- Basic caching
- 100 concurrent users

### Phase 2
- Load balancer
- Multiple backend instances
- Database read replicas
- 1,000 concurrent users

### Phase 3
- Microservices architecture
- Message queue for events
- Distributed caching
- 10,000+ concurrent users

## Development Phases

1. **Phase 1**: Core Backend (2 weeks)
   - Database schema
   - Authentication
   - Basic API endpoints

2. **Phase 2**: Price Integration (1 week)
   - External API integration
   - Price caching
   - Update mechanisms

3. **Phase 3**: Frontend Development (2 weeks)
   - Portfolio interface
   - User dashboard
   - Leaderboard

4. **Phase 4**: Game Logic (1 week)
   - Game lifecycle
   - Results calculation
   - Notifications

5. **Phase 5**: Testing & Deployment (1 week)
   - Unit tests
   - Integration tests
   - Deployment setup 