# Mini-Game Task 3.0 – Build `ButtonMashScene`

## Scene Lifecycle
1. **init(data)** – now accepts `isHost` boolean.
2. **create()** – countdown UI, event listeners
3. **update(time, delta)** – not heavy; timer driven by Phaser events
4. **shutdown()** – leave channel

## Key Functions
```js
startCountdown()         // 3-2-1-GO!
onKeyDown(event)         // local ++, broadcast
onIncrementMessage(msg)  // opponent ++
onFinishMessage(msg)     // show result
broadcastFinish()        // called once by host; guarded by this.finishSent
```

## Assets Needed
- Big numeric font spritesheet (0-3)
- "GO!" text
- Two coloured counters

## Testing
- Unit tests for timer end at ~5 000 ms ±50 ms.
- Simulated WebSocket messages to ensure sync.


### Reference Scene Skeleton

```js
import Phaser from 'phaser';
import { joinButtonMashChannel } from '../services/realtime';
import {
  MASH_DURATION_MS,
  COUNTDOWN_STEP_MS,
  MAX_MSGS_PER_SEC
} from '../constants/minigame';

export default class ButtonMashScene extends Phaser.Scene {
  init({ gameId, duelId }) {
    this.gameId = gameId;
    this.duelId = duelId;
    this.localCount = 0;
    this.remoteCount = 0;
  }

  async create() {
    this.channel = await joinButtonMashChannel(this.gameId, this.duelId);
    this.registerChannelHandlers();
    this.startCountdown();
  }

  // Local input
  registerInput() {
    const throttledSend = this.throttleIncrement();
    this.input.keyboard.on('keydown', () => {
      if (!this.isMashing) return;
      this.localCount++;
      this.localText.setText(this.localCount);
      throttledSend();
    });
  }

  throttleIncrement() {
    let lastSent = 0;
    return () => {
      const now = Date.now();
      if (now - lastSent < 1000 / MAX_MSGS_PER_SEC) return;
      lastSent = now;
      this.channel.send({
        type: 'broadcast',
        event: 'increment',
        payload: { duelId: this.duelId, playerId: this.userId, count: 1, ts: now }
      });
    };
  }
}
```

**Note**: We purposely avoid `setInterval` during the mash phase—Phaser’s
`time.delayedCall` with `MASH_DURATION_MS` suffices and pauses correctly
when the tab is backgrounded.

### UI Asset Checklist

| Asset | Dimensions | File |
| ----- | ---------- | ---- |
| Number spritesheet | 256×256 per digit | `/assets/fonts/numeric.png` |
| "GO!" splash | 1024×256 | `/assets/ui/go.png` |
| Cyan counter box | 400×120 | `/assets/ui/counter-cyan.png` |
| Magenta counter box | 400×120 | `/assets/ui/counter-magenta.png` |

### Implementation Notes
* Add `this.isHost` and `this.finishSent = false`.
* Only `isHost` triggers `broadcastStart()` (after short delay) **and**
  `broadcastFinish()` when the local mash timer ends.
* Non-hosts ignore local timeout if a `finish` packet is received first.