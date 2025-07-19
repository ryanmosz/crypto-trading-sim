# Tech Context - Development Stack

## Core Technologies

### Frontend Framework
**Phaser 3** - JavaScript game framework
- HTML5 Canvas/WebGL rendering
- Built-in physics and input handling
- Scene management system
- Asset loading and caching
- Cross-platform browser support

### Language & Tools
- **JavaScript ES6+** - Primary language
- **Webpack** - Module bundling
- **Babel** - JavaScript transpilation
- **npm** - Package management

### API Integration
**CoinGecko API** (Confirmed)
- Free tier: 50 calls/minute
- No API key required for basic endpoints
- Endpoints used:
  - `/simple/price` - Real-time prices
  - Includes 24hr change data
- Rate limiting: 30-second minimum between calls

### Backend (Phase 4)
- **Node.js** - Runtime
- **Vercel** - Serverless deployment
- **JSON** - Initial data storage

### Development Environment
- **VS Code** - Primary editor
- **Git** - Version control
- **Chrome DevTools** - Debugging
- **Local web server** - Development

## Project Structure
```
crypto-trading-sim/
├── src/
│   ├── scenes/          # Phaser scenes
│   ├── services/        # API services
│   ├── utils/           # Helper functions
│   └── index.js         # Entry point
├── public/
│   └── index.html       # HTML template
├── dist/                # Build output
├── package.json
├── webpack.config.js
└── .gitignore
```

## Key Technical Decisions

1. **Phaser over Unity** - Faster development, no build process, instant testing
2. **CoinGecko API** - Reliable, free tier sufficient, good documentation
3. **Webpack bundling** - Modern JavaScript development workflow
4. **Responsive design** - Mobile-first approach
5. **Progressive enhancement** - Works without backend initially

## Development Workflow
1. Code in VS Code
2. Webpack dev server auto-reloads
3. Test in browser immediately
4. Build for production with webpack
5. Deploy static files anywhere

## Performance Targets
- Load time: < 5 seconds
- FPS: 60 on modern devices
- Bundle size: < 2MB
- API calls: Max 2/minute 