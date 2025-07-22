# Test URLs for Crypto Trader

## ⚠️ IMPORTANT: Always use PORT 8001, not 8080!

The game runs on **http://localhost:8001/** - this is your Python server running from the `crypto-trader/public` directory.

## Main Application
- **Main Game**: http://localhost:8001/

## Authentication & Session Tests
- **Enhanced Auth Test** (with logging): http://localhost:8001/test-auth-enhanced.html
- **Simple Auth Test**: http://localhost:8001/test-auth-simple.html
- **RLS Verification**: http://localhost:8001/test-rls-verification.html

## Multiplayer Tests
- **Two-Player Test** (side-by-side view): http://localhost:8001/test-multiplayer-two-player.html
- **Comprehensive Multiplayer Test**: http://localhost:8001/test-multiplayer-comprehensive.html
- **API Test**: http://localhost:8001/test-multiplayer-api.html
- **Simple API Test**: http://localhost:8001/test-api-simple.html

## Database Tests
- **DB Cleanup Service**: http://localhost:8001/test-db-cleanup-service.html
- **DB Cleanup**: http://localhost:8001/test-db-cleanup.html

## Utility Tests
- **Key Test**: http://localhost:8001/test-keys.html

## Notes
- If you see a directory listing, you're on the wrong port (probably 8080)
- All test pages now have append-only logging with a "Copy Log" button
- Make sure you're logged in at http://localhost:8001/ before testing authenticated features 