// API Integration for Real-Time Crypto Prices
// This file contains the integration with CoinGecko API for live price updates

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

// Get API key from ENV if available
const COINGECKO_API_KEY = window.ENV?.COINGECKO_API_KEY || null;

// Mapping of our symbols to CoinGecko IDs
const CRYPTO_ID_MAP = {
    BTC: 'bitcoin',
    ETH: 'ethereum', 
    BNB: 'binancecoin',
    SOL: 'solana',
    XRP: 'ripple'
};

// Function to fetch current prices from CoinGecko
async function fetchCurrentPrices() {
    try {
        const ids = Object.values(CRYPTO_ID_MAP).join(',');
        const url = `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=usd`;
        
        console.log('Fetching prices from:', url);
        
        const options = {};
        if (COINGECKO_API_KEY) {
            options.headers = {
                'x-cg-demo-api-key': COINGECKO_API_KEY
            };
            console.log('Using API key:', COINGECKO_API_KEY ? 'Yes' : 'No');
        } else {
            console.warn('No CoinGecko API key configured - using free tier');
        }
        
        const response = await fetch(url, options);
        console.log('API Response status:', response.status);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw API response:', data);
        
        // Convert CoinGecko format to our format
        const prices = {};
        for (const [symbol, geckoId] of Object.entries(CRYPTO_ID_MAP)) {
            if (data[geckoId] && data[geckoId].usd) {
                prices[symbol] = data[geckoId].usd;
                console.log(`${symbol}: $${data[geckoId].usd} (live)`);
            } else {
                console.warn(`No price data for ${symbol} (${geckoId})`);
                // Use fallback price for missing data
                const fallbacks = {
                    BTC: 98500,
                    ETH: 3850,
                    BNB: 725,
                    SOL: 180,
                    XRP: 2.40
                };
                prices[symbol] = fallbacks[symbol] || 0;
                console.log(`${symbol}: $${prices[symbol]} (fallback)`);
            }
        }
        
        console.log('Final prices object:', prices);
        return prices;
    } catch (error) {
        console.error('Error fetching prices from CoinGecko:', error);
        console.log('Using all fallback prices due to error');
        // Return fallback prices
        return {
            BTC: 98500,
            ETH: 3850,
            BNB: 725,
            SOL: 180,
            XRP: 2.40
        };
    }
}

// Function to update prices in Supabase cache
async function updatePricesInCache(supabase) {
    try {
        const prices = await fetchCurrentPrices();
        
        // Update each price in the cache
        for (const [symbol, price] of Object.entries(prices)) {
            const { error } = await supabase
                .from('prices_cache')
                .upsert({ 
                    symbol, 
                    price,
                    fetched_at: new Date().toISOString()
                });
                
            if (error) {
                console.error(`Error updating ${symbol} price:`, error);
            } else {
                console.log(`Updated ${symbol}: $${price}`);
            }
        }
        
        console.log('All prices updated in cache:', prices);
        return prices;
    } catch (error) {
        console.error('Error updating prices:', error);
        throw error;
    }
}

// Function to get 24h price change (optional enhancement)
async function get24hPriceChange() {
    try {
        const ids = Object.values(CRYPTO_ID_MAP).join(',');
        const url = `${COINGECKO_API_URL}/simple/price?ids=${ids}&vs_currencies=usd&include_24hr_change=true`;
        
        const options = {};
        if (COINGECKO_API_KEY) {
            options.headers = {
                'x-cg-demo-api-key': COINGECKO_API_KEY
            };
        }
        
        const response = await fetch(url, options);
        const data = await response.json();
        
        const changes = {};
        for (const [symbol, geckoId] of Object.entries(CRYPTO_ID_MAP)) {
            if (data[geckoId] && data[geckoId].usd_24h_change) {
                changes[symbol] = data[geckoId].usd_24h_change;
            }
        }
        
        return changes;
    } catch (error) {
        console.error('Error fetching 24h changes:', error);
        return null;
    }
}

// Export functions for use in game
window.CryptoAPI = {
    fetchCurrentPrices,
    updatePricesInCache,
    get24hPriceChange
};