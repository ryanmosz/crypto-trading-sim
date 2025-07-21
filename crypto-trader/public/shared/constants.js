// Game configuration
export const GAME_CONFIG = {
    startingMoney: 10000000, // $10M
    blockSize: 1000000, // $1M per allocation
    cryptos: {
        BTC: { name: 'Bitcoin', startPrice: 65000, color: 0xf7931a },
        ETH: { name: 'Ethereum', startPrice: 3500, color: 0x627eea },
        BNB: { name: 'Binance Coin', startPrice: 400, color: 0xf3ba2f },
        SOL: { name: 'Solana', startPrice: 120, color: 0x00ffa3 },
        XRP: { name: 'Ripple', startPrice: 0.75, color: 0x23292f }
    }
};

// Enhanced scenario structure for modular time periods
export const MARCH_2020_SCENARIO = {
    id: 'march_2020',
    date: "March 12, 2020",
    displayName: "March 12, 2020",
    subtitle: "(24 hours)",
    description: "COVID-19 Black Thursday",
    duration: "24 hours",
    defaultSimulationTime: 30, // seconds
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "hourly",
    timeLabels: Array.from({length: 24}, (_, i) => `Hour ${i+1}`),
    
    // All cryptos available in 2020
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: true },
        BNB: { available: true },
        SOL: { available: true },
        XRP: { available: true }
    },
    
    prices: {
        BTC: { 
            start: 7911, 
            hourly: [7911, 7650, 7200, 6800, 6200, 5800, 5400, 5200, 5000, 4900, 4857, 4900, 
                     5100, 5300, 5200, 5100, 5000, 4950, 4900, 4880, 4860, 4857, 4850, 4857],
            end: 4857 
        },
        ETH: { 
            start: 194, 
            hourly: [194, 185, 170, 155, 140, 125, 115, 110, 108, 109, 110, 112,
                     115, 118, 116, 114, 112, 111, 110, 109, 110, 111, 110, 110],
            end: 110 
        },
        BNB: { 
            start: 13.50, 
            hourly: [13.50, 13.00, 12.20, 11.50, 10.80, 10.20, 9.80, 9.50, 9.30, 9.20, 9.15, 9.20,
                     9.40, 9.60, 9.50, 9.40, 9.30, 9.25, 9.20, 9.18, 9.16, 9.15, 9.14, 9.15],
            end: 9.15 
        },
        SOL: { 
            start: 0.85, // SOL didn't exist yet, using similar volatility
            hourly: [0.85, 0.82, 0.77, 0.72, 0.66, 0.61, 0.57, 0.54, 0.52, 0.51, 0.50, 0.51,
                     0.53, 0.55, 0.54, 0.53, 0.52, 0.51, 0.50, 0.50, 0.50, 0.50, 0.50, 0.50],
            end: 0.50 
        },
        XRP: { 
            start: 0.20, 
            hourly: [0.20, 0.19, 0.17, 0.16, 0.14, 0.13, 0.12, 0.115, 0.11, 0.11, 0.11, 0.112,
                     0.115, 0.118, 0.116, 0.114, 0.112, 0.111, 0.11, 0.11, 0.11, 0.11, 0.11, 0.11],
            end: 0.11 
        }
    }
};

