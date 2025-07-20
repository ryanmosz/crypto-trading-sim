// Supabase Edge Function to update game prices and complete expired games
// Deploy with: supabase functions deploy update-game-prices
// Set up cron: SELECT cron.schedule('update-prices', '0 * * * *', $$SELECT net.http_post(...)$$);

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Initialize Supabase client
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// CoinGecko API configuration
const COINGECKO_API_KEY = Deno.env.get('COINGECKO_API_KEY');
const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Crypto mappings
const CRYPTO_MAP = {
  BTC: 'bitcoin',
  ETH: 'ethereum',
  BNB: 'binancecoin',
  XRP: 'ripple',
  DOGE: 'dogecoin'
};

// Fetch current prices from CoinGecko
async function fetchCurrentPrices(): Promise<Record<string, number>> {
  try {
    // If no API key, use test data
    if (!COINGECKO_API_KEY) {
      console.log('No CoinGecko API key, using test data with ±10% variations');
      return await generateTestPrices();
    }

    const ids = Object.values(CRYPTO_MAP).join(',');
    const url = `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=usd`;
    
    const response = await fetch(url, {
      headers: {
        'x-cg-demo-api-key': COINGECKO_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const prices: Record<string, number> = {};
    
    for (const [symbol, geckoId] of Object.entries(CRYPTO_MAP)) {
      if (data[geckoId]?.usd) {
        prices[symbol] = data[geckoId].usd;
      } else {
        console.warn(`No price found for ${symbol} (${geckoId})`);
      }
    }
    
    if (Object.keys(prices).length === 0) {
      throw new Error('No prices returned from API');
    }
    
    return prices;
  } catch (error) {
    console.error('Error fetching from CoinGecko:', error);
    // Fallback to test prices
    return await generateTestPrices();
  }
}

// Generate test prices with random variations
async function generateTestPrices(): Promise<Record<string, number>> {
  // Get current prices from cache as baseline
  const { data: cachedPrices } = await supabase
    .from('prices_cache')
    .select('symbol, price');
  
  const prices: Record<string, number> = {};
  
  if (cachedPrices && cachedPrices.length > 0) {
    // Apply ±10% random change to cached prices
    for (const { symbol, price } of cachedPrices) {
      const change = (Math.random() - 0.5) * 0.2; // -10% to +10%
      prices[symbol] = Math.round(price * (1 + change) * 100) / 100;
    }
  } else {
    // Fallback base prices with variations
    const basePrices = {
      BTC: 98500,
      ETH: 3850,
      BNB: 725,
      XRP: 2.40,
      DOGE: 0.42
    };
    
    for (const [symbol, basePrice] of Object.entries(basePrices)) {
      const change = (Math.random() - 0.5) * 0.2; // -10% to +10%
      prices[symbol] = Math.round(basePrice * (1 + change) * 100) / 100;
    }
  }
  
  return prices;
}

// Update prices in cache
async function updatePricesCache(prices: Record<string, number>) {
  const updates = Object.entries(prices).map(([symbol, price]) => ({
    symbol,
    price,
    fetched_at: new Date().toISOString()
  }));
  
  const { error } = await supabase
    .from('prices_cache')
    .upsert(updates, { onConflict: 'symbol' });
  
  if (error) {
    console.error('Error updating prices cache:', error);
    throw error;
  }
  
  console.log('Updated prices:', prices);
}

// Store price history (called less frequently to save space)
async function storePriceHistory(prices: Record<string, number>) {
  const history = Object.entries(prices).map(([symbol, price]) => ({
    symbol,
    price,
    timestamp: new Date().toISOString()
  }));
  
  const { error } = await supabase
    .from('price_history')
    .insert(history);
  
  if (error) {
    console.error('Error storing price history:', error);
    // Don't throw - this is non-critical
  } else {
    console.log('Stored price history snapshot');
  }
}

// Clean up old price history (keep last 30 days)
async function cleanupOldHistory() {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  
  const { error } = await supabase
    .from('price_history')
    .delete()
    .lt('timestamp', thirtyDaysAgo.toISOString());
  
  if (error) {
    console.error('Error cleaning up old history:', error);
  }
}

// Main handler
serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify request method
    if (req.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers: corsHeaders });
    }

    console.log('=== Starting price update job ===');
    const startTime = Date.now();
    
    // Step 1: Fetch current prices
    console.log('Fetching current prices...');
    const prices = await fetchCurrentPrices();
    
    // Step 2: Update cache
    console.log('Updating price cache...');
    await updatePricesCache(prices);
    
    // Step 3: Store history (every 4 hours to avoid too much data)
    const now = new Date();
    if (now.getHours() % 4 === 0) {
      console.log('Storing price history snapshot...');
      await storePriceHistory(prices);
      
      // Clean up old history
      await cleanupOldHistory();
    }
    
    // Step 4: Update active game values
    console.log('Updating active game values...');
    const { error: updateError } = await supabase.rpc('update_active_game_values');
    if (updateError) {
      console.error('Error updating game values:', updateError);
      // Don't throw - continue to complete expired games
    }
    
    // Step 5: Complete expired games
    console.log('Checking for expired games...');
    const { data: completedGames, error: completeError } = await supabase.rpc('complete_expired_games');
    if (completeError) {
      console.error('Error completing games:', completeError);
    } else if (completedGames && completedGames.length > 0) {
      console.log(`✅ Completed ${completedGames.length} expired games`);
      
      // TODO: Send notifications to users about completed games
      // This could be done via:
      // - Email notifications
      // - Push notifications
      // - In-app message queue
    }
    
    const duration = Date.now() - startTime;
    console.log(`=== Job completed in ${duration}ms ===`);
    
    // Return success response
    return new Response(JSON.stringify({
      success: true,
      prices,
      completedGames: completedGames?.length || 0,
      duration: `${duration}ms`,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    });
    
  } catch (error) {
    console.error('Edge function error:', error);
    return new Response(JSON.stringify({
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500
    });
  }
});