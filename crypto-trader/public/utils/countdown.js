// Countdown timer utility functions

/**
 * Calculate time remaining from created date and duration
 * @param {string} createdAt - ISO date string when game was created
 * @param {number} durationDays - Duration of the game in days
 * @returns {object} Time remaining breakdown
 */
export function calculateTimeRemaining(createdAt, durationDays) {
    const created = new Date(createdAt);
    const endTime = new Date(created.getTime() + (durationDays * 24 * 60 * 60 * 1000));
    const now = new Date();
    
    const totalSeconds = Math.max(0, Math.floor((endTime - now) / 1000));
    
    if (totalSeconds === 0) {
        return {
            days: 0,
            hours: 0,
            minutes: 0,
            seconds: 0,
            totalSeconds: 0,
            isExpired: true
        };
    }
    
    const days = Math.floor(totalSeconds / (24 * 60 * 60));
    const hours = Math.floor((totalSeconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((totalSeconds % (60 * 60)) / 60);
    const seconds = totalSeconds % 60;
    
    return {
        days,
        hours,
        minutes,
        seconds,
        totalSeconds,
        isExpired: false
    };
}

/**
 * Format time remaining as "29d 23h 59m 45s"
 * @param {object} timeRemaining - Object from calculateTimeRemaining
 * @returns {string} Formatted string
 */
export function formatTimeRemaining(timeRemaining) {
    if (timeRemaining.isExpired) {
        return 'EXPIRED';
    }
    
    const parts = [];
    
    if (timeRemaining.days > 0) {
        parts.push(`${timeRemaining.days}d`);
    }
    if (timeRemaining.hours > 0 || parts.length > 0) {
        parts.push(`${timeRemaining.hours}h`);
    }
    if (timeRemaining.minutes > 0 || parts.length > 0) {
        parts.push(`${timeRemaining.minutes}m`);
    }
    parts.push(`${timeRemaining.seconds}s`);
    
    return parts.join(' ');
}

/**
 * Get color based on time remaining
 * @param {number} totalSeconds - Total seconds remaining
 * @param {number} durationDays - Original duration in days
 * @returns {string} Hex color
 */
export function getTimeRemainingColor(totalSeconds, durationDays) {
    const totalDurationSeconds = durationDays * 24 * 60 * 60;
    const percentRemaining = totalSeconds / totalDurationSeconds;
    
    if (totalSeconds === 0) {
        return '#ff0066'; // Red for expired
    } else if (percentRemaining < 0.1) {
        return '#ff6600'; // Orange for < 10% time left
    } else if (percentRemaining < 0.25) {
        return '#ffcc00'; // Yellow for < 25% time left
    } else {
        return '#00ff00'; // Green for plenty of time
    }
} 