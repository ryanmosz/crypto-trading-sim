// Configuration file for Crypto Trading Simulator
// Copy this to config.js and fill in your values

// Supabase Configuration
window.SUPABASE_URL = 'https://your-project-ref.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key-here';

// Feature Flags (for development/testing)
window.FEATURES = {
  // Enable real-time price updates from CoinGecko
  LIVE_PRICES: false,
  
  // Show leaderboard on dashboard
  LEADERBOARD: true,
  
  // Enable sound effects
  SOUND_EFFECTS: true,
  
  // Show price change animations
  PRICE_ANIMATIONS: true,
  
  // Development/Debug mode
  DEBUG_MODE: false
};

// Game Configuration
window.GAME_CONFIG = {
  // Starting money for all games
  STARTING_MONEY: 10000000, // $10M
  
  // Available durations for Now mode (days)
  NOW_MODE_DURATIONS: [30, 60, 90],
  
  // Price update frequency (minutes) - for UI polling
  PRICE_UPDATE_INTERVAL: 5,
  
  // Maximum past games to show per page
  GAMES_PER_PAGE: 5,
  
  // Chart configuration
  CHART_DATA_POINTS: 10,
  CHART_HEIGHT: 80,
  
  // Colors
  COLORS: {
    PROFIT: '#00ff00',
    LOSS: '#ff0066',
    NEUTRAL: '#666666',
    ACCENT: '#00ffff',
    WARNING: '#ffff00',
    DANGER: '#ff1493'
  }
};

// API Configuration (optional)
window.API_CONFIG = {
  // CoinGecko API endpoint (if using frontend fetching)
  COINGECKO_URL: 'https://api.coingecko.com/api/v3',
  
  // Rate limiting (requests per minute)
  RATE_LIMIT: 10
};