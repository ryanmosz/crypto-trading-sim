# Database Schema - Crypto Trading Simulation

## PostgreSQL Schema Design

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
```

### Games Table
```sql
CREATE TABLE games (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    game_number SERIAL UNIQUE,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    duration_hours INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    initial_balance DECIMAL(15, 2) DEFAULT 10000000.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_status CHECK (status IN ('pending', 'active', 'completed', 'cancelled'))
);

CREATE INDEX idx_games_status ON games(status);
CREATE INDEX idx_games_end_time ON games(end_time);
```

### Cryptocurrencies Table
```sql
CREATE TABLE cryptocurrencies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    symbol VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL,
    display_order INTEGER NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    icon_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial cryptocurrencies
INSERT INTO cryptocurrencies (symbol, name, display_order) VALUES
    ('BTC', 'Bitcoin', 1),
    ('ETH', 'Ethereum', 2),
    ('BNB', 'Binance Coin', 3),
    ('SOL', 'Solana', 4),
    ('XRP', 'XRP', 5);
```

### Portfolios Table
```sql
CREATE TABLE portfolios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    initial_balance DECIMAL(15, 2) NOT NULL,
    final_balance DECIMAL(15, 2),
    return_percentage DECIMAL(8, 4),
    final_rank INTEGER,
    is_locked BOOLEAN DEFAULT FALSE,
    locked_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_game UNIQUE (user_id, game_id)
);

CREATE INDEX idx_portfolios_user_id ON portfolios(user_id);
CREATE INDEX idx_portfolios_game_id ON portfolios(game_id);
CREATE INDEX idx_portfolios_final_rank ON portfolios(final_rank);
```

### Portfolio Allocations Table
```sql
CREATE TABLE portfolio_allocations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    portfolio_id UUID NOT NULL REFERENCES portfolios(id) ON DELETE CASCADE,
    cryptocurrency_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    allocation_percentage DECIMAL(5, 2) NOT NULL CHECK (allocation_percentage >= 0 AND allocation_percentage <= 100),
    allocation_amount DECIMAL(15, 2) NOT NULL,
    initial_price DECIMAL(15, 8) NOT NULL,
    initial_quantity DECIMAL(20, 8) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_portfolio_crypto UNIQUE (portfolio_id, cryptocurrency_id)
);

CREATE INDEX idx_allocations_portfolio_id ON portfolio_allocations(portfolio_id);
```

### Price Snapshots Table
```sql
CREATE TABLE price_snapshots (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cryptocurrency_id UUID NOT NULL REFERENCES cryptocurrencies(id),
    price DECIMAL(15, 8) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE NOT NULL,
    source VARCHAR(50) DEFAULT 'coingecko',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_price_snapshots_crypto_time ON price_snapshots(cryptocurrency_id, timestamp DESC);
CREATE INDEX idx_price_snapshots_timestamp ON price_snapshots(timestamp DESC);
```

### User Sessions Table
```sql
CREATE TABLE user_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) UNIQUE NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_sessions_token ON user_sessions(token_hash);
CREATE INDEX idx_sessions_expires ON user_sessions(expires_at);
```

### Game Results View
```sql
CREATE VIEW game_results AS
SELECT 
    p.id as portfolio_id,
    p.user_id,
    u.username,
    p.game_id,
    g.game_number,
    p.initial_balance,
    p.final_balance,
    p.return_percentage,
    p.final_rank,
    g.start_time,
    g.end_time,
    g.status as game_status
FROM portfolios p
JOIN users u ON p.user_id = u.id
JOIN games g ON p.game_id = g.id
WHERE p.is_locked = TRUE;
```

### Leaderboard View
```sql
CREATE VIEW leaderboard AS
SELECT 
    u.id as user_id,
    u.username,
    COUNT(DISTINCT p.game_id) as games_played,
    AVG(p.return_percentage) as avg_return,
    COUNT(CASE WHEN p.final_rank = 1 THEN 1 END) as wins,
    COUNT(CASE WHEN p.final_rank <= 3 THEN 1 END) as top_three_finishes,
    MAX(p.return_percentage) as best_return,
    MIN(p.return_percentage) as worst_return
FROM users u
JOIN portfolios p ON u.id = p.user_id
WHERE p.final_balance IS NOT NULL
GROUP BY u.id, u.username;
```

## Redis Schema (Cache)

### Current Prices
```
Key: prices:current
Type: Hash
Fields: {
    "BTC": "43567.23",
    "ETH": "2234.56",
    "BNB": "312.45",
    "SOL": "98.76",
    "XRP": "0.5432"
}
TTL: 60 seconds
```

### Game Leaderboard
```
Key: game:{game_id}:leaderboard
Type: Sorted Set
Members: user_id
Scores: return_percentage
TTL: Until game ends + 1 hour
```

### User Session
```
Key: session:{token}
Type: Hash
Fields: {
    "user_id": "uuid",
    "username": "string",
    "expires_at": "timestamp"
}
TTL: Session duration
```

## Database Migrations

### Migration Order
1. Create users table
2. Create games table
3. Create cryptocurrencies table and seed data
4. Create portfolios table
5. Create portfolio_allocations table
6. Create price_snapshots table
7. Create user_sessions table
8. Create views

### Indexes Strategy
- Primary keys: UUID for flexibility
- Foreign keys: Cascade deletes where appropriate
- Performance indexes on frequently queried columns
- Composite indexes for complex queries

## Data Integrity Rules

1. **Portfolio Allocations**: Sum must equal 100%
2. **Game Timing**: End time must be after start time
3. **Price Data**: No negative prices allowed
4. **User Uniqueness**: Email and username must be unique
5. **Portfolio Lock**: Can't modify after locking 