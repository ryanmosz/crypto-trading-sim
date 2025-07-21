import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Game code generator - 4 character alphanumeric
function generateGameCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? ''
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: false
      }
    })

    // Get auth header and verify user
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Invalid token or user not found')
    }

    // Parse request body
    const { duration, allocations } = await req.json()

    // Validate input
    if (!duration || ![30, 60, 90].includes(duration)) {
      throw new Error('Invalid duration. Must be 30, 60, or 90 days')
    }

    if (!allocations || typeof allocations !== 'object') {
      throw new Error('Invalid allocations')
    }

    // Validate allocation percentages sum to 100
    const totalAllocation = Object.values(allocations).reduce((sum: number, val: any) => sum + Number(val), 0)
    if (totalAllocation !== 10) { // 10 points total
      throw new Error('Allocations must sum to 10')
    }

    // Fetch current prices from prices_cache
    const { data: pricesData, error: pricesError } = await supabase
      .from('prices_cache')
      .select('symbol, price')
    
    if (pricesError) {
      throw new Error('Failed to fetch current prices')
    }

    // Convert prices array to object
    const startingPrices: Record<string, number> = {}
    pricesData.forEach(p => {
      startingPrices[p.symbol] = Number(p.price)
    })

    // Generate unique game code with retry logic
    let gameCode: string | null = null
    let attempts = 0
    const maxAttempts = 10

    while (!gameCode && attempts < maxAttempts) {
      const candidateCode = generateGameCode()
      
      // Check if code already exists
      const { data: existingGame } = await supabase
        .from('active_games')
        .select('id')
        .eq('game_code', candidateCode)
        .single()
      
      if (!existingGame) {
        gameCode = candidateCode
      }
      attempts++
    }

    if (!gameCode) {
      throw new Error('Failed to generate unique game code')
    }

    // Calculate end date
    const endsAt = new Date()
    endsAt.setDate(endsAt.getDate() + duration)

    // Start transaction by creating game
    const { data: gameData, error: gameError } = await supabase
      .from('active_games')
      .insert({
        user_id: user.id,
        duration_days: duration,
        ends_at: endsAt.toISOString(),
        allocations: allocations,
        starting_prices: startingPrices,
        starting_money: 10000000,
        current_prices: startingPrices,
        current_value: 10000000,
        last_updated: new Date().toISOString(),
        is_multiplayer: true,
        participant_count: 1,
        game_code: gameCode
      })
      .select()
      .single()

    if (gameError) {
      console.error('Game creation error:', gameError)
      throw new Error('Failed to create game')
    }

    // Add creator as first participant
    const { error: participantError } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameData.id,
        user_id: user.id,
        allocations: allocations,
        starting_value: 10000000,
        current_value: 10000000,
        is_original_creator: true
      })

    if (participantError) {
      // Rollback - delete the game if participant creation fails
      await supabase
        .from('active_games')
        .delete()
        .eq('id', gameData.id)
      
      throw new Error('Failed to add creator as participant')
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          game_id: gameData.id,
          game_code: gameCode,
          starting_prices: startingPrices,
          duration_days: duration,
          ends_at: gameData.ends_at
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in create-game function:', error)
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || 'An error occurred'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: error.message?.includes('authorization') ? 401 : 400
      }
    )
  }
}) 