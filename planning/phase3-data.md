# 📈 Phase 3: Live Data Integration with CoinGecko

Phase 3 adds real-time cryptocurrency price data using the CoinGecko API, creating a dynamic dashboard experience.

## Phase Overview

**Duration**: 1-2 days  
**Goal**: Integrate CoinGecko API for live price updates  
**Dependencies**: Phase 1 (screens), Phase 2 (allocation system)

## CoinGecko API Setup

### API Basics
- **Free Tier**: 50 calls/minute (more than enough)
- **No API Key Required**: For basic endpoints
- **Rate Limiting**: Built-in retry logic recommended

### Key Endpoints We'll Use
```javascript
// Simple price endpoint - all we need!
const PRICE_URL = 'https://api.coingecko.com/api/v3/simple/price';

// Our 5 cryptos
const CRYPTO_IDS = {
    BTC: 'bitcoin',
    ETH: 'ethereum',
    BNB: 'binancecoin',
    SOL: 'solana',
    XRP: 'ripple'
};
```

## Implementation Milestones

### Milestone 3: Mock Data Dashboard (4 hours)
Build the dashboard UI with fake data first.

#### Dashboard Layout
```javascript
// src/scenes/DashboardScene.js
export default class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
        this.mockPrices = {
            BTC: 45000,
            ETH: 3000,
            BNB: 400,
            SOL: 100,
            XRP: 0.75
        };
    }
    
    create() {
        this.createBackground();
        this.createHeader();
        this.createPortfolioCards();
        this.startMockUpdates();
    }
    
    createPortfolioCards() {
        const startY = 150;
        const cardHeight = 80;
        const spacing = 10;
        
        Object.keys(this.mockPrices).forEach((crypto, index) => {
            const y = startY + (index * (cardHeight + spacing));
            this.createCryptoCard(crypto, y);
        });
    }
    
    createCryptoCard(crypto, y) {
        const container = this.add.container(400, y);
        
        // Card background
        const bg = this.add.rectangle(0, 0, 700, 70, 0x1a1a1a)
            .setStrokeStyle(2, 0x00ffff);
        
        // Crypto name
        const name = this.add.text(-320, 0, crypto, {
            fontSize: '28px',
            color: '#00ffff'
        }).setOrigin(0, 0.5);
        
        // Allocation
        const allocation = this.add.text(-100, 0, '20 pts', {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // Price
        const price = this.add.text(100, 0, `$${this.mockPrices[crypto]}`, {
            fontSize: '24px',
            color: '#ffffff'
        }).setOrigin(0.5);
        
        // P&L
        const pl = this.add.text(280, 0, '+12.5%', {
            fontSize: '24px',
            color: '#00ff00'
        }).setOrigin(0.5);
        
        container.add([bg, name, allocation, price, pl]);
        container.setData('priceText', price);
        container.setData('plText', pl);
        
        return container;
    }
    
    startMockUpdates() {
        // Simulate price changes every 2 seconds
        this.time.addEvent({
            delay: 2000,
            callback: this.updateMockPrices,
            callbackScope: this,
            loop: true
        });
    }
    
    updateMockPrices() {
        // Random price movements (-2% to +2%)
        Object.keys(this.mockPrices).forEach(crypto => {
            const change = (Math.random() - 0.5) * 0.04;
            this.mockPrices[crypto] *= (1 + change);
        });
        
        // Update UI
        this.updatePriceDisplays();
    }
}
```

### Milestone 4: CoinGecko Integration (4 hours)
Replace mock data with real CoinGecko API calls.

#### API Service
```javascript
// src/services/CoinGeckoService.js
export default class CoinGeckoService {
    constructor() {
        this.baseURL = 'https://api.coingecko.com/api/v3';
        this.cache = new Map();
        this.lastFetch = 0;
        this.minInterval = 30000; // 30 seconds minimum
    }
    
    async getPrices() {
        // Rate limiting
        const now = Date.now();
        if (now - this.lastFetch < this.minInterval && this.cache.size > 0) {
            return this.getCachedPrices();
        }
        
        try {
            const ids = 'bitcoin,ethereum,binancecoin,solana,ripple';
            const url = `${this.baseURL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
            
            const response = await fetch(url);
            if (!response.ok) throw new Error('API Error');
            
            const data = await response.json();
            this.lastFetch = now;
            
            // Transform to our format
            const prices = {
                BTC: data.bitcoin.usd,
                ETH: data.ethereum.usd,
                BNB: data.binancecoin.usd,
                SOL: data.solana.usd,
                XRP: data.ripple.usd
            };
            
            // Cache the results
            Object.entries(prices).forEach(([key, value]) => {
                this.cache.set(key, value);
            });
            
            return prices;
            
        } catch (error) {
            console.error('CoinGecko API Error:', error);
            return this.getCachedPrices() || this.getFallbackPrices();
        }
    }
    
    getCachedPrices() {
        const prices = {};
        this.cache.forEach((value, key) => {
            prices[key] = value;
        });
        return prices;
    }
    
    getFallbackPrices() {
        // Emergency fallback prices
        return {
            BTC: 45000,
            ETH: 3000,
            BNB: 400,
            SOL: 100,
            XRP: 0.75
        };
    }
}
```

#### Integration in Dashboard
```javascript
// src/scenes/DashboardScene.js
import CoinGeckoService from '../services/CoinGeckoService';

