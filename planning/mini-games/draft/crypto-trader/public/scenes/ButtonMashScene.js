import Phaser from 'phaser';
import { joinButtonMashChannel } from '../services/realtime.js';
import {
  MASH_DURATION_MS,
  COUNTDOWN_STEP_MS,
  MAX_MSGS_PER_SEC,
  WIN_TEXT,
  LOSE_TEXT
} from '../constants/minigame.js';

export default class ButtonMashScene extends Phaser.Scene {
  /**
   * data: { gameId:string, duelId:string, userId:string, opponentId:string }
   */
  init(data) {
    this.gameId     = data.gameId;
    this.duelId     = data.duelId;
    this.userId     = data.userId;
    this.opponentId = data.opponentId;
    this.isHost     = !!data.isHost;      // <<< new

    this.localCount   = 0;
    this.remoteCount  = 0;
    this.isMashing    = false;

    // Guards
    this.finishSent   = false;
    this.matchComplete = false;
  }

  async create() {
    /* Background */
    this.cameras.main.setBackgroundColor('#000000');

    /* UI elements */
    this.countText     = this.add.text(300, 300, '0', { fontSize: '64px', color: '#00ffff' }).setOrigin(0.5);
    this.oppCountText  = this.add.text(600, 300, '0', { fontSize: '64px', color: '#ff0066' }).setOrigin(0.5);
    this.statusText    = this.add.text(450, 150, 'WAITING…', { fontSize: '48px', color: '#ffffff', fontFamily: 'Arial Black' }).setOrigin(0.5);

    /* Realtime channel */
    this.channel = await joinButtonMashChannel(this.gameId, this.duelId, { id: this.userId });

    this.channel.onStart(() => this.startMashPhase());
    this.channel.onIncrement(({ payload }) => this.handleIncrement(payload));
    this.channel.onFinish(({ payload }) => this.finishMatch(payload));

    /* Host starts the canonical countdown */
    if (this.isHost) {
      this.time.delayedCall(500, () => this.broadcastStart());
    }
  }

  /* ---------- Network helpers ---------- */
  broadcastStart() {
    this.channel.send({ type: 'broadcast', event: 'start', payload: { duelId: this.duelId, startTs: Date.now() } });
  }

  sendIncrement() {
    this.channel.send({ type: 'broadcast', event: 'increment', payload: { duelId: this.duelId, playerId: this.userId, count: 1, ts: Date.now() } });
  }

  broadcastFinish() {
    if (!this.isHost || this.finishSent) return;  // host-only, send once
    this.finishSent = true;

    this.channel.send({
      type:    'broadcast',
      event:   'finish',
      payload: {
        duelId   : this.duelId,
        p1       : this.localCount,
        p2       : this.remoteCount,
        winnerId : (this.localCount >= this.remoteCount ? this.userId : this.opponentId)
      }
    });
  }

  /* ---------- Game flow ---------- */
  startMashPhase() {
    this.statusText.setText('3');
    this.runCountdown(3).then(() => {
      this.statusText.setText('GO!');
      this.statusText.setColor('#00ff00');

      this.isMashing = true;
      this.registerInput();

      /* Auto-stop after duration */
      this.time.delayedCall(MASH_DURATION_MS, () => {
        this.isMashing = false;
        this.broadcastFinish(); // host or each client can send – dedup later
      });
    });
  }

  runCountdown(count) {
    return new Promise((resolve) => {
      let current = count;
      const timer = this.time.addEvent({
        delay: COUNTDOWN_STEP_MS,
        repeat: count - 1,
        callback: () => {
          current--;
          this.statusText.setText(current ? current : 'GO!');
          if (current === 0) resolve();
        }
      });
    });
  }

  registerInput() {
    const throttleGap = 1000 / MAX_MSGS_PER_SEC;
    let   lastSent    = 0;

    this.input.keyboard.on('keydown', () => {
      if (!this.isMashing) return;
      this.localCount++;
      this.countText.setText(this.localCount);

      const now = Date.now();
      if (now - lastSent >= throttleGap) {
        lastSent = now;
        this.sendIncrement();
      }
    });
  }

  handleIncrement({ playerId, count }) {
    if (playerId === this.userId) return; // we already updated locally
    this.remoteCount += count;
    this.oppCountText.setText(this.remoteCount);
  }

  finishMatch({ winnerId, p1, p2 }) {
    if (this.matchComplete) return;          // ignore duplicates
    this.matchComplete = true;
    this.isMashing = false;
    this.localCount  = p1;
    this.remoteCount = p2;
    this.countText.setText(p1);
    this.oppCountText.setText(p2);

    this.statusText.setText(winnerId === this.userId ? WIN_TEXT : LOSE_TEXT);
    this.statusText.setColor(winnerId === this.userId ? '#00ff00' : '#ff0066');

    /* Emit event so parent scene can refresh state */
    this.events.emit('DUEL_COMPLETE', { winnerId, p1, p2 });
  }

  shutdown() {
    this.channel?.unsubscribe();
  }
}