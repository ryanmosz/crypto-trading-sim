# 🚀 Deployment Guide for Crypto Trading Simulator

## Recommended Deployment Options (Ranked by Ease)

### 1. **GitHub Pages** ⭐ RECOMMENDED
**Best for:** Quick, free hosting directly from your repo
- ✅ Already using GitHub
- ✅ Free custom domain support
- ✅ Zero configuration needed
- ✅ Automatic updates on push
- ❌ Static files only (fine for now)

### 2. **Vercel**
**Best for:** When you add backend features
- ✅ Excellent performance
- ✅ Preview deployments for branches
- ✅ Built-in analytics
- ✅ Serverless functions ready
- ✅ Free tier generous

### 3. **Netlify**
**Best for:** Similar to Vercel
- ✅ Great DX
- ✅ Form handling
- ✅ Split testing
- ✅ Free tier available

### 4. **itch.io**
**Best for:** Game-specific audience
- ✅ Built-in game community
- ✅ Payment processing
- ✅ Game jams
- ✅ Analytics for games
- ❌ Less professional for business use

### 5. **Mobile App Stores**
**Best for:** Native app experience
- 📱 Wrap with Capacitor/Cordova
- 💰 Monetization options
- ❌ More complex process
- ❌ App store fees

## Quick Deploy to GitHub Pages (Let's do this now!)

### Method 1: Direct from main branch
```bash
# 1. Create gh-pages branch
git checkout -b gh-pages

# 2. Remove everything except game files
rm -rf planning/ research/ memory-bank/ 02/
rm -f *.md .gitignore

# 3. Move game files to root
mv crypto-trader/public/* .
rm -rf crypto-trader/

# 4. Commit and push
git add -A
git commit -m "Deploy game to GitHub Pages"
git push origin gh-pages

# 5. Return to main
git checkout main
```

### Method 2: GitHub Actions (Automated)
Create `.github/workflows/deploy.yml`:
```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Copy game files
        run: |
          mkdir -p dist
          cp -r crypto-trader/public/* dist/
          
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

### Method 3: Using GitHub UI
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main
4. Folder: /crypto-trader/public
5. Save

Your game will be live at:
`https://ryanmosz.github.io/crypto-trading-sim/`

## Deploy to Vercel (Alternative)

### 1. Install Vercel CLI
```bash
npm i -g vercel
```

### 2. Deploy
```bash
cd crypto-trader/public
vercel
```

### 3. Follow prompts
- Link to existing project? No
- What's your project name? crypto-trading-sim
- In which directory? ./
- Want to override settings? No

## Deploy to Netlify

### 1. Via GitHub
- Connect GitHub account at netlify.com
- Select repository
- Build command: (leave empty)
- Publish directory: crypto-trader/public
- Deploy!

### 2. Via CLI
```bash
npm i -g netlify-cli
cd crypto-trader/public
netlify deploy --prod
```

## Deploy to itch.io

### 1. Prepare ZIP
```bash
cd crypto-trader/public
zip -r crypto-trading-game.zip *
```

### 2. Upload to itch.io
- Create new project
- Kind: HTML
- Upload ZIP file
- Viewport: 900x600
- Enable fullscreen button

## Future Considerations

### When You Add Backend (Live Mode)
- **Vercel/Netlify**: Best for serverless functions
- **Railway/Render**: For persistent servers
- **Supabase**: For real-time features

### For Mobile Apps
```bash
# Using Capacitor
npm install @capacitor/core @capacitor/cli
npx cap init
npx cap add ios
npx cap add android
```

### Custom Domain Setup
All platforms support custom domains:
- GitHub Pages: CNAME file
- Vercel/Netlify: Domain settings
- Point DNS to platform

## Performance Optimization

Before deploying:
```bash
# Minify JavaScript
npm install -g terser
terser game.js -o game.min.js

# Update index.html to use game.min.js
```

## Monitoring

After deployment:
- Google Analytics
- Sentry for error tracking
- Cloudflare for CDN/protection

---

## Quick Start: Deploy NOW to GitHub Pages

The fastest way to get your game live:

1. Enable GitHub Pages in your repo settings
2. Select main branch, /crypto-trader/public folder
3. Wait 2-3 minutes
4. Visit: https://ryanmosz.github.io/crypto-trading-sim/

That's it! Your game is live! 🎮 