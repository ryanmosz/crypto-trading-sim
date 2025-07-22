/**
 * Non-interactive stub – focuses on layout & signalling.
 * To be instantiated from DashboardScene / ActiveGameViewScene.
 */

export default class DuelInviteModal extends Phaser.GameObjects.Container {
    /**
     * @param {Phaser.Scene} scene
     * @param {Array<{id:string,name:string}>} onlinePlayers
     * @param {(targetId:string)=>void} onInvite  Callback when user presses Invite
     */
    constructor(scene, onlinePlayers, onInvite) {
      super(scene, 450, 300);
      scene.add.existing(this);
  
      // Background
      const bg = scene.add.rectangle(0, 0, 500, 400, 0x111111)
                        .setStrokeStyle(2, 0x00ffff);
      this.add(bg);
  
      const title = scene.add.text(0, -170, 'DUEL INVITE', {
        fontFamily: 'Arial Black', fontSize: '24px', color: '#00ffff'
      }).setOrigin(0.5);
      this.add(title);
  
      // Scroll list placeholder
      let y = -120;
      onlinePlayers.forEach(p => {
        const row = scene.add.text(-160, y, p.name, {
          fontSize: '18px', color: '#ffffff'
        }).setOrigin(0, 0.5);
        this.add(row);
  
        const btn = scene.add.text(160, y, 'INVITE', {
          fontFamily: 'Arial Black', fontSize: '16px', color: '#00ff00'
        }).setOrigin(0.5).setInteractive({ useHandCursor: true });
  
        btn.on('pointerdown', () => onInvite(p.id));
        this.add(btn);
  
        y += 40;
      });
  
      // Close button
      const close = scene.add.text(0, 180, 'CLOSE', {
        fontFamily: 'Arial Black', fontSize: '16px', color: '#ff0066'
      }).setOrigin(0.5).setInteractive({ useHandCursor: true });
      close.on('pointerdown', () => this.destroy());
      this.add(close);
    }
  }