// May 19, 2021 China FUD crash
export const MAY_2021_SCENARIO = {
    id: 'may_2021',
    date: "May 19, 2021",
    displayName: "May 19, 2021",
    subtitle: "(24 hours)",
    description: "Crypto Market Crash",
    duration: "24 hours",
    defaultSimulationTime: 30,
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "hourly",
    timeLabels: Array.from({length: 24}, (_, i) => `Hour ${i+1}`),
    
    // All cryptos available in 2021
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: true },
        BNB: { available: true },
        SOL: { available: true },
        XRP: { available: true }
    },
    
    prices: {
        BTC: { 
            start: 43000, 
            hourly: [43000, 42000, 40500, 38000, 35000, 33000, 31500, 30000, 29500, 30000, 30500, 31000,
                     31500, 32000, 31800, 31600, 31400, 31200, 31000, 30800, 30600, 30500, 30400, 30000],
            end: 30000 
        },
        ETH: { 
            start: 3400, 
            hourly: [3400, 3200, 3000, 2800, 2500, 2200, 2000, 1900, 1850, 1900, 1950, 2000,
                     2050, 2100, 2080, 2060, 2040, 2020, 2000, 1980, 1960, 1950, 1940, 1900],
            end: 1900 
        },
        BNB: { 
            start: 600, 
            hourly: [600, 570, 530, 480, 430, 380, 340, 310, 300, 305, 310, 315,
                     320, 325, 322, 320, 318, 315, 312, 310, 308, 305, 303, 300],
            end: 300 
        },
        SOL: { 
            start: 55, 
            hourly: [55, 52, 48, 44, 40, 36, 33, 30, 29, 29.5, 30, 30.5,
                     31, 31.5, 31.3, 31.1, 30.9, 30.7, 30.5, 30.3, 30.1, 30, 29.9, 30],
            end: 30 
        },
        XRP: { 
            start: 1.50, 
            hourly: [1.50, 1.42, 1.32, 1.20, 1.08, 0.98, 0.92, 0.90, 0.88, 0.89, 0.90, 0.91,
                     0.92, 0.93, 0.925, 0.92, 0.915, 0.91, 0.905, 0.90, 0.895, 0.89, 0.885, 0.90],
            end: 0.90 
        }
    }
};

// 2013 Bitcoin's first major bull run
export const YEAR_2013_SCENARIO = {
    id: 'year_2013',
    date: "2013",
    displayName: "2013",
    subtitle: "(Full Year)",
    description: "Bitcoin's First Bull Run",
    duration: "1 year",
    defaultSimulationTime: 30,
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "monthly",
    timeLabels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    
    // Only early cryptos existed
    availableCryptos: {
        BTC: { available: true },
        ETH: { available: false, reason: "Not created until 2015" },
        BNB: { available: false, reason: "Not created until 2017" },
        SOL: { available: false, reason: "Not created until 2020" },
        XRP: { available: true }
    },
    
    prices: {
        BTC: {
            start: 13,
            monthly: [13, 20, 35, 100, 140, 110, 95, 120, 140, 180, 450, 1100],
            end: 1100
        },
        XRP: {
            start: 0.005,
            monthly: [0.005, 0.006, 0.008, 0.015, 0.020, 0.014, 0.013, 0.015, 0.018, 0.025, 0.040, 0.06],
            end: 0.06
        },
        // Unavailable cryptos still need price data structure
        ETH: { start: 0, monthly: Array(12).fill(0), end: 0 },
        BNB: { start: 0, monthly: Array(12).fill(0), end: 0 },
        SOL: { start: 0, monthly: Array(12).fill(0), end: 0 }
    }
};

// "Now" scenario - placeholder for real-time trading
export const NOW_SCENARIO = {
    id: 'now',
    date: "Live Trading",
    displayName: "Now",
    subtitle: "(Real-time)",
    description: "Trade with current prices",
    duration: "Real-time",
    defaultSimulationTime: 30,
    speeds: {
        regular: { label: "Regular Speed", multiplier: 1, time: 30 },
        double: { label: "Double Speed", multiplier: 2, time: 15 }
    },
    dataGranularity: "realtime",
    timeLabels: ["Real-time"],
    
    // All current cryptos available
    availableCryptos: ['BTC', 'ETH', 'BNB', 'SOL', 'XRP'],
    
    // Placeholder data - will be replaced with real-time data later
    prices: {
        BTC: { 
            start: 65000,
            hourly: [65000], // Placeholder
            end: 65000
        },
        ETH: { 
            start: 3500,
            hourly: [3500], // Placeholder
            end: 3500
        },
        BNB: { 
            start: 400,
            hourly: [400], // Placeholder
            end: 400
        },
        SOL: { 
            start: 120,
            hourly: [120], // Placeholder
            end: 120
        },
        XRP: { 
            start: 0.75,
            hourly: [0.75], // Placeholder
            end: 0.75
        }
    }
};

// Store available scenarios
export const SCENARIOS = {
    'now': NOW_SCENARIO,
    'march_2020': MARCH_2020_SCENARIO,
    'may_2021': MAY_2021_SCENARIO,
    'year_2013': YEAR_2013_SCENARIO
}; 