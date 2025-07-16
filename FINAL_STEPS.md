# 🏁 Final Steps - Ship It!

## Current Status
✅ Unity Hub installed  
✅ Unity 2022.3.62f1 with WebGL installed  
✅ Project created  
✅ All scripts ready  
✅ Automated scene builders created  

## Next Steps (In Unity)

### 1. Fix TextMeshPro (If Needed)
If you see red errors in the Console:
- **Window → TextMeshPro → Import TMP Essential Resources**
- Click **Import**

### 2. Choose Your Path

#### Path A: Use AutoSceneBuilder (Recommended)
1. Wait for Unity to compile scripts (progress bar at bottom)
2. **Tools → Build Crypto Sim Scenes**
3. Both scenes created automatically!
4. Continue to step 3

#### Path B: Use RuntimeSceneLoader
1. In Hierarchy: Right-click → Create Empty
2. Select the new GameObject
3. Inspector: Add Component → RuntimeSceneLoader
4. Hit Play button - everything builds at runtime!

### 3. Add Scenes to Build (Path A only)
1. **File → Build Settings**
2. Open Login scene: **File → Open Scene → Assets/Scenes/Login.unity**
3. In Build Settings: Click **Add Open Scenes**
4. Open Main scene: **File → Open Scene → Assets/Scenes/Main.unity**  
5. In Build Settings: Click **Add Open Scenes**
6. Verify order: Login (0), Main (1)

### 4. Test in Editor
1. Make sure Login scene is open
2. Hit **Play** button (triangle at top)
3. Click **Alice** → Should show "Welcome, Alice! Portfolio: $12.0M"
4. Click **Logout** → Returns to login
5. Click **Bob** → Should show "Welcome, Bob! Portfolio: $8.0M"

### 5. Build for Web
1. **File → Build Settings**
2. Click **Switch Platform** → Choose **WebGL**
3. Wait for platform switch (few minutes)
4. Click **Build**
5. Create new folder: `Builds/WebGL`
6. Select that folder and click **Save**
7. Wait for build (5-15 minutes first time)

### 6. Test in Browser
1. Navigate to `Builds/WebGL` folder
2. Open `index.html` in a web browser
3. Test both users work correctly

## Success Checklist
- [ ] TextMeshPro imported
- [ ] Scenes created (either method)
- [ ] Can play in Unity editor
- [ ] Alice shows $10M → $12M (+20%)
- [ ] Bob shows $10M → $8M (-20%)
- [ ] User switching works
- [ ] WebGL build completes
- [ ] Runs in browser

## Troubleshooting

**"Can't find scene" error**: Make sure to add scenes to Build Settings

**Build takes forever**: First WebGL build is slow, subsequent builds are faster

**Black screen in browser**: Check browser console for errors, may need to run from a local server

**Buttons don't work**: Make sure EventSystem exists in scene

---

**You're almost there!** Just a few clicks in Unity and you'll have a working web game! 🚀 