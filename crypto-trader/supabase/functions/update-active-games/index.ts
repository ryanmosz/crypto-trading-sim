import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey',
}

// Calculate portfolio value based on current prices and allocations
function calculatePortfolioValue(
  allocations: Record<string, number>,
  currentPrices: Record<string, number>,
  startingMoney: number
): number {
  let totalValue = 0
  
  // Each allocation point represents 10% of starting money
  Object.entries(allocations).forEach(([symbol, points]) => {
    const allocation = Number(points)
    const investmentAmount = (allocation / 10) * startingMoney
    const currentPrice = currentPrices[symbol] || 0
    
    // For crypto pairs like BTC/ETH, we need the price of the base currency
    if (symbol.includes('/')) {
      const [base] = symbol.split('/')
      const basePrice = currentPrices[base] || 0
      totalValue += investmentAmount * (currentPrice * basePrice)
    } else {
      totalValue += investmentAmount * currentPrice
    }
  })
  
  return totalValue
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false
      }
    })

    // Fetch latest prices from prices_cache
    const { data: pricesData, error: pricesError } = await supabase
      .from('prices_cache')
      .select('symbol, price, fetched_at')
      .order('fetched_at', { ascending: false })
    
    if (pricesError) {
      throw new Error('Failed to fetch current prices')
    }

    // Convert prices array to object and get latest fetch time
    const currentPrices: Record<string, number> = {}
    let latestFetchTime = new Date(0)
    
    pricesData.forEach(p => {
      currentPrices[p.symbol] = Number(p.price)
      const fetchTime = new Date(p.fetched_at)
      if (fetchTime > latestFetchTime) {
        latestFetchTime = fetchTime
      }
    })

    // Get all active games
    const { data: activeGames, error: gamesError } = await supabase
      .from('active_games')
      .select('*')
      .eq('is_complete', false)
    
    if (gamesError) {
      throw new Error('Failed to fetch active games')
    }

    if (!activeGames || activeGames.length === 0) {
      return new Response(
        JSON.stringify({
          success: true,
          message: 'No active games to update'
        }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 200
        }
      )
    }

    const now = new Date()
    const updatePromises = []
    const completedGameIds = []

    // Process each active game
    for (const game of activeGames) {
      const gameEndTime = new Date(game.ends_at)
      const isComplete = now > gameEndTime
      
      // Calculate current portfolio value
      const currentValue = calculatePortfolioValue(
        game.allocations,
        currentPrices,
        game.starting_money
      )

      // Prepare update data
      const updateData: any = {
        current_prices: currentPrices,
        current_value: currentValue,
        last_updated: latestFetchTime.toISOString()
      }

      // Mark as complete if time has expired
      if (isComplete) {
        updateData.is_complete = true
        updateData.final_value = currentValue
        updateData.completed_at = now.toISOString()
        completedGameIds.push(game.id)
      }

      // Update game record
      updatePromises.push(
        supabase
          .from('active_games')
          .update(updateData)
          .eq('id', game.id)
      )

      // Update all participants for this game
      if (game.participant_count > 0) {
        const { data: participants, error: participantsError } = await supabase
          .from('game_participants')
          .select('*')
          .eq('game_id', game.id)
        
        if (!participantsError && participants) {
          for (const participant of participants) {
            // Calculate participant's portfolio value based on their allocations
            const participantValue = calculatePortfolioValue(
              participant.allocations,
              currentPrices,
              participant.starting_value
            )
            
            updatePromises.push(
              supabase
                .from('game_participants')
                .update({ 
                  current_value: participantValue 
                })
                .eq('id', participant.id)
            )
          }
        }
      }
    }

    // Execute all updates
    await Promise.all(updatePromises)

    // Insert price history records for tracking
    const priceHistoryPromises = activeGames.map(game => {
      const currentValue = calculatePortfolioValue(
        game.allocations,
        currentPrices,
        game.starting_money
      )
      
      return supabase
        .from('price_history')
        .insert({
          game_id: game.id,
          prices: currentPrices,
          portfolio_value: currentValue
        })
    })

    await Promise.all(priceHistoryPromises)

    // Return summary
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          games_updated: activeGames.length,
          games_completed: completedGameIds.length,
          last_price_update: latestFetchTime.toISOString()
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in update-active-games function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
}) 