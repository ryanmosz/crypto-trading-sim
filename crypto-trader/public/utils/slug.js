// Game code/slug utility functions

/**
 * Format a game code for display (uppercase with spacing)
 * @param {string} code - The raw game code
 * @returns {string} Formatted game code (e.g., "AB CD")
 */
export function formatGameCode(code) {
    if (!code || typeof code !== 'string') return '';
    
    // Remove any existing spaces and convert to uppercase
    const cleaned = code.replace(/\s/g, '').toUpperCase();
    
    // Return without spaces
    return cleaned;
}

/**
 * Validate a game code
 * @param {string} code - The game code to validate
 * @returns {boolean} True if valid
 */
export function validateGameCode(code) {
    if (!code || typeof code !== 'string') return false;
    
    // Remove spaces for validation
    const cleaned = code.replace(/\s/g, '');
    
    // Must be exactly 4 alphanumeric characters
    return /^[A-Za-z0-9]{4}$/.test(cleaned);
}

/**
 * Clean a game code for API usage (remove spaces, keep case)
 * @param {string} code - The game code to clean
 * @returns {string} Cleaned game code
 */
export function cleanGameCode(code) {
    if (!code || typeof code !== 'string') return '';
    return code.replace(/\s/g, '');
}

/**
 * Check if a game is still active based on end date
 * @param {string|Date} endsAt - The game end date
 * @returns {boolean} True if game is still active
 */
export function isGameActive(endsAt) {
    if (!endsAt) return false;
    
    const endDate = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
    return endDate > new Date();
}

/**
 * Format game duration for display
 * @param {number} durationDays - Duration in days (30, 60, or 90)
 * @returns {string} Formatted duration
 */
export function formatGameDuration(durationDays) {
    switch (durationDays) {
        case 30:
            return '1 Month';
        case 60:
            return '2 Months';
        case 90:
            return '3 Months';
        default:
            return `${durationDays} days`;
    }
}

/**
 * Calculate time remaining for a game
 * @param {string|Date} endsAt - The game end date
 * @returns {string} Human-readable time remaining
 */
export function getTimeRemaining(endsAt) {
    if (!endsAt) return 'Unknown';
    
    const endDate = typeof endsAt === 'string' ? new Date(endsAt) : endsAt;
    const now = new Date();
    
    if (endDate <= now) {
        return 'Ended';
    }
    
    const diffMs = endDate - now;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffDays > 0) {
        return `${diffDays} day${diffDays !== 1 ? 's' : ''} ${diffHours}h`;
    } else {
        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return `${diffHours}h ${diffMinutes}m`;
    }
}

/**
 * Get game status text
 * @param {Object} game - The game object
 * @returns {string} Status text
 */
export function getGameStatus(game) {
    if (!game) return 'Unknown';
    
    if (game.is_complete) {
        return 'Completed';
    }
    
    if (!isGameActive(game.ends_at)) {
        return 'Ended';
    }
    
    if (game.is_multiplayer) {
        return `Active (${game.participant_count || 1} players)`;
    }
    
    return 'Active';
} 