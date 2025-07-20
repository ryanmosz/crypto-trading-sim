# Deploy to v0 - Quick Guide

## ✅ Your Game is Ready for v0!

The Crypto Trading Simulator is 100% feature complete and ready to deploy. Here's how:

## 🚀 Quick Deploy Steps

1. **Prepare Environment File**
   ```bash
   cd crypto-trader/public
   cp env.js.example env.js
   ```
   
2. **Edit `env.js`** with your Supabase credentials:
   ```javascript
   const ENV = {
     SUPABASE_URL: 'https://yuobwpszomojorrjiwlp.supabase.co',
     SUPABASE_ANON_KEY: 'eyJhbGc...' // Your anon key (safe for frontend)
   };
   ```

3. **Deploy to v0**:
   - Go to [v0.dev](https://v0.dev)
   - Create new project
   - Upload the contents of `crypto-trader/public/` directory
   - Your game will be live!

## 📁 Files to Deploy

Upload everything in `crypto-trader/public/`:
- `index.html`
- `game.js`
- `auth.js`
- `api-integration.js`
- `config.js`
- `env.js` (with your values)

## ⚡ What's Working

- ✅ All 3 game modes (Historical, Now, Training)
- ✅ User authentication
- ✅ Real-time price updates (every 5 minutes)
- ✅ Leaderboards
- ✅ Game saves and history
- ✅ Beautiful UI

## 🔒 Security Note

- Only include the `SUPABASE_ANON_KEY` in frontend code
- Never include `SUPABASE_SERVICE_ROLE_KEY` in frontend
- The service role key is only for backend/edge functions

## 🎮 Live Features

Once deployed, users can:
1. Sign up/login with email
2. Play historical crypto scenarios
3. Start "Now Mode" challenges (30/60/90 days)
4. Track their portfolio in real-time
5. Compete on global leaderboards
6. View their trading history

Your game is production-ready! 🎉 