import { formatGameCode, validateGameCode, cleanGameCode } from '../utils/slug.js';
import { auth } from '../auth.js';

// Helper function to get CONFIG values
function getConfig() {
    if (!window.CONFIG) {
        throw new Error('CONFIG not loaded. Make sure config.js is loaded before using the API.');
    }
    return {
        SUPABASE_URL: window.CONFIG.SUPABASE_URL,
        SUPABASE_ANON_KEY: window.CONFIG.SUPABASE_ANON_KEY
    };
}

/**
 * Get the current authentication token from Supabase session
 * @returns {Promise<string>} The access token
 * @throws {Error} If no active session exists
 */
async function getAuthToken() {
    const supabase = auth.supabase;
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        throw new Error('No active session');
    }
    return session.access_token;
}

/**
 * Make an authenticated request to a Supabase Edge Function
 * @param {string} endpoint - The function endpoint name
 * @param {Object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<Object>} The response data
 * @throws {Error} If the request fails or returns an error
 */
async function makeAuthenticatedRequest(endpoint, options = {}) {
    const token = await getAuthToken();
    const config = getConfig();
    
    const response = await fetch(`${config.SUPABASE_URL}/functions/v1/${endpoint}`, {
        ...options,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
            'apikey': config.SUPABASE_ANON_KEY,
            ...options.headers
        }
    });

    const data = await response.json();
    
    if (!response.ok || !data.success) {
        throw new Error(data.error || 'Request failed');
    }
    
    return data.data;
}

/**
 * Create a new multiplayer game
 * @param {number} duration - Game duration (30, 60, or 90 days)
 * @param {Object} allocations - Crypto allocations (must sum to 10)
 * @returns {Promise<{game_id, game_code, starting_prices, duration_days, ends_at}>}
 */
export async function createNowGame({ duration, allocations }) {
    return makeAuthenticatedRequest('create-game', {
        method: 'POST',
        body: JSON.stringify({ duration, allocations })
    });
}

/**
 * Join an existing multiplayer game
 * @param {string} gameId - The game ID to join
 * @param {Object} allocations - Crypto allocations (must sum to 10)
 * @returns {Promise<{game_id, game_code, participant_id, starting_prices, duration_days, ends_at, participant_count}>}
 */
export async function joinNowGame({ gameId, allocations }) {
    return makeAuthenticatedRequest('join-game', {
        method: 'POST',
        body: JSON.stringify({ gameId, allocations })
    });
}

/**
 * Find a game by its 4-character code
 * @param {string} gameCode - The 4-character game code
 * @returns {Promise<Object>} - The game data
 */
export async function findGameByCode(gameCode) {
    const supabase = auth.supabase;
    
    const { data, error } = await supabase
        .from('active_games')
        .select('*')
        .eq('game_code', gameCode)  // Remove .toUpperCase() to make it case-sensitive
        .eq('is_multiplayer', true)
        .eq('is_complete', false)
        .single();
        
    if (error) {
        throw new Error('Game not found or no longer active');
    }
    
    return data;
}

/**
 * Get participants for a game
 * @param {string} gameId - The game ID
 * @returns {Promise<Array>} - Array of participants with their data
 */
export async function getGameParticipants(gameId) {
    const supabase = auth.supabase;
    
    const { data, error } = await supabase
        .from('game_participants')
        .select(`
            *,
            profiles:user_id (username)
        `)
        .eq('game_id', gameId)
        .order('current_value', { ascending: false });
        
    if (error) {
        throw new Error('Failed to fetch participants');
    }
    
    return data;
}

/**
 * Check if a user has already joined a game
 * @param {string} gameId - The game ID
 * @param {string} userId - The user ID
 * @returns {Promise<boolean>} - True if user has joined
 */
export async function hasUserJoinedGame(gameId, userId) {
    const supabase = auth.supabase;
    
    const { data } = await supabase
        .from('game_participants')
        .select('id')
        .eq('game_id', gameId)
        .eq('user_id', userId)
        .single();
        
    return !!data;
} 