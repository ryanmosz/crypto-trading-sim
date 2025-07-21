# 🗂️ Miscellaneous TODO

This document captures small or ad-hoc cleanup tasks that don’t yet fit
into a larger phase plan.

---

## ❌ Remove Redundant "Enable Multiplayer" Toggle (Now-Mode Setup)

### Context
* **Location:** `NowModeSetupScene` (in `game.js` or its extracted scene
  file after refactor).
* **Elements involved:**
  ```js
  const multiplayerToggle = this.add.rectangle(...)
  this.multiplayerText = this.add.text(...)
  multiplayerToggle.on('pointerdown', () => { … })
  ```
* Sets `this.isMultiplayer` which is later forwarded to
  `AllocationScene` and used when saving a game.

The toggle never delivered real functionality; multiplayer games are
created by default via the *Create Game* flow. Leaving the switch in
place confuses users.

### Safe-Removal Checklist
1. **Delete UI creation code**
   Remove the `multiplayerToggle` rectangle, the accompanying text node
   `this.multiplayerText`, and the `pointerdown` handler in
   `NowModeSetupScene.create()`.

2. **Hard-code the flag**
   Immediately after refactoring step 1, set
   ```js
   this.isMultiplayer = false;
   ```
   to preserve the property in case other code paths still reference it
   (avoids `undefined` errors).

3. **Audit downstream references**
   * `AllocationScene.init(data)` – accepts `isMultiplayer`.
     • Pass `false` (or omit the field) when calling
       `this.scene.start('AllocationScene', …)`.
   * `NowModeResultScene.init(data)` – also consumes `isMultiplayer`.
     • Behaviour is identical for `false`; no further changes needed.
   * `saveActiveGame()` logic sets `is_multiplayer` DB column.
     • With flag always `false`, the insert remains valid.

4. **Search-and-replace sweep**
   Grep the codebase for `isMultiplayer` to confirm there are no writes
   other than the toggle handler you just removed.

5. **Manual test flow**
   * Start a Now-Mode game (30/60/90 days).
   * Verify:
     - No toggle visible.
     - Game creates successfully.
     - Dashboard "Active" tab still shows the game (single-player).

6. **Future clean-up (optional)**
   * Remove `isMultiplayer` parameter plumbing entirely once all legacy
     code paths are confirmed unused.
   * Consider deleting the `is_multiplayer` column in `active_games`
     after multiplayer refactor completes.

---