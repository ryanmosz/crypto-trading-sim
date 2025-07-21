// Helper function to create back/dashboard button
export function createBackButton(scene, x = 50, y = 550, text = 'BACK', destination = 'DashboardScene') {
    const btn = scene.add.rectangle(x, y, 100, 40, 0x000000, 1)
        .setStrokeStyle(2, 0x666666)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);
        
    const btnText = scene.add.text(x, y, text, {
        fontSize: '16px',
        fontFamily: 'Arial Black',
        color: '#ffffff'
    }).setOrigin(0.5);
    
    btn.on('pointerover', () => {
        btn.setStrokeStyle(2, 0x00ffff);
        btnText.setColor('#00ffff');
    })
    .on('pointerout', () => {
        btn.setStrokeStyle(2, 0x666666);
        btnText.setColor('#ffffff');
    })
    .on('pointerdown', () => {
        scene.scene.start(destination, { user: scene.user });
    });
    
    return { btn, btnText };
}

// Helper function to create dashboard button
export function createDashboardButton(scene, x = 850, y = 40) {
    return createBackButton(scene, x, y, 'DASHBOARD', 'DashboardScene');
} 