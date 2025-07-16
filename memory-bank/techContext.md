# Tech Context - Development Environment

## Unity Configuration

### Version
- Unity 2022.3 LTS (Long Term Support)
- WebGL Build Support module required
- TextMeshPro package imported

### Project Settings
```
Player Settings:
- Company: YourCompany
- Product: Crypto Trading Sim
- Version: 0.1.0
- WebGL Memory: 256MB
- Compression: Gzip
- WebAssembly Streaming: Enabled

Graphics:
- Color Space: Linear
- Rendering Path: Forward
- Tier: Low (WebGL optimization)

Quality:
- Custom "WebGL" preset
- Shadows: Disabled
- Anti-aliasing: 2x
- V-Sync: Every V Blank
```

## Development Tools

### Required Software
- Unity Hub (latest)
- Visual Studio Code or preferred IDE
- Git for version control
- Docker Desktop for Mac
- Node.js 18+ (for backend)
- Chrome/Firefox for testing

### VS Code Extensions
- Unity Code Snippets
- C# for Visual Studio Code
- Unity Tools
- GitLens

## Dependencies

### Unity Packages
- TextMeshPro (built-in)
- Unity UI (built-in)
- Newtonsoft JSON (for API parsing)

### External APIs
- CoinGecko API (free tier)
  - Rate limit: 50 calls/minute
  - Endpoints: /simple/price
  - No API key required

### Backend Stack
- Vercel serverless functions
- Node.js runtime
- Simple JSON file storage
- CORS enabled for Unity WebGL

## Build Pipeline

### Docker Configuration
- Base image: unityci/editor:ubuntu-2022.3.10f1-webgl-1.0
- Automated Unity license activation
- Cache volumes for faster builds
- Nginx server for local testing

### Build Process
1. Docker runs build.sh
2. Unity builds to WebGL
3. Output to builds/WebGL/
4. Nginx serves on port 8080

## Development Constraints

### WebGL Limitations
- No threading (use coroutines)
- Limited memory (optimize textures)
- No native plugins
- CORS restrictions for APIs
- Larger build sizes than native

### Performance Targets
- Build size: < 20MB compressed
- Load time: < 10 seconds
- Frame rate: 60 FPS
- Memory usage: < 256MB

## File Structure

```
Project Root/
├── Assets/          # Unity assets
├── builds/          # Build outputs
├── planning/        # Documentation
├── research/        # Design docs
├── memory-bank/     # Agent memory
├── backend/         # API code
└── Docker files     # Build automation
```

## Security Considerations

- No sensitive data in client
- API keys server-side only
- HTTPS required for production
- Input validation on all endpoints
- Rate limiting on API calls 