# 🚀 Deployment Guide for Crypto Trading Simulator

## Prerequisites

- Supabase account with a project
- GitHub account (for hosting)
- Basic knowledge of Git

## Step 1: Supabase Setup

### 1.1 Create Tables
The tables should already be created if you've been following along, but verify:
- `profiles`
- `past_runs` 
- `active_games`
- `price_history`
- `prices_cache`

### 1.2 Deploy Edge Functions

1. Install Supabase CLI:
```bash
npm install -g supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link your project:
```bash
supabase link --project-ref your-project-ref
```

4. Deploy the price update function:
```bash
cd crypto-trader
supabase functions deploy update-game-prices
```

### 1.3 Set Up Cron Job

In your Supabase dashboard:
1. Go to Database → Extensions
2. Enable `pg_cron` extension
3. Go to SQL Editor and run:

```sql
-- Schedule price updates every hour
SELECT cron.schedule(
    'update-game-prices',
    '0 * * * *', -- Every hour
    $$
    SELECT net.http_post(
        url:='https://your-project-ref.supabase.co/functions/v1/update-game-prices',
        headers:='{"Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
    ) AS request_id;
    $$
);
```

## Step 2: Frontend Deployment

### 2.1 Update Configuration

1. Create `crypto-trader/public/config.js`:
```javascript
// Production configuration
window.SUPABASE_URL = 'https://your-project-ref.supabase.co';
window.SUPABASE_ANON_KEY = 'your-anon-key';
```

2. Update `crypto-trader/public/index.html` to include it:
```html
<script src="./config.js"></script>
```

### 2.2 Deploy to GitHub Pages

1. Create a new GitHub repository

2. Push your code:
```bash
git remote add origin https://github.com/YOUR_USERNAME/crypto-trading-sim.git
git push -u origin main
```

3. Enable GitHub Pages:
   - Go to Settings → Pages
   - Source: Deploy from a branch
   - Branch: main, folder: /crypto-trader/public
   - Save

Your game will be available at:
`https://YOUR_USERNAME.github.io/crypto-trading-sim/`

## Step 3: Enable Real-Time Price Updates

### 3.1 CoinGecko API

1. Get a free API key from [CoinGecko](https://www.coingecko.com/en/api)

2. Update the edge function with your API key:
```typescript
// In update-game-prices/index.ts
const COINGECKO_API_KEY = Deno.env.get('COINGECKO_API_KEY');
```

3. Set the secret in Supabase:
```bash
supabase secrets set COINGECKO_API_KEY=your-api-key
```

### 3.2 Enable Price Fetching

Uncomment the price fetching code in the edge function:
```typescript
// Fetch real prices from CoinGecko API
const response = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,dogecoin&vs_currencies=usd',
    {
        headers: {
            'x-cg-demo-api-key': COINGECKO_API_KEY
        }
    }
);
```

## Step 4: Security Checklist

- [ ] RLS policies enabled on all tables
- [ ] Service role key not exposed in frontend
- [ ] CORS properly configured
- [ ] API rate limits considered
- [ ] Error handling in place

## Step 5: Monitoring

### 5.1 Supabase Dashboard
- Monitor active users
- Check database performance
- Review edge function logs

### 5.2 Error Tracking
Consider adding error tracking:
```javascript
window.addEventListener('error', (event) => {
    // Log to your error tracking service
    console.error('Global error:', event.error);
});
```

## Optional Enhancements

### Custom Domain
1. Add a CNAME file in `/crypto-trader/public`:
```
yourdomain.com
```

2. Configure DNS settings with your domain provider

### PWA Support
Add a manifest.json for installability:
```json
{
    "name": "Crypto Trader Simulator",
    "short_name": "CryptoSim",
    "start_url": "/",
    "display": "standalone",
    "theme_color": "#00ffff",
    "background_color": "#000000"
}
```

## Troubleshooting

### Games not updating
- Check edge function logs in Supabase dashboard
- Verify cron job is running: `SELECT * FROM cron.job;`
- Test function manually

### Authentication issues
- Verify Supabase URL and anon key
- Check RLS policies
- Review auth settings in Supabase

### Performance issues
- Enable connection pooling
- Add indexes on frequently queried columns
- Consider caching strategies

## Maintenance

- Regularly update dependencies
- Monitor API rate limits
- Keep price data fresh
- Archive old completed games periodically