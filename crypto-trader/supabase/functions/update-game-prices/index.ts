// Supabase Edge Function to update game prices and complete expired games
// Deploy with: supabase functions deploy update-game-prices

import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Update active game values based on current prices
    const { error: updateError } = await supabaseClient
      .rpc('update_active_game_values')
    
    if (updateError) {
      console.error('Error updating game values:', updateError)
      throw updateError
    }

    // Complete any expired games
    const { error: completeError } = await supabaseClient
      .rpc('complete_expired_games')
    
    if (completeError) {
      console.error('Error completing expired games:', completeError)
      throw completeError
    }

    // Optional: Fetch real prices from CoinGecko API
    // const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,binancecoin,ripple,dogecoin&vs_currencies=usd')
    // const prices = await response.json()
    // 
    // const priceMap = {
    //   BTC: prices.bitcoin.usd,
    //   ETH: prices.ethereum.usd,
    //   BNB: prices.binancecoin.usd,
    //   XRP: prices.ripple.usd,
    //   DOGE: prices.dogecoin.usd
    // }
    //
    // for (const [symbol, price] of Object.entries(priceMap)) {
    //   await supabaseClient
    //     .from('prices_cache')
    //     .upsert({ symbol, price })
    // }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Game prices updated and expired games completed' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})