// Edge function to fetch crypto prices from CoinGecko
// Runs on a schedule to update price_cache table

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// CoinGecko API configuration
const COINGECKO_API_URL = "https://api.coingecko.com/api/v3";
const CRYPTO_IDS = {
  BTC: "bitcoin",
  ETH: "ethereum",
  BNB: "binancecoin",
  SOL: "solana",
  XRP: "ripple"
};

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Fetch prices from CoinGecko
    const cryptoIds = Object.values(CRYPTO_IDS).join(',');
    const response = await fetch(
      `${COINGECKO_API_URL}/simple/price?ids=${cryptoIds}&vs_currencies=usd`
    );

    if (!response.ok) {
      throw new Error(`CoinGecko API error: ${response.status}`);
    }

    const data = await response.json();
    console.log('Fetched prices:', data);

    // Transform data for our format
    const priceUpdates = [];
    for (const [symbol, geckoId] of Object.entries(CRYPTO_IDS)) {
      if (data[geckoId] && data[geckoId].usd) {
        priceUpdates.push({
          symbol,
          price: data[geckoId].usd,
          fetched_at: new Date().toISOString()
        });
      }
    }

    // Update price_cache table
    const { error: upsertError } = await supabase
      .from('price_cache')
      .upsert(priceUpdates, { 
        onConflict: 'symbol',
        ignoreDuplicates: false 
      });

    if (upsertError) {
      throw new Error(`Database update error: ${upsertError.message}`);
    }

    // Log success
    console.log(`Updated ${priceUpdates.length} crypto prices`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        updated: priceUpdates.length,
        prices: priceUpdates 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in fetch-prices function:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
}); 