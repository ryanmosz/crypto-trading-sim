# 🔐 Updating Your Supabase Keys

Since you've rotated your keys, here's where to update them:

## 1. Anon Key (Public - OK to commit)
Update your **new anon key** in these files:

### `crypto-trader/public/config.js` (line 5)
```javascript
window.SUPABASE_ANON_KEY = 'YOUR_NEW_ANON_KEY_HERE';
```

### `crypto-trader/public/auth.js` (line 9)
```javascript
const SUPABASE_ANON_KEY = window.SUPABASE_ANON_KEY || 'YOUR_NEW_ANON_KEY_HERE';
```

## 2. Service Role Key (Secret - NEVER commit)
Keep this in a local `.env.local` file:

### Create `crypto-trader/.env.local` (git ignored)
```bash
SUPABASE_SERVICE_ROLE_KEY=YOUR_NEW_SERVICE_ROLE_KEY_HERE
```

## 3. Edge Functions
Update your edge function with the new service role key:
1. Go to Supabase Dashboard > Edge Functions
2. Update the environment variable for your function

## 4. Verify Everything Works
1. Test authentication (login/signup)
2. Test price updates
3. Test game creation and loading

## Important Notes
- ✅ Anon keys are safe to commit (they're public)
- ❌ Service role keys should NEVER be in your code
- 🔄 After updating, restart your local server

Remember: The anon key is used by the frontend and has limited permissions. The service role key has full access and should only be used server-side!