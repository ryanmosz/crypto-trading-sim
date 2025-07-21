import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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
    const { gameId, allocations } = await req.json()

    // Validate input
    if (!gameId) {
      throw new Error('Game ID is required')
    }

    if (!allocations || typeof allocations !== 'object') {
      throw new Error('Invalid allocations')
    }

    // Validate allocation percentages sum to 100
    const totalAllocation = Object.values(allocations).reduce((sum: number, val: any) => sum + Number(val), 0)
    if (totalAllocation !== 10) { // 10 points total
      throw new Error('Allocations must sum to 10')
    }

    // Check if game exists and is multiplayer
    const { data: gameData, error: gameError } = await supabase
      .from('active_games')
      .select('*')
      .eq('id', gameId)
      .eq('is_multiplayer', true)
      .eq('is_complete', false)
      .single()

    if (gameError || !gameData) {
      throw new Error('Game not found or not joinable')
    }

    // Check if user has already joined this game
    const { data: existingParticipant } = await supabase
      .from('game_participants')
      .select('id')
      .eq('game_id', gameId)
      .eq('user_id', user.id)
      .single()

    if (existingParticipant) {
      throw new Error('You have already joined this game')
    }

    // Check if user is the game creator
    if (gameData.user_id === user.id) {
      throw new Error('You cannot join your own game')
    }

    // Insert participant record
    const { data: participantData, error: participantError } = await supabase
      .from('game_participants')
      .insert({
        game_id: gameId,
        user_id: user.id,
        allocations: allocations,
        starting_value: 10000000,
        current_value: 10000000,
        is_original_creator: false
      })
      .select()
      .single()

    if (participantError) {
      console.error('Participant creation error:', participantError)
      throw new Error('Failed to join game')
    }

    // Increment participant count
    const newParticipantCount = (gameData.participant_count || 1) + 1
    const { error: updateError } = await supabase
      .from('active_games')
      .update({ 
        participant_count: newParticipantCount,
        last_updated: new Date().toISOString()
      })
      .eq('id', gameId)

    if (updateError) {
      // Rollback - delete the participant record
      await supabase
        .from('game_participants')
        .delete()
        .eq('id', participantData.id)
      
      throw new Error('Failed to update participant count')
    }

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        data: {
          game_id: gameId,
          game_code: gameData.game_code,
          participant_id: participantData.id,
          starting_prices: gameData.starting_prices,
          duration_days: gameData.duration_days,
          ends_at: gameData.ends_at,
          participant_count: newParticipantCount
        }
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200
      }
    )

  } catch (error) {
    console.error('Error in join-game function:', error)
    
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