# 🛠️ Complete Setup Guide

## Overview
This guide covers everything you need for Unity WebGL development, including optional Docker setup for consistent builds.

## Required Software

### Core Requirements
- **Unity Hub** - Manages Unity installations
- **Unity 2022.3 LTS** - Long-term stable version
- **WebGL Build Support** - Required module
- **Visual Studio Code** - Recommended editor
- **Git** - Version control

### Optional Tools
- **Docker Desktop** - For containerized builds
- **Node.js 18+** - For backend development
- **Chrome DevTools** - For debugging

## Installation Steps

### 1. Unity Setup
```bash
# Install Unity Hub
brew install --cask unity-hub

# Or download from
open https://unity.com/download
```

In Unity Hub:
1. Sign in with Unity ID
2. Installs → Install Editor
3. Select 2022.3 LTS
4. Add Modules:
   - ✅ WebGL Build Support
   - ✅ Mac Build Support (if on Mac)
   - Optional: Documentation, VS Code Editor

### 2. Development Environment

#### VS Code Extensions
```bash
# Install VS Code
brew install --cask visual-studio-code

# Recommended extensions
code --install-extension ms-dotnettools.csharp
code --install-extension unity.unity-debug
code --install-extension visualstudioexptteam.vscodeintellicode
```

#### Git Configuration
```bash
# Set up Git
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Initialize repository
git init
cp /path/to/project/.gitignore .
git add . && git commit -m "Initial Unity project"
```

### 3. Unity Project Settings

#### Build Settings
1. File → Build Settings
2. Select WebGL → Switch Platform
3. Player Settings:
   ```
   Company Name: YourCompany
   Product Name: Crypto Trading Sim
   Version: 0.1.0
   
   WebGL Settings:
   - Template: Minimal
   - Compression: Gzip
   - Memory Size: 256 MB
   ```

#### Graphics Settings
Edit → Project Settings → Graphics:
- Color Space: Linear
- Tier Settings: Low (for WebGL)

#### Quality Settings
Edit → Project Settings → Quality:
- Create "WebGL" preset
- Shadows: Disabled
- Anti-aliasing: 2x

## Docker Setup (Optional)

### Why Docker?
- Consistent builds across team
- CI/CD ready
- No "works on my machine" issues
- Automated Unity licensing

### Docker Installation
```bash
# Install Docker Desktop
brew install --cask docker

# Verify installation
docker --version
docker-compose --version
```

### Unity License for Docker

1. Generate activation file:
```bash
/Applications/Unity/Unity.app/Contents/MacOS/Unity \
  -quit -batchmode -createManualActivationFile
```

2. Upload `Unity_v20XX.X.XX.alf` to https://license.unity3d.com/manual

3. Save license to `.env`:
```bash
echo "UNITY_LICENSE_CONTENT=$(cat Unity_lic.ulf | base64)" > .env
```

### Docker Commands
```bash
# Build with Docker
docker-compose up unity-builder

# Run local server
docker-compose up web-server

# Full build and serve
docker-compose up
```

## Project Structure

### Folder Organization
```
Project Root/
├── Assets/              # Unity assets
│   ├── Scripts/        # C# code
│   │   ├── Managers/   # Singletons
│   │   ├── UI/         # UI components
│   │   ├── Data/       # Data models
│   │   └── Utils/      # Helpers
│   ├── Prefabs/        # Reusable objects
│   ├── Materials/      # Shaders/materials
│   ├── Scenes/         # Game scenes
│   └── UI/             # UI assets
├── builds/             # Build output
├── planning/           # Documentation
├── backend/            # API server
└── memory-bank/        # Agent memory
```

### Essential Files
- `.gitignore` - Unity-specific ignores
- `.editorconfig` - Code formatting
- `Dockerfile` - Build container
- `docker-compose.yml` - Services
- `build.sh` - Build script

## Development Workflow

### Daily Routine
1. **Start Docker** (optional)
   ```bash
   docker-compose up -d
   ```

2. **Open Unity Project**
   ```bash
   open -a "Unity Hub"
   ```

3. **Make Changes**
   - Edit in VS Code
   - Test in Unity Editor
   - Build to WebGL

4. **Test Locally**
   ```bash
   cd builds/WebGL
   python3 -m http.server 8000
   # Open http://localhost:8000
   ```

5. **Commit Changes**
   ```bash
   git add -A
   git commit -m "feat: description"
   git tag v0.X
   ```

## Performance Guidelines

### Texture Settings
- Max Size: 1024x1024
- Compression: Normal
- Generate Mipmaps: ✓

### Build Optimization
- Strip Engine Code: ✓
- Optimize Mesh Data: ✓
- IL2CPP Code Generation: Faster

### WebGL Specific
- Avoid threading (use coroutines)
- Minimize texture memory
- Batch draw calls
- Profile in browser

## Troubleshooting

### Common Issues

**Unity Hub won't open**
```bash
rm -rf ~/Library/Application\ Support/UnityHub
brew reinstall unity-hub
```

**WebGL build fails**
- Check WebGL module installed
- Clear Library folder
- Increase memory in Player Settings

**Docker license error**
- Regenerate .alf file
- Check .env file exists
- Verify base64 encoding

**CORS errors**
- Use proper web server (not file://)
- Configure backend CORS headers

## Quick Reference

### Build Shortcuts
- `Cmd+Shift+B` - Build Settings
- `Cmd+B` - Build
- `Cmd+P` - Play/Stop

### Testing URLs
- Local: http://localhost:8000
- Docker: http://localhost:8080
- API: http://localhost:3000

### File Paths
- Scenes: `Assets/Scenes/`
- Scripts: `Assets/Scripts/`
- Builds: `builds/WebGL/`

## Ready Checklist

- [ ] Unity Hub installed
- [ ] Unity 2022.3 LTS with WebGL
- [ ] VS Code with extensions
- [ ] Git repository initialized
- [ ] Project settings configured
- [ ] Can build to WebGL
- [ ] Can run locally
- [ ] (Optional) Docker working

## Next Steps

✅ Setup complete! Now you can:
1. Follow [phase1-foundation.md](phase1-foundation.md) to start building
2. Reference [troubleshooting.md](troubleshooting.md) if you hit issues
3. Check [07-MASTER-PHASES.md](07-MASTER-PHASES.md) for the full roadmap 