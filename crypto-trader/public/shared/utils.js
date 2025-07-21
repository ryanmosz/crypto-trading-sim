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

// Generate a 4-character alphanumeric game code
export function generateGameCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz';
    let code = '';
    for (let i = 0; i < 4; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// Calculate portfolio value based on allocations and prices
export function calculatePortfolioValue(allocations, currentPrices, startingMoney) {
    let totalValue = 0;
    
    // Each allocation point represents 10% of starting money
    Object.entries(allocations).forEach(([symbol, points]) => {
        const allocation = Number(points);
        const investmentAmount = (allocation / 10) * startingMoney;
        const currentPrice = currentPrices[symbol] || 0;
        
        // For crypto pairs like BTC/ETH, we need the price of the base currency
        if (symbol.includes('/')) {
            const [base] = symbol.split('/');
            const basePrice = currentPrices[base] || 0;
            totalValue += investmentAmount * (currentPrice * basePrice);
        } else {
            totalValue += investmentAmount * currentPrice;
        }
    });
    
    return totalValue;
}

// Format error response for display
export function formatErrorMessage(error) {
    if (typeof error === 'string') return error;
    if (error.message) return error.message;
    if (error.error) return error.error;
    return 'An unexpected error occurred';
}

// Validate allocations sum to 10
export function validateAllocations(allocations) {
    const total = Object.values(allocations).reduce((sum, val) => sum + Number(val), 0);
    return total === 10;
} 