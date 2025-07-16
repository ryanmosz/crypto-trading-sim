# 🌐 Serving Unity WebGL Builds

## The Problem
Modern browsers block loading Unity WebGL builds directly from `file://` URLs due to CORS (Cross-Origin Resource Sharing) security policies. You'll see errors like:
- "Failed to download file Build/02.data"
- "Loading web pages via a file:// URL without a web server is not supported"

## The Solution
Run a local web server! Here are several easy options:

### Option 1: Python (Recommended)
```bash
# Navigate to your build folder
cd 02  # or cd Builds/WebGL

# Start server
python3 -m http.server 8000

# Open browser to http://localhost:8000
```

### Option 2: Use the Included Script
```bash
./serve-webgl.sh
```

### Option 3: Node.js http-server
```bash
# Install globally (one time)
npm install -g http-server

# Run in build folder
http-server -p 8000
```

### Option 4: Unity's Build and Run
In Unity, use **Build and Run** instead of just **Build**. Unity will automatically start a local server.

## Current Setup
- Server running at: `http://localhost:8000`
- Serving folder: `02/`
- Stop server: Press `Ctrl+C` in terminal

## Pro Tips
- Keep the terminal open while testing
- Different builds can use different ports (8001, 8002, etc.)
- Some browsers cache aggressively - use Incognito/Private mode for testing

---

**Your game is now running at** http://localhost:8000 🎮 