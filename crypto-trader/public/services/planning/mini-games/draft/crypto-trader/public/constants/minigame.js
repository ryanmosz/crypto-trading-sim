/**
 * Constants for the Button-Mash Duel mini-game.
 * Keep values in sync with minigame-plan-1-design-spec.md
 */

export const MASH_DURATION_MS   = 5_000;   // 5-second active phase
export const COUNTDOWN_STEP_MS  = 1_000;   // 3-2-1-GO! cadence
export const MAX_MSGS_PER_SEC   = 20;      // Throttle input broadcasts
export const CHANNEL_PREFIX     = 'button_mash';

/** UI copy */
export const WIN_TEXT  = 'You Win!';
export const LOSE_TEXT = 'You Lose…';