export default class DashboardScene extends Phaser.Scene {
    constructor() {
        super({ key: 'DashboardScene' });
        this.api = new CoinGeckoService();
    }
    
    async create() {
        this.createBackground();
        this.createHeader();
        this.createLoadingIndicator();
        
        // Fetch initial prices
        await this.fetchPrices();
        
        // Create cards after prices loaded
        this.createPortfolioCards();
        
        // Start periodic updates
        this.startPriceUpdates();
    }
    
    async fetchPrices() {
        this.showLoadingIndicator();
        
        try {
            const prices = await this.api.getPrices();
            this.currentPrices = prices;
            this.calculatePortfolioValue();
        } catch (error) {
            console.error('Failed to fetch prices:', error);
        }
        
        this.hideLoadingIndicator();
    }
    
    startPriceUpdates() {
        // Update every 30 seconds
        this.time.addEvent({
            delay: 30000,
            callback: this.fetchPrices,
            callbackScope: this,
            loop: true
        });
    }
    
    calculatePortfolioValue() {
        const allocation = this.registry.get('allocation') || {};
        let totalValue = 0;
        
        Object.entries(allocation).forEach(([crypto, points]) => {
            const price = this.currentPrices[crypto];
            const value = (points / 100) * 10000000; // $10M starting
            const units = value / price;
            totalValue += units * price;
        });
        
        this.updatePortfolioDisplay(totalValue);
    }
}
```

## Error Handling & Fallbacks

### Network Issues
```javascript
// Graceful degradation
async fetchWithRetry(url, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url);
            if (response.ok) return response;
            
            // Wait before retry
            await new Promise(r => setTimeout(r, 1000 * (i + 1)));
        } catch (error) {
            if (i === retries - 1) throw error;
        }
    }
}
```

### Offline Mode
```javascript
// Local storage caching
savePricesToCache(prices) {
    localStorage.setItem('cryptoPrices', JSON.stringify({
        prices,
        timestamp: Date.now()
    }));
}

loadPricesFromCache() {
    const cached = localStorage.getItem('cryptoPrices');
    if (!cached) return null;
    
    const { prices, timestamp } = JSON.parse(cached);
    const age = Date.now() - timestamp;
    
    // Use cache if less than 5 minutes old
    if (age < 300000) return prices;
    return null;
}
```

## Visual Polish

### Price Change Animations
```javascript
animatePriceChange(text, oldPrice, newPrice) {
    const color = newPrice > oldPrice ? 0x00ff00 : 0xff0000;
    
    // Flash color
    this.tweens.add({
        targets: text,
        tint: color,
        duration: 500,
        yoyo: true,
        ease: 'Power2'
    });
    
    // Smooth number transition
    const dummy = { value: oldPrice };
    this.tweens.add({
        targets: dummy,
        value: newPrice,
        duration: 1000,
        ease: 'Power1',
        onUpdate: () => {
            text.setText(`$${dummy.value.toFixed(2)}`);
        }
    });
}
```

### Loading States
```javascript
createLoadingIndicator() {
    this.loadingText = this.add.text(400, 300, 'Loading prices...', {
        fontSize: '24px',
        color: '#00ffff'
    }).setOrigin(0.5).setAlpha(0);
}

showLoadingIndicator() {
    this.tweens.add({
        targets: this.loadingText,
        alpha: 1,
        duration: 300
    });
}
```

## Testing Checklist

### Mock Data Phase
- [ ] Dashboard displays all 5 cryptos
- [ ] Mock prices update every 2 seconds
- [ ] P&L calculations correct
- [ ] Visual feedback on updates
- [ ] No errors in console

### CoinGecko Integration
- [ ] Real prices load on start
- [ ] Updates every 30 seconds
- [ ] Handles API errors gracefully
- [ ] Falls back to cached data
- [ ] Rate limiting works
- [ ] Mobile data usage reasonable

## Common Issues

### CORS Errors
```javascript
// CoinGecko API supports CORS, but if issues:
// 1. Use proxy in development
// 2. Or use JSONP endpoint
// 3. Or serverless function wrapper
```

### Rate Limiting
```javascript
// Track API calls
class RateLimiter {
    constructor(maxCalls, timeWindow) {
        this.maxCalls = maxCalls;
        this.timeWindow = timeWindow;
        this.calls = [];
    }
    
    canMakeCall() {
        const now = Date.now();
        this.calls = this.calls.filter(t => now - t < this.timeWindow);
        return this.calls.length < this.maxCalls;
    }
    
    recordCall() {
        this.calls.push(Date.now());
    }
}
```

## Next Steps

After completing Phase 3:
1. Move to [phase4-multiplayer.md](phase4-multiplayer.md) for backend
2. Or polish the dashboard further
3. Add more detailed analytics
4. Implement portfolio history

---

**Remember**: Start with mock data (Milestone 3) to get the UI right, then add CoinGecko integration. This approach ensures you always have something working. 